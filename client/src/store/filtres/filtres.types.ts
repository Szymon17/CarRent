export type FuelType = "Petrol" | "Diesel" | "Electric" | null;
export type DriveType = "4x4" | "Rear axle" | "Front axle" | null;

export interface FiltresState {
  minValue: number;
  maxValue: number;
  inputMinValue: number;
  inputMaxValue: number;

  place_of_receipt: string;
  place_of_return: string;

  date_of_receipt: Date;
  date_of_return: Date;

  numberOfSits: string | null;
  fuelType: FuelType;
  driveType: DriveType;
}
