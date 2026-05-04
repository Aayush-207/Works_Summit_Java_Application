export interface Booking {
  id?: string;
  hotelId: string;
  hotelName: string;
  reservedDate: string;
  reservedForUser: string;
  amountPaid: number;
  bookedAt?: any;
}
