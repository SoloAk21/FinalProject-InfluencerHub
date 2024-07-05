// utils/payment.js

export const acceptPayment = async (amount) => {
  const apiPath = "/api/payments/accept-payment";

  try {
    const response = await fetch(apiPath, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(amount),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    return { success: false };
  }
};

export const verifyPayment = async (txRef) => {
  const apiPath = `/api/payments/verify-payment/${txRef}`;

  try {
    const response = await fetch(apiPath);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
};
