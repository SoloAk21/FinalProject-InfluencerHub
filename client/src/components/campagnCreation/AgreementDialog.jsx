// AgreementDialog.js
import React, { useState } from "react";
import {
  Typography,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
} from "@material-tailwind/react";
import { useSelector } from "react-redux";

import { useParticipantData } from "../../helper/userParticipantData";
import { getCurrentDateFormatted } from "../../helper/getCurrentDateFormatted";
import { createCampaign } from "../../utils/api/campaignApi";
import { createAgreement } from "../../utils/api/agreementApi";
import {
  acceptPayment,
  createPayment,
  verifyPayment,
} from "../../utils/api/paymentApi";

const AgreementDialog = ({ isOpen, onClose, campaignInfo }) => {
  const { currentUser } = useSelector((state) => state.user);
  const selectedParticipant = useSelector(
    (state) => state.chat.selectedParticipant
  );
  const { participant } = useParticipantData(selectedParticipant);
  const formattedDate = getCurrentDateFormatted();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleAgreementConfirm = async () => {
    setIsLoading(true);

    try {
      const paymentResponse = await acceptPayment(campaignInfo.amount);
      if (paymentResponse.success) {
        const txRef = paymentResponse.tx_ref;
        await verifyPayment(txRef);
        if (paymentResponse.success) {
          const checkoutUrl = paymentResponse.data.data.checkout_url;

          const campaignData = {
            campaignName: campaignInfo.campaignName,
            campaignDescription: campaignInfo.campaignDescription,
            startDate: campaignInfo.startDate,
            endDate: campaignInfo.endDate,
            campaignBudget: campaignInfo.campaignBudget,
            contentGuidelines: campaignInfo.contentGuidelines,
            contentDeliverables: campaignInfo.contentDeliverables,
            targetAudience: campaignInfo.targetAudience,
            additionalRequirements: campaignInfo.additionalRequirements,
          };
          const createdCampaign = await createCampaign(campaignData);
          const agreementData = {
            company: currentUser._id,
            contentCreator: participant._id,
            campaign: createdCampaign._id,
            agreementDate: new Date(),
            isSigned: false,
          };
          const createdAgreement = await createAgreement(agreementData);

          const paymentData = {
            agreement: createdAgreement._id,
            amount: campaignInfo.amount,
            paymentDate: new Date(),
            transactionId: paymentResponse.tx_ref,
          };

          await createPayment(paymentData);
          window.open(checkoutUrl, "_blank");
          onClose();
        } else {
          setErrorMessage("Payment verification failed. Please try again.");
        }
      } else {
        setErrorMessage("Payment acceptance failed. Please try again.");
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
    }

    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen} handler={onClose}>
      <DialogHeader>Advertising Campaign Agreement</DialogHeader>
      <DialogBody divider className="h-[30rem] overflow-scroll">
        {errorMessage && (
          <div className="my-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
            <Typography variant="small" color="red">
              {errorMessage}
            </Typography>
          </div>
        )}
        <Typography variant="h6">
          This Advertising Campaign Agreement ("Agreement") is entered into on
          this {formattedDate} by and between:
        </Typography>
        <Typography variant="body1" className="mt-4">
          <strong>Company:</strong> {currentUser.companyName}
          <br />
          <strong>Address:</strong>
          {currentUser.companyWebsite}
          <br />
          <strong>Contact Person:</strong>
          {currentUser.contactName}
          <br />
          <strong>Email:</strong> {currentUser.email}
        </Typography>
        <Typography variant="body1" className="mt-4">
          <strong>Content Creator:</strong>
          <br />
          <strong>Name:</strong> {participant.firstName} &nbsp;
          {participant.lastName}
          <br />
          <strong>Address:</strong> {participant.city}
          <br />
          <strong>Email:</strong> {participant.email}
        </Typography>

        <Typography variant="body1" className="mt-4">
          <strong>1. Purpose:</strong>
          <br />
          The purpose of this Agreement is to outline the terms and conditions
          under which the Content Creator will create and deliver content for
          the Company's advertising campaign in Ethiopia.
        </Typography>

        <Typography variant="body1" className="mt-4">
          <strong>2. Campaign Details:</strong>
          <br />
          <strong>Campaign Name:</strong> {campaignInfo.campaignName}
          <br />
          <strong>Campaign Description:</strong>{" "}
          {campaignInfo.campaignDescription}
          <br />
          <strong>Start Date:</strong> {campaignInfo.startDate}
          <br />
          <strong>End Date:</strong> {campaignInfo.endDate}
          <br />
          <strong>Campaign Budget:</strong> {campaignInfo.campaignBudget}{" "}
          Ethiopian Birr (ETB)
          <br />
          **Target Audience:** {campaignInfo.targetAudience} (Details about the
          target audience demographics, interests, etc. can be included here)
          <br />
          <strong>Content Deliverables:</strong>{" "}
          {campaignInfo.contentDeliverables.join(", ")}
          <br />
          <strong>Content Guidelines:</strong> {campaignInfo.contentGuidelines}
          <br />
          <strong>Payment Amount:</strong> {campaignInfo.amount} Ethiopian Birr
          (ETB)
        </Typography>

        <Typography variant="body1" className="mt-4">
          <strong>3. Content Creation and Delivery:</strong>
          <br />
          <strong>3.1</strong> The Content Creator agrees to create and deliver
          the following content as part of the campaign, ensuring it aligns with
          the target audience:
          <br />
          {campaignInfo.contentDeliverables.join(", ")}
          <br />
          <strong>3.2</strong> All content must adhere to the following
          guidelines and target the specified audience:
          <br />
          {campaignInfo.contentGuidelines}
          <br />
          <strong>3.3</strong> The Content Creator agrees to submit the content
          by the following deadlines:
          <br />
          [List of Deadlines, if applicable]
        </Typography>

        <Typography variant="body1" className="mt-4">
          <strong>4. Other Requirements:</strong>
          <br />
          [Include any additional requirements specific to the campaign, such
          as:]
          <br />* Approval process for content deliverables * Revision policy *
          Reporting requirements (e.g., content performance metrics) * Use of
          specific hashtags or brand mentions * Disclaimers or legal
          requirements for the content **4.1** The Company may request revisions
          to the content to ensure it meets the campaign goals and targets the
          specified audience. The Content Creator agrees to make reasonable
          revisions in a timely manner.
        </Typography>

        <Typography variant="body1" className="mt-4">
          <strong>5. Payment:</strong>
          <br />
          <strong>5.1</strong> The Company agrees to pay the Content Creator a
          total amount of {campaignInfo.amount} Ethiopian Birr (ETB) for the
          services rendered.
          <br />
          <strong>5.2</strong> Payment will be made in the following manner:
          <br />
          [Payment Schedule and Method]
          <br />
          <strong>5.3</strong> The payment will be processed upon successful
          completion of the deliverables and verification by the Company,
          ensuring they meet the target audience criteria and other
          requirements.
        </Typography>
      </DialogBody>

      <DialogFooter>
        <div className="flex gap-2">
          <Button
            variant="gradient"
            color="green"
            size="sm"
            onClick={handleAgreementConfirm}
            disabled={isLoading}
            className="my-8 text-center capitalize h-10"
            loading={isLoading}
          >
            {isLoading ? "Processing..." : "Confirm Agreement"}
          </Button>
          <Button
            onClick={onClose}
            ripple="light"
            color="red"
            size="sm"
            variant="outlined"
            className="my-8  text-center capitalize h-10"
          >
            Cancel
          </Button>
        </div>
      </DialogFooter>
    </Dialog>
  );
};

