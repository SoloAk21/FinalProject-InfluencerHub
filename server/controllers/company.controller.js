import Company from "../models/user/company.model.js";

export const fetchData = async (req, res) => {
    try {
      const companyData = await Company.find();
  
      if (!companyData || companyData.length === 0) {
        console.error('No records found', companyData);
        return res.status(404).json({ message: "No records found" });
      }
  
      res.json(companyData);
    } catch (error) {
      console.error('Error retrieving data:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  }