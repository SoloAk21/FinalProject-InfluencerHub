import { useState } from "react";
import { useSelector } from "react-redux";
import { postToAuthAPI } from "../helper/postToAuthAPI";

export function useSendMessage() {
  const { selectedParticipant } = useSelector((state) => state.chat);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = async (messageData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await postToAuthAPI(`/api/messages/send`, messageData);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success === false) {
        throw new Error(data.message);
      }

      console.log(data);
    } catch (error) {
      console.log(error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, sendMessage };
}
