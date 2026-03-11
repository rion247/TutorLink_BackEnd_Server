import { Request, Response, Router, NextFunction } from 'express';
import { upload } from '../../utils/sendImageToCloudinary';
import validateRequest from '../../middleware/validateRequest';
import { studentValidationSchemas } from '../Student/student.validation';
import { UserController } from './user.controller';
import { adminValidationSchemas } from '../Admin/admin.validation';
import { tutorValidationSchemas } from '../Tutor/tutor.validation';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../Auth/auth.constant';

const router = Router();

router.post(
  '/create-student',
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(studentValidationSchemas.studentValidationSchemaforCreate),
  UserController.createStudent,
);

router.post(
  '/create-admin',
  auth(USER_ROLE.admin),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(adminValidationSchemas.adminValidationSchemaforCreate),
  UserController.createAdmin,
);

router.post(
  '/create-tutor',
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(tutorValidationSchemas.tutorValidationSchemaforCreate),
  UserController.createTutor,
);

router.get(
  '/get-me',
  auth(USER_ROLE.student, USER_ROLE.admin, USER_ROLE.tutor),
  UserController.getMe,
);

export const UserRoutes = router;
