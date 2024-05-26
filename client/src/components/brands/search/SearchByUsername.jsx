import React, { useEffect, useState } from "react";
import { Button, Checkbox, Input, Select } from "@material-tailwind/react";
import { FaAngleDown, FaCross, FaSearch } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { InfluencerProfile } from "../InfluencerProfile";
// import { InfluencerProfile } from "../InfluencerProfile";

export default function SearchByUsername() {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetch(`/api/influencers/search?term=${searchTerm}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.message === "No influencer found") {
            setSuggestions([]);
          } else {
            setSuggestions(data);
          }
          setIsLoading(false);
        });
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);
  const handleSearch = (event) => {
    event.preventDefault();
    setIsLoading(true);
    // Perform the search operation here
    // ...
    setIsLoading(false);
  };
  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
    setActiveSuggestionIndex(0);
  };

  const handleKeyDown = (event) => {
    if (
      event.key === "ArrowDown" &&
      activeSuggestionIndex < suggestions.length - 1
    ) {
      setActiveSuggestionIndex(activeSuggestionIndex + 1);
    } else if (event.key === "ArrowUp" && activeSuggestionIndex > 0) {
      setActiveSuggestionIndex(activeSuggestionIndex - 1);
    } else if (event.key === "Enter") {
      setSearchTerm(suggestions[activeSuggestionIndex].username);
      // Optionally, you can also perform the search here
    }
  };
  return (
    <>
      <form className=" text-xs mx-auto mt-10" onSubmit={handleSearch}>
        <div className="flex gap-2 flex-col ">
          <div className="flex relative items-center">
            <Input
              label="Search by username"
              className="flex-1"
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              value={searchTerm}
            />
            <RxCross2
              className="absolute right-0 mr-4 text-lg  cursor-pointer hover:bg-black"
              onClick={() => {
                setSearchTerm("");
              }}
            />
          </div>

          {isLoading && <div>Loading...</div>}
          {suggestions.message && !isLoading && <div>No influencer found</div>}

          {suggestions.length > 0 && (
            <InfluencerProfile influencers={suggestions} />
          )}
        </div>
      </form>
      {/* ... */}
    </>
  );
}
