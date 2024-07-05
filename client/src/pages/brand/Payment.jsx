import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import ValidatedInput from "../../components/ValidatedInput";
import { PhoneNumberInput } from "../../components/PhoneNumberInput";
import { useNavigate } from "react-router-dom";

const Payment = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(!open);

  const [input, setInput] = useState({
    fName: "",
    lName: "",
    email: "",
    pNumber: "",
    amount: "",
    currency: "ETB",
    txRef: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    validateInput();

    if (Object.values(errors).some((error) => error !== "")) {
      return;
    }

    const paymentResponse = await acceptPayment();

    if (paymentResponse.success) {
      setInput((prev) => ({ ...prev, txRef: paymentResponse.tx_ref }));
      await verifyPayment(paymentResponse.tx_ref);
    } else {
      console.error("Payment initiation failed");
    }
  };

  const handleChange = (field, value) => {
    setInput((prev) => ({ ...prev, [field]: value }));
  };

  const validateInput = () => {
    const newErrors = {};
    for (const [name, value] of Object.entries(input)) {
      if (value.trim() === "" && name !== "txRef") {
        newErrors[name] = `${name} is required`;
      } else {
        newErrors[name] = "";
      }
    }
    setErrors(newErrors);
  };

  const acceptPayment = async () => {
    const apiPath = "/api/payments/accept-payment";
    setIsLoading(true);

    const formData = {
      amount: input.amount,
      currency: input.currency,
      email: input.email,
      first_name: input.fName,
      last_name: input.lName,
      phone_number: input.pNumber,
      return_url: "http://localhost:3000/payment-success",
    };

    try {
      const response = await fetch(apiPath, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setIsLoading(false);
      return data;
    } catch (error) {
      setIsLoading(false);
      console.error("Error:", error);
      return { success: false };
    }
  };

  const verifyPayment = async (txRef) => {
    const apiPath = `/api/payments/verify-payment/${txRef}`;

    try {
      const response = await fetch(apiPath);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setPaymentStatus(data.status);
      navigate("/payment-success");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <Button onClick={handleOpen} variant="gradient">
        Open Dialog
      </Button>
      <Dialog open={open} handler={handleOpen}>
        <DialogHeader>Payment Details</DialogHeader>
        <DialogBody>
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
            <ValidatedInput
              label="First Name"
              name="fName"
              value={input.fName}
              onChange={(e) => handleChange("fName", e.target.value)}
              error={errors.fName}
              required
            />
            <ValidatedInput
              label="Last Name"
              name="lName"
              value={input.lName}
              onChange={(e) => handleChange("lName", e.target.value)}
              error={errors.lName}
              required
            />
            <ValidatedInput
              label="Email"
              name="email"
              value={input.email}
              onChange={(e) => handleChange("email", e.target.value)}
              error={errors.email}
              type="email"
              required
            />
            <PhoneNumberInput
              label="Phone Number"
              name="pNumber"
              value={input.pNumber}
              onChange={(e) => handleChange("pNumber", e.target.value)}
              error={errors.pNumber}
              required
            />
            <ValidatedInput
              label="Amount"
              name="amount"
              value={input.amount}
              onChange={(e) => handleChange("amount", e.target.value)}
              error={errors.amount}
              type="number"
              required
              min="1"
            />
            <div className="flex justify-end">
              <Button
                variant="text"
                color="red"
                onClick={handleOpen}
                className="mr-1"
              >
                Cancel
              </Button>
              <Button variant="gradient" color="green" type="submit">
                Confirm
              </Button>
            </div>
          </form>
        </DialogBody>
        <DialogFooter></DialogFooter>
      </Dialog>
    </div>
  );
};

export default Payment;
