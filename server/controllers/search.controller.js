import Collaboration from "../models/collaboration.model.js";
import Influencer from "../models/user/influencer.model.js";

export const test = (req, res) => {
  res.json({
    message: "API route is working!",
  });
};

export const getInfluencersByUsername = async (req, res) => {
  try {
    const { term } = req.query; // Extract the search term from the query parameters

    let query = {};
    if (term) {
      query = {
        $or: [
          { username: { $regex: term, $options: "i" } },
          { firstName: { $regex: term, $options: "i" } },
          { lastName: { $regex: term, $options: "i" } },
        ],
      };
    }

    const influencers = await Influencer.find(query)
      .select("-password") // Exclude the password field from the results
      .exec(); // Execute the query;

    if (influencers.length === 0) {
      return res.status(404).json({ message: "No influencers found" });
    }

    res.status(200).json(influencers);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getInfluencersByFilters = async (req, res) => {
  try {
    const { platforms, ageGroups, categories } = req.query;
    let queries = [];

    // Platforms filter
    if (platforms) {
      const platformList = platforms.split(",");
      // Ensure that all platforms in the list are matched
      const platformQueries = platformList.map((platform) => ({
        platforms: { $elemMatch: { name: platform } },
      }));
      if (platformQueries.length > 1) {
        queries.push({ $and: platformQueries });
      } else {
        queries.push(...platformQueries);
      }
    }

    // Categories filter
    if (categories) {
      queries.push({ contents: { $in: categories.split(",") } });
    }

    // Categories filter
    if (categories) {
      const categoryList = categories.split(",");
      // Ensure that all categories in the list are matched
      const categoryQueries = categoryList.map((category) => ({
        contents: { $elemMatch: { $eq: category } },
      }));
      if (categoryQueries.length > 1) {
        queries.push({ $and: categoryQueries });
      } else {
        queries.push(...categoryQueries);
      }
    }

    // Age groups filter
    if (ageGroups) {
      const ageGroupQueries = ageGroups.split(",").map((ageGroup) => {
        const [minAge, maxAge] = ageGroup.split("-").map(Number);
        const minDateOfBirth = calculateDateOfBirth(maxAge);
        const maxDateOfBirth = calculateDateOfBirth(minAge - 1);
        return {
          dateOfBirth: { $gte: minDateOfBirth, $lt: maxDateOfBirth },
        };
      });
      queries.push({ $or: ageGroupQueries });
    }

    // Combine all filters
    let finalQuery = {};
    if (queries.length > 0) {
      finalQuery = { $and: queries };
    }

    const influencers = await Influencer.find(finalQuery);
    if (queries.length === 0) {
      return res.status(200).json(await Influencer.find({}));
    }
    if (influencers.length === 0) {
      return res
        .status(200)
        .json({ message: "No influencers found with the selected filters." });
    }

    res.status(200).json(influencers);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Adjusted helper function to calculate date of birth based on age
const calculateDateOfBirth = (age) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset hours to start of the day
  const birthDate = new Date(
    today.getFullYear() - age,
    today.getMonth(),
    today.getDate()
  );
  return birthDate;
};

export const getInfluencerDetail = async (req, res) => {
  try {
    const influencerId = req.params.id; // Extracts ID from URL
    const influencer = await Influencer.findById(influencerId).select(
      "-_id -createdAt -password -updatedAt -__v -userType -active"
    ); // Excluding unwanted fields
    if (!influencer) {
      return res.status(404).json({ message: "Influencer not found" });
    }

    res.status(200).json(influencer);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching influencer details",
      error: error.message,
    });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    const { userId } = req.user;

    // Find all collaborations where company matches userId and status is "accepted"
    const collaborations = await Collaboration.find({
      company: userId, // Match userId in the company field
      status: "accepted", // Only fetch collaborations with status "accepted"
    }).populate({
      path: "influencer", // Populate the 'influencer' field with influencer data
      match: {
        $or: [
          { username: { $regex: query, $options: "i" } },
          { email: { $regex: query, $options: "i" } },
          { firstName: { $regex: query, $options: "i" } },
          { lastName: { $regex: query, $options: "i" } },
        ],
      },
    });

    const influencers = collaborations
      .map((collaboration) => collaboration.influencer)
      .filter((influencer) => influencer !== null);

    // Check if influencers array is not empty
    if (influencers.length > 0) {
      res.json(influencers);
    } else {
      res.json([]); // Return an empty array if no influencers are found
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
