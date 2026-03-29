import { NextFunction, Request, Response, Router } from 'express';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../Auth/auth.constant';
import validateRequest from '../../middleware/validateRequest';
import { offeredSubjectValidationSchemas } from './offeredSubject.validation';
import { OfferedSubjectController } from './offeredSubject.controller';
import { upload } from '../../utils/sendImageToCloudinary';

const router = Router();

router.post(
  '/create-offered-subject',
  auth(USER_ROLE.tutor),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(
    offeredSubjectValidationSchemas.offeredSubjectValidationSchemaforCreate,
  ),
  OfferedSubjectController.createOfferedSubject,
);

router.patch(
  '/:id',
  auth(USER_ROLE.tutor),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(
    offeredSubjectValidationSchemas.availabilityValidationSchemaforUpdate,
  ),
  OfferedSubjectController.updateOfferedSubject,
);

router.delete(
  '/:id',
  auth(USER_ROLE.tutor),
  OfferedSubjectController.deleteOfferedSubject,
);

router.get('/:id', OfferedSubjectController.getSingleOfferedSubject);

router.get('/', OfferedSubjectController.getAllOfferedSubject);

export const OfferedSubjectRoutes = router;
