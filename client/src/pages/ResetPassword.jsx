import React, { useState } from "react";
import { Card, Button, Typography } from "@material-tailwind/react";
import validator from "validator";
import ValidatedInput from "../components/ValidatedInput";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function ResetPassword() {

  const {id, userType, token} = useParams()  

  const [resetPassword, setResetPassword] = useState({
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (field, value) => {
    setResetPassword((prev) => ({ ...prev, [field]: value }));
  };

  const handleResetpassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    const newErrors = {};

    if (!validator.isLength(resetPassword.password, { min: 8 })) {
      newErrors.password = "Password must be at least 8 characters long";
    }

    if (resetPassword.password !== resetPassword.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const password = resetPassword.password  
        
      await axios.post(`/api/forgot-password/new-password/${id}/${userType}/${token}`, { password });

    } catch (error) {
      console.error("Error:", error);
      setErrors({
        confirmPassword: "Please try again.",
      });
      setIsLoading(false);
      return;
    }
    setErrors({});
    setIsLoading(false);
    alert('Your password is successfully changed. Now you can sign in');
    navigate("/signin");
  };

  return (
    <Card className="mx-auto max-w-xl" color="transparent" shadow={false}>
      <form
        onSubmit={handleResetpassword}
        className="flex flex-col gap-4 md:gap-4 mt-8 mb-2 w-72 max-w-screen-lg sm:w-96"
      >
        <Typography
            variant="h3"
            color="blue-gray"
            className="mb-2 text-center"
          >
            Reset-password
          </Typography>
          <Typography className="mb-8 text-gray-600 text-center text-xs">
            Enter new password
          </Typography>

        <ValidatedInput
          type="password"
          label="Password"
          value={resetPassword.password}
          onChange={(e) => handleChange("password", e.target.value)}
          error={errors.password}
          required
        />
        <ValidatedInput
          type="password"
          label="Confirm Password"
          value={resetPassword.confirmPassword}
          onChange={(e) => handleChange("confirmPassword", e.target.value)}
          error={errors.confirmPassword}
          required
        />

        <Button
            color="gray"
            size="lg"
            className="mt-6 p-3 capitalize text-xs"
            fullWidth
            loading={isLoading}
            type="submit"
        >
            Submit
        </Button>
        <div className="mt-3 flex justify-end">
            <Link to="/signin" className="text-sm text-blue-900">
            Back to sign in
            </Link>
        </div>
      </form>
    </Card>
  );
}
