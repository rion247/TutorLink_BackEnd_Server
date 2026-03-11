import { NextFunction, Request, Response } from 'express';
import { TUser_role } from '../modules/Auth/auth.interface';
import catchAsync from '../utils/catchAsync';
import { StatusCodes } from 'http-status-codes';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import AppError from './../errors/AppError';
import { User } from '../modules/User/user.model';

const auth = (...requiredRoles: TUser_role[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req?.headers?.authorization;

    if (!token) {
      throw new AppError(
        StatusCodes.UNAUTHORIZED,
        'Sorry!!! You are not authorized!!!',
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(
        token,
        config.jwt_access_secret as string,
      ) as JwtPayload;
    } catch {
      throw new AppError(
        StatusCodes.UNAUTHORIZED,
        'Sorry!!! You are not authorized!!!',
      );
    }

    const { userEmail, role, iat } = decoded;

    const userData = await User.isUserExist(userEmail);

    if (!userData) {
      throw new AppError(
        StatusCodes.NOT_FOUND,
        'Sorry!!! This user is not found!!!',
      );
    }

    const userStatus = userData?.status;

    if (userStatus === 'blocked') {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        'Sorry!!! This user is already blocked !!!',
      );
    }

    if (userData?.isDeleted) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        'Sorry!!! This user is already deleted !!!',
      );
    }

    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        'Sorry!!! You are not authorized!!!',
      );
    }

    if (
      userData?.passwordChangedAt &&
      User.isUserPasswordIssuedBeforeJWTToken(
        userData?.passwordChangedAt,
        iat as number,
      )
    ) {
      throw new AppError(
        StatusCodes.UNAUTHORIZED,
        'Sorry!!! You are not authorized!!!',
      );
    }

    req.user = decoded as JwtPayload;

    next();
  });
};

export default auth;
