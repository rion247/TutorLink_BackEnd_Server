import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import config from '../config';
import fs from 'fs';
import multer from 'multer';
import { UploadApiErrorResponse } from './../../../node_modules/cloudinary/types/index.d';

cloudinary.config({
  cloud_name: config.cloud_name,
  api_key: config.cloud_api_key,
  api_secret: config.cloud_api_secret,
});

export const sendImageToCloudinary = (
  imageName: string,
  path: string,
): Promise<Record<string, unknown>> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      path,
      {
        public_id: imageName.trim(),
      },
      function (
        error: UploadApiErrorResponse | undefined,
        result: UploadApiResponse | undefined,
      ) {
        if (error) {
          return reject(error);
        }

        if (!result) {
          return reject(new Error('Upload failed'));
        }

        resolve(result as UploadApiResponse);

        fs.unlink(path, (err) => {
          if (err) {
            console.log('Error deleted.', err);
          } else {
            console.log('File is deleted.');
          }
        });
      },
    );
  });
};

export const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.cwd() + '/uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  },
});

export const upload = multer({ storage: storage });
