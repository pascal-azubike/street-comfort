import { PaymentStatus } from './payment'

export type OrderStatus =
  | 'pending'
  | 'payment_initiated'
  | 'payment_processing'
  | 'payment_failed'
  | 'payment_successful'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export type DeliveryStatus = 
  | 'not-started'
  | 'in-progress'
  | 'delivered'
  | 'cancelled';

export interface Order {
  _id: string;
  userId: string;
  amount: number;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  deliveryStatus: DeliveryStatus;
  createdAt: string;
  updatedAt: string;
  orderItems: any[]; // Define proper type based on your needs
  paymentId?: string;
  transactionRef?: string;
  address: {
    type: string;
    label: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    landmark?: string;
    instructions?: string;
  };
  paymentData?: {
    verificationResult?: string;
    verifiedAt?: string;
    flutterwaveResponse?: any;
    processorResponse?: string;
    lastVerificationAttempt?: string;
    cancellationReason?: string;
  };
  deliveryDetails?: {
    isDelivered: boolean;
    deliveredAt: string | null;
    estimatedDeliveryDate: string | null;
    trackingNumber: string | null;
  };
  paymentType?: string;
} 