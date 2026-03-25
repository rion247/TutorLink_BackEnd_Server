import { TScheduled } from './offeredSubject.interface';

export const hasTimeConflict = (
  oldScheduled: TScheduled[],
  newScheduled: TScheduled,
) => {
  for (const schedule of oldScheduled) {
    if (schedule.day === newScheduled?.day) {
      const existingStartTime = new Date(`1970-01-01T${schedule.startTime}`);
      const existingEndTime = new Date(`1970-01-01T${schedule.endTime}`);
      const newStartTime = new Date(`1970-01-01T${newScheduled.startTime}`);
      const newEndTime = new Date(`1970-01-01T${newScheduled.endTime}`);

      if (newStartTime < existingEndTime && existingStartTime < newEndTime) {
        return true;
      }
    }
  }
  return false;
};

export const calculateHour = (startTime: string, endTime: string) => {
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);

  const start = startHour * 60 + startMin;
  const end = endHour * 60 + endMin;

  const durationInMinutes = end - start;

  return durationInMinutes / 60;
};
