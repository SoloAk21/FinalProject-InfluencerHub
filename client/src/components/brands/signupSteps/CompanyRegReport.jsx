import React, { useState, useMemo } from "react";
import { Card, Typography, Button } from "@material-tailwind/react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";
import { MdCancel } from "react-icons/md";
import { useNavigate } from "react-router-dom";

import { auth, storage } from "../../../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { emailAuthReset } from "../../../redux/user/emailSlice";
import { useDispatch } from "react-redux";
import { postToAuthAPI } from "../../../helper/postToAuthAPI";

export default function CompanyRegReport({ formData }) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLicenceDocument = async () => {
    const file = formData.licenceDocument;
    if (file) {
      try {
        const uniqueFilename = `${uuidv4()}_${file.name}`;
        const storageRef = ref(storage, `licence-document/${uniqueFilename}`);
        await uploadBytes(storageRef, file);
        const licenceDocumentURL = await getDownloadURL(storageRef);
        formData.licenceDocument = licenceDocumentURL;
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };

  const handleNext = async (e) => {
    setIsLoading(true);
    const apiPath = "/api/auth/companies/signup";

    try {
      await handleLicenceDocument();
      const response = await postToAuthAPI(apiPath, formData);

      const data = await response.json();

      if (data.success === false) {
        console.log(data);
        setError(data.message);
      } else {
        setError(null);
        dispatch(emailAuthReset());
        navigate("/registration-success");
      }
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formatArrayValue = useMemo(
    () => (value) => value.join(", ").replace(/,(?=[^,]*$)/, " and"),
    [formData]
  );

  const renderField = (key) => {
    if (["licenceDocument", "confirmPassword"].includes(key)) return;

    const label = key
      .replace(/([A-Z])/g, " $1")
      .trim()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
    const value = Array.isArray(formData[key])
      ? formatArrayValue(formData[key])
      : formData[key];

    return (
      <div key={key} className="grid grid-cols-1 md:grid-cols-2 gap-[2px]">
        <Typography className="text-xl text-blue-gray-900 font-medium">
          {label}
        </Typography>
        <div className="text-lg text--gray-600 bg-blue-900/10 min-h-10 rounded-lg px-4 py-1">
          {key === "password" ? renderPassword(value) : value}
        </div>
      </div>
    );
  };

  const renderPassword = (password) => (
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        value={password}
        className="w-full  bg-gray-900/0 border-0 focus:outline-none " // Remove extra space here
        readOnly
      />
      <button
        className="absolute inset-y-0 right-0 px-3 py-1"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? <FaEye /> : <FaEyeSlash />}
      </button>
    </div>
  );

  const renderLicenceDocument = () => {
    return (
      <img
        src={URL.createObjectURL(formData.licenceDocument)}
        alt={formData.licenceDocument.name}
        className="max-w-full"
      />
    );
  };

  return (
    <Card className="mx-auto max-w-xl" color="transparent" shadow={false}>
      {error && (
        <div
          class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <span class="block sm:inline">{error}</span>
          <span class="absolute top-0 bottom-0 right-0 px-4 py-3">
            <MdCancel />
          </span>
        </div>
      )}
      <div className="flex flex-col gap-4 mt-8 mb-2 ">
        <Typography variant="h6" color="blue-gray" className="text-center mb-4">
          Registration Report
        </Typography>
        <div className="flex flex-col gap-3">
          {Object.keys(formData).map(renderField)}
        </div>
        <div className="w-full p-4 mt-4 border border-gray-300 rounded-md text-gray-700 dark:text-gray-300">
          {renderLicenceDocument()}
        </div>
      </div>

      <div className="flex justify-end mt-8">
        <Button
          onClick={handleNext}
          loading={isLoading}
          className="capitalize "
        >
          Submit Report
        </Button>
      </div>
    </Card>
  );
}