export default AgreementDialog;

// import React, { useState } from "react";
// import {
//   Typography,
//   Dialog,
//   DialogHeader,
//   DialogBody,
//   DialogFooter,
//   Button,
// } from "@material-tailwind/react";
// import { useSelector } from "react-redux";
// import { acceptPayment, verifyPayment } from "../../helper/payment";
// import { useParticipantData } from "../../helper/userParticipantData";
// import { getCurrentDateFormatted } from "../../helper/getCurrentDateFormatted";
// import { createCampaign } from "../../utils/api/campaignApi";
// import { createAgreement } from "../../utils/api/agreementApi";
// import { createPayment } from "../../utils/api/paymentApi";

// const AgreementDialog = ({ isOpen, onClose, campaignInfo }) => {
//   const { currentUser } = useSelector((state) => state.user);
//   const selectedParticipant = useSelector(
//     (state) => state.chat.selectedParticipant
//   );
//   const { participant } = useParticipantData(selectedParticipant);
//   const formattedDate = getCurrentDateFormatted();
//   const [isLoading, setIsLoading] = useState(false);

//   const handleAgreementConfirm = async () => {
//     setIsLoading(true);

//     try {
//       const paymentResponse = await acceptPayment(campaignInfo.amount);
//     if (paymentResponse.success) {
//       const txRef = paymentResponse.tx_ref;
//       await verifyPayment(txRef);
//       if (paymentResponse.success) {
//         const checkoutUrl = paymentResponse.data.data.checkout_url;
//         window.location.href = checkoutUrl;
//       }
//     } else {
//       setIsLoading(false);
//       console.error("Payment initiation failed");
//     }

