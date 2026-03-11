import { Types } from 'mongoose';

export type TDay =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';

export interface TAvailability {
  _id: Types.ObjectId;
  day: TDay;
  startTime: string;
  endTime: string;
  duration: number;
  pricePerHour: number;
  maxCapacity: number;
  currentlyBooked: number;
}

export interface TOfferedSubject {
  tutor: Types.ObjectId;
  subject: Types.ObjectId;
  availableSlots: TAvailability[];
  isActive: boolean;
}

export interface TOldTimeScheduled {
  oldStartTime: string;
  oldEndTime: string;
}

export interface TNewTimeScheduled {
  newStartTime: string;
  newEndTime: string;
}
