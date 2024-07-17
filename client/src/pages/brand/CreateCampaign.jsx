import React, { useState, useEffect } from "react";
import MainStructure from "./MainStructure";
import ContentDeliverables from "../../components/campagnCreation/ContentDeliverables";
import AgreementDialog from "../../components/campagnCreation/AgreementDialog";
import { setSelectedParticipant } from "../../redux/chat/chatSlice";
import { useDispatch } from "react-redux";

const CreateCampaign = () => {
  const [campaignInfo, setCampaignInfo] = useState({
    campaignName: "",
    campaignDescription: "",
    startDate: "",
    endDate: "",
    campaignBudget: "",
    contentGuidelines: "",
    amount: "",
    contentDeliverables: [],
    targetAudience: "",
    additionalRequirements: "",
    selectedInfluencer: null, // Track selected influencer
  });

  const dispatch = useDispatch();

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isAgreementOpen, setIsAgreementOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setSearchLoading(true);

        const response = await fetch(`/api/influencers?query=${searchTerm}`);

        const data = await response.json();

        setSearchResults(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setSearchLoading(false);
      }
    };

    if (searchTerm !== "") {
      fetchUsers();
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSelectInfluencer = (influencer) => {
    setCampaignInfo((prev) => ({
      ...prev,
      selectedInfluencer: influencer,
    }));

    dispatch(setSelectedParticipant(influencer._id));
    setSearchTerm(""); // Clear search term after selection if needed
    setSearchResults([]); // Clear search results after selection if needed
  };

  const handleChange = (field, value) => {
    setCampaignInfo((prev) => ({ ...prev, [field]: value }));
    setErrors({ ...errors, [field]: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setIsAgreementOpen(true);
    setIsLoading(false);
  };

  return (
    <MainStructure
      content={
        <div className="m-auto p-4 md:p-8">
          <div className="mt-8 mb-4">
            <h1 className="text-xl font-medium pr-2 leading-5 text-gray-800">
              Create Campaign
            </h1>
            <p className="mt-2 text-sm leading-5 text-gray-600">
              Information about the section could go here and a brief
              description of how this might be used.
            </p>
          </div>

          <div className="relative mx-auto lg:max-w-[410px] w-full mb-20">
            <input
              placeholder="Search influencer"
              className="p-4 py-3 outline-none focus pr-10 bg-gray-100 border rounded border-gray-100 text-slate-600 lg:max-w-[410px] w-full leading-4"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <svg
              className="absolute pointer-events-none top-3 right-5"
              width={24}
              height={24}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 17C13.866 17 17 13.866 17 10C17 6.13401 13.866 3 10 3C6.13401 3 3 6.13401 3 10C3 13.866 6.13401 17 10 17Z"
                stroke="#4B5563"
                strokeWidth="1.66667"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M21 21L15 15"
                stroke="#4B5563"
                strokeWidth="1.66667"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            {/* Display search results */}
            {searchResults.length > 0 && (
              <div className="absolute bg-white shadow-lg w-full mt-1 rounded border border-gray-200 z-10">
                {searchResults &&
                  searchResults.map((user) => (
                    <div
                      className="flex items-center"
                      key={user._id}
                      onClick={() => handleSelectInfluencer(user)}
                    >
                      <div className="w-10 h-10  hover:bg-gray-100 rounded-sm flex items-center justify-center">
                        <img
                          src="https://i.ibb.co/C6bwf12/Mask-Group.png"
                          className="w-8 h-8 rounded-full"
                          alt="profile"
                        />
                      </div>
                      <div className="pl-1">
                        <p className="text-sm font-medium leading-none text-gray-800">
                          {user.username}
                        </p>
                        <p className="text-xs leading-3 text-gray-600 ">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Selected Influencer */}
          {campaignInfo.selectedInfluencer && (
            <>
              {" "}
              <p className="text-sm leading-none text-gray-800">
                Selected User
              </p>{" "}
              <div className="flex items-center  mb-4  mt-3">
                <div className="w-10 h-10  hover:bg-gray-100 rounded-sm flex items-center justify-center">
                  <img
                    src="https://i.ibb.co/C6bwf12/Mask-Group.png"
                    className="w-8 h-8  rounded-full"
                    alt="profile"
                  />
                </div>
                <div className="pl-1">
                  <p className="text-sm font-medium leading-none text-gray-800">
                    {campaignInfo.selectedInfluencer.username}
                  </p>
                  <p className="text-xs leading-3 text-gray-600 mt-1">
                    {campaignInfo.selectedInfluencer.email}
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Start Date and End Date */}
          <div className="container mx-auto grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3  pt-6 gap-8">
            {/* Campaign Name */}
            <div className="flex flex-col">
              <label
                className="text-sm leading-none text-gray-800"
                htmlFor="campaignName"
              >
                Campaign Name
              </label>
              <input
                type="text"
                id="campaignName"
                className="w-full p-3 mt-3 bg-gray-100 border rounded border-gray-200 focus:outline-none focus:border-gray-600 text-sm font-medium leading-none text-gray-800"
                placeholder="Enter campaign name"
                value={campaignInfo.campaignName}
                onChange={(e) => handleChange("campaignName", e.target.value)}
                required
              />
            </div>

            {/* Campaign Budget */}
            <div className="flex flex-col">
              <label
                className="text-sm leading-none text-gray-800"
                htmlFor="campaignBudget"
              >
                Campaign Budget
              </label>
              <input
                type="number"
                id="campaignBudget"
                className="w-full p-3 mt-3 bg-gray-100 border rounded border-gray-200 focus:outline-none focus:border-gray-600 text-sm font-medium leading-none text-gray-800"
                placeholder="Enter campaign budget"
                value={campaignInfo.campaignBudget}
                onChange={(e) => handleChange("campaignBudget", e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col">
              <label
                className="text-sm leading-none text-gray-800"
                htmlFor="startDate"
              >
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                className="w-full p-3 mt-3 bg-gray-100 border rounded border-gray-200 focus:outline-none focus:border-gray-600 text-sm font-medium leading-none text-gray-800"
                value={campaignInfo.startDate}
                onChange={(e) => handleChange("startDate", e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col mt-4 md:mt-0">
              <label
                className="text-sm leading-none text-gray-800"
                htmlFor="endDate"
              >
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                className="w-full p-3 mt-3 bg-gray-100 border rounded border-gray-200 focus:outline-none focus:border-gray-600 text-sm font-medium leading-none text-gray-800"
                value={campaignInfo.endDate}
                onChange={(e) => handleChange("endDate", e.target.value)}
                required
              />
            </div>

            {/* Content Guidelines */}
            <div className="flex flex-col">
              <label
                className="text-sm leading-none text-gray-800"
                htmlFor="contentGuidelines"
              >
                Content Guidelines
              </label>
              <textarea
                id="contentGuidelines"
                className="w-full p-3 mt-3 bg-gray-100 border rounded border-gray-200 focus:outline-none focus:border-gray-600 text-sm font-medium leading-none text-gray-800"
                placeholder="Enter content guidelines"
                value={campaignInfo.contentGuidelines}
                onChange={(e) =>
                  handleChange("contentGuidelines", e.target.value)
                }
                rows={3}
              />
            </div>
            {/* Target Audience */}
            <div className="flex flex-col">
              <label
                className="text-sm leading-none text-gray-800"
                htmlFor="targetAudience"
              >
                Target Audience
              </label>
              <textarea
                id="targetAudience"
                className="w-full p-3 mt-3 bg-gray-100 border rounded border-gray-200 focus:outline-none focus:border-gray-600 text-sm font-medium leading-none text-gray-800"
                placeholder="Describe target audience"
                value={campaignInfo.targetAudience}
                onChange={(e) => handleChange("targetAudience", e.target.value)}
                rows={3}
              />
            </div>
          </div>

          {/* Campaign Description */}
          <div className="container mx-auto mt-6">
            <label
              className="text-sm leading-none text-gray-800"
              htmlFor="campaignDescription"
            >
              Campaign Description
            </label>
            <textarea
              id="campaignDescription"
              className="w-full p-3 mt-3 bg-gray-100 border rounded border-gray-200 focus:outline-none focus:border-gray-600 text-sm font-medium leading-none text-gray-800"
              placeholder="Enter campaign description"
              value={campaignInfo.campaignDescription}
              onChange={(e) =>
                handleChange("campaignDescription", e.target.value)
              }
              rows={3}
              required
            />
          </div>

          {/* Amount */}
          <div className="mt-6">
            <label
              className="text-sm leading-none text-gray-800"
              htmlFor="amount"
            >
              Amount
            </label>
            <input
              type="number"
              id="amount"
              className="w-full p-3 mt-3 bg-gray-100 border rounded border-gray-200 focus:outline-none focus:border-gray-600 text-sm font-medium leading-none text-gray-800"
              placeholder="Enter amount"
              value={campaignInfo.amount}
              onChange={(e) => handleChange("amount", e.target.value)}
              required
              min="1"
            />
          </div>

          {/* Target Audience */}
          <div className="mt-6">
            <label
              className="text-sm leading-none text-gray-800"
              htmlFor="targetAudience"
            >
              Target Audience
            </label>
            <textarea
              id="targetAudience"
              className="w-full p-3 mt-3 bg-gray-100 border rounded border-gray-200 focus:outline-none focus:border-gray-600 text-sm font-medium leading-none text-gray-800"
              placeholder="Describe target audience"
              value={campaignInfo.targetAudience}
              onChange={(e) => handleChange("targetAudience", e.target.value)}
              rows={3}
            />
          </div>
          <div className="py-4 flex items-center">
            <div className="bg-white dark:bg-gray-800 border rounded-sm border-gray-400 dark:border-gray-700 w-5 h-5 flex flex-shrink-0 justify-center items-center relative">
              <input
                type="checkbox"
                className="checkbox opacity-0 absolute cursor-pointer w-full h-full"
              />
              <div className="check-icon hidden bg-indigo-700 text-white rounded-sm">
                <svg
                  className="icon icon-tabler icon-tabler-check"
                  xmlns="http://www.w3.org/2000/svg"
                  width={20}
                  height={20}
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" />
                  <path d="M5 12l5 5l10 -10" />
                </svg>
              </div>
            </div>
            <p className="ml-3 text-base leading-4 font-normal text-gray-800 dark:text-gray-100">
              On
            </p>
          </div>
          {/* Additional Requirements */}
          <div className="mt-6">
            <label
              className="text-sm leading-none text-gray-800"
              htmlFor="additionalRequirements"
            >
              Additional Requirements
            </label>
            <textarea
              id="additionalRequirements"
              className="w-full p-3 mt-3 bg-gray-100 border rounded border-gray-200 focus:outline-none focus:border-gray-600 text-sm font-medium leading-none text-gray-800"
              placeholder="Specify additional requirements"
              value={campaignInfo.additionalRequirements}
              onChange={(e) =>
                handleChange("additionalRequirements", e.target.value)
              }
              rows={3}
            />
          </div>

          <ContentDeliverables
            campaignInfo={campaignInfo}
            setCampaignInfo={setCampaignInfo}
          />

          {/* Submit Button */}
          <div className="mt-8 flex justify-end">
            <button
              className="mx-2 my-2 bg-blue-700 transition duration-150 ease-in-out hover:bg-blue-600 rounded text-white px-6 py-2 text-xs"
              type="submit"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Submit"}
            </button>
          </div>

          {/* Agreement Dialog */}
          <AgreementDialog
            isOpen={isAgreementOpen}
            onClose={() => setIsAgreementOpen(false)}
            campaignInfo={campaignInfo}
          />
        </div>
      }
    />
  );
};

export default CreateCampaign;
