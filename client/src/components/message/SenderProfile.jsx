import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Avatar, Menu, MenuItem } from "@material-tailwind/react";
import React, { useState, useRef, useEffect, useMemo } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function SenderProfile({ senderImage }) {
  const selectedParticipant = useSelector(
    (state) => state.chat.selectedParticipant
  );
  const conversations = useSelector((state) => state.chat.conversations);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuButtonRef = useRef(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const participantData = useMemo(
    () =>
      conversations.find(
        (conversation) =>
          conversation.participants[0].participant._id === selectedParticipant
      ),
    [conversations, selectedParticipant]
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !menuButtonRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef, menuButtonRef]);

  if (!participantData) {
    return null; // or some loading indicator
  }

  const participant = participantData.participants[0].participant;
  const userType = participant.userType;
  const name =
    userType === "company"
      ? participant.companyName
      : `${participant.firstName} ${participant.lastName}`;
  const lastMessage = participantData.lastMessage;
  return (
    <>
      <div className="relative flex justify-between gap-3 items-center bg-gray-200 px-4 py-2 z-20">
        <div className="flex gap-3 items-center">
          <ArrowLeftIcon className="lg:hidden h-5 w-5" />
          <div className="h-10 w-10">
            <Avatar
              src={senderImage}
              alt={name}
              withBorder={true}
              className="p-0.5 border-blue-900 w-10 h-10"
            />
          </div>
          <div>
            <div className="text-sm font-medium text-secondary-500">{name}</div>
            <div className="text-xs text-secondary-400">
              {new Date(lastMessage.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        </div>

        <BsThreeDotsVertical
          ref={menuButtonRef}
          className="cursor-pointer"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        />
      </div>

      {isMenuOpen && (
        <div ref={menuRef} className="absolute right-4 bg-gray-200 z-10">
          <Menu as="div">
            <div className="py-1" role="none">
              <MenuItem
                as="button"
                className="block px-4 py-2 text-sm"
                onClick={() => navigate("/create-campaign")}
              >
                Create campaign
              </MenuItem>
              <MenuItem
                as="button"
                className="block px-4 py-2 text-sm"
                onClick={() => console.log("Menu Item 2")}
              >
                Menu Item 2
              </MenuItem>
              <MenuItem
                as="button"
                className="block px-4 py-2 text-sm"
                onClick={() => console.log("Menu Item 3")}
              >
                Menu Item 3
              </MenuItem>
            </div>
          </Menu>
        </div>
      )}
    </>
  );
}
