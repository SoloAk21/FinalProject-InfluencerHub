import React, { useState, useEffect } from "react";
import { postToAuthAPI } from "../../../helper/postToAuthAPI";
import InfluencerCard from "./InfluencerCard";
import { Link } from "react-router-dom";

export function InfluencerProfile({ influencers = [] }) {
  const [error, setError] = useState("");
  const [collabStatus, setCollabStatus] = useState({});
  const [loadingStates, setLoadingStates] = useState({});

  useEffect(() => {
    const fetchCollabStatus = async () => {
      try {
        const statusResponses = await Promise.all(
          influencers.map((influencer) =>
            postToAuthAPI("/api/collaborations/status", {
              influencerId: influencer._id,
            })
          )
        );
        const statusData = await Promise.all(
          statusResponses.map((res) => res.json())
        );
        const statusMap = statusData.reduce((acc, status, index) => {
          acc[influencers[index]._id] = status.collabStatus;
          return acc;
        }, {});
        setCollabStatus(statusMap);
      } catch (error) {
        console.error("Failed to fetch collaboration statuses:", error);
      }
    };

    fetchCollabStatus();
  }, [influencers]);

  const handleSendCollaboration = async (influencerId) => {
    setLoadingStates((prev) => ({ ...prev, [influencerId]: true }));
    setError("");

    try {
      const response = await postToAuthAPI("/api/collaborations/send", {
        influencerId,
      });
      const responseData = await response.json();
      console.log(responseData);

      setCollabStatus((prevStatus) => ({
        ...prevStatus,
        [influencerId]: "pending",
      }));
    } catch (error) {
      setError("Failed to send request. Please try again.");
    } finally {
      setLoadingStates((prev) => ({ ...prev, [influencerId]: false }));
    }
  };

  const handleMessage = (influencerId) => {
    console.log("Messaging influencer with ID:", influencerId);
  };

  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {influencers.map((influencer) => (
        <InfluencerCard
          key={influencer._id}
          influencer={influencer}
          collabStatus={collabStatus[influencer._id]}
          isLoading={loadingStates[influencer._id]}
          error={error}
          handleSendCollaboration={handleSendCollaboration}
          handleMessage={handleMessage}
        />
      ))}
    </div>
  );
}
