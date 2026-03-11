import { Router } from 'express';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../Auth/auth.constant';
import validateRequest from '../../middleware/validateRequest';
import { offeredSubjectValidationSchemas } from './offeredSubject.validation';
import { OfferedSubjectController } from './offeredSubject.controller';

const router = Router();

router.post(
  '/create-offered-subject',
  auth(USER_ROLE.tutor),
  validateRequest(
    offeredSubjectValidationSchemas.offeredSubjectValidationSchemaforCreate,
  ),
  OfferedSubjectController.createOfferedSubject,
);

router.delete(
  '/:id',
  auth(USER_ROLE.tutor),
  OfferedSubjectController.deleteOfferedSubject,
);

router.patch(
  '/:id/update-available-slot/:slotId',
  auth(USER_ROLE.tutor),
  validateRequest(
    offeredSubjectValidationSchemas.availabilityValidationSchemaforUpdate,
  ),
  OfferedSubjectController.updateOfferedSubject,
);

router.get('/:id', OfferedSubjectController.getSingleOfferedSubject);

router.get('/', OfferedSubjectController.getAllOfferedSubject);

export const OfferedSubjectRoutes = router;
