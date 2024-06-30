import { useState, useCallback, useEffect } from "react";
import { Textarea, IconButton } from "@material-tailwind/react";
import { FaImage } from "react-icons/fa";
import { BsEmojiSmileFill } from "react-icons/bs";
import { BiSend } from "react-icons/bi";
import { useSendMessage } from "../../hooks/useSendMessage";
import { useSelector } from "react-redux";
import { postToAuthAPI } from "../../helper/postToAuthAPI.js";

export default function ChatBoxTextArea() {
  const [message, setMessage] = useState("");
  const [collaborationId, setCollaborationId] = useState(null);
  const { loading, error, sendMessage } = useSendMessage();
  const { currentUser } = useSelector((state) => state.user);
  const selectedParticipant = useSelector(
    (state) => state.chat.selectedParticipant
  );

  useEffect(() => {
    const fetchCollaborationId = async () => {
      const userData = {
        userId1: currentUser._id,
        userId2: selectedParticipant,
      };

      try {
        const response = await postToAuthAPI(
          "/api/collaborations/findid",
          userData
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setCollaborationId(data.collaborationId);
      } catch (error) {
        console.error("Error fetching collaboration ID:", error);
      }
    };

    if (currentUser._id && selectedParticipant) {
      fetchCollaborationId();
    }
  }, [currentUser, selectedParticipant]);

  const handleSendMessage = async () => {
    if (message.trim() && collaborationId) {
      const messageData = {
        collaboration: collaborationId,
        sender: currentUser._id,
        recipient: selectedParticipant,
        content: message,
      };
      await sendMessage(messageData);
      setMessage("");
    }
  };
  return (
    <div className="relative bottom-0 z-10 w-full bg-white flex items-center gap-2 rounded-[99px] border border-gray-900/10 bg-gray-900/5 p-2">
      <IconButton variant="text" className="rounded-full">
        <FaImage className="h-4 w-4" />
      </IconButton>
      <IconButton variant="text" className="rounded-full">
        <BsEmojiSmileFill className="h-4 w-4" />
      </IconButton>
      <Textarea
        rows={1}
        resize={true}
        placeholder="Your Message"
        className="min-h-full !border-0 focus:border-transparent"
        containerProps={{ className: "grid h-full" }}
        labelProps={{ className: "before:content-none after:content-none" }}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <IconButton
        variant="text"
        className="rounded-full"
        onClick={handleSendMessage}
        disabled={loading}
      >
        <BiSend className="h-5 w-5" />
      </IconButton>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
