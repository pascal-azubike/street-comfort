import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatNairaPrice = (price: string) => {
  const number = parseInt(price, 10);
  return new Intl.NumberFormat('en-NG', {
    maximumFractionDigits: 0
  }).format(number);
};

export function generateTransactionRef(orderId?: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  const prefix = 'SC';
  
  return orderId 
    ? `${prefix}_${orderId}_${timestamp}`
    : `${prefix}_${timestamp}_${random}`;
}

export const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};
