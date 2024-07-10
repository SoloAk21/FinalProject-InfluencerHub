import React, { useState } from "react";
import { Card, Input, Button, Typography } from "@material-tailwind/react";
import { postToAuthAPI } from "../helper/postToAuthAPI";

const InitiateTransfer = () => {
  const [transferData, setTransferData] = useState({
    account_name: "",
    account_number: "",
    amount: "",
    reference: "",
    bank_code: "",
  });
  const [message, setMessage] = useState("");
  const [verificationMessage, setVerificationMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTransferData({ ...transferData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await postToAuthAPI("/api/transfers", transferData);
      const data = await response.json();
      if (response.ok) {
        setMessage("Transfer initiated successfully");
        await handleVerify(transferData.reference);
      } else {
        setMessage(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error(error);
      setMessage("Failed to initiate transfer");
    }
  };

  const handleVerify = async (reference) => {
    try {
      const response = await fetch(`/api/transfers/verify/${reference}`);
      console.log(response);
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setVerificationMessage(
          `Verification successful: ${JSON.stringify(data)}`
        );
      } else {
        setVerificationMessage(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error(error);
      setVerificationMessage("Failed to verify transfer");
    }
  };

  return (
    <Card
      color="transparent"
      shadow={false}
      className="max-w-screen-md mx-auto my-10"
    >
      <Typography variant="h4" color="blue-gray">
        Initiate Transfer
      </Typography>
      <Typography color="gray" className="mt-1 font-normal">
        Fill in the details to initiate a transfer.
      </Typography>
      <form
        onSubmit={handleSubmit}
        className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96"
      >
        <div className="mb-4 flex flex-col gap-6">
          <Typography variant="h6" color="blue-gray" className="-mb-3">
            Account Name <span className="text-red-500">*</span>
          </Typography>
          <Input
            type="text"
            name="account_name"
            value={transferData.account_name}
            onChange={handleInputChange}
            size="lg"
            placeholder="Recipient's Account Name"
          />
          <Typography variant="h6" color="blue-gray" className="-mb-3">
            Account Number<span className="text-red-500">*</span>
          </Typography>
          <Input
            type="text"
            name="account_number"
            value={transferData.account_number}
            onChange={handleInputChange}
            size="lg"
            placeholder="Recipient's Account Number"
          />
          <Typography variant="h6" color="blue-gray" className="-mb-3">
            Amount <span className="text-red-500">*</span>
          </Typography>
          <Input
            type="number"
            name="amount"
            value={transferData.amount}
            onChange={handleInputChange}
            size="lg"
            placeholder="Amount"
          />
          <Typography variant="h6" color="blue-gray" className="-mb-3">
            Reference <span className="text-red-500">*</span>
          </Typography>
          <Input
            type="text"
            name="reference"
            value={transferData.reference}
            onChange={handleInputChange}
            size="lg"
            placeholder="Reference"
          />
          <Typography variant="h6" color="blue-gray" className="-mb-3">
            Bank Code <span className="text-red-500">*</span>
          </Typography>
          <Input
            type="text"
            name="bank_code"
            value={transferData.bank_code}
            onChange={handleInputChange}
            size="lg"
            placeholder="Recipient's Bank Code"
          />
        </div>
        <Button type="submit" className="mt-6" fullWidth>
          Initiate Transfer
        </Button>
        {message && (
          <Typography color="gray" className="mt-4 text-center font-normal">
            {message}
          </Typography>
        )}
      </form>
      {verificationMessage && (
        <Typography color="gray" className="mt-4 text-center font-normal">
          {verificationMessage}
        </Typography>
      )}
    </Card>
  );
};

export default InitiateTransfer;
