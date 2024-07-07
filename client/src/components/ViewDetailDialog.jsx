import React from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Typography,
} from "@material-tailwind/react";

const ViewDetailDialog = ({ isOpen, onClose, userInfo }) => {
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

  return (
    <Dialog open={isOpen} handler={onClose}>
      <DialogHeader>
        <Typography variant="h5" color="blue-gray">
          Campaign Detail
        </Typography>
      </DialogHeader>
      <DialogBody divider className="grid  gap-4">
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
