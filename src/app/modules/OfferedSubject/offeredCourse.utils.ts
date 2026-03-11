import {
  TAvailability,
  TNewTimeScheduled,
  TOldTimeScheduled,
} from './offeredSubject.interface';

export const hasTimeConflict = (
  oldScheduled: TOldTimeScheduled,
  newScheduled: TNewTimeScheduled,
) => {
  const oldStartTime = new Date(`1970-01-01T${oldScheduled.oldStartTime}`);
  const oldEndTime = new Date(`1970-01-01T${oldScheduled.oldEndTime}`);
  const newStartTime = new Date(`1970-01-01T${newScheduled.newStartTime}`);
  const newEndTime = new Date(`1970-01-01T${newScheduled.newEndTime}`);

  if (newStartTime < oldEndTime && newEndTime > oldStartTime) {
    return true;
  }

  return false;
};

export const selfComparisonWithNewData = (slots: TAvailability[]) => {
  for (let i = 0; i < slots.length; i++) {
    for (let j = i + 1; j < slots.length; j++) {
      if (slots[i].day === slots[j].day) {
        const oldScheduled = {
          oldStartTime: slots[i].startTime,
          oldEndTime: slots[i].endTime,
        };

        const newScheduled = {
          newStartTime: slots[j].startTime,
          newEndTime: slots[j].endTime,
        };

        if (hasTimeConflict(oldScheduled, newScheduled)) {
          return true;
        }
      }
    }
  }

  return false;
};

export const comparisonWithNewDataAndExistingData = (
  existingTimeScheduled: TAvailability[],
  slots: TAvailability[],
) => {
  for (const newSlot of slots) {
    for (const existingSlot of existingTimeScheduled) {
      if (newSlot?.day === existingSlot?.day) {
        const oldScheduled = {
          oldStartTime: existingSlot?.startTime,
          oldEndTime: existingSlot?.endTime,
        };

        const newScheduled = {
          newStartTime: newSlot?.startTime,
          newEndTime: newSlot?.endTime,
        };

        if (hasTimeConflict(oldScheduled, newScheduled)) {
          return true;
        }
      }
    }
  }

  return false;
};
