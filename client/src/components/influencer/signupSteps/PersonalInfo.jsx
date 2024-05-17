import React, { useState } from "react";
import {
  Card,
  Button,
  Typography,
  Textarea,
  Select,
  Option,
  IconButton,
} from "@material-tailwind/react";
import MultiSelect from "../../MultiSelect";
import ValidatedInput from "../../ValidatedInput";
import { CITIES, CONTENTS, GENDER } from "../../../constants";
import { FaArrowRight } from "react-icons/fa";

export default function PersonalInfo({ onNext }) {
  const [personalInfo, setPersonalInfo] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    contents: [],
    city: "",
    biography: "",
    gender: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setPersonalInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = async (e) => {
    e.preventDefault();
    const newErrors = {};
    const { firstName, lastName, dateOfBirth, contents, city, gender } =
      personalInfo; 
    // Validating required fields 
    if (!firstName) newErrors.firstName = "First name is required";
    if (!lastName) newErrors.lastName = "Last name is required";
    if (!dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
    if (contents.length === 0)
      newErrors.contents = "Please select at least one content";
    if (!city) newErrors.city = "City is required";
    if (!gender) newErrors.gender = "Please select your gender";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onNext(personalInfo);
  };

  return (
    <Card
      className="flex justify-center items-center w-screen"
      color="transparent"
      shadow={false}
    >
      <form
        onSubmit={handleNext}
        className="flex max-w-xl flex-col gap-3 md:gap-4 mt-8 mb-2 w-72 sm:w-96"
      >
        <Typography variant="h6" color="blue-gray" className="text-center mb-4">
          Personal Information
        </Typography>

        <ValidatedInput
          label="First Name"
          placeholder="Alex"
          value={personalInfo.firstName}
          onChange={(e) => handleChange("firstName", e.target.value)}
          error={errors.firstName}
          required
        />
        <ValidatedInput
          label="Last Name"
          placeholder="Abera"
          value={personalInfo.lastName}
          onChange={(e) => handleChange("lastName", e.target.value)}
          error={errors.lastName}
          required
        />

        <ValidatedInput
          type="date"
          label="Date of Birth"
          value={personalInfo.dateOfBirth}
          onChange={(e) => handleChange("dateOfBirth", e.target.value)}
          error={errors.dateOfBirth}
          required
        />

        <MultiSelect
          label="Select contents"
          options={CONTENTS}
          selectedOptions={personalInfo.contents}
          onChange={(value) => handleChange("contents", value)}
          error={errors.contents}
          required
        />

        <div>
          <select
            value={personalInfo.city}
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
            value={personalInfo.gender}
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
        <Textarea
          className="text-xs placeholder:text-xs py-2 "
          label="Biography (optional)"
          value={personalInfo.biography}
          onChange={(e) => handleChange("biography", e.target.value)}   
        />

        <div className="flex justify-end"> 
          <IconButton type="submit" className="capitalize" size="sm">
            <FaArrowRight />
          </IconButton>
        </div>
      </form>
    </Card>
  );
}
