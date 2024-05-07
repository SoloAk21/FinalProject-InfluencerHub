import React, { useState, useMemo } from "react";
import { Card, Typography, Button } from "@material-tailwind/react";
import { FaEye, FaEyeSlash, FaFilePdf } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { emailAuthReset } from "../../../redux/user/emailSlice";
import { useDispatch } from "react-redux";
import DynamicTable from "../../DynamicTable";

export default function InfluencerRegReport({ formData }) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleNext = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/influencer-auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log(data);
      if (data.success === false) {
        setError(data.message);
      } else {
        setError(null);
        dispatch(emailAuthReset());
        navigate("/registration-success");
      }
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
    if (["platforms", "confirmPassword"].includes(key)) return;

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
      <div key={key} className="flex items-center flex-row gap-3">
        <Typography className="text-sm  text-blue-gray-900 font-medium">
          {label}
        </Typography>
        <div className="text-xs flex-1 flex items-center text--gray-600   ">
          <span className="bg-gray-900/5 rounded-sm p-2">
            {key === "password" ? renderPassword(value) : value}
          </span>
        </div>
      </div>
    );
  };

  const renderPassword = (password) => (
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        value={password}
        className="w-full bg-transparent border-0 focus:outline-none"
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

  const tableHeaders = ["Platform", "URL", "Followers"];
  const tableData = formData.platforms.map(({ name, url, followerCount }) => [
    name,
    url,
    followerCount,
  ]);
  return (
    <Card className="mx-auto max-w-2xl" color="transparent" shadow={false}>
      {error && (
        <Typography className=" text-[10px] ml-4 mt-1" color="red">
          {error}
        </Typography>
      )}

      <div className="flex flex-col gap-4 mt-8 mb-2 ">
        <Typography variant="h6" color="blue-gray" className="text-center mb-4">
          Registration Report
        </Typography>
        <div className="flex flex-col gap-3">
          {Object.keys(formData).map(renderField)}
        </div>
      </div>

      <DynamicTable headers={tableHeaders} data={tableData} />
      <div className="flex justify-end mt-8">
        <Button
          onClick={handleNext}
          loading={isLoading}
          disabled={isLoading}
          className="capitalize "
        >
          Submit Report
        </Button>
      </div>
    </Card>
  );
}
