import React from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Typography,
} from "@material-tailwind/react";
import { calculateAge } from "../helper/calculateAge";

const ViewDetailDialog = ({ isOpen, onClose, userInfo, currentUserType }) => {
  const handleOpen = () => onClose(!isOpen);

  const renderField = (label, value) => {
    return (
      <div className="flex items-start flex-row gap-3">
        <Typography className="text-sm text-blue-gray-900 font-medium">
          {label}:
        </Typography>
        <Typography className="text-xs text-gray-600">
          {Array.isArray(value) ? value.join(", ") : value}
        </Typography>
      </div>
    );
  };

  const renderSocialMediaTable = () => {
    if (!userInfo.platforms || userInfo.platforms.length === 0) {
      return null;
    }

    return (
      <div className="flex flex-col gap-4">
        <Typography variant="subtitle1" color="blue-gray">
          Social Media Handles
        </Typography>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Platform
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Followers
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  URL
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {userInfo.platforms.map((platform) => (
                <tr key={platform._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {platform.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {platform.followerCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {platform.url}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderInfluencerDetails = () => (
    <>
      {renderField(
        "Influencer Name",
        `${userInfo?.firstName} ${userInfo?.lastName}`
      )}
      {renderSocialMediaTable()}
      {renderField("Email", userInfo?.email)}
      {renderField("Phone Number", userInfo?.phoneNumber)}
      {renderField("Age", calculateAge(userInfo?.dateOfBirth))}
    </>
  );

  const renderCompanyDetails = () => (
    <>
      {renderField("Company Name", userInfo?.companyName)}
      {renderField(
        "Company Website",
        <a
          href={userInfo?.companyWebsite}
          target="_blank"
          rel="noopener noreferrer"
        >
          {userInfo?.companyWebsite}
        </a>
      )}
      {renderField("Industry", userInfo?.industry)}
      {renderField("Company Description", userInfo?.companyDescription)}
      {renderField("Contact Name", userInfo?.contactName)}
      {renderField("Email", userInfo?.email)}
      {renderField("Phone Number", userInfo?.phoneNumber)}
    </>
  );

  return (
    <Dialog open={isOpen} onClose={onClose} size="lg">
      <DialogHeader>
        <Typography variant="h5" color="blue-gray">
          {currentUserType === "company"
            ? "Influencer Detail"
            : "Company Detail"}
        </Typography>
      </DialogHeader>
      <DialogBody divider className="grid gap-4">
        {currentUserType === "company"
          ? renderInfluencerDetails()
          : renderCompanyDetails()}
      </DialogBody>
      <DialogFooter className="space-x-2">
        <Button variant="text" color="blue-gray" onClick={handleOpen}>
          Close
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default ViewDetailDialog;
