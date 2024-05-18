import React, { useState } from "react";
import { Stepper, Step, Button } from "@material-tailwind/react";
import CompanyInfo from "../../components/brands/signupSteps/CompanyInfo";
import ContactInfo from "../../components/brands/signupSteps/ContactInfo";
import LicenseDocument from "../../components/brands/signupSteps/LicenceDocument";
import CompanyRegReport from "../../components/brands/signupSteps/CompanyRegReport";

export default function SignUpCompany() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({});

  const handleNext = (data) => {
    setFormData({ ...formData, ...data });

    setActiveStep((cur) => cur + 1);
  };

  const steps = [
    <CompanyInfo onNext={handleNext} setFormData={setFormData} />,
    <ContactInfo onNext={handleNext} setFormData={setFormData} />,
    <LicenseDocument onNext={handleNext} setFormData={setFormData} />,
    <CompanyRegReport formData={formData} />,
  ];

  return (
    <div className="w-full mx-auto px-4 md:px-24 py-4">
      <Stepper activeStep={activeStep}>
        {steps.map((_, index) => (
          <Step key={index}>{index + 1}</Step>
        ))}
      </Stepper>
      <div className="flex flex-col items-center">{steps[activeStep]}</div>
    </div>
  );
}
