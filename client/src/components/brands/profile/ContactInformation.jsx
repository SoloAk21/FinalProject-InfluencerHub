import React, { useState } from "react";
import { Card, Button, Typography, Textarea } from "@material-tailwind/react";
import ValidatedInput from "../../ValidatedInput";
import MultiSelect from "../../MultiSelect";
import { CONTENTS } from "../../../constants";
import { PhoneNumberInput } from "../../PhoneNumberInput";
import { useSelector, useDispatch } from "react-redux";
import { updateUserProfile } from "../../../redux/user/userSlice";
import { postToAuthAPI } from "../../../helper/postToAuthAPI";
import validator from "validator";

export default function ContactInformation() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const initialUserInfo = {
    companyName: currentUser.companyName || "",
    email: currentUser.email || "",
    companyWebsite: currentUser.companyWebsite || "",
    contactName: currentUser.contactName || "",
    phoneNumber: currentUser.phoneNumber || "",
    industry: currentUser.industry || [],
    companyDescription: currentUser.companyDescription || "",
    userType: currentUser.userType,
  };

  const [userInfo, setUserInfo] = useState(initialUserInfo);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (field, value) => {
    setUserInfo((prev) => ({ ...prev, [field]: value }));
    setIsEditing(true);
  };

  const handleCancel = () => {
    setUserInfo(initialUserInfo);
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const newErrors = {};

    if (
      userInfo.companyName !== initialUserInfo.companyName &&
      !validator.isLength(userInfo.companyName, { min: 4 })
    ) {
      newErrors.companyName = "Company name must be at least 4 characters long";
    }

    if (!validator.isMobilePhone(userInfo.phoneNumber)) {
      newErrors.phoneNumber = "Valid phone number is required";
    }

    if (userInfo.contactName.trim().length < 3)
      newErrors.contactName = "Contact name must be at least 3 characters long";

    if (userInfo.industry.length === 0)
      newErrors.industry = "Please select at least one industry";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }
    console.log(currentUser._id);

    const apiPath = `/api/user/update/${currentUser._id}`;
    console.log(userInfo);
    try {
      const response = await postToAuthAPI(apiPath, userInfo);
      console.log(response);
      if (!response.ok) {
        throw new Error(
          `Error updating user information: ${response.statusText}`
        );
      }

      const data = await response.json();
      if (data.success === false) {
        const newErrors = {};
        for (const error of data.errors) {
          newErrors[error.exist] = error.error;
        }
        setErrors(newErrors);
        setIsLoading(false);
        return;
      }

      dispatch(updateUserProfile(userInfo));

      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user information", error);
      setErrors({
        email: "Error updating user information. Please try again.",
      });
      setIsLoading(false);
      return;
    }
    setErrors({});
    setIsLoading(false);
  };

  return (
    <Card color="transparent" shadow={false}>
      <Typography className="text-center mb-4 text-blue-gray-600" variant="h6">
        Contact Information
      </Typography>
      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col mx-auto max-w-xl gap-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ValidatedInput
            label="Company Name"
            value={userInfo.companyName}
            onChange={(e) => handleChange("companyName", e.target.value)}
            error={errors.companyName}
          />
          <ValidatedInput
            label="Email Address"
            value={userInfo.email}
            disabled
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PhoneNumberInput
            label="Phone Number"
            value={userInfo.phoneNumber}
            onChange={(e) => handleChange("phoneNumber", e.target.value)}
            error={errors.phoneNumber}
          />
          <ValidatedInput
            label="Contact Name"
            value={userInfo.contactName}
            onChange={(e) => handleChange("contactName", e.target.value)}
            error={errors.contactName}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ValidatedInput
            label="Company Website"
            value={userInfo.companyWebsite}
            onChange={(e) => handleChange("companyWebsite", e.target.value)}
            error={errors.companyWebsite}
          />
          <MultiSelect
            label="Select Industry"
            options={CONTENTS}
            selectedOptions={userInfo.industry}
            onChange={(value) => handleChange("industry", value)}
            error={errors.industry}
          />
        </div>
        <Textarea
          className="text-xs placeholder:text-xs py-2"
          label="Company Description"
          value={userInfo.companyDescription}
          onChange={(e) => handleChange("companyDescription", e.target.value)}
          error={errors.companyDescription}
        />
        {isEditing && (
          <div className="flex justify-end mb-6 mt-0 gap-4">
            <Button
              variant="outlined"
              onClick={handleCancel}
              className="capitalize border-red-500 text-red-500"
              size="sm"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isLoading}
              className="capitalize bg-green-500"
              size="sm"
            >
              Save Changes
            </Button>
          </div>
        )}
      </form>
    </Card>
  );
}
