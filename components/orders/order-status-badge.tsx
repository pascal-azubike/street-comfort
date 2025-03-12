import { OrderStatus } from '@/types/order';
import { cn } from '@/lib/utils';

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'payment_initiated':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'payment_processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'payment_failed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'payment_successful':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'processing':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: OrderStatus) => {
    return status
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <span
      className={cn(
        'px-3 py-1 rounded-full text-sm font-medium border',
        getStatusColor(status)
      )}
    >
      {getStatusText(status)}
    </span>
  );
}
