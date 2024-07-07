import React from "react";
import { Typography, Textarea, Input, Button } from "@material-tailwind/react";
import ValidatedInput from "../../components/ValidatedInput";
import ContentDeliverables from "../../components/campagnCreation/ContentDeliverables";
import { formatDate } from "../../helper/formatDate";

const CampaignDetailsForm = ({
  campaignInfo,
  setCampaignInfo,
  handleChange,
  handleSave,
  isLoading,
  errors,
}) => (
  <form onSubmit={handleSave} className="flex flex-col gap-4 mt-8 mb-2">
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
        onChange={(e) => handleChange("campaignDescription", e.target.value)}
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
            onChange={(e) => handleChange("startDate", e.target.value)}
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
          onChange={(e) => handleChange("campaignBudget", e.target.value)}
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
      onChange={(e) => handleChange("contentGuidelines", e.target.value)}
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
      onChange={(e) => handleChange("additionalRequirements", e.target.value)}
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
);

export default CampaignDetailsForm;
