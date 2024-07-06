import React, { useState } from "react";
import {
  Card,
  Typography,
  Button,
  Textarea,
  Input,
} from "@material-tailwind/react";
import ValidatedInput from "../../components/ValidatedInput";
import MainStructure from "./MainStructure";
import AgreementPaper from "../../components/campagnCreation/AgreementPaper";
import ContentDeliverables from "../../components/campagnCreation/ContentDeliverables";
import { formatDate } from "../../helper/formatDate";

const CampaignDetails = ({ campaign }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [campaignInfo, setCampaignInfo] = useState({ ...campaign });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

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

  const renderField = (label, value) => (
    <div key={label} className="flex items-center flex-row gap-3">
      <Typography className="text-sm text-blue-gray-900 font-medium">
        {label}
      </Typography>
      <div className="text-xs flex-1 flex items-center text-gray-600">
        <span className="bg-gray-900/5 rounded-sm p-2">{value}</span>
      </div>
    </div>
  );

  return (
    <MainStructure
      content={
        <Card className="m-auto p-4 md:p-8" color="transparent" shadow={false}>
          {isEditMode ? (
            <form
              onSubmit={handleSave}
              className="flex flex-col gap-4 mt-8 mb-2"
            >
              <Typography className="text-center text-2xl font-bold text-blue-gray-600">
                Edit Campaign
              </Typography>

              <div>
                <ValidatedInput
                  label="Campaign Name"
                  value={campaignInfo.campaignName}
                  onChange={(e) => handleChange("campaignName", e.target.value)}
                  error={errors.campaignName}
                  required
                />
                <Typography
                  variant="small"
                  color="gray"
                  className="text-xs font-normal m-1 mx-2"
                >
                  Enter a unique name for your campaign.
                </Typography>
              </div>
              <div>
                <Textarea
                  label="Campaign Description"
                  value={campaignInfo.campaignDescription}
                  onChange={(e) =>
                    handleChange("campaignDescription", e.target.value)
                  }
                  required
                />
                <Typography
                  variant="small"
                  color="gray"
                  className="text-xs font-normal m-1 mx-2"
                >
                  Provide a brief description of your campaign.
                </Typography>
              </div>
              <div className="flex flex-col lg:flex-row gap-4">
                <div>
                  <div className="flex flex-col md:flex-row gap-2">
                    <ValidatedInput
                      type="date"
                      label="Start Date"
                      value={formatDate(campaignInfo.startDate)}
                      onChange={(e) =>
                        handleChange("startDate", e.target.value)
                      }
                      required
                    />
                    <ValidatedInput
                      type="date"
                      label="End Date"
                      value={formatDate(campaignInfo.endDate)}
                      onChange={(e) => handleChange("endDate", e.target.value)}
                      required
                    />
                  </div>
                  <Typography
                    variant="small"
                    color="gray"
                    className="text-xs font-normal m-1 mx-2"
                  >
                    Select the start and end dates for your campaign.
                  </Typography>
                </div>
                <div className="flex-1">
                  <Input
                    type="number"
                    label={`Campaign Budget: ${campaignInfo.campaignBudget}`}
                    onChange={(e) =>
                      handleChange("campaignBudget", e.target.value)
                    }
                    disabled
                  />
                </div>
              </div>

              <ContentDeliverables
                campaignInfo={campaignInfo}
                setCampaignInfo={setCampaignInfo}
              />

              <Textarea
                label="Content Guidelines"
                value={campaignInfo.contentGuidelines}
                onChange={(e) =>
                  handleChange("contentGuidelines", e.target.value)
                }
              />
              <Typography
                variant="small"
                color="gray"
                className="text-xs font-normal m-1 mx-2"
              >
                Provide guidelines for content creation.
              </Typography>

              <Textarea
                label="Target Audience"
                value={campaignInfo.targetAudience}
                onChange={(e) => handleChange("targetAudience", e.target.value)}
              />
              <Typography
                variant="small"
                color="gray"
                className="text-xs font-normal m-1 mx-2"
              >
                Describe the target audience for this campaign.
              </Typography>

              <Textarea
                label="Additional Requirements"
                value={campaignInfo.additionalRequirements}
                onChange={(e) =>
                  handleChange("additionalRequirements", e.target.value)
                }
              />
              <Typography
                variant="small"
                color="gray"
                className="text-xs font-normal m-1 mx-2"
              >
                Specify any additional requirements for this campaign.
              </Typography>
              <div>
                <Button
                  variant="gradient"
                  color="green"
                  className="mt-6 p-3 capitalize text-xs"
                  type="submit"
                  loading={isLoading}
                  disabled={isLoading}
                >
                  Save Changes
                </Button>
              </div>
            </form>
          ) : (
            <div className="flex flex-col gap-4 mt-4 mb-2">
              <Typography className="text-center text-2xl font-bold text-blue-gray-600">
                Campaign Details
              </Typography>

              {renderField("Campaign Name", campaignInfo.campaignName)}
              {renderField(
                "Campaign Description",
                campaignInfo.campaignDescription
              )}
              {renderField("Start Date", formatDate(campaignInfo.startDate))}
              {renderField("End Date", formatDate(campaignInfo.endDate))}
              {renderField(
                "Campaign Budget",
                `${campaignInfo.campaignBudget} Ethiopian Birr (ETB)`
              )}
              {renderField(
                "Content Guidelines",
                campaignInfo.contentGuidelines
              )}

              {renderField("Target Audience", campaignInfo.targetAudience)}
              {renderField(
                "Additional Requirements",
                campaignInfo.additionalRequirements
              )}

              <div className="flex justify-between mt-4">
                <Button
                  variant="gradient"
                  className=" p-3 capitalize text-xs"
                  color="blue"
                  onClick={handleEdit}
                >
                  Edit Campaign
                </Button>
              </div>
            </div>
          )}

          <AgreementPaper campaign={campaignInfo} />
        </Card>
      }
    />
  );
};

export default CampaignDetails;
