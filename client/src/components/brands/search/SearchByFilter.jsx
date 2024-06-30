import React, { useState, useEffect } from "react";
import { Button, Checkbox, Select } from "@material-tailwind/react";
import { RxCross2 } from "react-icons/rx";
import { AGE_GROUP, INDUSTRY, PLATFORM } from "../../../constants";
import { InfluencerProfile } from "./InfluencerProfile";

export default function SearchByFilter() {
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [selectedAgeGroups, setSelectedAgeGroups] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [filteredInfluencers, setFilteredInfluencers] = useState([]);

  useEffect(() => {
    fetchFilteredInfluencers();
  }, [selectedPlatforms, selectedAgeGroups, selectedCategories]);

  const mapAgeGroupToRange = (ageGroup) => {
    if (ageGroup === "Under 18") {
      return "0-18";
    }
    return ageGroup;
  };

  const fetchFilteredInfluencers = async () => {
    setIsLoading(true);
    const mappedAgeGroups = selectedAgeGroups.map(mapAgeGroupToRange);

    const params = new URLSearchParams({
      platforms: selectedPlatforms.join(","),
      ageGroups: mappedAgeGroups.join(","),
      categories: selectedCategories.join(","),
    });

    console.log(params.toString());

    try {
      const response = await fetch(
        `/api/influencers/filter?${params.toString()}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setFilteredInfluencers(data.message ? [] : data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setFilteredInfluencers([]); // Reset the influencers list on error
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlatformChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      if (value === "allPlatforms") {
        setSelectedPlatforms(PLATFORM.map((platform) => platform.name));
      } else {
        setSelectedPlatforms((prevSelected) => [...prevSelected, value]);
      }
    } else {
      if (value === "allPlatforms") {
        setSelectedPlatforms([]);
      } else {
        setSelectedPlatforms((prevSelected) =>
          prevSelected.filter((platform) => platform !== value)
        );
      }
    }
  };

  const handleAgeGroupChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      if (value === "allAgeGroups") {
        setSelectedAgeGroups(AGE_GROUP);
      } else {
        setSelectedAgeGroups((prevSelected) => [...prevSelected, value]);
      }
    } else {
      if (value === "allAgeGroups") {
        setSelectedAgeGroups([]);
      } else {
        setSelectedAgeGroups((prevSelected) =>
          prevSelected.filter((ageGroup) => ageGroup !== value)
        );
      }
    }
  };

  const handleInfluencerCategoryChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      if (value === "allInfluencerCategories") {
        setSelectedCategories(INDUSTRY);
      } else {
        setSelectedCategories((prevSelected) => [...prevSelected, value]);
      }
    } else {
      if (value === "allInfluencerCategories") {
        setSelectedCategories([]);
      } else {
        setSelectedCategories((prevSelected) =>
          prevSelected.filter((category) => category !== value)
        );
      }
    }
  };

  const removeSelectedPlatform = (platformToRemove) => {
    setSelectedPlatforms((prevSelected) =>
      prevSelected.filter((platform) => platform !== platformToRemove)
    );
  };

  const removeSelectedAgeGroup = (ageGroupToRemove) => {
    setSelectedAgeGroups((prevSelected) =>
      prevSelected.filter((ageGroup) => ageGroup !== ageGroupToRemove)
    );
  };

  const removeSelectedInfluencerCategory = (categoryToRemove) => {
    setSelectedCategories((prevSelected) =>
      prevSelected.filter((category) => category !== categoryToRemove)
    );
  };

  const isAllPlatformsSelected = selectedPlatforms.length === PLATFORM.length;
  const isAllAgeGroupsSelected = selectedAgeGroups.length === AGE_GROUP.length;
  const isAllInfluencerCategoriesSelected =
    selectedCategories.length === INDUSTRY.length;

  return (
    <>
      <form className="text-xs  mx-auto" onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
          <Select
            variant="outlined"
            className="w-full"
            label="Social Media"
            multiple
          >
            <Checkbox
              label="Select All"
              value="allPlatforms"
              checked={isAllPlatformsSelected}
              onChange={handlePlatformChange}
            />
            {PLATFORM.map((platform) => (
              <Checkbox
                key={platform.name}
                label={platform.name}
                value={platform.name}
                checked={selectedPlatforms.includes(platform.name)}
                onChange={handlePlatformChange}
              />
            ))}
          </Select>
          <Select
            className="w-full"
            variant="outlined"
            label="Age Groups"
            multiple
          >
            <Checkbox
              label="Select All"
              value="allAgeGroups"
              checked={isAllAgeGroupsSelected}
              onChange={handleAgeGroupChange}
            />
            {AGE_GROUP.map((ageGroup) => (
              <Checkbox
                key={ageGroup}
                label={ageGroup}
                value={ageGroup}
                checked={selectedAgeGroups.includes(ageGroup)}
                onChange={handleAgeGroupChange}
              />
            ))}
          </Select>
          <Select
            className="w-full"
            variant="outlined"
            label="Influencer Categories"
            multiple
          >
            <Checkbox
              label="Select All"
              value="allInfluencerCategories"
              checked={isAllInfluencerCategoriesSelected}
              onChange={handleInfluencerCategoryChange}
            />
            {INDUSTRY.map((category) => (
              <Checkbox
                key={category}
                label={category}
                value={category}
                checked={selectedCategories.includes(category)}
                onChange={handleInfluencerCategoryChange}
              />
            ))}
          </Select>
        </div>

        <div className="flex flex-wrap gap-2 my-2 justify-center ">
          {selectedPlatforms.map((platform) => (
            <Button
              key={platform}
              className="flex text-blue-white bg-blue-gray-50 gap-1 min-w-max p-2 capitalize text-[10px]"
            >
              {platform}
              <RxCross2
                className="text-xs cursor-pointer hover:bg-black"
                onClick={() => {
                  removeSelectedPlatform(platform);
                }}
              />
            </Button>
          ))}
          {selectedAgeGroups.map((ageGroup) => (
            <Button
              key={ageGroup}
              className="flex text-blue-white bg-blue-gray-50 gap-1 min-w-max p-2 capitalize text-[10px]"
            >
              {ageGroup}
              <RxCross2
                className="text-xs cursor-pointer hover:bg-red-500"
                onClick={() => {
                  removeSelectedAgeGroup(ageGroup);
                }}
              />
            </Button>
          ))}
          {selectedCategories.map((category) => (
            <Button
              key={category}
              className="flex text-blue-white bg-blue-gray-50 gap-1 min-w-max p-2 capitalize text-[10px]"
            >
              {category}
              <RxCross2
                className="text-xs cursor-pointer hover:bg-black"
                onClick={() => {
                  removeSelectedInfluencerCategory(category);
                }}
              />
            </Button>
          ))}
        </div>
        {isLoading && <div>Loading...</div>}
        {!isLoading && filteredInfluencers.length === 0 && (
          <div className="md:min-h-80 mt-10">No influencer found</div>
        )}
        {!isLoading && filteredInfluencers.length > 0 && (
          <InfluencerProfile influencers={filteredInfluencers} />
        )}
      </form>
    </>
  );
}
