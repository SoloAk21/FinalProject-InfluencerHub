import Agreement from "../models/agreement.model.js";

// Create Agreement
export const createAgreement = async (req, res) => {
  try {
    console.log(req.body);
    const agreement = new Agreement(req.body);
    await agreement.save();
    res.status(201).json(agreement);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message, body: req.body });
  }
};

// Get Agreement by ID
export const getAgreementById = async (req, res) => {
  const { agreementId } = req.params;
  try {
    const agreement = await Agreement.findById(agreementId);
    if (!agreement) {
      return res.status(404).json({ message: "Agreement not found" });
    }
    res.json(agreement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAgreementsByCampaignId = async (req, res) => {
  const { campaignId } = req.params;

  try {
    const agreements = await Agreement.find({ campaign: campaignId }).populate({
      path: "campaign",
      populate: [
        {
          path: "influencer",
          model: "Influencer",
        },
        { path: "company", model: "Company" },
      ],
    });

    if (!agreements.length) {
      return res
        .status(404)
        .json({ message: "No agreements found for this campaign." });
    }

    res.status(200).json(agreements);
  } catch (error) {
    res.status(500).json({ message: "Error fetching agreements.", error });
  }
};

// Update Agreement by ID
export const updateAgreement = async (req, res) => {
  const { agreementId } = req.params;
  try {
    const updatedAgreement = await Agreement.findByIdAndUpdate(
      agreementId,
      req.body,
      { new: true }
    );
    if (!updatedAgreement) {
      return res.status(404).json({ message: "Agreement not found" });
    }
    res.json(updatedAgreement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Agreement by ID
export const deleteAgreement = async (req, res) => {
  const { agreementId } = req.params;
  try {
    const deletedAgreement = await Agreement.findByIdAndDelete(agreementId);
    if (!deletedAgreement) {
      return res.status(404).json({ message: "Agreement not found" });
    }
    res.json({ message: "Agreement deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
