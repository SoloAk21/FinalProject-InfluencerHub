import React, { useState } from "react";
import {
  Card,
  Button,
  Typography,
  Dialog,
  DialogHeader,
  DialogBody,
  IconButton,
} from "@material-tailwind/react";
import { IoMdClose } from "react-icons/io";

import validator from "validator";
import { MdCancel } from "react-icons/md";

import { FaArrowRight } from "react-icons/fa";

import { useSelector } from "react-redux";
import { PLATFORM } from "../../../constants";
import ValidatedInput from "../../ValidatedInput";
import DynamicTable from "../../DynamicTable";

const MIN_FOLLOWERS = PLATFORM.map((platform) => platform.minFollowers);

const SocialMediaPlatform = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [open, setOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [url, setUrl] = useState("");
  const [followerCount, setFollowerCount] = useState("");
  const [platforms, setPlatforms] = useState(currentUser.platforms);
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const closeError = () => {
    setErrors({});
  };

  const handlePlatformSelect = (platform) => {
    const existingProfile = platforms.find((p) => p.name === platform);
    if (existingProfile) {
      setUrl(existingProfile.url);
      setFollowerCount(existingProfile.followerCount);
    } else {
      setUrl("");
      setFollowerCount("");
    }
    setSelectedPlatform(platform);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedPlatform("");
    setUrl("");
    setFollowerCount("");
    setErrors({});
  };

  const handleSave = () => {
    const minFollowers =
      MIN_FOLLOWERS[PLATFORM.findIndex((p) => p.name === selectedPlatform)] ||
      0;
    const newErrors = {};

    if (!selectedPlatform || !url.trim()) {
      newErrors.url = "Please enter a valid URL.";
    }

    // Convert followerCount to a string before calling trim
    const followerCountStr = String(followerCount).trim();

    if (!selectedPlatform || !followerCountStr) {
      newErrors.followerCount = "Please specify the followers count.";
    } else if (!validator.isInt(followerCountStr, { min: minFollowers })) {
      newErrors.followerCount = `Minimum follower number for ${selectedPlatform} is ${minFollowers}.`;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const newData = platforms.filter((p) => p.name !== selectedPlatform);
    newData.push({
      name: selectedPlatform,
      url,
      followerCount: parseInt(followerCountStr, 10), // Ensure followerCount is stored as a number
    });

    setPlatforms(newData);
    setIsEditing(true);
    handleClose();
  };

  const tableHeaders = ["Platform", "URL", "Followers", ""];
  const tableData = platforms.map(({ name, url, followerCount }) => [
    name,
    url,
    followerCount,
    <Typography
      as="a"
      href="#"
      className="text-blue-700 font-medium text-xs"
      onClick={() => handlePlatformSelect(name)}
    >
      Edit
    </Typography>,
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(platforms);

    setIsEditing(false);
  };
  return (
    <Card
      className="mx-auto w-full max-w-xl"
      color="transparent"
      shadow={false}
    >
      <form
        className="flex flex-col text-center gap-4  w-full"
        onSubmit={handleSubmit}
      >
        <Typography className="text-blue-gray-600" variant="h6">
          Social Media Profile
        </Typography>
        <div className="flex justify-center  gap-2">
          <div className="flex justify-center  gap-2">
            {PLATFORM.map((platform) => (
              <Button
                key={platform.name}
                variant="outlined"
                className={`px-2 py-1 flex items-center flex-col `}
                onClick={() => handlePlatformSelect(platform.name)}
              >
                <platform.icon className="text-xl" />
              </Button>
            ))}
          </div>{" "}
        </div>
        <Dialog size="md" open={open} onClose={handleClose}>
          <DialogHeader className="justify-between">
            <span></span>
            <IoMdClose className="text-base" onClick={handleClose} />
          </DialogHeader>
          <DialogBody className="overflow-y-scroll">
            <Typography color="blue-gray" className="mb-4 font-bold">
              Selected Platforms: {selectedPlatform}
            </Typography>
            <div className="flex flex-col gap-4">
              <ValidatedInput
                label="URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                error={errors.url}
                required
              />

              <ValidatedInput
                type="number"
                label="Followers"
                value={followerCount}
                onChange={(e) => setFollowerCount(e.target.value)}
                error={errors.followerCount}
                required
              />
            </div>

            <div className="flex  justify-end">
              <Button
                className="bg-green-900 mt-4 px-4 capitalize py-2"
                onClick={handleSave}
              >
                Save
              </Button>
            </div>
          </DialogBody>
        </Dialog>

        {errors.platforms && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <span className="block sm:inline">{errors.platforms}</span>
            <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
              <MdCancel onClick={closeError} />
            </span>
          </div>
        )}

        <DynamicTable headers={tableHeaders} data={tableData} />

        {isEditing && (
          <div className="flex justify-end mt-10 gap-4">
            <Button
              variant="outlined"
              className="capitalize border-red-500 text-red-500"
              size="sm"
            >
              Cancel
            </Button>
            <Button type="submit" className="capitalize bg-green-500" size="sm">
              Save Changes
            </Button>
          </div>
        )}
      </form>
    </Card>
  );
};

export default SocialMediaPlatform;
