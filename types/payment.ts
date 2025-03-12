export interface CartItem {
  _id: string;
  name: string;
  price: string;
  quantity: number;
  size: string;
  image: string;
}

export type PaymentStatus = 
  | 'pending'
  | 'processing'
  | 'successful'
  | 'failed'
  | 'cancelled';

export interface FlutterwaveConfig {
  public_key: string;
  tx_ref: string;
  amount: number;
  currency: string;
  payment_options: string;
  customer: {
    email: string;
    name: string;
    phone_number: string;
  };
  customizations: {
    title: string;
    description: string;
    logo: string;
  };
}

export interface FlutterwaveResponse {
  amount: number;
  currency: string;
  customer: {
    email: string;
    name: string;
    phone_number: string;
  };
  flw_ref: string;
  status: PaymentStatus;
  transaction_id: string;
  tx_ref: string;
  payment_type?: string;
  processor_response?: string;
  transaction_date?: string;
  meta?: {
    authorization?: {
      mode?: string;
      validate_instructions?: string;
    };
    consumer_mac?: string;
    consumer_id?: string;
  };
  narration?: string;
  payment_method?: string;
}
