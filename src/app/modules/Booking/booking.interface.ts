import { Types } from 'mongoose';

type TBookingStatus = 'pending' | 'confirmed' | 'cancelled';
type TPaymentStatus = 'paid' | 'unpaid';

export interface TBooking {
  student: Types.ObjectId;
  tutor: Types.ObjectId;
  offeredSubject: Types.ObjectId;
  bookingStatus: TBookingStatus;
  paymentStatus: TPaymentStatus;
  transactionID: string;
  isDelivered?: boolean;
}

export interface TPaymentInformation {
  tran_id: string;
  total_amount: number;
  product_name: string;
  cus_name: string;
  cus_email: string;
  cus_add1: string;
}
