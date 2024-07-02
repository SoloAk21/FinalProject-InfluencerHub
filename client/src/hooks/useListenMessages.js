import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import { useDispatch, useSelector } from "react-redux";
import { setSendMessageSuccess } from "../redux/chat/chatSlice";

const useListenMessages = () => {
  const { socket } = useSocketContext();
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.chat.messages);

  useEffect(() => {
    if (socket) {
      const handleNewMessage = (message) => {
        message.shouldShake = true; // Modify message data as needed
        dispatch(setSendMessageSuccess([...messages, message]));
      };

      socket.on("newMessage", handleNewMessage);

      return () => {
        socket.off("newMessage", handleNewMessage);
      };
    }
  }, [socket, dispatch, messages]);

  return null; // You may return something else if needed
};

export default useListenMessages;
