import React, { useState } from "react";
import {
  Card,
  Button,
  Typography,
  Textarea,
  IconButton,
} from "@material-tailwind/react";
import { INDUSTRY } from "../../../constants";
import MultiSelect from "../../MultiSelect";
import { FaArrowRight, FaExclamation } from "react-icons/fa";
import ValidatedInput from "../../ValidatedInput";
import validator from "validator";
import { postToAuthAPI } from "../../../helper/postToAuthAPI";

export default function CompanyInfo({ onNext }) {
  const [companyInfo, setCompanyInfo] = useState({
    companyName: "",
    companyWebsite: "",
    industry: [],
    companyDescription: "",
    userType: "company",
  });
  const [errors, setErrors] = useState({
    companyName: "",
    industry: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field, value) => {
    setCompanyInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const { companyName, industry, companyWebsite } = companyInfo;
    const newErrors = {};

    if (!companyName) {
      newErrors.companyName = "Company Name is required";
    }

    if (industry.length === 0) {
      newErrors.industry = "Please select at least one industry";
    }

    // Only validate website if it's provided
    if (companyWebsite && !validator.isURL(companyWebsite)) {
      newErrors.companyWebsite =
        "Invalid company website URL. Please enter a valid URL like 'http://www.example.com'";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    const checkData = { companyName: companyInfo.companyName };
    const apiPath = "/api/auth/companies/check";

    try {
      const response = await postToAuthAPI(apiPath, { checkData });

      const data = await response.json();

      if (data.success === false) {
        newErrors.companyName = data.message;
        setErrors(newErrors);
        setIsLoading(false);
        return;
      }
    } catch (error) {
      console.error("Error checking company name:", error);
      setErrors({
        companyName: "Error checking company name. Please try again.",
      });
      setIsLoading(false);
      return;
    }
    setErrors({});
    setIsLoading(false);
    onNext(companyInfo);
  };

  return (
    <Card className="mx-auto max-w-xl" color="transparent" shadow={false}>
      <form
        onSubmit={handleNext}
        className="flex flex-col gap-2 md:gap-4 mt-8 mb-2 w-72 max-w-screen-lg sm:w-96"
      >
        <Typography variant="h6" color="blue-gray" className="text-center mb-4">
          Company Information
        </Typography>
        <ValidatedInput
          label="Company Name"
          placeholder="TechSolutions Inc."
          value={companyInfo.companyName}
          onChange={(e) => handleChange("companyName", e.target.value)}
          error={errors.companyName}
          required
        />
        <ValidatedInput
          label="Company Website (optional)"
          placeholder="www.techsolutions.com"
          value={companyInfo.companyWebsite}
          onChange={(e) => handleChange("companyWebsite", e.target.value)}
          error={errors.companyWebsite}
        />
        <MultiSelect
          label="Industry"
          options={INDUSTRY}
          selectedOptions={companyInfo.industry}
          onChange={(value) => handleChange("industry", value)}
          error={errors.industry}
        />
        <div>
          <Textarea
            label="Company Description (optional)"
            value={companyInfo.companyDescription}
            onChange={(e) => handleChange("companyDescription", e.target.value)}
          />
        </div>
        <div className="flex justify-end">
          <IconButton
            type="submit"
            loading={isLoading}
            className="p-2 capitalize mt-4 w-16"
          >
            <FaArrowRight />
          </IconButton>
        </div>
      </form>
    </Card>
  );
}
