import Company from "../models/user/company.model.js";
import Influencer from "../models/user/influencer.model.js";
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import { hashPassword } from "../utils/auth.utils.js";
import { errorHandler } from "../utils/error.js";

export const resetPassword = async (req, res, next) => {
    const { email, userType } = req.body;

    let Model;
    if (userType === 'company') {
        Model = Company;
    } else if (userType === 'influencer') {
        Model = Influencer;
    } else {
        return res.status(400).send({ error: 'Invalid userType' });
    }

    try {
        await Model.findOne({ email }).then(user => {
            if (!user) {
                console.error('No records found for email:', email);
                return next(
                    errorHandler(401, "Email or user type incorrect")
                );
            }
            const token = jwt.sign({id: user._id, userType: user.userType}, "jwt_secret_key", {expiresIn: "1d"})
            var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'yohaneslema986@gmail.com',
                pass: 'cojs rncs jeex dpsi'
            },
            tls: {
                rejectUnauthorized: false
            }
            });
            
            var mailOptions = {
            from: 'yohaneslema986@gmail.com',
            to: email,
            subject: 'Reset your password',
            text: `http://localhost:3000/reset-password/${user._id}/${user.userType}/${token}`
            };
            
            transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                res.json({ userExists: true });
            }
            });
        })

        res.json({ userExists: true });
    } catch (error) {
        next(error);
    }
};

export const newPassword = async (req, res) => {
    const {id, userType, token} = req.params;
    const { password } = req.body;

    let Model;
    if (userType === 'company') {
        Model = Company;
    } else if (userType === 'influencer') {
        Model = Influencer;
    } else {
        return res.status(400).send({ error: 'Invalid userType' });
    }
    try {
        jwt.verify(token, "jwt_secret_key", async (err, decodedData) => {
            if (err) {
                console.error('Token verification failed:', err);
                return res.status(401).json({ message: "Invalid token" });
            }
            const hashedPassword = await hashPassword(password);
            await Model.findByIdAndUpdate(decodedData.id, { password: hashedPassword })
            res.json({ message: "Password updated successfully" });
        });
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
}    