import React, { useState } from "react";
import { Typography, Input, Button, useSelect } from "@material-tailwind/react";
import { EyeSlashIcon, EyeIcon } from "@heroicons/react/24/solid";
import { useNavigate, Link } from "react-router-dom";
import { postToAuthAPI } from "../helper/postToAuthAPI";
import OAuth from "../components/AOuth"; // Assuming correct import
import { useDispatch, useSelector } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import axios from "axios";

export default function SignIn() {
  const [formData, setFormData] = useState({
    email: "",
    userType: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { userType, email } = formData;
    if (!userType || !email) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post("/api/forgot-password/reset-password", {
        email,
        userType,
      });

      console.log(response);

      if (response.status !== 200) {
        throw new Error("Network response was not ok.");
      }
      alert("Reset password link is sent successfully chack your email.");
      navigate("/signin");
    } catch (error) {
      console.log(error);
      console.error("Error occurred while checking email:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
        setIsLoading(false);
      } else {
        setError("Network error, please try again later.");
      }
    }
    setIsLoading(false);
  };

  return (
    <>
      <section className="flex justify-center p-6 h-screen items-center">
        <div className="w-full max-w-xs">
          <Typography
            variant="h3"
            color="blue-gray"
            className="mb-2 text-center"
          >
            Forgot-password
          </Typography>
          <Typography className="mb-8 text-gray-600 text-center text-xs">
            Enter your email to recover your password
          </Typography>
          <form
            onSubmit={handleSubmit}
            className="mx-auto max-w-lg text-left flex flex-col gap-2"
          >
            <Input
              type="email"
              name="email"
              label="Email"
              placeholder="example@gmail.com"
              onChange={handleChange}
              disabled={isLoading}
            />
            <select
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              className="bg-gray-50 border text-sm text-blue-gray-500 border-blue-gray-200 py-3 rounded-md focus:text-blue-gray-900 block w-full p-2.5"
              disabled={isLoading}
            >
              <option disabled value="">
                User type
              </option>
              <option value="company">Company</option>
              <option value="influencer">Influencer</option>
            </select>
            {error && (
              <Typography color="red" className="text-[10px] ml-2 ">
                {error}
              </Typography>
            )}
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
        </div>
      </section>
    </>
  );
}
