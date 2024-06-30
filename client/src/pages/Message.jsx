import React, { useState, useEffect } from "react";
import ChatBoxTextArea from "../components/message/ChatBoxTextArea";
import MessageBubble from "../components/message/MessageBubble";
import SenderProfile from "../components/message/SenderProfile";
import MainStructure from "./brand/MainStructure";
import ChatList from "../components/message/ChatList";
import { useSelector } from "react-redux";

import { useDispatch } from "react-redux";
import { setSelectedParticipant } from "../redux/chat/chatSlice";

export default function Message() {
  const dispatch = useDispatch();
  const selectedParticipant = useSelector(
    (state) => state.chat.selectedParticipant
  );
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSelectUser = (userId) => {
    dispatch(setSelectedParticipant(userId));
  };

  return (
    <MainStructure
      content={
        <div className="flex h-screen">
          {isSmallScreen ? (
            selectedParticipant ? (
              <div className="flex flex-col h-full w-full">
                {/* Top Sender Profile */}
                <div className="sticky top-0 z-10 w-full bg-white">
                  <SenderProfile
                    senderImage={
                      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    }
                  />
                </div>

                {/* Message List */}
                <div className="flex-grow overflow-y-auto no-scrollbar">
                  <MessageBubble />
                </div>

                {/* Bottom Chat Box Text Area */}
                <div className="sticky bottom-0 z-10 w-full bg-white p-4">
                  <ChatBoxTextArea />
                </div>
              </div>
            ) : (
              <ChatList
                onSelectUser={handleSelectUser}
                selectedParticipant={selectedParticipant}
              />
            )
          ) : (
            <>
              <div className="w-1/3 border-r border-gray-200">
                <ChatList
                  onSelectUser={handleSelectUser}
                  selectedParticipant={selectedParticipant}
                />
              </div>
              <div className="flex flex-col w-2/3">
                {/* Top Sender Profile */}
                <div className="sticky top-0 z-10 w-full bg-white">
                  <SenderProfile
                    senderImage={
                      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    }
                  />
                </div>
                {/* Message List */}
                <div className="flex-grow overflow-y-auto no-scrollbar">
                  <MessageBubble />
                </div>

                {/* Bottom Chat Box Text Area */}
                <div className="sticky bottom-0 z-10 w-full bg-white p-4">
                  <ChatBoxTextArea />
                </div>
              </div>
            </>
          )}
        </div>
      }
    />
  );
}
