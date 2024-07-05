export const createCampaign = async (campaignData) => {
  try {
    const response = await fetch(`api/campaigns/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(campaignData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error creating campaign:", error.message);
    throw error;
  }
};

export const getCampaignById = async (campaignId) => {
  try {
    const response = await fetch(`/api/campaigns/${campaignId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching campaign:", error.message);
    throw error;
  }
};

export const updateCampaign = async (campaignId, campaignData) => {
  try {
    const response = await fetch(`/api/campaigns/${campaignId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(campaignData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error updating campaign:", error.message);
    throw error;
  }
};

export const deleteCampaign = async (campaignId) => {
  try {
    const response = await fetch(`/api/campaigns/${campaignId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return { message: "Campaign deleted successfully" };
  } catch (error) {
    console.error("Error deleting campaign:", error.message);
    throw error;
  }
};
