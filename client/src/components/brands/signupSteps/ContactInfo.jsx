import React, { useState } from "react";
import { Card, Button, Typography, IconButton } from "@material-tailwind/react";
import { PhoneNumberInput } from "../../PhoneNumberInput";
import validator from "validator";
import ValidatedInput from "../../ValidatedInput"; // Import the ValidatedInput component
import { useSelector } from "react-redux";
import { FaArrowRight } from "react-icons/fa";

export default function ContactInfo({ onNext }) {
  const email = useSelector((state) => state.email.email);

  const [contactInfo, setContactInfo] = useState({
    contactName: "",
    email: email,
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    contactName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field, value) => {
    setContactInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    const newErrors = {};

    // Validation checks
    if (
      !validator.isLength(contactInfo.contactName, { min: 4 }) ||
      !validator.isAlpha(contactInfo.contactName.replace(/\s/g, ""))
    ) {
      newErrors.contactName = "Valid Contact name  is required";
    }

    if (!validator.isEmail(contactInfo.email)) {
      newErrors.email = "Valid email address is required";
    }

    if (
      !validator.isLength(contactInfo.phoneNumber, { min: 9, max: 9 }) ||
      !validator.isMobilePhone(contactInfo.phoneNumber, "any", {
        strictMode: false,
      })
    ) {
      newErrors.phoneNumber = "A valid 9-digit phone number is required.";
    }

    if (!validator.isLength(contactInfo.password, { min: 8 })) {
      newErrors.password = "Password must be at least 8 characters long";
    }

    if (contactInfo.password !== contactInfo.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/company-auth/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success === false) {
        newErrors.email = data.message;
        setErrors(newErrors);
        setIsLoading(false);
        return;
      }
    } catch (error) {
      console.error("Error checking company name:", error);
      setErrors({
        email: "Error checking company name. Please try again.",
      });
      setIsLoading(false);
      return;
    }
    setErrors({});
    setIsLoading(false);
    onNext(contactInfo);
  };

  return (
    <Card className="mx-auto max-w-xl" color="transparent" shadow={false}>
      <form
        onSubmit={handleNext}
        className="flex flex-col gap-4 md:gap-4 mt-8 mb-2 w-72 max-w-screen-lg sm:w-96"
      >
        <Typography
          className="text-center mb-4 text-blue-gray-600"
          variant="h6"
          color="blue-gray"
        >
          Contact Information{" "}
          <span className="text-xs font-thin text-blue-gray-900">
            {" "}
            (manager){" "}
          </span>
        </Typography>

        <ValidatedInput
          label="Contact Person's Name"
          placeholder="Abebe Bekele"
          value={contactInfo.contactName}
          onChange={(e) => handleChange("contactName", e.target.value)}
          error={errors.contactName}
          required
        />
        <ValidatedInput
          label="Email Address"
          type="email"
          value={contactInfo.email}
          error={errors.email}
          required
        />
        <PhoneNumberInput
          label="Phone Number"
          value={contactInfo.phoneNumber}
          onChange={(e) => handleChange("phoneNumber", e.target.value)}
          error={errors.phoneNumber}
          required
          placeholder={911223344}
        />
        <ValidatedInput
          type="password"
          label="Password"
          value={contactInfo.password}
          onChange={(e) => handleChange("password", e.target.value)}
          error={errors.password}
          required
        />
        <ValidatedInput
          type="password"
          label="Confirm Password"
          value={contactInfo.confirmPassword}
          onChange={(e) => handleChange("confirmPassword", e.target.value)}
          error={errors.confirmPassword}
          required
        />

        <div className="flex justify-end mt-8">
          <IconButton type="submit" loading={isLoading}>
            <FaArrowRight />
          </IconButton>
        </div>
      </form>
    </Card>
  );
}
