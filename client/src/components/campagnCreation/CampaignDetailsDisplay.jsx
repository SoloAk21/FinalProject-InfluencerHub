import React from "react";
import { Typography, Button } from "@material-tailwind/react";
import { formatDate } from "../../helper/formatDate";
import { useSelector } from "react-redux"; // Importing useSelector for Redux state

const CampaignDetailsDisplay = ({ campaignInfo, handleEdit }) => {
  const { currentUser } = useSelector((state) => state.user); // Accessing currentUser from Redux state

  return (
    <div className="flex flex-col gap-4 mt-4 mb-2">
      <Typography className="text-center text-2xl font-bold text-blue-gray-600">
        Campaign Details
      </Typography>
      {renderField("Campaign Name", campaignInfo.campaignName)}
      {renderField("Campaign Description", campaignInfo.campaignDescription)}
      {renderField("Start Date", formatDate(campaignInfo.startDate))}
      {renderField("End Date", formatDate(campaignInfo.endDate))}
      {renderField(
        "Campaign Budget",
        `${campaignInfo.campaignBudget} Ethiopian Birr (ETB)`
      )}
      {renderField("Content Guidelines", campaignInfo.contentGuidelines)}
      {renderField("Target Audience", campaignInfo.targetAudience)}
      {renderField(
        "Additional Requirements",
        campaignInfo.additionalRequirements
      )}
      {currentUser.userType === "company" && (
        <div className="flex justify-between mt-4">
          <Button
            variant="gradient"
            className="p-3 capitalize text-xs"
            color="blue"
            onClick={handleEdit}
          >
            Edit Campaign
          </Button>
        </div>
      )}
    </div>
  );
};

const renderField = (label, value) => (
  <div key={label} className="flex items-center flex-row gap-3">
    <Typography className="text-sm text-blue-gray-900 font-medium">
      {label}
    </Typography>
    <div className="text-xs flex-1 flex items-center text-gray-600">
      <span className="bg-gray-200 rounded-sm p-2">{value}</span>
    </div>
  </div>
);

export default CampaignDetailsDisplay;
