import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const notFound = (req: Request, res: Response) => {
  const statusCode = StatusCodes.NOT_FOUND;
  const message = 'Sorry!!! API Not Found!!!';

  res.status(statusCode).json({
    success: false,
    message,
    error: '',
  });
};

export default notFound;
