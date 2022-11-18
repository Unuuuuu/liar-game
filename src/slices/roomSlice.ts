import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface RoomState {
  roomCode: string;
}

const initialState: RoomState = {
  roomCode: "",
};

const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    updateRoomCode: (state, action: PayloadAction<string>) => {
      state.roomCode = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateRoomCode } = roomSlice.actions;

export default roomSlice;
