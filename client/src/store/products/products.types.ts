type product = {
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
  mileage: string;
  traits: string[];
};

type initialStateTypes = {
  products: product[];
  status: "idle" | "loading" | "failed";
  shouldFetch: boolean;
};

export { product, initialStateTypes };
