import React from "react";
import ContactInformation from "../../components/influencer/profile/ContactInformation";
import SocialMediaPlatform from "../../components/influencer/profile/SocialMediaPlatform";
import { Card } from "@material-tailwind/react";

export default function userProfile() {
  return (
    <Card className="min-h-full py-10 px-4">
      <ContactInformation />
      <SocialMediaPlatform />
    </Card>
  );
}
