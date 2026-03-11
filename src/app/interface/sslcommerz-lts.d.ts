/* eslint-disable no-unused-vars */

interface SSLCommerzResponse {
  status: string;
  failedreason?: string;
  GatewayPageURL?: string;
  tran_id?: string;
  val_id?: string;
  [key: string]: unknown;
}

declare module 'sslcommerz-lts' {
  interface SSLCommerzInit {
    new (
      store_id: string,
      store_passwd: string,
      is_live: boolean,
    ): {
      init(data: Record<string, unknown>): Promise<SSLCommerzResponse>;
    };
  }

  const SSLCommerzPayment: SSLCommerzInit;
  export = SSLCommerzPayment;
}
