import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  Typography,
  Input,
  Card,
} from "@material-tailwind/react";
import { IoMdClose } from "react-icons/io";
import {
  FaFacebookF,
  FaInstagram,
  FaTelegram,
  FaTiktok,
  FaYoutube,
} from "react-icons/fa";

export function StepThree() {
  const [open, setOpen] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [url, setUrl] = useState("");
  const [followerCount, setFollowerCount] = useState("");
  const [savedData, setSavedData] = useState([]);
  const TABLE_HEAD = ["Platform", "URL", "Follower Count", ""];

  const handlePlatformSelect = (platform) => {
    setOpen(true);
    setSelectedPlatforms((prevSelected) => [...prevSelected, platform]);
  };

  const handleClose = () => setOpen(false);

  const handleEdit = (index) => {
    const dataToEdit = savedData[index];
    setSelectedPlatforms(dataToEdit.platforms);
    setUrl(dataToEdit.url);
    setFollowerCount(dataToEdit.followerCount);
    setOpen(true); // Open the dialog for editing
  };

  const handleSave = () => {
    setSavedData((prevData) => [
      ...prevData,
      {
        platforms: selectedPlatforms,
        url,
        followerCount,
      },
    ]);

    setUrl("");
    setFollowerCount("");
    setSelectedPlatforms([]);
    handleClose();
  };

  return (
    <Card className="mx-auto max-w-xl" color="transparent" shadow={false}>
      <form className="flex flex-col gap-2 md:gap-4 mt-8 mb-2 w-72 max-w-screen-lg sm:w-96">
        <Typography
          className="text-center text-blue-gray-600"
          variant="h6"
          color="blue-gray"
        >
          Social Media Profile
        </Typography>

        <div className="text-xs items-center flex flex-col md:flex-row">
          <span>Please select your social media platform(s).</span>
          <span className="text-red-200 font-normal">
            Follower count must be the minimum requirement
          </span>
        </div>

        <div className="flex mt-4 gap-2">
          <Button
            className={`px-3 py-2 flex items-center flex-col bg-blue-500`}
            onClick={() => handlePlatformSelect("Telegram")}
          >
            <FaTelegram className="text-2xl" />
          </Button>
          <Button
            className={`px-3 py-2 flex items-center flex-col bg-red-500`}
            onClick={() => handlePlatformSelect("YouTube")}
          >
            <FaYoutube className="text-2xl" />
          </Button>
          <Button
            className={`px-3 py-2 flex items-center flex-col bg-blue-800`}
            onClick={() => handlePlatformSelect("Facebook")}
          >
            <FaFacebookF className="text-2xl" />
          </Button>
          <Button
            className={`px-3 py-2 flex items-center flex-col bg-black`}
            onClick={() => handlePlatformSelect("Tiktok")}
          >
            <FaTiktok className="text-2xl" />
          </Button>
          <Button
            className={`px-3 py-2 flex items-center flex-col bg-purple-500`}
            onClick={() => handlePlatformSelect("Instagram")}
          >
            <FaInstagram className="text-2xl" />
          </Button>
        </div>

        <Dialog size="md" open={open} onClose={handleClose}>
          <DialogHeader className="justify-between">
            <span></span>
            <IoMdClose className="text-base" onClick={handleClose} />
          </DialogHeader>
          <DialogBody className="overflow-y-scroll">
            <Typography color="blue-gray" className="mb-1 font-bold">
              Selected Platforms: {selectedPlatforms.join(", ")}
            </Typography>
            <div className="flex flex-col gap-2 md:gap-4">
              <Input
                type="text"
                label="URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <Input
                type="number"
                label="Follower Count"
                value={followerCount}
                onChange={(e) => setFollowerCount(e.target.value)}
              />
            </div>
            <Button className="my-4 bg-blue-gray-900" onClick={handleSave}>
              Save
            </Button>
          </DialogBody>
        </Dialog>

        {savedData.length > 0 && (
          <table className="max-w-full w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {TABLE_HEAD.map((head) => (
                  <th
                    key={head}
                    className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal leading-none opacity-70"
                    >
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {savedData.map(({ platforms, url, followerCount }, index) => {
                const isLast = index === savedData.length - 1;
                const classes = isLast
                  ? "p-4"
                  : "p-4 border-b border-blue-gray-50";

                return (
                  <tr key={index}>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {platforms.join(", ")}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {url}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {followerCount}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        as="a"
                        href="#"
                        variant="small"
                        color="blue-gray"
                        className="font-medium"
                        onClick={() => handleEdit(index)}
                      >
                        Edit
                      </Typography>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </form>
    </Card>
  );
}

export default StepThree;