//       // Step 3: Save Payment Information
//       const paymentData = {
//         agreement: null, // Placeholder, will be updated after agreement creation
//         amount: campaignInfo.amount,
//         paymentDate: new Date(),
//         transactionId: paymentResponse.tx_ref,
//         status: "Completed",
//       };
//       const savedPayment = await createPayment(paymentData);

//       // Step 4: Create Campaign
//       const campaignData = {
//         campaignName: campaignInfo.campaignName,
//         campaignDescription: campaignInfo.campaignDescription,
//         startDate: campaignInfo.startDate,
//         endDate: campaignInfo.endDate,
//         campaignBudget: campaignInfo.campaignBudget,
//         contentGuidelines: campaignInfo.contentGuidelines,
//         contentDeliverables: campaignInfo.contentDeliverables,
//         targetAudience: campaignInfo.targetAudience,
//         additionalRequirements: campaignInfo.additionalRequirements,
//       };
//       const createdCampaign = await createCampaign(campaignData);

//       // Update paymentData with the agreement ID after campaign creation
//       paymentData.agreement = createdAgreement._id;

//       // Step 5: Create Agreement
//       const agreementData = {
//         company: currentUser.companyId,
//         contentCreator: participant._id,
//         campaign: createdCampaign._id,
//         agreementDate: new Date(),
//         isSigned: false,
//       };
//       const createdAgreement = await createAgreement(agreementData);

//       // Update paymentData with the agreement ID after agreement creation
//       paymentData.agreement = createdAgreement._id;

//       // Step 6: Update Payment with Agreement ID
//       await updatePayment(savedPayment._id, paymentData);

//       // If all steps are successful, handle any post-confirmation actions here
//       console.log("Agreement successfully created:", createdAgreement);

//       // Close the dialog on success
//       onClose();
//     } catch (error) {
//       console.error("Error confirming agreement:", error);
//       // Handle any specific error cases here
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Dialog open={isOpen} handler={onClose}>
//       <DialogHeader>Advertising Campaign Agreement</DialogHeader>
//       <DialogBody divider className="h-[30rem] overflow-scroll">
//         <Typography variant="h6">
//           This Advertising Campaign Agreement ("Agreement") is entered into on
//           this {formattedDate} by and between:
//         </Typography>
//         <Typography variant="body1" className="mt-4">
//           <strong>Company:</strong> {currentUser.companyName}
//           <br />
//           <strong>Address:</strong>
//           {currentUser.companyWebsite}
//           <br />
//           <strong>Contact Person:</strong>
//           {currentUser.contactName}
//           <br />
//           <strong>Email:</strong> {currentUser.email}
//         </Typography>
//         <Typography variant="body1" className="mt-4">
//           <strong>Content Creator:</strong>
//           <br />
//           <strong>Name:</strong> {participant.firstName} &nbsp;
//           {participant.lastName}
//           <br />
//           <strong>Address:</strong> {participant.city}
//           <br />
//           <strong>Email:</strong> {participant.email}
//         </Typography>

