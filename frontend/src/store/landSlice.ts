import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LandRecord } from "@/types/land";

interface LandState {
  records: LandRecord[];
  selectedLand: LandRecord | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: LandState = {
  records: [],
  selectedLand: null,
  isLoading: false,
  error: null,
};

const landSlice = createSlice({
  name: "land",
  initialState,
  reducers: {
    setRecords(state, action: PayloadAction<LandRecord[]>) {
      state.records = action.payload;
    },
    addRecord(state, action: PayloadAction<LandRecord>) {
      state.records.push(action.payload);
    },
    setSelectedLand(state, action: PayloadAction<LandRecord | null>) {
      state.selectedLand = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
  },
});

export const { setRecords, addRecord, setSelectedLand, setLoading, setError } = landSlice.actions;
export default landSlice.reducer;
