import { Button, Typography } from "@material-tailwind/react";
import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function RegistrationSuccess() {
  return (
    <div className="h-screen flex items-center justify-center p-10 ">
      <div
        className=" p-10 rounded-xl md:mx-auto  max-w-screen-md bg-teal-50 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md"
        role="alert"
      >
        <FaCheckCircle className="text-green-600 w-10 h-10 mx-auto my-3" />

        <div className="text-center">
          <Typography
            variant="h2"
            className="font-semibold text-xl md:text-2xl"
          >
            Registration Submitted for Review
          </Typography>
          <p className="text-gray-600 my-2">Thank you for your application.</p>

          <p className="mb-4">
            Our team is currently reviewing your information to ensure it meets
            our requirements. This process typically takes up to{" "}
            <span className="font-semibold">24 hours.</span>
          </p>
          <p>
            You will be notified{" "}
            <span className="font-semibold">via email</span> once your
            application is approved.
          </p>

          <Link to={"/"}>
            <Button className="my-8 text-center bg-blue-800 capitalize h-10">
              Go Back
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
