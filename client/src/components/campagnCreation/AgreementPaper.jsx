import React from "react";
import { Typography } from "@material-tailwind/react";

const AgreementPaper = ({ campaign }) => {
  const {
    company,
    influencer,
    campaignName,
    campaignDescription,
    startDate,
    endDate,
    campaignBudget,
    contentGuidelines,
    contentDeliverables,
    targetAudience,
    additionalRequirements,
  } = campaign;

  // Format dates for display
  const formattedStartDate = new Date(startDate).toLocaleDateString();
  const formattedEndDate = new Date(endDate).toLocaleDateString();

  return (
    <div className="p-8">
      <div className="mb-4">
        <Typography
          variant="h6"
          className="text-center text-blue-gray-900"
          style={{ fontFamily: "Times New Roman, serif" }}
        >
          Advertising Campaign Agreement
        </Typography>
        <Typography
          variant="body1"
          className="text-center text-blue-gray-900"
          style={{ fontFamily: "Times New Roman, serif" }}
        >
          This Agreement is entered into on {formattedStartDate}.
        </Typography>
      </div>

      <div className="border-b-2 border-gray-200 mb-6 pb-4">
        <Typography
          variant="h6"
          className="mb-2 text-blue-gray-900"
          style={{ fontFamily: "Times New Roman, serif" }}
        >
          Parties:
        </Typography>
        <Typography
          variant="body1"
          className="text-blue-gray-900"
          style={{ fontFamily: "Times New Roman, serif" }}
        >
          <strong className="font-bold text-sm">Company:</strong>{" "}
          {company.companyName}
          <br />
          <strong className="font-bold text-sm">Address:</strong>{" "}
          {company.companyWebsite}
          <br />
          <strong className="font-bold text-sm">Contact Person:</strong>{" "}
          {company.contactName}
          <br />
          <strong className="font-bold text-sm">Email:</strong> {company.email}
        </Typography>

        <Typography
          variant="body1"
          className="mt-4 text-blue-gray-900"
          style={{ fontFamily: "Times New Roman, serif" }}
        >
          <strong className="font-bold text-sm">Content Creator:</strong>
          <br />
          <strong className="font-bold text-sm">Name:</strong>{" "}
          {influencer.firstName} {influencer.lastName}
          <br />
          <strong className="font-bold text-sm">Address:</strong>{" "}
          {influencer.city}
          <br />
          <strong className="font-bold text-sm">Email:</strong>{" "}
          {influencer.email}
        </Typography>
      </div>

      <div className="mb-6">
        <Typography
          variant="h6"
          className="mb-2 text-blue-gray-900"
          style={{ fontFamily: "Times New Roman, serif" }}
        >
          Purpose:
        </Typography>
        <Typography
          variant="body1"
          className="text-blue-gray-900"
          style={{ fontFamily: "Times New Roman, serif" }}
        >
          The purpose of this Agreement is to outline the terms and conditions
          under which the Content Creator will create and deliver content for
          the Company's advertising campaign in Ethiopia.
        </Typography>
      </div>

      <div className="mb-6">
        <Typography
          variant="h6"
          className="mb-2 text-blue-gray-900"
          style={{ fontFamily: "Times New Roman, serif" }}
        >
          Campaign Details:
        </Typography>
        <Typography
          variant="body1"
          className="text-blue-gray-900"
          style={{ fontFamily: "Times New Roman, serif" }}
        >
          <strong className="font-bold text-sm">Campaign Name:</strong>{" "}
          {campaignName}
          <br />
          <strong className="font-bold text-sm">
            Campaign Description:
          </strong>{" "}
          {campaignDescription}
          <br />
          <strong className="font-bold text-sm">Start Date:</strong>{" "}
          {formattedStartDate}
          <br />
          <strong className="font-bold text-sm">End Date:</strong>{" "}
          {formattedEndDate}
          <br />
          <strong className="font-bold text-sm">Campaign Budget:</strong>{" "}
          {campaignBudget} Ethiopian Birr (ETB)
          <br />
          <strong className="font-bold text-sm">Target Audience:</strong>{" "}
          {targetAudience}
          <br />
          <strong className="font-bold text-sm">
            Content Deliverables:
          </strong>{" "}
          {contentDeliverables.join(", ")}
          <br />
          <strong className="font-bold text-sm">
            Content Guidelines:
          </strong>{" "}
          {contentGuidelines}
          <br />
          <strong className="font-bold text-sm">
            Additional Requirements:
          </strong>{" "}
          {additionalRequirements}
        </Typography>
      </div>

      <div className="mb-6">
        <Typography
          variant="h6"
          className="mb-2 text-blue-gray-900"
          style={{ fontFamily: "Times New Roman, serif" }}
        >
          Content Creation and Delivery:
        </Typography>
        <Typography
          variant="body1"
          className="text-blue-gray-900"
          style={{ fontFamily: "Times New Roman, serif" }}
        >
          <strong className="font-bold text-sm">3.1</strong> The Content Creator
          agrees to create and deliver the following content as part of the
          campaign, ensuring it aligns with the target audience:{" "}
          {contentDeliverables.join(", ")}
          <br />
          <strong className="font-bold text-sm">3.2</strong> All content must
          adhere to the following guidelines and target the specified audience:{" "}
          {contentGuidelines}
          <br />
          <strong className="font-bold text-sm">3.3</strong> The Content Creator
          agrees to submit the content by the following deadlines:
          <br />
          [List of Deadlines, if applicable]
        </Typography>
      </div>

      <div className="mb-6">
        <Typography
          variant="h6"
          className="mb-2 text-blue-gray-900"
          style={{ fontFamily: "Times New Roman, serif" }}
        >
          Other Requirements:
        </Typography>
        <Typography
          variant="body1"
          className="text-blue-gray-900"
          style={{ fontFamily: "Times New Roman, serif" }}
        >
          [Include any additional requirements specific to the campaign, such
          as:]
          <br />
          * Approval process for content deliverables
          <br />
          * Revision policy
          <br />
          * Reporting requirements (e.g., content performance metrics)
          <br />
          * Use of specific hashtags or brand mentions
          <br />
          * Disclaimers or legal requirements for the content
          <br />
          <strong className="font-bold text-sm">4.1</strong> The Company may
          request revisions to the content to ensure it meets the campaign goals
          and targets the specified audience. The Content Creator agrees to make
          reasonable revisions in a timely manner.
        </Typography>
      </div>

      <div>
        <Typography
          variant="h6"
          className="mb-2 text-blue-gray-900"
          style={{ fontFamily: "Times New Roman, serif" }}
        >
          Payment:
        </Typography>
        <Typography
          variant="body1"
          className="text-blue-gray-900"
          style={{ fontFamily: "Times New Roman, serif" }}
        >
          <strong className="font-bold text-sm">5.1</strong> The Company agrees
          to pay the Content Creator a total amount of {campaign.amount}{" "}
          Ethiopian Birr (ETB) for the services rendered.
          <br />
          <strong className="font-bold text-sm">5.2</strong> Payment will be
          made in the following manner:
          <br />
          [Payment Schedule and Method]
          <br />
          <strong className="font-bold text-sm">5.3</strong> The payment will be
          processed upon successful completion of the deliverables and
          verification by the Company, ensuring they meet the target audience
          criteria and other requirements.
        </Typography>
      </div>
    </div>
  );
};

export default AgreementPaper;
