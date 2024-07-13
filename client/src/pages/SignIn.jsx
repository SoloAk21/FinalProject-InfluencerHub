import React, { useState } from "react";
import { Typography, Input, Button, useSelect } from "@material-tailwind/react";
import { EyeSlashIcon, EyeIcon } from "@heroicons/react/24/solid";

import { useNavigate, Link } from "react-router-dom";
import { postToAuthAPI } from "../helper/postToAuthAPI";
import OAuth from "../components/AOuth"; // Assuming correct import
import { useDispatch, useSelector } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";

export default function SignIn() {
  const [passwordShown, setPasswordShown] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    userType: "",
  });
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { userType, email, password } = formData;
    if (!userType || !email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    const apiPath = "/api/auth/signin";
    try {
      const response = await postToAuthAPI(apiPath, formData);
      if (response.ok) {
        const data = await response.json();
        dispatch(signInSuccess(data));

        navigate("/dashboard");
      } else {
        setError(
          "Failed to log in, please check your credentials and try again."
        );
      }
    } catch (error) {
      console.error("Error occurred while signing in:", error);
      setError("Network error, please try again later.");
    }
    setIsLoading(false);
  };

  return (
    <>
      <Header />
      <section className="flex items-center justify-center p-6">
        <div className="w-full max-w-xs">
          <Typography
            variant="h3"
            color="blue-gray"
            className="mb-2 text-center"
          >
            Sign In
          </Typography>
          <Typography className="mb-8 text-gray-600 text-center text-xs">
            Enter your email and password to sign in
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
            <Input
              type={passwordShown ? "text" : "password"}
              name="password"
              icon={
                <button onClick={togglePasswordVisibility} type="button">
                  {passwordShown ? (
                    <EyeIcon className="h-5 w-5" />
                  ) : (
                    <EyeSlashIcon className="h-5 w-5" />
                  )}
                </button>
              }
              label="Password"
              placeholder="*******"
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
              Sign in
            </Button>
            <div className="mt-3 flex justify-end">
              <Link to="/reset-password" className="text-sm text-blue-900">
                Forgot Password?
              </Link>
            </div>
            <div className="mt-3 w-full">
              <OAuth
                userType={formData.userType.toLowerCase()}
                className="flex justify-center items-center p-3 w-full lowercase font-thin"
              />
            </div>
            <Typography
              variant="small"
              color="gray"
              className="mt-4 text-center font-normal"
            >
              Not registered?{" "}
              <Link to="/register" className="text-blue-900">
                Create account
              </Link>
            </Typography>
          </form>
        </div>
      </section>
    </>
  );
}
