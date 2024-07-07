import React, { useState } from "react";
import { Card } from "@material-tailwind/react";

import AgreementPaper from "../../components/campagnCreation/AgreementPaper";
import CampaignDetailsForm from "../../components/campagnCreation/CampaignDetailsForm";
import CampaignDetailsDisplay from "../../components/campagnCreation/CampaignDetailsDisplay";
import { useSelector } from "react-redux";

const CampaignDetails = ({ campaign }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [campaignInfo, setCampaignInfo] = useState({ ...campaign });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  const handleChange = (field, value) => {
    setCampaignInfo((prev) => ({ ...prev, [field]: value }));
    setErrors({ ...errors, [field]: "" });
  };

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`/api/campaigns/${campaignInfo._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(campaignInfo),
      });

      if (!response.ok) {
        throw new Error("Failed to update campaign");
      }

      const updatedCampaign = await response.json();
      setCampaignInfo(updatedCampaign);
      setIsEditMode(false);
    } catch (error) {
      console.error("Error updating campaign:", error);
      // Handle error state or show error message to user
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="m-auto p-4 md:px-8" color="transparent" shadow={false}>
      {isEditMode && currentUser.userType === "company" ? (
        <CampaignDetailsForm
          campaignInfo={campaignInfo}
          setCampaignInfo={setCampaignInfo} // Ensure setCampaignInfo is passed down
          handleChange={handleChange}
          handleSave={handleSave}
          isLoading={isLoading}
          errors={errors}
        />
      ) : (
        <CampaignDetailsDisplay
          campaignInfo={campaignInfo}
          handleEdit={handleEdit}
        />
      )}

      <AgreementPaper campaign={campaignInfo} />
    </Card>
  );
};

export default CampaignDetails;
