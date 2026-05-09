export interface Car {
  id: string;
  year: number;
  number_of_seats: number;
  drive_type: string;
  fuel_type: string;
  daily_price: number;
  power: number;
  brand: string;
  model: string;
  engine_capacity: string;
  color: string;
  transmission: string;
  fuel_usage_city: string;
  fuel_usage_outcity: string;
  image_url: string;
  index: number;
  addons: string[];
  localisation: string;
  borrowed: boolean;
}

export interface Reservation {
  car_id: string;
  user_id: string;
  date_of_receipt: Date;
  date_of_return: Date;
  place_of_receipt: string;
  place_of_return: string;
}
