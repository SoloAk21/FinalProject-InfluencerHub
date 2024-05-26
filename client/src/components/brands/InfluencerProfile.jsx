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
import { FaFacebookF, FaTelegram, FaStar } from "react-icons/fa";
import { BsInstagram, BsTiktok, BsYoutube } from "react-icons/bs";

const platformsIcons = {
  Facebook: FaFacebookF,
  Telegram: FaTelegram,
  Instagram: BsInstagram,
  Tiktok: BsTiktok,
  YouTube: BsYoutube,
};

export function InfluencerProfile({ influencers = [] }) {
  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
            <div className="group mt-3 inline-flex flex-wrap items-center gap-1">
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
            <Button
              size="sm"
              variant="outlined"
              className="capitalize font-thin"
            >
              Send Collaboration
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
