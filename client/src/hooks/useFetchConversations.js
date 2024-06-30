import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setConversationsFailure,
  setConversationsStart,
  setConversationsSuccess,
} from "../redux/chat/chatSlice";
// useFetchConversations hook
export function useFetchConversations() {
  const dispatch = useDispatch();
  const { conversations, loading, error } = useSelector((state) => state.chat);

  useEffect(() => {
    const fetchData = async () => {
      dispatch(setConversationsStart());
      try {
        const response = await fetch("/api/conversations");
        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }
        dispatch(setConversationsSuccess(data));
      } catch (error) {
        dispatch(setConversationsFailure(error.message));
      }
    };

    fetchData();
  }, [dispatch]);

  return { conversations, loading, error };
}
