import React, { useState } from "react";
import { Stepper, Step, Button } from "@material-tailwind/react";
import ContactInfo from "../../components/influencer/signupSteps/ContactInfo";
import PersonalInfo from "../../components/influencer/signupSteps/PersonalInfo";
import SocialMediaProfile from "../../components/influencer/signupSteps/SocialMediaPlatform";
import InfluencerRegReport from "../../components/influencer/signupSteps/InfluencerRegReport";
import Google from "../../components/Google";

export default function SignUpInfluencer() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({});

  const handleNext = (data) => {
    setFormData.userType = "influencer";
    setFormData({ ...formData, ...data });
    setActiveStep((cur) => cur + 1);
  };

  const steps = [
    <Google onNext={handleNext} />,
    <ContactInfo onNext={handleNext} formData={formData} />,
    <PersonalInfo onNext={handleNext} />,
    <SocialMediaProfile onNext={handleNext} />,
    <InfluencerRegReport formData={formData} />,
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
