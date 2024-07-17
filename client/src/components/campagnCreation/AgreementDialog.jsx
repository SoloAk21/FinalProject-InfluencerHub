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
            companyId: currentUser._id,
            influencerId: participant._id,
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
      console.log(error);
      setErrorMessage("An error occurred. Please try again.");
    }

    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen} handler={onClose}>
      <DialogHeader>
        {" "}
        <div className="">
          <p className="text-gray-800 dark:text-white lg:text-4xl text-3xl font-extrabold leading-9">
            Campaign agreement
          </p>
        </div>
      </DialogHeader>
      <DialogBody divider className="h-[30rem] overflow-scroll">
        {errorMessage && (
          <div className="my-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
            <p className="lg:text-base text-sm leading-normal text-red-700">
              {errorMessage}
            </p>
          </div>
        )}
        <Typography variant="h6">
          <p className="lg:text-base text-sm leading-normal text-gray-600 dark:text-gray-300">
            This Advertising Campaign Agreement ("Agreement") is entered into on
            this {formattedDate} by and between:
          </p>
        </Typography>
        <Typography variant="body1" className="mt-4">
          <p className="lg:text-base text-sm leading-normal text-gray-600 dark:text-gray-300">
            <strong className="font-bold text-sm">Company:</strong>{" "}
            {currentUser.companyName}
            <br />
            <strong className="font-bold text-sm">Address:</strong>
            {currentUser.companyWebsite}
            <br />
            <strong className="font-bold text-sm">Contact Person:</strong>
            {currentUser.contactName}
            <br />
            <strong className="font-bold text-sm">Email:</strong>{" "}
            {currentUser.email}
          </p>
        </Typography>
        <Typography variant="body1" className="mt-4">
          <p className="lg:text-base text-sm leading-normal text-gray-600 dark:text-gray-300">
            <strong className="font-bold text-sm">Content Creator:</strong>
            <br />
            <strong className="font-bold text-sm">Name:</strong>{" "}
            {participant.firstName} &nbsp;
            {participant.lastName}
            <br />
            <strong className="font-bold text-sm">Address:</strong>{" "}
            {participant.city}
            <br />
            <strong className="font-bold text-sm">Email:</strong>{" "}
            {participant.email}
          </p>
        </Typography>

        <Typography variant="body1" className="mt-4">
          <p className="lg:text-base text-sm leading-normal text-gray-600 dark:text-gray-300">
            <strong className="font-bold text-sm">1. Purpose:</strong>
            <br />
            The purpose of this Agreement is to outline the terms and conditions
            under which the Content Creator will create and deliver content for
            the Company's advertising campaign in Ethiopia.
          </p>
        </Typography>

        <Typography variant="body1" className="mt-4">
          <p className="lg:text-base text-sm leading-normal text-gray-600 dark:text-gray-300">
            <strong className="font-bold text-sm">2. Campaign Details:</strong>
            <br />
            <strong className="font-bold text-sm">Campaign Name:</strong>{" "}
            {campaignInfo.campaignName}
            <br />
            <strong className="font-bold text-sm">
              Campaign Description:
            </strong>{" "}
            {campaignInfo.campaignDescription}
            <br />
            <strong className="font-bold text-sm">Start Date:</strong>{" "}
            {campaignInfo.startDate}
            <br />
            <strong className="font-bold text-sm">End Date:</strong>{" "}
            {campaignInfo.endDate}
            <br />
            <strong className="font-bold text-sm">Campaign Budget:</strong>{" "}
            {campaignInfo.campaignBudget} Ethiopian Birr (ETB)
            <br />
            **Target Audience:** {campaignInfo.targetAudience} (Details about
            the target audience demographics, interests, etc. can be included
            here)
            <br />
            <strong className="font-bold text-sm">
              Content Deliverables:
            </strong>{" "}
            {campaignInfo.contentDeliverables.join(", ")}
            <br />
            <strong className="font-bold text-sm">
              Content Guidelines:
            </strong>{" "}
            {campaignInfo.contentGuidelines}
            <br />
            <strong className="font-bold text-sm">Payment Amount:</strong>{" "}
            {campaignInfo.amount} Ethiopian Birr (ETB)
          </p>
        </Typography>

        <Typography variant="body1" className="mt-4">
          <p className="lg:text-base text-sm leading-normal text-gray-600 dark:text-gray-300">
            <strong className="font-bold text-sm">
              3. Content Creation and Delivery:
            </strong>
            <br />
            <strong className="font-bold text-sm">3.1</strong> The Content
            Creator agrees to create and deliver the following content as part
            of the campaign, ensuring it aligns with the target audience:
            <br />
            {campaignInfo.contentDeliverables.join(", ")}
            <br />
            <strong className="font-bold text-sm">3.2</strong> All content must
            adhere to the following guidelines and target the specified
            audience:
            <br />
            {campaignInfo.contentGuidelines}
            <br />
            <strong className="font-bold text-sm">3.3</strong> The Content
            Creator agrees to submit the content by the following deadlines:
            <br />
            [List of Deadlines, if applicable]
          </p>
        </Typography>

        <Typography variant="body1" className="mt-4">
          <p className="lg:text-base text-sm leading-normal text-gray-600 dark:text-gray-300">
            <strong className="font-bold text-sm">
              4. Other Requirements:
            </strong>
            <br />
            [Include any additional requirements specific to the campaign, such
            as:]
            <br />* Approval process for content deliverables * Revision policy
            * Reporting requirements (e.g., content performance metrics) * Use
            of specific hashtags or brand mentions * Disclaimers or legal
            requirements for the content **4.1** The Company may request
            revisions to the content to ensure it meets the campaign goals and
            targets the specified audience. The Content Creator agrees to make
            reasonable revisions in a timely manner.
          </p>
        </Typography>

        <Typography variant="body1" className="mt-4">
          <p className="lg:text-base text-sm leading-normal text-gray-600 dark:text-gray-300">
            <strong className="font-bold text-sm">5. Payment:</strong>
            <br />
            [Include payment terms, such as payment schedule, amount, and
            method:]
            <br />
            **5.1** The Company agrees to pay the Content Creator the total
            amount of {campaignInfo.amount} ETB upon the successful completion
            and submission of the campaign deliverables. Payment will be made
            via direct deposit to the Content Creator's designated bank account
            or other agreed-upon method. **5.2** The Company agrees to process
            payment within [number] business days upon receipt and acceptance of
            the campaign deliverables. **5.3** In the event of a dispute or
            non-performance of the Content Creator, the Company reserves the
            right to withhold payment until the issue is resolved. **5.4** The
            Content Creator acknowledges that payment is contingent upon the
            successful completion and submission of the campaign deliverables,
            as outlined in this Agreement.
          </p>
        </Typography>

        <Typography variant="body1" className="mt-4">
          <p className="lg:text-base text-sm leading-normal text-gray-600 dark:text-gray-300">
            <strong className="font-bold text-sm">
              6. Term and Termination:
            </strong>
            <br />
            [Include the term of the Agreement and conditions for termination,
            if applicable:] **6.1** This Agreement shall commence on{" "}
            {formattedDate} and continue until [end date] or until the
            completion of the campaign deliverables, whichever comes first.
            **6.2** Either party may terminate this Agreement upon [number]
            days' written notice for any reason or no reason at all. **6.3** In
            the event of termination, the Company agrees to compensate the
            Content Creator for any work completed and accepted up to the date
            of termination, as outlined in Section 5 (Payment).
          </p>
        </Typography>

        <Typography variant="body1" className="mt-4">
          <p className="lg:text-base text-sm leading-normal text-gray-600 dark:text-gray-300">
            <strong className="font-bold text-sm">7. Confidentiality:</strong>
            <br />
            [Include confidentiality terms, if applicable, such as protection of
            proprietary information or trade secrets:] **7.1** The Company and
            Content Creator agree to maintain the confidentiality of any
            proprietary or confidential information disclosed during the course
            of this Agreement. **7.2** Confidential information includes, but is
            not limited to, campaign strategies, target audience data, financial
            information, and trade secrets. **7.3** The parties agree not to
            disclose, reproduce, or use confidential information for any purpose
            other than the performance of this Agreement, without the prior
            written consent of the disclosing party.
          </p>
        </Typography>

        <Typography variant="body1" className="mt-4">
          <p className="lg:text-base text-sm leading-normal text-gray-600 dark:text-gray-300">
            <strong className="font-bold text-sm">8. Governing Law:</strong>
            <br />
            [Specify the governing law and jurisdiction for any disputes or
            legal matters arising from this Agreement:] **8.1** This Agreement
            shall be governed by and construed in accordance with the laws of
            the Federal Democratic Republic of Ethiopia, without regard to its
            conflict of law provisions. **8.2** Any dispute arising under or
            related to this Agreement shall be subject to the exclusive
            jurisdiction of the courts in [city, state], Ethiopia.
          </p>
        </Typography>

        <Typography variant="body1" className="mt-4">
          <p className="lg:text-base text-sm leading-normal text-gray-600 dark:text-gray-300">
            <strong className="font-bold text-sm">9. Entire Agreement:</strong>
            <br />
            [Include a statement that the Agreement constitutes the entire
            understanding between the parties, superseding any prior agreements
            or representations:] **9.1** This Agreement, including any exhibits
            or attachments hereto, constitutes the entire understanding between
            the parties with respect to the subject matter hereof and supersedes
            all prior agreements, negotiations, and representations, written or
            oral, relating to such subject matter.
          </p>
        </Typography>

        <Typography variant="body1" className="mt-4">
          <p className="lg:text-base text-sm leading-normal text-gray-600 dark:text-gray-300">
            <strong className="font-bold text-sm">10. Amendments:</strong>
            <br />
            [Include a provision allowing for amendments or modifications to the
            Agreement, if applicable:] **10.1** This Agreement may be amended or
            modified only by a written instrument executed by authorized
            representatives of both parties. **10.2** No amendment or
            modification of this Agreement shall be binding unless it is in
            writing and signed by both parties.
          </p>
        </Typography>

        <Typography variant="body1" className="mt-4">
          <p className="lg:text-base text-sm leading-normal text-gray-600 dark:text-gray-300">
            <strong className="font-bold text-sm">11. Counterparts:</strong>
            <br />
            [Include a provision allowing for the Agreement to be executed in
            counterparts, if applicable:] **11.1** This Agreement may be
            executed in counterparts, each of which shall be deemed an original
            and all of which together shall constitute one and the same
            agreement.
          </p>
        </Typography>

        <Typography variant="body1" className="mt-4">
          <p className="lg:text-base text-sm leading-normal text-gray-600 dark:text-gray-300">
            <strong className="font-bold text-sm">12. Signature:</strong>
            <br />
            The parties hereto have caused this Agreement to be executed as of
            the date first written above.
          </p>
        </Typography>

        <Typography variant="body1" className="mt-4">
          <p className="lg:text-base text-sm leading-normal text-gray-600 dark:text-gray-300">
            <strong className="font-bold text-sm">Company Name:</strong>{" "}
            {currentUser.companyName}
            <br />
            <strong className="font-bold text-sm">Signature:</strong>
            <br />
            <strong className="font-bold text-sm">Name:</strong>{" "}
            {currentUser.contactName}
            <br />
            <strong className="font-bold text-sm">Title:</strong> [Title]
            <br />
            <strong className="font-bold text-sm">Date:</strong> {formattedDate}
            <br />
            <strong className="font-bold text-sm">
              Content Creator Name:
            </strong>{" "}
            {participant.firstName} &nbsp;
            {participant.lastName}
            <br />
            <strong className="font-bold text-sm">Signature:</strong>
            <br />
            <strong className="font-bold text-sm">Name:</strong> [Name]
            <br />
            <strong className="font-bold text-sm">Title:</strong> [Title]
            <br />
            <strong className="font-bold text-sm">Date:</strong> {formattedDate}
          </p>
        </Typography>

        <Typography variant="body1" className="mt-4">
          <p className="lg:text-base text-sm leading-normal text-gray-600 dark:text-gray-300">
            **By signing below, the parties acknowledge and agree to the terms
            and conditions set forth in this Agreement.**
          </p>
        </Typography>
      </DialogBody>
      <DialogFooter>
        <div className="">
          <button
            onClick={handleAgreementConfirm}
            disabled={isLoading}
            loading={isLoading}
            className="mx-2 my-2 bg-indigo-700 transition duration-150 ease-in-out hover:bg-indigo-600 rounded text-white px-6 py-2 text-xs"
          >
            {isLoading ? "Processing..." : "Deposit"}
          </button>
          <button
            onClick={onClose}
            className="mx-2 my-2 bg-red-700 transition duration-150 ease-in-out hover:bg-red-600 rounded text-white px-6 py-2 text-xs"
          >
            Cancel
          </button>
        </div>
      </DialogFooter>
    </Dialog>
  );
};

export default AgreementDialog;
