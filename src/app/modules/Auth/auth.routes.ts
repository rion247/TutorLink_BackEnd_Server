import { Router } from 'express';
import validateRequest from '../../middleware/validateRequest';
import { authValidationSchemas } from './auth.validation';
import { AuthController } from './auth.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from './auth.constant';

const router = Router();

router.post(
  '/login',
  validateRequest(authValidationSchemas.loginUserValidationSchema),
  AuthController.loginUser,
);

router.post(
  '/change-password',
  auth(USER_ROLE.admin, USER_ROLE.student, USER_ROLE.tutor),
  validateRequest(authValidationSchemas.changeUserPasswordValidationSchema),
  AuthController.changeUserPassword,
);

router.post(
  '/forget-password',
  validateRequest(authValidationSchemas.forgetPasswordValidationSchema),
  AuthController.forgetPassword,
);

router.post(
  '/refresh-token',
  validateRequest(authValidationSchemas.refreshTokenValidationSchema),
  AuthController.refreshToken,
);

router.post(
  '/reset-password',
  validateRequest(authValidationSchemas.resetPasswordValidationSchema),
  AuthController.resetPassword,
);

export const AuthRoutes = router;
