import React, { useEffect, useState } from "react";
import { Card, Button, Typography, IconButton } from "@material-tailwind/react";
import { PhoneNumberInput } from "../../PhoneNumberInput";
import validator from "validator";
import ValidatedInput from "../../ValidatedInput"; // Ensure you have a ValidatedInput component that can handle validation feedback
import { useSelector } from "react-redux";
import { FaArrowRight } from "react-icons/fa";
import { postToAuthAPI } from "../../../helper/postToAuthAPI";
import { useNavigate } from "react-router-dom";

export default function ContactInfo({ onNext }) {
  const email = useSelector((state) => state.email.email);
  const navigate = useNavigate();
  console.log(email);
  useEffect(() => {
    if (!email) {
      // Redirect to Google Auth path if email is empty
      navigate("/influencer/google");
    }
  }, [email, navigate]);
  const [userInfo, setUserInfo] = useState({
    username: "",
    email: email,
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field, value) => {
    setUserInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const newErrors = {};

    if (!validator.isLength(userInfo.username, { min: 4 })) {
      newErrors.username = "Username must be at least 4 characters long";
    }
    if (!validator.isEmail(userInfo.email)) {
      newErrors.email = "Valid email address is required";
    }
    if (!validator.isMobilePhone(userInfo.phoneNumber)) {
      newErrors.phoneNumber = "Valid phone number is required";
    }
    if (!validator.isLength(userInfo.password, { min: 8 })) {
      newErrors.password = "Password must be at least 8 characters long";
    }
    if (userInfo.password !== userInfo.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    const checkData = { email: userInfo.email, username: userInfo.username };

    const apiPath = "/api/auth/influencers/check";

    try {
      const response = await postToAuthAPI(apiPath, { checkData });

      if (!response.ok) {
        throw new Error(
          `Error checking username and email: ${response.statusText}`
        ); // More informative error message
      }

      const data = await response.json();
      console.log(data);
      if (data.success === false) {
        const newErrors = {};
        for (const error of data.errors) {
          newErrors[error.exist] = error.error;
        }
        setErrors(newErrors);
        setIsLoading(false);
        return;
      }

      // Successful username and email check (data.success === true)
    } catch (error) {
      console.error("Error checking username and email:", error);
      setErrors({
        email: "Error checking username and email. Please try again.",
      });
      setIsLoading(false);
      return;
    }
    setErrors({});
    setIsLoading(false);
    onNext(userInfo); // Proceed to the next step or handle form submission
  };

  return (
    <Card className="flex mx-auto max-w-xl" color="transparent" shadow={false}>
      <form
        onSubmit={handleNext}
        className="flex flex-col gap-4 mt-8 mb-2 w-full sm:w-96"
      >
        <Typography
          className="text-center mb-4 text-blue-gray-600"
          variant="h6"
        >
          Contact Information
        </Typography>
        <ValidatedInput
          label="Username"
          value={userInfo.username}
          onChange={(e) => handleChange("username", e.target.value)}
          error={errors.username}
          required
        />
        <ValidatedInput
          label="Email Address"
          value={userInfo.email}
          error={errors.email}
          required
        />
        <PhoneNumberInput
          label="Phone Number"
          value={userInfo.phoneNumber}
          onChange={(e) => handleChange("phoneNumber", e.target.value)}
          error={errors.phoneNumber}
          required
        />
        <ValidatedInput
          type="password"
          label="Password"
          value={userInfo.password}
          onChange={(e) => handleChange("password", e.target.value)}
          error={errors.password}
          required
        />
        <ValidatedInput
          type="password"
          label="Confirm Password"
          value={userInfo.confirmPassword}
          onChange={(e) => handleChange("confirmPassword", e.target.value)}
          error={errors.confirmPassword}
          required
        />
        <IconButton
          type="submit"
          className="self-end  mt-4 "
          loading={isLoading}
        >
          <FaArrowRight />
        </IconButton>
      </form>
    </Card>
  );
}
