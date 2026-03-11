import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AdminService } from './admin.service';

const tutorApproval = catchAsync(async (req, res) => {
  const { tutorId } = req.params;
  const result = await AdminService.tutorApprovalInToDB(tutorId as string);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Tutor ID approved successfully!!!',
    data: result?.result,
  });
});

export const AdminController = {
  tutorApproval,
};
