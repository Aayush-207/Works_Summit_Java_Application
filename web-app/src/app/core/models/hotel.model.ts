export interface Hotel {
  id?: string;
  name: string;
  description: string;
  pricePerNight: number;
  imageUrl: string;
  location: string;
  unavailableDates: string[]; // ISO date strings "YYYY-MM-DD"
  createdAt?: any;
}
