import { Types } from 'mongoose';

export type TDay =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';

export interface TOfferedSubject {
  tutor: Types.ObjectId;
  offeredSubjectImage?: string;
  subject: Types.ObjectId;
  day: TDay;
  startTime: string;
  endTime: string;
  duration: number;
  pricePerHour: number;
  maxCapacity: number;
  currentlyBooked: number;
  isActive: boolean;
}

export interface TScheduled {
  day: TDay;
  startTime: string;
  endTime: string;
}

export interface TOfferedSubjectForUpdate {
  offeredSubjectImage?: string;
  day: TDay;
  startTime: string;
  endTime: string;
  pricePerHour?: number;
  maxCapacity?: number;
}
