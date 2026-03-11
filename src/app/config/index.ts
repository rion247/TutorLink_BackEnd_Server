import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  NODE_ENV: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALTROUNDS,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  cloud_name: process.env.CLOUD_NAME,
  cloud_api_key: process.env.CLOUD_API_KEY,
  cloud_api_secret: process.env.CLOUD_API_SECRET,
  store_id: process.env.STORE_ID,
  store_password: process.env.STORE_PASSWORD,
  store_success_url: process.env.STORE_SUCCESS_URL,
  store_fail_url: process.env.STORE_FAIL_URL,
  store_cancel_url: process.env.STORE_CANCEL_URL,
  store_ipn_url: process.env.STORE_IPN_URL,
  reset_password_ui_link: process.env.RESET_PASSWORD_UI_LINK,
  smtp_user_email: process.env.SMTP_USER_EMAIL,
  smtp_user_password: process.env.SMTP_USER_PASSWORD,
};
