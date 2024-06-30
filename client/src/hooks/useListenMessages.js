// import { useEffect } from "react";
// import { useDispatch } from "react-redux";

// import notificationSound from "../assets/sounds/notification.mp3";
// import { setSendMessageSuccess } from "../redux/chat/chatSlice";
// import { useSocketContext } from "../context/SocketContext";

// const useListenMessages = () => {
//   const { socket } = useSocketContext();
//   const dispatch = useDispatch();

//   useEffect(() => {
//     const handleNewMessage = (newMessage) => {
//       newMessage.shouldShake = true;
//       const sound = new Audio(notificationSound);
//       sound.play();
//       dispatch(setSendMessageSuccess(newMessage));
//     };

//     if (socket) {
//       socket.on("newMessage", handleNewMessage);
//     }

//     return () => {
//       if (socket) {
//         socket.off("newMessage", handleNewMessage);
//       }
//     };
//   }, [socket, dispatch]);
// };

// export default useListenMessages;
