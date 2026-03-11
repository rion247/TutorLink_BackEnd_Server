import { Tutor } from '../Tutor/tutor.model';

const tutorApprovalInToDB = async (id: string) => {
  const result = await Tutor.findByIdAndUpdate(
    id,
    { isApproved: true },
    { new: true, runValidators: true },
  );

  return { result };
};

export const AdminService = {
  tutorApprovalInToDB,
};
