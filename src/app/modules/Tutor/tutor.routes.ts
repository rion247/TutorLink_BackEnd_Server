import { Router } from 'express';
import { TutorController } from './tutor.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../Auth/auth.constant';
import validateRequest from '../../middleware/validateRequest';
import { tutorValidationSchemas } from './tutor.validation';

const router = Router();

router.patch(
  '/update-data',
  auth(USER_ROLE.tutor),
  validateRequest(tutorValidationSchemas.tutorValidationSchemaforUpdate),
  TutorController.updateTutor,
);

router.delete(
  '/delete-data',
  auth(USER_ROLE.tutor),
  TutorController.deleteTutor,
);

router.get(
  '/all-tutor',
  auth(USER_ROLE.admin),
  TutorController.getAllTutorAdminQueryOnly,
);

router.get('/:id', TutorController.getSingleTutor);

router.get(
  '/all-tutor',
  auth(USER_ROLE.admin),
  TutorController.getAllTutorAdminQueryOnly,
);

router.get('/', TutorController.getAllTutor);

export const TutorRoutes = router;
