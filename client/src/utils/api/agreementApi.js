export const createAgreement = async (agreementData) => {
  try {
    const response = await fetch(`/api/agreements/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(agreementData),
    });
    console.log(response);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.log(error);
    console.error("Error creating agreement:", error.message);
    throw error;
  }
};

export const getAgreementById = async (agreementId) => {
  try {
    const response = await fetch(`/api/agreements/${agreementId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching agreement:", error.message);
    throw error;
  }
};

export const updateAgreement = async (agreementId, agreementData) => {
  try {
    const response = await fetch(`/api/agreements/${agreementId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(agreementData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error updating agreement:", error.message);
    throw error;
  }
};

export const deleteAgreement = async (agreementId) => {
  try {
    const response = await fetch(`/api/agreements/${agreementId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return { message: "Agreement deleted successfully" };
  } catch (error) {
    console.error("Error deleting agreement:", error.message);
    throw error;
  }
};