//         <Typography variant="body1" className="mt-4">
//           <strong>1. Purpose:</strong>
//           <br />
//           The purpose of this Agreement is to outline the terms and conditions
//           under which the Content Creator will create and deliver content for
//           the Company's advertising campaign in Ethiopia.
//         </Typography>

//         <Typography variant="body1" className="mt-4">
//           <strong>2. Campaign Details:</strong>
//           <br />
//           <strong>Campaign Name:</strong> {campaignInfo.campaignName}
//           <br />
//           <strong>Campaign Description:</strong>{" "}
//           {campaignInfo.campaignDescription}
//           <br />
//           <strong>Start Date:</strong> {campaignInfo.startDate}
//           <br />
//           <strong>End Date:</strong> {campaignInfo.endDate}
//           <br />
//           <strong>Campaign Budget:</strong> {campaignInfo.campaignBudget}{" "}
//           Ethiopian Birr (ETB)
//           <br />
//           **Target Audience:** {campaignInfo.targetAudience} (Details about the
//           target audience demographics, interests, etc. can be included here)
//           <br />
//           <strong>Content Deliverables:</strong>{" "}
//           {campaignInfo.contentDeliverables.join(", ")}
//           <br />
//           <strong>Content Guidelines:</strong> {campaignInfo.contentGuidelines}
//           <br />
//           <strong>Payment Amount:</strong> {campaignInfo.amount} Ethiopian Birr
//           (ETB)
//         </Typography>

//         <Typography variant="body1" className="mt-4">
//           <strong>3. Content Creation and Delivery:</strong>
//           <br />
//           <strong>3.1</strong> The Content Creator agrees to create and deliver
//           the following content as part of the campaign, ensuring it aligns with
//           the target audience:
//           <br />
//           {campaignInfo.contentDeliverables.join(", ")}
//           <br />
//           <strong>3.2</strong> All content must adhere to the following
//           guidelines and target the specified audience:
//           <br />
//           {campaignInfo.contentGuidelines}
//           <br />
//           <strong>3.3</strong> The Content Creator agrees to submit the content
//           by the following deadlines:
//           <br />
//           [List of Deadlines, if applicable]
//         </Typography>

//         <Typography variant="body1" className="mt-4">
//           <strong>4. Other Requirements:</strong>
//           <br />
//           [Include any additional requirements specific to the campaign, such
//           as:]
//           <br />* Approval process for content deliverables * Revision policy *
//           Reporting requirements (e.g., content performance metrics) * Use of
//           specific hashtags or brand mentions * Disclaimers or legal
//           requirements for the content **4.1** The Company may request revisions
//           to the content to ensure it meets the campaign goals and targets the
//           specified audience. The Content Creator agrees to make reasonable
//           revisions in a timely manner.
//         </Typography>

//         <Typography variant="body1" className="mt-4">
//           <strong>5. Payment:</strong>
//           <br />
//           <strong>5.1</strong> The Company agrees to pay the Content Creator a
//           total amount of {campaignInfo.amount} Ethiopian Birr (ETB) for the
//           services rendered.
//           <br />
//           <strong>5.2</strong> Payment will be made in the following manner:
//           <br />
//           [Payment Schedule and Method]
//           <br />
//           <strong>5.3</strong> The payment will be processed upon successful
//           completion of the deliverables and verification by the Company,
//           ensuring they meet the target audience criteria and other
//           requirements.
//         </Typography>
//       </DialogBody>

//       <DialogFooter>
//         <div className="flex gap-2">
//           <Button
//             variant="gradient"
//             color="green"
//             size="sm"
//             onClick={handleAgreementConfirm}
//             disabled={isLoading}
//             className="my-8 text-center capitalize h-10"
//             loading={isLoading}
//           >
//             {isLoading ? "Processing..." : "Confirm Agreement"}
//           </Button>
//           <Button
//             onClick={onClose}
//             ripple="light"
//             color="red"
//             size="sm"
//             variant="outlined"
//             className="my-8  text-center capitalize h-10"
//           >
//             Cancel
//           </Button>
//         </div>
//       </DialogFooter>
//     </Dialog>
//   );
// };

// export default AgreementDialog;
