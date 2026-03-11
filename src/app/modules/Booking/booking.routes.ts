import { Router } from 'express';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../Auth/auth.constant';
import validateRequest from '../../middleware/validateRequest';
import { BookingValidationSchemas } from './booking.validation';
import { BookingController } from './booking.controller';

const router = Router();

router.get(
  `/get-my-booking`,
  auth(USER_ROLE.student, USER_ROLE.tutor),
  BookingController.getMyBooking,
);

router.post(
  '/create-booking',
  auth(USER_ROLE.student),
  validateRequest(BookingValidationSchemas.bookingValidationSchemasforCreate),
  BookingController.createBooking,
);

router.post(`/payment/success/:tran_id`, BookingController.confirmPayment);
router.post(`/payment/fail/:tran_id`, BookingController.paymentFailed);

router.patch(
  `/change-delivered-status/:id`,
  auth(USER_ROLE.tutor),
  BookingController.updateMyBookingDeliveredStatus,
);

router.get(`/:id`, auth(USER_ROLE.admin), BookingController.getSingleBooking);
router.get(`/`, auth(USER_ROLE.admin), BookingController.getAllBooking);

export const BookingRoutes = router;
