import React, { useState } from "react";
import { Card, Button, Typography, IconButton } from "@material-tailwind/react";
import { FaArrowRight, FaFilePdf, FaUpload } from "react-icons/fa";

export default function LicenceVerification({ onNext, formData }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    setIsLoading(false);
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setErrors({});

      setSelectedFile(file);
    }
  };

  const handleNext = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!selectedFile) {
      setErrors({ file: "Please upload a file to continue" });
      setIsLoading(false);
      return;
    }

    onNext({ licenceDocument: selectedFile });
    setIsLoading(false);
  };

  return (
    <Card className="mx-auto max-w-xl" color="transparent" shadow={false}>
      <form
        onSubmit={handleNext}
        className="flex flex-col  gap-2 md:gap-4 mt-8 mb-2 w-72 max-w-screen-lg sm:w-96"
      >
        <Typography variant="h6" color="blue-gray" className="text-center mb-4">
          Upload Verification Document
        </Typography>
        <div className="text-xs flex">
          Please upload your trade license. The document must be an image and
          not exceed 1MB.
        </div>

        <label
          htmlFor="file-upload"
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <FaUpload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Images (PNG, JPG)
            </p>
          </div>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept=".png, .jpg, .jpeg"
          />
        </label>
        {Object.keys(errors).length > 0 && (
          <div className="text-red-500 text-sm mb-2">{errors.file}</div>
        )}
        {selectedFile && (
          <div className="w-full p-4 mt-4 border border-gray-300 rounded-md text-gray-700 dark:text-gray-300">
            <img
              src={URL.createObjectURL(selectedFile)}
              alt="Selected Image"
              className="max-w-full"
            />
          </div>
        )}
        <div className="flex justify-end mt-4">
          <IconButton type="submit" loading={isLoading} className="capitalize ">
            <FaArrowRight />
          </IconButton>
        </div>
      </form>
    </Card>
  );
}
