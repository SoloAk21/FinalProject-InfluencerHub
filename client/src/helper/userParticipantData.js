import { useSelector } from "react-redux";

export function useParticipantData(selectedParticipant) {
  const conversations = useSelector((state) => state.chat.conversations);

  const participantData = conversations.find(
    (conversation) =>
      conversation.participants[0].participant._id === selectedParticipant
  );

  if (!participantData) {
    return null;
  }

  const participant = participantData.participants[0].participant;

  return {
    participant,
  };
}
