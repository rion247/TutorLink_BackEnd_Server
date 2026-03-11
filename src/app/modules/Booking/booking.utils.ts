import SSLCommerzPayment from 'sslcommerz-lts';
import config from '../../config';
import { TPaymentInformation } from './booking.interface';

export const sslPayment = async (payload: TPaymentInformation) => {
  const store_is_live = false;
  const tran_id = payload?.tran_id;

  const data = {
    total_amount: payload?.total_amount,
    currency: 'BDT',
    tran_id, // use unique tran_id for each api call
    success_url: `${config.store_success_url}/${tran_id}`,
    fail_url: config.store_cancel_url,
    cancel_url: config.store_cancel_url,
    ipn_url: config.store_ipn_url,
    shipping_method: 'Courier',
    product_name: payload?.product_name,
    product_category: 'Electronic',
    product_profile: 'general',
    cus_name: payload?.cus_name,
    cus_email: payload?.cus_email,
    cus_add1: payload?.cus_add1,
    cus_add2: 'Dhaka',
    cus_city: 'Dhaka',
    cus_state: 'Dhaka',
    cus_postcode: '1000',
    cus_country: 'Bangladesh',
    cus_phone: '01711111111',
    cus_fax: '01711111111',
    ship_name: 'Customer Name',
    ship_add1: 'Dhaka',
    ship_add2: 'Dhaka',
    ship_city: 'Dhaka',
    ship_state: 'Dhaka',
    ship_postcode: 1000,
    ship_country: 'Bangladesh',
  };

  const sslcz = new SSLCommerzPayment(
    config.store_id as string,
    config.store_password as string,
    store_is_live,
  );

  const apiResponse = await sslcz.init(data);

  return apiResponse;
};
