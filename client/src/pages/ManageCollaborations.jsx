import React, { useEffect, useState, useCallback } from "react";
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
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { FcCancel, FcCheckmark, FcViewDetails } from "react-icons/fc";
import MainStructure from "./brand/MainStructure";
import DefaultPagination from "../components/DefaultPagination";
import { formatRelativeTime } from "../helper/formatRelativeTime";
import ConfirmationDialog from "../components/ConfirmationDialog";
import { postToAuthAPI } from "../helper/postToAuthAPI";
import { useNavigate } from "react-router-dom";
import ViewDetailDialog from "../components/ViewDetailDialog";
import { RiUserUnfollowFill } from "react-icons/ri";
const TABS = [
  { label: "All", value: "all" },
  { label: "Accepted", value: "accepted" },
  { label: "Pending", value: "pending" },
  { label: "Rejected", value: "rejected" },
];

const PAGE_SIZE = 10;

const ManageCollaborations = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [state, setState] = useState({
    collaborations: [],
    selectedCollaboration: null,
    activePage: 1,
    totalPages: 1,
    currentPage: 1,
    loading: true,
    dialogOpen: false,
    dialogAction: "",
    dialogTitle: "",
    dialogMessage: "",
    selectedCollaborationId: null,
  });
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleOpen = (user) => {
    setSelectedUser(user);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };
  const fetchCollaborations = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/collaborations?page=${state.activePage}&pageSize=${PAGE_SIZE}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch collaborations");
      }

      const data = await response.json();

      const sortedCollaborations = data.collaborations.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      setState((prevState) => ({
        ...prevState,
        collaborations: sortedCollaborations,
        totalPages: data.totalPages,
        currentPage: data.currentPage,
        loading: false,
      }));
    } catch (error) {
      console.error("Error fetching collaborations:", error);
      setState((prevState) => ({
        ...prevState,
        loading: false,
      }));
    }
  }, [state.activePage]);

  useEffect(() => {
    fetchCollaborations();
  }, [fetchCollaborations]);

  const handlePageChange = (page) => {
    setState((prevState) => ({
      ...prevState,
      activePage: page,
    }));
  };

  const tableHead = () => {
    if (currentUser.userType === "influencer") {
      return [
        "Company",
        "Status",
        "Requested At",
        "", // Accept/Reject buttons column
      ];
    } else if (currentUser.userType === "company") {
      return ["Influencer", "Status", "Requested At", ""];
    }
    return [];
  };

  const openDialog = (action, collaborationId) => {
    let dialogTitle = "";
    let dialogMessage = "";

    switch (action) {
      case "accept":
        dialogTitle = "Confirm Acceptance";
        dialogMessage =
          "Are you sure you want to accept this collaboration request? This action cannot be undone.";
        break;
      case "reject":
        dialogTitle = "Confirm Rejection";
        dialogMessage =
          "Are you sure you want to reject this collaboration request? This action cannot be undone.";
        break;
      case "request-back":
        dialogTitle = "Confirm Request Back";
        dialogMessage =
          "Are you sure you want to request back this collaboration? This action cannot be undone.";
        break;
      default:
        return;
    }

    setState((prevState) => ({
      ...prevState,
      dialogOpen: true,
      dialogAction: action,
      dialogTitle,
      dialogMessage,
      selectedCollaborationId: collaborationId,
    }));
  };

  const closeDialog = () => {
    setState((prevState) => ({
      ...prevState,
      dialogOpen: false,
      selectedCollaborationId: null,
    }));
  };

  const handleCollaborationAction = async () => {
    setIsLoading(true);
    const { dialogAction, selectedCollaborationId } = state;
    const formData = {
      status: dialogAction,
      collaborationId: selectedCollaborationId,
    };
    const apiPath = "/api/collaborations/respond";
    try {
      const response = await postToAuthAPI(apiPath, formData);

      console.log(response);
      if (!response.ok) {
        throw new Error(`Failed to ${dialogAction} collaboration`);
      }

      fetchCollaborations();
    } catch (error) {
      console.error(`Error ${dialogAction} collaboration:`, error);
    } finally {
      closeDialog();
      setIsLoading(false);
    }
  };

  return (
    <MainStructure
      content={
        <div>
          {state.selectedCollaboration ? (
            <div>{/* Display detailed collaboration information */}</div>
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
                      Collaborations List
                    </Typography>
                    <Typography color="gray" className="mt-1 font-normal">
                      See information about all collaborations
                    </Typography>
                  </div>
                  <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                    <Button variant="outlined" size="sm">
                      View All
                    </Button>
                    {/* Add Collaboration button or other actions */}
                  </div>
                </div>
                <div className="flex flex-col lg:items-center justify-between gap-4 lg:flex-row">
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
              {state.loading ? (
                <>
                  <CardBody className="">
                    <Typography>Loading...</Typography>
                  </CardBody>
                </>
              ) : (
                <>
                  <CardBody className="overflow-scroll px-0">
                    <table className="mt-4 w-full min-w-max table-auto text-left">
                      <thead>
                        <tr>
                          {tableHead().map((head, index) => (
                            <th
                              key={index}
                              className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                            >
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="leading-none opacity-70 font-bold"
                              >
                                {head}
                              </Typography>
                            </th>
                          ))}
                        </tr>
                      </thead>

                      <tbody>
                        {state.collaborations.map(
                          ({ _id, status, createdAt, company, influencer }) => {
                            const isLast =
                              state.collaborations.indexOf(_id) ===
                              state.collaborations.length - 1;
                            const classes = isLast
                              ? "p-4"
                              : "p-4 border-b border-blue-gray-50";

                            const name =
                              currentUser.userType === "influencer"
                                ? company.companyName
                                : `${influencer.firstName} ${influencer.lastName} `;

                            const selectedUser =
                              currentUser.userType === "influencer"
                                ? company
                                : influencer;
                            currentUser.userType === "influencer"
                              ? company.companyName
                              : `${influencer.firstName} ${influencer.lastName} `;

                            const userProfile =
                              "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

                            return (
                              <tr key={_id}>
                                <td className={classes}>
                                  <div
                                    className="flex items-center gap-3 hover:bg-gray-50"
                                    onClick={() => handleOpen(selectedUser)}
                                  >
                                    <Avatar
                                      src={userProfile}
                                      alt={name}
                                      size="sm"
                                    />
                                    <div className="flex flex-col">
                                      <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="font-normal"
                                      >
                                        {name}
                                      </Typography>
                                      <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="font-normal opacity-70"
                                      >
                                        {currentUser.userType === "influencer"
                                          ? company.email
                                          : toUser.email}
                                      </Typography>
                                    </div>
                                  </div>
                                </td>
                                <td className={classes}>
                                  <div className="w-max">
                                    <Chip
                                      variant="ghost"
                                      size="sm"
                                      value={status}
                                      color={
                                        status === "accepted"
                                          ? "green"
                                          : status === "pending"
                                          ? "blue"
                                          : "red"
                                      }
                                    />
                                  </div>
                                </td>
                                <td className={classes}>
                                  <div className="w-max">
                                    <Typography
                                      variant="small"
                                      color="blue-gray"
                                      className="font-normal"
                                    >
                                      {formatRelativeTime(createdAt)}
                                    </Typography>
                                  </div>
                                </td>

                                {currentUser.userType === "influencer" && (
                                  <td className={classes}>
                                    <div className="flex gap-6">
                                      <Tooltip
                                        content="Accept Collaboration"
                                        className="px-4"
                                      >
                                        <IconButton
                                          variant="text"
                                          color="green"
                                          onClick={() =>
                                            openDialog("accept", _id)
                                          }
                                          disabled={status === "accepted"}
                                        >
                                          <div className="flex flex-col items-center gap-2 px-2">
                                            <FcCheckmark className="h-3 w-3" />
                                            <span className="text-[10px] text-green-600">
                                              Accept
                                            </span>
                                          </div>
                                        </IconButton>
                                      </Tooltip>
                                      <Tooltip
                                        content="Reject Collaboration"
                                        className="px-4"
                                      >
                                        <IconButton
                                          variant="text"
                                          color="red"
                                          onClick={() =>
                                            openDialog("reject", _id)
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
                                  </td>
                                )}
                                {currentUser.userType === "company" && (
                                  <td className={classes}>
                                    <div className="flex gap-6">
                                      <Tooltip
                                        content="Request Back Collaboration"
                                        className="px-4"
                                      >
                                        <IconButton
                                          variant="text"
                                          color="red"
                                          onClick={() =>
                                            openDialog("request-back", _id)
                                          }
                                        >
                                          <div className="flex flex-col items-center gap-2 px-2">
                                            <RiUserUnfollowFill className="h-3 w-3" />
                                            <span className="text-[10px] text-red-600">
                                              Request Back
                                            </span>
                                          </div>
                                        </IconButton>
                                      </Tooltip>
                                    </div>
                                  </td>
                                )}
                              </tr>
                            );
                          }
                        )}
                      </tbody>
                    </table>
                  </CardBody>
                  <CardFooter className="flex items-center justify-center border-t border-blue-gray-50 p-4">
                    <DefaultPagination
                      currentPage={state.currentPage}
                      totalPages={state.totalPages}
                      onPageChange={handlePageChange}
                    />
                  </CardFooter>
                </>
              )}
            </Card>
          )}
          <ConfirmationDialog
            isOpen={state.dialogOpen}
            onClose={closeDialog}
            onConfirm={handleCollaborationAction}
            title={state.dialogTitle}
            message={state.dialogMessage}
          />
          <ViewDetailDialog
            isOpen={isOpen}
            onClose={handleClose}
            userInfo={selectedUser}
          />
        </div>
      }
    />
  );
};

export default ManageCollaborations;
