import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
  Tooltip,
} from "@material-tailwind/react";
import { FaFacebookF, FaTelegram, FaStar } from "react-icons/fa";
import { BsInstagram, BsTiktok, BsYoutube } from "react-icons/bs";
import { postToAuthAPI } from "../../helper/postToAuthAPI";

const platformsIcons = {
  Facebook: FaFacebookF,
  Telegram: FaTelegram,
  Instagram: BsInstagram,
  Tiktok: BsTiktok,
  YouTube: BsYoutube,
};

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

  const renderButton = (influencer) => {
    const isLoading = loadingStates[influencer._id];
    switch (collabStatus[influencer._id]) {
      case "pending":
        return <Button disabled>Pending</Button>;
      case "accepted":
        return (
          <Button onClick={() => handleMessage(influencer._id)}>Message</Button>
        );
      default:
        return (
          <Button
            size="small"
            className="bg-green-400 capitalize font-thin"
            disabled={isLoading}
            onClick={() => handleSendCollaboration(influencer._id)}
          >
            {isLoading ? "Sending..." : "Send Collaboration Request"}
          </Button>
        );
    }
  };

  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {influencers.map((influencer) => (
        <Card className="w-full border-2" key={influencer._id}>
          <CardHeader floated={false} color="blue-gray">
            <img
              src="https://img-cdn.pixlr.com/image-generator/history/665203ea2c577e5c24b393a2/8e800c73-fbbe-4286-8465-93228528313d/preview.webp"
              alt={influencer.username}
            />
          </CardHeader>
          <CardBody>
            <div className="flex items-center justify-between">
              <Typography
                variant="h6"
                color="blue-gray"
                className="font-medium"
              >
                {influencer.username}
              </Typography>
              <Typography
                color="blue-gray"
                className="flex text-xs md:text-sm items-center gap-1.5 font-normal"
              >
                <FaStar className="text-yellow-900" />
                4.5
              </Typography>
            </div>
            <Typography color="gray" className="text-xs md:text-sm font-medium">
              {influencer.biography}
            </Typography>
            <div className="group mt-3 inline-flex flex-wrap items-center gap-1 my-4">
              {influencer.platforms.map((platform) => (
                <Tooltip content={platform.name} key={platform._id}>
                  <span className="cursor-pointer rounded-full border border-blue-900/5 bg-blue-900/20 p-2 text-blue-900 transition-colors hover:border-gray-900/10 hover:bg-gray-900/10 hover:!opacity-100 group-hover:opacity-70">
                    {React.createElement(platformsIcons[platform.name])}
                  </span>
                </Tooltip>
              ))}
            </div>
          </CardBody>
          <CardFooter className="pt-[0px]">
            {error && <p className="text-red-500 mb-2">{error}</p>}
            {renderButton(influencer)}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
