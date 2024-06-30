import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setSendMessageSuccess,
  setSendMessageFailure,
  setSendMessageStart,
} from "../redux/chat/chatSlice";

const useFetchMessages = (userId) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.chat);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        dispatch(setSendMessageStart()); // Dispatch start action
        const response = await fetch(`/api/message/${userId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        dispatch(setSendMessageSuccess(data));
      } catch (error) {
        console.error("Error fetching messages:", error);
        dispatch(setSendMessageFailure(error.message));
      }
    };

    if (userId) {
      fetchMessages();
    }
  }, [userId]);

  return { loading, error };
};

export default useFetchMessages;
