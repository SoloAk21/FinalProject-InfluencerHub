import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
  Tooltip,
} from "@material-tailwind/react";
import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import { platformsIcons } from "../../../helper/platformIcons";

const InfluencerCard = ({
  influencer,
  collabStatus,
  isLoading,
  error,
  handleSendCollaboration,
  handleMessage,
}) => {
  const renderButton = (influencer) => {
    switch (collabStatus) {
      case "pending":
        return (
          <Button
            size="sm"
            variant="outlined"
            className="border-gray-900 text-gray-900 capitalize font-thin"
            disabled
          >
            Pending Request ...
          </Button>
        );
      case "accepted":
        return (
          <Button
            size="sm"
            variant="outlined"
            color="red"
            className=" capitalize font-thin"
            onClick={() => handleMessage(influencer._id)}
          >
            Send Message
          </Button>
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
    <Link to={`/influencer/${influencer._id}`}>
      <Card className="w-full border-2" key={influencer._id}>
        <CardHeader floated={false}>
          <img
            src="../../assets/images/preview.webp"
            alt={influencer.username}
          />
        </CardHeader>
        <CardBody>
          <div className="flex items-center justify-between">
            <Typography variant="h6" color="blue-gray" className="font-medium">
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
    </Link>
  );
};

export default InfluencerCard;
