import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
  Chip,
  IconButton,
  Tooltip,
} from "@material-tailwind/react";
import ConfirmationDialog from "../components/ConfirmationDialog";
import { BsChatLeftDotsFill } from "react-icons/bs";
import { setSelectedParticipant } from "../redux/chat/chatSlice";
import { useNavigate } from "react-router-dom";

const Content = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [contents, setContents] = useState([]);
  const [selectedContent, setSelectedContent] = useState(null);
  const [action, setAction] = useState(null);
  const [selectedSingleContent, setSelectedSingleContent] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchContentByUserId = async () => {
    try {
      const response = await fetch(`/api/contents/content`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setContents(data);
    } catch (error) {
      console.error("Error fetching content:", error);
    }
  };

  useEffect(() => {
    fetchContentByUserId();
  }, []);

  const handleAction = (contentItem, actionType) => {
    setSelectedContent(contentItem);
    setSelectedSingleContent(
      contentItem.contents[contentItem.contents.length - 1]._id
    );
    setAction(actionType);
  };

  const handleConfirmAction = async () => {
    try {
      const response = await fetch(
        `/api/contents/${selectedContent._id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: action === "accept" ? "approved" : "rejected",
            selectedSingleContent,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      await response.json();

      // Update local state or fetch updated content list
      fetchContentByUserId();

      // Close dialog after handling confirmation
      setSelectedContent(null);
    } catch (error) {
      console.error(
        `Error ${action === "accept" ? "accepting" : "rejecting"} content:`,
        error
      );
    }
  };

  const handleSelectUser = (userId) => {
    dispatch(setSelectedParticipant(userId));
    navigate("/message");
  };

  const renderLatestContent = (contentItem) => {
    const latestContent = contentItem.contents[contentItem.contents.length - 1];
    const isVideo = latestContent.type === "video";

    const influencer = contentItem.campaign.influencer;
    const company = contentItem.campaign.company;

    return (
      <Card key={contentItem._id} className="flex flex-col">
        <CardHeader className="relative mt-5 rounded-none p-0 shadow-none">
          {isVideo ? (
            <video
              className="h-auto md:h-full w-full rounded-lg object-cover object-center"
              controls
            >
              <source
                src={latestContent.url || "https://via.placeholder.com/400"}
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img
              src={latestContent.url || "https://via.placeholder.com/400"}
              alt="content"
              className="w-full h-auto md:h-full rounded-lg object-cover object-center"
            />
          )}
        </CardHeader>
        <CardBody className="flex flex-grow">
          <div className="flex flex-col w-full p-3">
            <div className="flex items-center mb-2">
              <img
                alt="profile"
                src={
                  currentUser.userType === "influencer"
                    ? company?.profileImage || "https://via.placeholder.com/100"
                    : influencer?.profileImage ||
                      "https://via.placeholder.com/100"
                }
                className="w-12 h-12 mr-2 rounded-full object-cover"
              />
              <div>
                <h6 className="font-semibold text-blue-gray-900">
                  {currentUser.userType === "influencer"
                    ? company?.companyName
                    : `${influencer?.firstName} ${influencer?.lastName}`}
                </h6>
                <p className="text-sm text-gray-700">
                  {currentUser.userType === "influencer"
                    ? company?.email
                    : influencer?.email}
                </p>
              </div>
            </div>
            <Typography variant="h5" color="blue-gray" className="mb-2">
              {contentItem.campaign.campaignName}
            </Typography>
            <Typography>{latestContent.description}</Typography>
          </div>
        </CardBody>
        <CardFooter
          className={`pt-0 flex gap-2 ${
            contentItem.overallStatus !== "rejected" && "justify-between"
          }`}
        >
          {currentUser.userType === "company" ? (
            <div>
              {contentItem.overallStatus === "pending" ? (
                <>
                  <Button
                    size="sm"
                    color="green"
                    onClick={() => handleAction(contentItem, "accept")}
                  >
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    color="red"
                    onClick={() => handleAction(contentItem, "reject")}
                  >
                    Reject
                  </Button>{" "}
                </>
              ) : (
                <div>
                  <Chip
                    size="sm"
                    variant="ghost"
                    value={contentItem.overallStatus}
                    color={
                      contentItem.overallStatus === "approved" ? "green" : "red"
                    }
                  />
                  {contentItem.overallStatus === "rejected" && (
                    <Tooltip content="Go to message">
                      <IconButton
                        className="rounded ml-2 bg-transparent shadow-none"
                        onClick={() => handleSelectUser(influencer._id)}
                      >
                        <BsChatLeftDotsFill className="text-xl text-[#1DA1F2] hover:shadow-[#1DA1F2]/20" />
                      </IconButton>
                    </Tooltip>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="inline-flex">
              <Chip
                size="sm"
                variant="ghost"
                value={contentItem.overallStatus}
                color={
                  contentItem.overallStatus === "approved"
                    ? "green"
                    : contentItem.overallStatus === "pending"
                    ? "amber"
                    : "red"
                }
              />
              {contentItem.overallStatus === "rejected" && (
                <Tooltip content="Go to message">
                  <IconButton
                    onClick={() => handleSelectUser(company._id)}
                    className="rounded ml-2 bg-transparent shadow-none"
                  >
                    <BsChatLeftDotsFill className="text-xl text-[#1DA1F2] hover:shadow-[#1DA1F2]/20" />
                  </IconButton>
                </Tooltip>
              )}
            </div>
          )}
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
      {contents.map((contentItem) => (
        <div key={contentItem._id} className="flex flex-col w-full">
          {renderLatestContent(contentItem)}
        </div>
      ))}

      <ConfirmationDialog
        isOpen={!!selectedContent}
        onClose={() => setSelectedContent(null)}
        onConfirm={handleConfirmAction}
        onCancel={() => setSelectedContent(null)}
        title={
          selectedContent
            ? `Confirm ${
                currentUser.userType === "company" ? "Acceptance" : "Rejection"
              }`
            : ""
        }
        message={`Are you sure you want to ${
          currentUser.userType === "company" ? "accept" : "reject"
        } this content?`}
      />
    </div>
  );
};

export default Content;
