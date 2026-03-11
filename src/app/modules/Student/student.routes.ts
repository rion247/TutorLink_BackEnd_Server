import { Router } from 'express';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../Auth/auth.constant';
import { StudentController } from './student.controller';
import validateRequest from '../../middleware/validateRequest';
import { studentValidationSchemas } from './student.validation';

const router = Router();

router.patch(
  '/update-data',
  auth(USER_ROLE.student),
  validateRequest(studentValidationSchemas.studentValidationSchemaforUpdate),
  StudentController.updateStudent,
);

router.delete(
  '/delete-data',
  auth(USER_ROLE.student),
  StudentController.deleteStudent,
);

router.get(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.tutor),
  StudentController.getSingleStudent,
);

router.get(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.tutor),
  StudentController.getAllStudent,
);

export const StudentRoutes = router;
