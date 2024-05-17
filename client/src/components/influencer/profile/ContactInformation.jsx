import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  Typography,
  IconButton,
  Textarea,
} from "@material-tailwind/react";
import validator from "validator";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaArrowRight } from "react-icons/fa";
import ValidatedInput from "../../ValidatedInput";
import MultiSelect from "../../MultiSelect";
import { CITIES, CONTENTS, GENDER } from "../../../constants";
import { PhoneNumberInput } from "../../PhoneNumberInput";
import { postToAuthAPI } from "../../../helper/postToAuthAPI";
import { formatDate } from "../../../helper/formatDate";
import { updateUserProfile } from "../../../redux/user/userSlice";

export default function ContactInformation() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selectedPlatforms = currentUser.platforms.map(
    (platform) => platform.name
  );
  const selectedContents = currentUser.contents;

  const initialUserInfo = {
    username: currentUser.username,
    email: currentUser.email,
    firstName: currentUser.firstName || "",
    lastName: currentUser.lastName || "",
    dateOfBirth: formatDate(currentUser.dateOfBirth) || "",
    contents: selectedContents || [],
    city: currentUser.city || "",
    biography: currentUser.biography || "",
    gender: currentUser.gender || "",
  };

  const [userInfo, setUserInfo] = useState(initialUserInfo);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (field, value) => {
    setUserInfo((prev) => ({ ...prev, [field]: value }));
    setIsEditing(true);
  };

  const handleDateChange = (event) => {
    const { value } = event.target;
    const date = new Date(value);

    // Check if the date is valid before attempting to format it
    if (!isNaN(date.getTime())) {
      const formattedDate = date.toISOString().slice(0, 10);
      setUserInfo((prev) => ({ ...prev, dateOfBirth: formattedDate }));
      setIsEditing(true);
    } else {
      // Handle invalid date input, such as clearing the error or providing feedback
      setErrors((prevErrors) => ({
        ...prevErrors,
        dateOfBirth: "Invalid date",
      }));
    }
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
      userInfo.username !== currentUser.username &&
      !validator.isLength(userInfo.username, { min: 4 })
    ) {
      newErrors.username = "Username must be at least 4 characters long";
    }

    // if (!validator.isMobilePhone(userInfo.phoneNumber)) {
    //   newErrors.phoneNumber = "Valid phone number is required";
    // }

    if (userInfo.firstName.trim().length < 3)
      newErrors.firstName = "First name must be at least 3 characters long";

    if (userInfo.lastName.trim().length < 3)
      newErrors.lastName = "Last name must be at least 3 characters long";

    if (!userInfo.dateOfBirth)
      newErrors.dateOfBirth = "Date of birth is required";

    if (userInfo.contents.length === 0)
      newErrors.contents = "Please select at least one content";

    if (!userInfo.city) newErrors.city = "City is required";

    if (!userInfo.gender) newErrors.gender = "Please select your gender";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    const updatedData = {};
    Object.keys(userInfo).forEach((key) => {
      if (userInfo[key] !== initialUserInfo[key]) {
        updatedData[key] = userInfo[key];
      }
    });

    const apiPath = `/api/user/update/${currentUser._id}`;

    try {
      const response = await postToAuthAPI(apiPath, updatedData);

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

      dispatch(updateUserProfile(updatedData));

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
        className="flex flex-col mx-auto max-w-xl gap-4 "
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {" "}
          <ValidatedInput
            label="Username"
            value={userInfo.username}
            onChange={(e) => handleChange("username", e.target.value)}
            error={errors.username}
            className="bg-gray-500"
          />
          <ValidatedInput
            label="Email Address"
            value={userInfo.email}
            error={errors.email}
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
            label="First Name"
            placeholder="Alex"
            value={userInfo.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
            error={errors.firstName}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ValidatedInput
            label="Last Name"
            placeholder="Abera"
            value={userInfo.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
            error={errors.lastName}
          />
          <ValidatedInput
            type="date"
            label="Date of Birth"
            value={userInfo.dateOfBirth} // Convert string to date object initially
            onChange={handleDateChange}
            error={errors.dateOfBirth}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MultiSelect
            label="Select contents"
            options={CONTENTS}
            selectedOptions={userInfo.contents}
            onChange={(value) => handleChange("contents", value)}
            error={errors.contents}
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <select
                value={userInfo.city}
                onChange={(e) => handleChange("city", e.target.value)}
                className="bg-gray-50  border text-blue-gray-500 border-blue-gray-200 py-3 rounded-md text-xs  focus:text-blue-gray-900  block w-full p-2.5"
              >
                <option disabled value="" className=" ">
                  City
                </option>
                {CITIES.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              {errors.city && (
                <Typography
                  color="red"
                  className="flex text-[10px] gap-1 items-center ml-4 mt-1"
                >
                  {errors.city}
                </Typography>
              )}
            </div>
            <div>
              <select
                value={userInfo.gender}
                onChange={(e) => handleChange("gender", e.target.value)}
                className="bg-gray-50 border text-xs  text-blue-gray-500 border-blue-gray-200 py-3 rounded-md   focus:text-blue-gray-900  block w-full p-2.5"
              >
                <option disabled value="">
                  Gender
                </option>
                {GENDER.map((gender) => (
                  <option key={gender} value={gender}>
                    {gender}
                  </option>
                ))}
              </select>
              {errors.gender && (
                <Typography
                  color="red"
                  className="flex text-[10px] gap-1 items-center ml-4 mt-1"
                >
                  {errors.gender}
                </Typography>
              )}
            </div>
          </div>
        </div>

        <Textarea
          className="text-xs placeholder:text-xs py-2 "
          label="Biography"
          value={userInfo.biography}
          onChange={(e) => handleChange("biography", e.target.value)}
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
