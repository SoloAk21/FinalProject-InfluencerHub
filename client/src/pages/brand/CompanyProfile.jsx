import React from "react";
import { Card } from "@material-tailwind/react";
import ContactInformation from "../../components/brands/profile/ContactInformation";

export default function CompanyProfile() {
  return (
    <Card className="min-h-full py-10 px-4">
      <ContactInformation />
    </Card>
  );
}
