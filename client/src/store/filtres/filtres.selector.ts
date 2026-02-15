import { stateType } from "../store";

export const selectFiltres = (state: stateType) => state.filtres;

export const selectPriceRange = (state: stateType) => ({
  minValue: state.filtres.minValue,
  maxValue: state.filtres.maxValue,
});

export const selectLocations = (state: stateType) => ({
  place_of_receipt: state.filtres.place_of_receipt,
  place_of_return: state.filtres.place_of_return,
});

export const selectDates = (state: stateType) => ({
  date_of_receipt: state.filtres.date_of_receipt,
  date_of_return: state.filtres.date_of_return,
});

export const selectAdditionalFiltres = (state: stateType) => ({
  numberOfSits: state.filtres.numberOfSits,
  fuelType: state.filtres.fuelType,
  driveType: state.filtres.driveType,
});
