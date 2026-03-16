export interface Starship {
  id: number;
  name: string;
  model: string;
  manufacturer: string;
  cost_in_credits: string;
  length: string;
  max_atmosphering_speed: string;
  crew: string;
  passengers: string;
  cargo_capacity: string;
  consumables: string;
  hyperdrive_rating: string;
  MGLT: string;
  starship_class: string;
}

export interface PagedResult<T> {
  data: T[];
  totalRecords: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export const emptyStarship: Starship = {
  id: 0,
  name: "",
  model: "",
  manufacturer: "",
  cost_in_credits: "",
  length: "",
  max_atmosphering_speed: "",
  crew: "",
  passengers: "",
  cargo_capacity: "",
  consumables: "",
  hyperdrive_rating: "",
  MGLT: "",
  starship_class: "",
};
