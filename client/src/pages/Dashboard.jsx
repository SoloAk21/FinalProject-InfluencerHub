import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import ConfirmationDialog from "../components/ConfirmationDialog";

// Function to fetch payments
const fetchPayments = async () => {
  try {
    const response = await fetch("/api/payments/list");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

function Dashboard() {
  const [payments, setPayments] = useState([]);
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false); // State for controlling modal visibility
  const [accountNumber, setAccountNumber] = useState(""); // State for storing account number input
  const [password, setPassword] = useState(""); // State for storing password input
  const [error, setError] = useState(null); // State for storing errors

  useEffect(() => {
    const loadPayments = async () => {
      try {
        const data = await fetchPayments();
        setPayments(data);
        setLoading(false);
      } catch (error) {
        console.error("Error loading payments:", error);
        setLoading(false);
      }
    };

    loadPayments();
  }, []);

  const handleRefund = (paymentId) => {
    setSelectedPaymentId(paymentId);
    setConfirmationOpen(true);
  };

  const handleConfirmation = async () => {
    try {
      const response = await fetch(
        `/api/payments/refund/${selectedPaymentId}`,
        {
          method: "POST",
        }
      );

      if (response.ok) {
        setPayments((prevPayments) =>
          prevPayments.map((payment) =>
            payment._id === selectedPaymentId
              ? { ...payment, status: "Refunded" }
              : payment
          )
        );
      } else {
        console.error("Error processing refund");
      }
    } catch (error) {
      console.error("Error processing refund:", error);
    } finally {
      setConfirmationOpen(false);
      setSelectedPaymentId(null);
    }
  };

  const handleEarnClick = () => {
    setModalOpen(true); // Open modal when Earn button is clicked
  };

  const validateInput = (input) => {
    const digitRegex = /^\d+$/;
    const isValidFormat = digitRegex.test(input);
    const isValidLength = input.length === 12;
    return isValidFormat && isValidLength;
  };

  const handleSubmitAccount = async () => {
    try {
      // Validate account number
      if (!validateInput(accountNumber)) {
        setError("Account number must contain 12 digits.");
        return;
      }

      const response = await fetch("/api/payments/transfer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ accountNumber, password }),
      });

      const data = await response.json();

      console.log(data);
      if (response.ok) {
        setError(null);
        setModalOpen(false);
      } else {
        setError(data.message || "Failed to update account number.");
      }
    } catch (error) {
      console.error("Error updating account number:", error);
      setError("Failed to update account number: " + error.message);
    } finally {
      // Clear inputs
      setAccountNumber("");
      setPassword("");
    }
  };

  const totalDeposit = payments.reduce((total, payment) => {
    if (payment.status === "Pending") {
      return total + payment.amount;
    }
    return total;
  }, 0);

  function sumPendingCompletedPayments(data) {
    return data
      .filter(
        (payment) =>
          payment.status === "Pending" &&
          payment.agreement.campaign.status === "completed"
      )
      .reduce((sum, item) => sum + item.amount, 0);
  }

  return (
    <div className="w-full sm:px-6">
      <div className="px-4 md:px-10 py-4 md:py-7 bg-gray-100 rounded-tl-lg rounded-tr-lg">
        <div className="sm:flex items-center justify-between">
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold leading-normal text-gray-800">
            Payments
          </p>
          {currentUser.userType === "influencer" && (
            <div className="flex items-center">
              <p className="text-sm text-gray-600 mr-2">
                Total Balance: ETB{" "}
                {sumPendingCompletedPayments(payments).toFixed(2)}
              </p>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleEarnClick} // Handle click on Earn button
              >
                Earn
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="bg-white shadow px-4 md:px-10 pt-4 md:pt-7 pb-5 overflow-y-auto">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div>
            <p className="text-sm text-gray-600">
              Total Deposit: ETB {totalDeposit.toFixed(2)}
            </p>
            <table className="w-full whitespace-nowrap">
              <thead>
                <tr className="h-16 w-full text-sm leading-none text-gray-800">
                  <th className="font-normal text-left pl-4">Campaign Name</th>
                  <th className="font-normal text-left pl-12">
                    {currentUser.userType === "company"
                      ? "Company"
                      : "Influencer"}
                  </th>
                  <th className="font-normal text-left pl-12">Amount</th>
                  <th className="font-normal text-left pl-12">Payment Date</th>
                  <th className="font-normal text-left pl-20">
                    Transaction ID
                  </th>
                  <th className="font-normal text-left pl-20">Status</th>
                  <th className="font-normal text-left pl-20">Actions</th>
                </tr>
              </thead>
              <tbody className="w-full">
                {payments.map((payment) => {
                  const {
                    agreement: { company, contentCreator, campaign },
                    amount,
                    paymentDate,
                    transactionId,
                    status,
                    _id,
                  } = payment;
                  return (
                    <tr
                      key={_id}
                      className="h-20 text-sm leading-none text-gray-800 bg-white hover:bg-gray-100 border-b border-t border-gray-100"
                    >
                      <td className="pl-4 cursor-pointer">
                        <div className="flex items-center mb-4 mt-3">
                          <div className="w-10 h-10 hover:bg-gray-100 rounded-sm flex items-center justify-center">
                            <img
                              src="https://i.ibb.co/C6bwf12/Mask-Group.png"
                              className="w-8 h-8 rounded-full"
                              alt="profile"
                            />
                          </div>
                          <div className="pl-1">
                            <p className="text-sm font-medium leading-none text-gray-800">
                              {currentUser.userType === "company"
                                ? contentCreator.username
                                : company.companyName}
                            </p>
                            <p className="text-xs leading-3 text-gray-600 mt-1">
                              {currentUser.userType === "company"
                                ? contentCreator.email
                                : company.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="pl-12">{campaign.campaignName}</td>
                      <td className="pl-12">ETB {amount}</td>
                      <td className="pl-12">
                        {new Date(paymentDate).toLocaleDateString()}
                      </td>
                      <td className="pl-20">{transactionId}</td>
                      <td className="pl-20">
                        <p
                          className={`text-xs leading-3 rounded-full px-3 py-1 ${
                            status === "Completed"
                              ? "bg-green-500 text-green-700"
                              : status === "Pending"
                              ? "bg-yellow-500 text-yellow-700"
                              : "bg-red-500 text-red-700"
                          }`}
                        >
                          {status}
                        </p>
                      </td>
                      <td className="pl-20">
                        {currentUser.userType === "company" &&
                        status === "Pending" ? (
                          <button
                            onClick={() => handleRefund(_id)}
                            className="mx-2 my-2 bg-gray-300 transition duration-150 ease-in-out hover:bg-gray-400 rounded text-indigo-700 px-6 py-2 text-xs"
                          >
                            Refund
                          </button>
                        ) : (
                          <p
                            className={`text-xs leading-3 rounded-full w-20 text-center px-3 py-1 ${
                              campaign.status === "completed"
                                ? "bg-green-500 text-green-700"
                                : campaign.status === "pending"
                                ? "bg-yellow-500 text-yellow-700"
                                : "bg-red-500 text-red-700"
                            }`}
                          >
                            {campaign.status}
                          </p>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* Confirmation dialog for refund */}
      <ConfirmationDialog
        isOpen={confirmationOpen}
        title="Confirm Refund"
        message="Are you sure you want to refund this payment?"
        onConfirm={handleConfirmation}
        onCancel={() => setConfirmationOpen(false)}
      />
      {/* Modal for updating account number */}
      <div
        className={`fixed top-0 left-0 w-full h-full bg-gray-600 bg-opacity-75 flex items-center justify-center ${
          modalOpen ? "block" : "hidden"
        }`}
      >
        <div className="bg-white p-8 rounded shadow-lg m-2">
          <h2 className="text-lg font-semibold mb-6">
            Transfer to your own bank account number
          </h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <input
            type="text"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            placeholder="Enter account number"
            className="border border-gray-300 rounded-md p-2 mb-4 w-full"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="border border-gray-300 rounded-md p-2 mb-4 w-full"
          />
          <div className="flex justify-end">
            <button
              onClick={handleSubmitAccount}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Submit
            </button>
            <button
              onClick={() => {
                setModalOpen(false);
                setError(null);
              }}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded ml-4"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
