import React, { useEffect, useRef } from "react";
import { Avatar } from "@material-tailwind/react";
import MessageDropdown from "./MessageDropdown";
import { useSelector } from "react-redux";

export default function MessageBubble() {
  const { conversations, selectedParticipant } = useSelector(
    (state) => state.chat
  );

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversations]);

  const participantData = conversations.find(
    (conversation) =>
      conversation.participants[0].participant._id === selectedParticipant
  );

  let prevSender = null;
  return (
    <div className="">
      {participantData.messages.map((msg, index) => {
        const isUserMessage = msg.sender !== selectedParticipant;
        const alignment = isUserMessage ? "justify-end" : "justify-start";
        const textColor = isUserMessage
          ? "text-white"
          : "text-gray-900 dark:text-white";
        const bgColor = isUserMessage
          ? "bg-blue-500 dark:bg-blue-600"
          : "bg-gray-100 dark:bg-gray-700";
        const roundedStyle = isUserMessage
          ? "rounded-br-lg rounded-l-lg "
          : "rounded-bl-lg rounded-r-lg";
        const showDetails = prevSender !== msg.sender || index === 0;
        const participant = participantData.participants[0].participant;
        const userType = participant.userType;
        const name =
          userType === "company"
            ? participant.companyName
            : `${participant.firstName} ${participant.lastName}`;

        prevSender = msg.sender;

        return (
          <div
            key={msg._id}
            className={`flex flex-col gap-2.5 ${alignment} px-4`}
          >
            {!isUserMessage && showDetails && (
              <div className="flex items-center gap-2">
                <Avatar
                  src="https://buffer.com/cdn-cgi/image/w=1000,fit=contain,q=90,f=auto/library/content/images/size/w300/2023/10/free-images.jpg"
                  alt="User image"
                  className="w-8 h-8"
                />
                <span className={`text-sm font-semibold ${textColor}`}>
                  {name}
                </span>
              </div>
            )}
            <div className={`flex items-start gap-0 ${alignment}`}>
              <div
                className={`flex flex-col mb-4 w-full  max-w-[280px] md:max-w-[320px] lg:max-w-96`}
              >
                <div
                  className={`p-4 border-gray-200 ${bgColor} ${roundedStyle}`}
                >
                  <p className={`text-sm font-normal ${textColor}`}>
                    {msg.content}
                  </p>
                </div>
                <span className="text-[10px]  text-gray-500 dark:text-gray-400 self-end">
                  Delivered {new Date(msg.createdAt).toLocaleTimeString()}
                </span>
              </div>
              {!isUserMessage && showDetails && <MessageDropdown />}
            </div>
          </div>
        );
      })}

      {/* Invisible element at the end of the messages */}
      <div ref={messagesEndRef} />
    </div>
  );
}
