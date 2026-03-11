import { Router } from 'express';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../Auth/auth.constant';
import { AdminController } from './admin.controller';

const router = Router();

router.patch(
  '/tutor-approval/:tutorId',
  auth(USER_ROLE.admin),
  AdminController.tutorApproval,
);

export const AdminRoutes = router;
