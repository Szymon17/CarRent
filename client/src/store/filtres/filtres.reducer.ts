import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { FiltresState, FuelType, DriveType } from "./filtres.types";
import { tomorrow, dayAfterTomorrow } from "../../utils/basicFunctions";

export const filtresInitialState: FiltresState = {
  minValue: 0,
  maxValue: 1000,
  inputMinValue: 0,
  inputMaxValue: 1000,

  place_of_receipt: "Warszawa",
  place_of_return: "Warszawa",

  date_of_receipt: new Date(tomorrow),
  date_of_return: new Date(dayAfterTomorrow),

  numberOfSits: null,
  fuelType: null,
  driveType: null,
};

const filtresSlice = createSlice({
  name: "filtres",
  initialState: filtresInitialState,
  reducers: {
    setMinValue(state, action: PayloadAction<number>) {
      state.minValue = action.payload;
      state.inputMinValue = action.payload;
    },

    setMaxValue(state, action: PayloadAction<number>) {
      state.maxValue = action.payload;
      state.inputMaxValue = action.payload;
    },

    setInputMinValue(state, action: PayloadAction<number>) {
      state.inputMinValue = action.payload;
    },

    setInputMaxValue(state, action: PayloadAction<number>) {
      state.inputMaxValue = action.payload;
    },

    setPlaceOfReceipt(state, action: PayloadAction<string>) {
      state.place_of_receipt = action.payload;
    },

    setPlaceOfReturn(state, action: PayloadAction<string>) {
      state.place_of_return = action.payload;
    },

    setDateOfReceipt(state, action: PayloadAction<Date>) {
      state.date_of_receipt = action.payload;
    },

    setDateOfReturn(state, action: PayloadAction<Date>) {
      state.date_of_return = action.payload;
    },

    setNumberOfSits(state, action: PayloadAction<string | null>) {
      state.numberOfSits = action.payload;
    },

    setFuelType(state, action: PayloadAction<FuelType>) {
      state.fuelType = action.payload;
    },

    setDriveType(state, action: PayloadAction<DriveType>) {
      state.driveType = action.payload;
    },

    clearExtendedFiltres(state, action: PayloadAction<void>) {
      const coppyOfInitial = { ...filtresInitialState };

      coppyOfInitial.date_of_receipt = state.date_of_receipt;
      coppyOfInitial.date_of_return = state.date_of_return;
      coppyOfInitial.place_of_receipt = state.place_of_receipt;
      coppyOfInitial.place_of_return = state.place_of_return;

      return coppyOfInitial;
    },

    clearFiltres(state) {
      return filtresInitialState;
    },
  },
});

export const {
  setMinValue,
  setMaxValue,
  setInputMinValue,
  setInputMaxValue,
  setPlaceOfReceipt,
  setPlaceOfReturn,
  setDateOfReceipt,
  setDateOfReturn,
  setNumberOfSits,
  setFuelType,
  setDriveType,
  clearFiltres,
  clearExtendedFiltres,
} = filtresSlice.actions;

export default filtresSlice.reducer;
