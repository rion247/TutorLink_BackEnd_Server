import { Router } from 'express';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../Auth/auth.constant';
import validateRequest from '../../middleware/validateRequest';
import { reviewValidationSchemas } from './review.validation';
import { ReviewController } from './review.controller';

const router = Router();

router.post(
  '/create-review',
  auth(USER_ROLE.student),
  validateRequest(reviewValidationSchemas.reviewValidationSchemaforCreate),
  ReviewController.createReview,
);

router.patch(
  '/:id',
  auth(USER_ROLE.student),
  validateRequest(reviewValidationSchemas.reviewValidationSchemaforUpdate),
  ReviewController.updateReview,
);

router.delete('/:id', auth(USER_ROLE.student), ReviewController.deleteReview);

router.get('/:id', ReviewController.getSingleReview);
router.get('/', ReviewController.getAllReview);

export const ReviewRoutes = router;
