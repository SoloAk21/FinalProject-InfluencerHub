import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  conversations: [],
  selectedParticipant: null,
  message: [],
  loading: false,
  error: null,
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setConversationsStart: (state) => {
      state.loading = true;
    },
    setConversationsSuccess: (state, action) => {
      state.conversations = action.payload;
      state.loading = false;
      state.error = null;
    },
    setConversationsFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setSelectedParticipant: (state, action) => {
      state.selectedParticipant = action.payload;
    },

    setSendMessageStart: (state) => {
      state.loading = true;
    },
    setSendMessageSuccess: (state, action) => {
      state.message = [...state.message, action.payload];
      state.loading = false;
      state.error = null;
    },
    setSendMessageFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    resetChatState: () => initialState,
  },
});

export const {
  setConversationsStart,
  setConversationsSuccess,
  setConversationsFailure,
  setSelectedParticipant,
  setSendMessageFailure,
  setSendMessageSuccess,
  setSendMessageStart,
  resetChatState,
} = chatSlice.actions;

export default chatSlice.reducer;
