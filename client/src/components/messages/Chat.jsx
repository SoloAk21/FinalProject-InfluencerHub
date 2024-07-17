import React, { useState, useEffect, useMemo, useRef } from "react";
import { IconButton, Input, Textarea } from "@material-tailwind/react";
import { FaImage, FaSearch } from "react-icons/fa";
import { useSocketContext } from "../../context/SocketContext";
import { useSelector } from "react-redux";
import { BiSend } from "react-icons/bi";
import { postToAuthAPI } from "../../helper/postToAuthAPI";
import { formatRelativeTime } from "../../helper/formatRelativeTime";
import notificationSound from "../../assets/sounds/notificationSound.wav";
const Chat = () => {
  const { socket, onlineUsers } = useSocketContext();
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchCollaborations();
  }, [currentUser]);

  useEffect(() => {
    if (selectedParticipant) {
      fetchMessagesBetweenParticipants();
    }
  }, [selectedParticipant]);

  useEffect(() => {
    if (socket) {
      socket.on("receive_message", (newMessage) => {
        const sound = new Audio(notificationSound);
        sound.play();
        setReceivedMessages((prevMessages) => [...prevMessages, newMessage]);
      });

      return () => {
        socket.off("receive_message");
      };
    }
  }, [socket]);
  useEffect(() => {
    // Scroll to the bottom when receivedMessages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [receivedMessages]);
  const filteredMessages = useMemo(() => {
    if (selectedParticipant) {
      return receivedMessages.filter((message) => {
        return (
          (message.sender === currentUser._id &&
            message.receiver === selectedParticipant.id) ||
          (message.sender === selectedParticipant.id &&
            message.receiver === currentUser._id)
        );
      });
    }
    return [];
  }, [selectedParticipant, receivedMessages, currentUser]);

  const fetchCollaborations = async () => {
    setLoading(true);
    try {
      const endpoint =
        currentUser.userType === "influencer"
          ? "/api/collaborations/list?status=accepted"
          : "/api/collaborations/list";
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error("Failed to fetch collaborations");
      }
      const data = await response.json();
      const collaborations = data.collaborations;

      const newUsers = collaborations.map((collaboration) => {
        const participant =
          currentUser.userType === "influencer"
            ? collaboration.company
            : collaboration.influencer;
        const name =
          participant.userType === "company"
            ? participant.companyName
            : `${participant.firstName} ${participant.lastName}`;
        console.log(collaboration.lastMessage);
        return {
          id: participant._id,
          name,
          message: collaboration.lastMessage
            ? collaboration.lastMessage.content
            : "", // Display lastMessage content
          avatar: "default-avatar-url",
          date: collaboration.lastMessage
            ? new Date(collaboration.lastMessage.createdAt)
            : null,
          lastSeen: collaboration.lastSeen
            ? new Date(collaboration.lastSeen)
            : null,
          isOnline: onlineUsers.includes(participant._id),
        };
      });

      // Sort users by the date of the last message
      newUsers.sort((a, b) => (b.date && a.date ? b.date - a.date : 0));

      setUsers(newUsers);

      // Set the initially selected participant to the one with the latest message
      if (newUsers.length > 0) {
        setSelectedParticipant(newUsers[0]);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessagesBetweenParticipants = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/messages/${selectedParticipant.id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }
      const data = await response.json();
      setReceivedMessages(data.messages);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredUsers = useMemo(
    () =>
      users.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [users, searchTerm]
  );

  const sendMessage = async () => {
    if (!selectedParticipant) {
      console.error("No participant selected");
      return;
    }

    if (socket.connected && message.trim() !== "") {
      try {
        const messageData = {
          content: message,
          receiverId: selectedParticipant.id,
        };

        const response = await postToAuthAPI("/api/messages/send", messageData);
        const newMessage = await response.json();
        socket.emit("send_message", newMessage);

        setMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="flex bg-white dark:bg-gray-900">
      <div className="w-80 h-screen dark:bg-gray-800 bg-gray-100 p-2 hidden md:block">
        <div className="h-full overflow-y-auto">
          <div className="sticky top-0 z-10 bg-white pt-3">
            <div className="relative">
              <Input
                label="Search by username"
                value={searchTerm}
                onChange={handleSearch}
              />
              <FaSearch className="absolute right-3 top-3 bg-white border-none text-blue-gray-900 text-1xl z-10" />
            </div>
          </div>
          <div className="text-lg font-semibold text-gray-600 dark:text-gray-200 p-3">
            Recent
          </div>
          <div className="p-1">
            <div className="rounded-lg border dark:bg-gray-800 dark:border-gray-700">
              <div className="flow-root w-full">
                {filteredUsers.map((user) => (
                  <li
                    key={user.id}
                    className={`py-2 px-4 md:py-3 cursor-pointer ${
                      user.id === selectedParticipant?.id ? "bg-gray-100" : ""
                    }`}
                    onClick={() => setSelectedParticipant(user)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="relative flex-shrink-0">
                        <img
                          className="w-8 h-8 rounded-full"
                          src={user.avatar}
                          alt={`${user.name} image`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-thin text-blue-gray-900 truncate dark:text-white">
                          {user.name}
                        </p>
                        <p className="text-sm font-thin text-gray-500 truncate dark:text-gray-400">
                          {console.log(user)}
                        </p>
                      </div>
                      <div className="flex flex-col">
                        <div className="inline-flex justify-end text-xs font-thin text-gray-500 dark:text-white">
                          {user.isOnline
                            ? "online"
                            : user.lastSeen &&
                              formatRelativeTime(user.lastSeen)}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedParticipant ? (
        <div className="flex-grow h-screen p-2 rounded-md">
          <div className="flex-grow h-full flex flex-col">
            <div className="w-full h-15 p-1 bg-blue-400 dark:bg-gray-800 shadow-md rounded-xl rounded-bl-none rounded-br-none">
              <div className="flex p-2 align-middle items-center">
                <div className="p-2 md:hidden rounded-full mr-1 hover:bg-gray-500 text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                </div>
                <div className="border rounded-full border-white p-1/2">
                  <img
                    className="w-14 h-14 rounded-full"
                    src="https://cdn.pixabay.com/photo/2017/01/31/21/23/avatar-2027366_960_720.png"
                    alt="avatar"
                  />
                </div>
                <div className="flex-grow p-2">
                  <div className="text-md text-gray-50 font-semibold">
                    {selectedParticipant.name}
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                    <div className="text-xs text-gray-50 ml-1">
                      {selectedParticipant.isOnline ? "online" : "offline"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-full overflow-y-auto no-scrollbar">
              {filteredMessages.map((message, index) => (
                <div
                  key={index}
                  className={`${
                    message.sender === currentUser._id ? "ml-auto" : ""
                  } w-2/4 p-2 my-2 rounded-md border shadow-md ${
                    message.sender === currentUser._id
                      ? "bg-gray-400 text-gray-900"
                      : "bg-gray-100"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {message.receiver === currentUser._id && (
                      <img
                        className="w-6 h-6 rounded-full"
                        src="https://cdn.pixabay.com/photo/2017/01/31/21/23/avatar-2027366_960_720.png"
                        alt="avatar"
                      />
                    )}

                    <div className="text-sm">{message.content}</div>
                  </div>
                  <div className="text-xs text-gray-500 text-right">
                    {formatRelativeTime(new Date(message.createdAt))}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} /> {/* Scroll to this ref */}
            </div>

            <div className="flex items-center bg-gray-200 p-2 rounded-md">
              <Input
                label="Write a message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                containerProps={{ className: "grow" }}
              />
              <div className="flex items-center space-x-2 ml-2">
                <IconButton className="bg-transparent" onClick={sendMessage}>
                  <BiSend className="text-blue-500 text-xl" />
                </IconButton>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-grow h-screen flex justify-center items-center">
          <p className="text-gray-500 dark:text-gray-400">
            Select a participant to start a conversation.
          </p>
        </div>
      )}
    </div>
  );
};

export default Chat;
