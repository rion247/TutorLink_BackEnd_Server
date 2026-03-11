import { Router } from 'express';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../Auth/auth.constant';
import validateRequest from '../../middleware/validateRequest';
import { subjectValidationSchemas } from './subject.validation';
import { SubjectController } from './subject.controller';

const router = Router();

router.post(
  '/create-subject',
  auth(USER_ROLE.admin),
  validateRequest(subjectValidationSchemas.subjectValidationSchemaforCreate),
  SubjectController.createSubject,
);

router.patch(
  '/:id',
  auth(USER_ROLE.admin),
  validateRequest(subjectValidationSchemas.subjectValidationSchemaforUpdate),
  SubjectController.updateSubject,
);

router.delete('/:id', auth(USER_ROLE.admin), SubjectController.deleteSubject);

router.patch(
  '/update/:id',
  auth(USER_ROLE.admin),
  validateRequest(
    subjectValidationSchemas.subjectValidationSchemaforUpdateStatus,
  ),
  SubjectController.updateStatusForSubject,
);

router.get('/:id', auth(USER_ROLE.admin), SubjectController.getSingleSubject);

router.get('/', auth(USER_ROLE.admin), SubjectController.getAllSubject);

export const SubjectRoutes = router;
