import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
  Chip,
  CardFooter,
  Tabs,
  TabsHeader,
  Tab,
  Avatar,
  IconButton,
  Tooltip,
} from "@material-tailwind/react";
import { useSelector } from "react-redux";
import {
  MagnifyingGlassIcon,
  TrashIcon,
  PlusIcon,
  BackwardIcon,
} from "@heroicons/react/24/solid";
import CampaignDetails from "./CampaignDetails";
import { FcCancel, FcCheckmark, FcViewDetails } from "react-icons/fc";
import DefaultPagination from "../../components/DefaultPagination";
import MainStructure from "./MainStructure";
import { IoIosArrowRoundBack } from "react-icons/io";
import ConfirmationDialog from "../../components/ConfirmationDialog";

const TABS = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Completed", value: "completed" },
  { label: "Pending", value: "pending" },
];

const TABLE_HEAD = [
  "Content Creator",
  "Campaign Name",
  "Status",
  "Start Date",
  "End Date",
  "",
];

const PAGE_SIZE = 10; // Number of items per page

const ManageCampaign = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [activePage, setActivePage] = useState(1); // Current active page
  const { currentUser } = useSelector((state) => state.user);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState("");
  const [confirmationCampaignId, setConfirmationCampaignId] = useState("");

  const openConfirmationDialog = (campaignId, action) => {
    setConfirmationOpen(true);
    setConfirmationAction(action);
    setConfirmationCampaignId(campaignId);
  };

  const handleConfirmation = () => {
    if (confirmationAction === "accept") {
      updateCampaignStatus(confirmationCampaignId, "active");
    } else if (confirmationAction === "reject") {
      updateCampaignStatus(confirmationCampaignId, "rejected");
    }
    setConfirmationOpen(false);
  };

  const fetchCampaigns = async () => {
    try {
      let endpoint = "";
      if (currentUser.userType === "company") {
        const companyId = currentUser._id;
        endpoint = `/api/campaigns/company/${companyId}`;
      } else if (currentUser.userType === "influencer") {
        const influencerId = currentUser._id;
        endpoint = `/api/campaigns/influencer/${influencerId}`;
      }

      const response = await fetch(
        `${endpoint}?page=${activePage}&pageSize=${PAGE_SIZE}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch campaigns");
      }

      const data = await response.json();

      setCampaigns(data.campaigns);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, [currentUser._id, currentUser.userType, activePage]);

  useEffect(() => {
    // This useEffect runs when campaigns or selectedCampaign changes
    // You can add more dependencies as needed
    console.log(
      "Campaigns or Selected Campaign changed:",
      campaigns,
      selectedCampaign
    );
  }, [campaigns, selectedCampaign]);

  const fetchCampaignById = async (campaignId) => {
    try {
      const response = await fetch(`/api/campaigns/${campaignId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch campaign");
      }
      const data = await response.json();
      setSelectedCampaign(data);
    } catch (error) {
      console.error("Error fetching campaign:", error);
    }
  };

  const handlePageChange = (page) => {
    setActivePage(page);
  };

  const updateCampaignStatus = async (campaignId, newStatus) => {
    try {
      const response = await fetch(`/api/campaigns/${campaignId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update campaign status");
      }

      // Update the local state of campaigns after status update
      const updatedCampaigns = campaigns.map((campaign) =>
        campaign._id === campaignId
          ? { ...campaign, status: newStatus }
          : campaign
      );
      setCampaigns(updatedCampaigns);
    } catch (error) {
      console.error("Error updating campaign status:", error);
    }
  };

  const handleBackToList = () => {
    setSelectedCampaign(null);
  };

  return (
    <MainStructure
      content={
        <div>
          {selectedCampaign ? (
            <>
              <div>
                <IconButton
                  variant="text"
                  onClick={handleBackToList}
                  className="hover:bg-gray-50"
                >
                  <IoIosArrowRoundBack className="h-8 w-8" />
                </IconButton>
              </div>
              <hr className="my-0 border-gray-200" />
              <CampaignDetails campaign={selectedCampaign} />
            </>
          ) : (
            <Card className="h-full w-full">
              <CardHeader
                floated={false}
                shadow={false}
                className="rounded-none"
              >
                <div className="mb-8 flex items-center justify-between gap-8">
                  <div>
                    <Typography variant="h5" color="blue-gray">
                      Campaigns List
                    </Typography>
                    <Typography color="gray" className="mt-1 font-normal">
                      See information about all campaigns
                    </Typography>
                  </div>
                  <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                    <Button variant="outlined" size="sm">
                      View All
                    </Button>
                    <Button className="flex items-center gap-3" size="sm">
                      <PlusIcon strokeWidth={2} className="h-4 w-4" /> Add
                      Campaign
                    </Button>
                  </div>
                </div>
                <div className="flex flex-col  lg:items-center justify-between gap-4 lg:flex-row">
                  <Tabs value="all" className="w-full md:w-max">
                    <TabsHeader>
                      {TABS.map(({ label, value }) => (
                        <Tab key={value} value={value}>
                          &nbsp;&nbsp;{label}&nbsp;&nbsp;
                        </Tab>
                      ))}
                    </TabsHeader>
                  </Tabs>
                  <div className="w-full md:w-72">
                    <Input
                      label="Search"
                      icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardBody className="overflow-scroll px-0">
                <table className="mt-4 w-full min-w-max table-auto text-left">
                  <thead>
                    <tr>
                      {TABLE_HEAD.map((head) => (
                        <th
                          key={head}
                          className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
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
                    {campaigns.map(
                      (
                        {
                          _id,
                          influencer,
                          company,
                          campaignName,
                          status,
                          startDate,
                          endDate,
                        },
                        index
                      ) => {
                        const isLast = index === campaigns.length - 1;
                        const classes = isLast
                          ? "p-4"
                          : "p-4 border-b border-blue-gray-50";

                        return (
                          <tr key={_id}>
                            <td className={classes}>
                              <div className="flex items-center gap-3">
                                {currentUser.userType === "company" ? (
                                  <>
                                    <Avatar
                                      src={
                                        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                                      }
                                      alt={influencer.username || ""}
                                      size="sm"
                                    />
                                    <div className="flex flex-col">
                                      <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="font-normal"
                                      >
                                        {influencer.username || "Unknown"}
                                      </Typography>
                                      <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="font-normal opacity-70"
                                      >
                                        {influencer.email || "No email"}
                                      </Typography>
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <Avatar
                                      src={
                                        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                                      }
                                      alt={company.companyName || ""}
                                      size="sm"
                                    />
                                    <div className="flex flex-col">
                                      <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="font-normal"
                                      >
                                        {company.companyName || "Unknown"}
                                      </Typography>
                                      <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="font-normal opacity-70"
                                      >
                                        {company.email || "No email"}
                                      </Typography>
                                    </div>
                                  </>
                                )}
                              </div>
                            </td>
                            <td className={classes}>
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                              >
                                {campaignName}
                              </Typography>
                            </td>
                            <td className={classes}>
                              <div className="w-max">
                                <Chip
                                  variant="ghost"
                                  size="sm"
                                  value={status}
                                  color={
                                    status === "active"
                                      ? "green"
                                      : status === "pending"
                                      ? "yellow"
                                      : "red"
                                  }
                                />
                              </div>
                            </td>
                            <td className={classes}>
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                              >
                                {new Date(startDate).toLocaleDateString()}
                              </Typography>
                            </td>
                            <td className={classes}>
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                              >
                                {new Date(endDate).toLocaleDateString()}
                              </Typography>
                            </td>
                            <td className={classes}>
                              <div className="flex gap-2">
                                <Tooltip content="View Details">
                                  <IconButton
                                    variant="text"
                                    onClick={() => fetchCampaignById(_id)}
                                  >
                                    <FcViewDetails className="h-4 w-4" />
                                  </IconButton>
                                </Tooltip>
                                {currentUser.userType === "influencer" && (
                                  <div className="flex gap-2">
                                    <Tooltip content="Accept Campaign">
                                      <IconButton
                                        variant="text"
                                        color="green"
                                        onClick={() =>
                                          openConfirmationDialog(_id, "accept")
                                        }
                                        disabled={status === "active"}
                                      >
                                        <div className="flex flex-col items-center gap-2 px-2">
                                          <FcCheckmark className="h-3 w-3" />
                                          <span className="text-[10px] text-green-600">
                                            Accept
                                          </span>
                                        </div>
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip content="Reject Campaign">
                                      <IconButton
                                        variant="text"
                                        color="red"
                                        onClick={() =>
                                          openConfirmationDialog(_id, "reject")
                                        }
                                        disabled={status === "rejected"}
                                      >
                                        <div className="flex flex-col items-center gap-2 px-2">
                                          <FcCancel className="h-3 w-3" />
                                          <span className="text-[10px] text-red-600">
                                            Reject
                                          </span>
                                        </div>
                                      </IconButton>
                                    </Tooltip>
                                  </div>
                                )}
                                {currentUser.userType === "company" && (
                                  <Tooltip content="Delete Campaign">
                                    <IconButton variant="text">
                                      <TrashIcon
                                        className="h-4 w-4"
                                        color="red"
                                      />
                                    </IconButton>
                                  </Tooltip>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      }
                    )}
                  </tbody>
                </table>
              </CardBody>
              <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  Page {activePage} of {Math.ceil(campaigns.length / PAGE_SIZE)}
                </Typography>
                <DefaultPagination
                  active={currentPage}
                  setActive={handlePageChange}
                  totalPages={totalPages}
                />
              </CardFooter>
            </Card>
          )}

          <ConfirmationDialog
            isOpen={confirmationOpen}
            onClose={() => setConfirmationOpen(false)}
            onConfirm={handleConfirmation}
            title="Confirmation"
            message={`Are you sure you want to ${
              confirmationAction === "accept" ? "accept" : "reject"
            } this campaign ${
              confirmationAction === "accept"
                ? "and start collaborating with the influencer?"
                : "? This action cannot be undone. This campaign will be marked as rejected."
            }`}
          />
        </div>
      }
    />
  );
};

export default ManageCampaign;
