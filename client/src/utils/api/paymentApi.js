// Function to accept payment
export const acceptPayment = async (amount) => {
  const apiPath = `/api/payments/accept-payment`;

  try {
    const response = await fetch(apiPath, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount }),
    });

    console.log(response);
    // Check if the response is okay; throw an error if not
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Parse the response JSON data
    const data = await response.json();
    return data; // Return the parsed JSON response
  } catch (error) {
    console.error("Error accepting payment:", error); // Log any errors that occur
    return { success: false }; // Return a default failure response
  }
};

// Function to verify payment
export const verifyPayment = async (txRef) => {
  const apiPath = `/api/payments/verify-payment/${txRef}`;

  try {
    // Make a GET request to verify the payment using the transaction reference
    const response = await fetch(apiPath);

    // Check if the response is okay; throw an error if not
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Parse the response JSON data
    const data = await response.json();
    return data; // Return the parsed JSON response
  } catch (error) {
    console.error("Error verifying payment:", error); // Log any errors that occur
    throw error;
  }
};

// Function to create payment (if needed on the frontend)
export const createPayment = async (paymentData) => {
  const apiPath = `/api/payments/create`; // Adjust endpoint as needed

  try {
    const response = await fetch("/api/payments/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData),
    });

    console.log(response);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    console.error("Error creating payment:", error);
    throw error;
  }
};

// Function to update payment status
export const updatePaymentStatus = async (paymentId, updateData) => {
  const apiPath = `/api/payments/update-payment/${paymentId}`; // Adjust endpoint as needed

  try {
    const response = await fetch(apiPath, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating payment:", error);
    throw error;
  }
};
