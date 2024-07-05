// pages/campaigns/CreateCampaign.js

import React, { useState } from "react";
import { Card, Typography, Textarea, Button } from "@material-tailwind/react";
import ValidatedInput from "../../components/ValidatedInput";
import ContentDeliverables from "../../components/campagnCreation/ContentDeliverables";
import MainStructure from "./MainStructure";
import AgreementDialog from "../../components/campagnCreation/AgreementDialog";

const CreateCampaign = () => {
  const [campaignInfo, setCampaignInfo] = useState({
    campaignName: "",
    campaignDescription: "",
    startDate: "",
    endDate: "",
    campaignBudget: "",
    contentGuidelines: "",
    amount: "",
    contentDeliverables: [],
    targetAudience: "",
    additionalRequirements: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isAgreementOpen, setIsAgreementOpen] = useState(false);

  const handleChange = (field, value) => {
    setCampaignInfo((prev) => ({ ...prev, [field]: value }));
    setErrors({ ...errors, [field]: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setIsAgreementOpen(true);
    setIsLoading(false);
  };

  return (
    <MainStructure
      content={
        <Card className="m-auto p-4 md:p-8" color="transparent" shadow={false}>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 mt-8 mb-2"
          >
            <Typography className="text-center text-2xl font-bold text-blue-gray-600">
              Create Campaign
            </Typography>

            {/* Campaign Name */}
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

            {/* Campaign Description */}
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

            {/* Start Date and End Date */}
            <div className="flex flex-col md:flex-row gap-2 ">
              <div>
                <div className="flex gap flex-col gap-4 md:flex-row">
                  <ValidatedInput
                    type="date"
                    label="Start Date"
                    value={campaignInfo.startDate}
                    onChange={(e) => handleChange("startDate", e.target.value)}
                    required
                  />
                  <ValidatedInput
                    type="date"
                    label="End Date"
                    value={campaignInfo.endDate}
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

              {/* Campaign Budget */}
              <div className="flex-1">
                <ValidatedInput
                  label="Campaign Budget"
                  type="number"
                  value={campaignInfo.campaignBudget}
                  onChange={(e) =>
                    handleChange("campaignBudget", e.target.value)
                  }
                  required
                />
                <Typography
                  variant="small"
                  color="gray"
                  className="text-xs font-normal m-1 mx-2"
                >
                  Enter the total budget allocated for the campaign.
                </Typography>
              </div>
            </div>

            {/* Content Deliverables */}
            <ContentDeliverables
              campaignInfo={campaignInfo}
              setCampaignInfo={setCampaignInfo}
            />

            {/* Content Guidelines */}
            <div>
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
            </div>

            {/* Amount */}
            <div>
              <ValidatedInput
                label="Amount"
                value={campaignInfo.amount}
                onChange={(e) => handleChange("amount", e.target.value)}
                error={errors.amount}
                type="number"
                required
                min="1"
              />
              <Typography
                variant="small"
                color="gray"
                className="text-xs font-normal m-1 mx-2"
              >
                Enter the amount to proceed with payment.
              </Typography>
            </div>

            {/* Target Audience */}
            <div>
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
            </div>

            {/* Additional Requirements */}
            <div>
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
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button
                variant="gradient"
                color="green"
                className="my-8 text-center capitalize h-10"
                type="submit"
                loading={isLoading}
                disabled={isLoading}
              >
                Proceed to Payment
              </Button>
            </div>
          </form>

          {/* Agreement Dialog */}
          <AgreementDialog
            isOpen={isAgreementOpen}
            onClose={() => setIsAgreementOpen(false)}
            campaignInfo={campaignInfo}
          />
        </Card>
      }
    />
  );
};

export default CreateCampaign;
