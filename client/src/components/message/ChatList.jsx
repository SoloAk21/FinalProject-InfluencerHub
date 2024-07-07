import React, { useState, useEffect, useMemo } from "react";
import { Input } from "@material-tailwind/react";
import { FaSearch } from "react-icons/fa";
import { useFetchConversations } from "../../hooks/useFetchConversations";
import { useDispatch, useSelector } from "react-redux";
import { useSocketContext } from "../../context/SocketContext";

export default function ChatList({ onSelectUser, selectedParticipant }) {
  const [searchTerm, setSearchTerm] = useState("");
  const { conversations, loading, error } = useFetchConversations();
  const [users, setUsers] = useState([]);
  const { onlineUsers } = useSocketContext();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchCollaborations = async () => {
      try {
        let endpoint = "/api/collaborations/list";
        if (currentUser.userType === "influencer") {
          endpoint += `?status=accepted`;
        }

        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error("Failed to fetch collaborations");
        }
        const data = await response.json();
        const collaborations = data.collaborations;

        console.log(conversations);
        // Update users based on fetched collaborations
        const newUsers = collaborations.map((collaboration) => {
          const participant =
            currentUser.userType === "influencer"
              ? collaboration.fromUser
              : collaboration.toUser;

          const lastMessage = collaboration.lastMessage;
          const lastSeen = participant.lastSeen;

          let name =
            participant.userType === "company"
              ? participant.companyName
              : `${participant.firstName} ${participant.lastName}`;

          return {
            id: participant._id,
            name: name,
            message: lastMessage ? lastMessage.content : "", // Adjust according to your data structure
            avatar: "default-avatar-url", // Replace with actual avatar URL if available
            date: lastMessage
              ? new Date(lastMessage.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "",
            lastSeen: lastSeen
              ? new Date(lastSeen).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "",
            isOnline: onlineUsers.includes(participant._id),
          };
        });

        setUsers(newUsers);

        // Select the latest chat (top chat) by default if no participant is selected
        if (newUsers.length > 0 && !selectedParticipant) {
          const latestParticipantId = newUsers[0].id;
          onSelectUser(latestParticipantId);
        }
      } catch (error) {
        console.error("Error fetching collaborations:", error);
      }
    };

    fetchCollaborations();
  }, [currentUser, selectedParticipant, onSelectUser, onlineUsers]);

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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return (
    <div className="overflow-y-auto no-scrollbar">
      <div className="rounded-lg border dark:bg-gray-800 dark:border-gray-700">
        <div className="sticky top-0 z-10 bg-white">
          <div className="relative">
            <Input label="Search by username" onChange={handleSearch} />
            <FaSearch className="absolute right-3 top-3 bg-white border-none text-blue-gray-900 text-1xl z-10" />
          </div>
        </div>
        <div className="flow-root w-full">
          {filteredUsers.length > 0 ? (
            <ul className="divide-y flex-1 divide-gray-200 dark:divide-blue-gray-900">
              {filteredUsers.map((user) => (
                <li
                  key={user.id}
                  className={`py-2 px-4 md:py-3 cursor-pointer ${
                    user.id === selectedParticipant ? "bg-gray-100" : ""
                  }`}
                  onClick={() => onSelectUser(user.id)}
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
                        {user.message}
                      </p>
                    </div>
                    <div className="flex flex-col">
                      <div className="inline-flex items-center text-xs font-thin text-gray-500 dark:text-white">
                        {user.isOnline ? "online" : user.date}
                      </div>
                      {user.lastSeen && (
                        <div className="inline-flex items-center text-xs font-thin text-gray-500 dark:text-white">
                          Last seen: {user.lastSeen}
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center mt-4 text-gray-500 dark:text-gray-400">
              No message found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
