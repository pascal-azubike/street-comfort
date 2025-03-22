import { cn } from "@/lib/utils";
import { useOnlineStatus } from "@/components/providers/online-status-provider";
import { format, isValid, formatDistanceToNowStrict, differenceInDays } from "date-fns";

interface UserStatusBadgeProps {
  userEmail: string;
  showLastSeen?: boolean;
  className?: string;
}

export function UserStatusBadge({ 
  userEmail, 
  showLastSeen = false,
  className 
}: UserStatusBadgeProps) {
  const { userStatuses, lastSeenTimes } = useOnlineStatus();
  const status = userStatuses[userEmail] || "offline";
  const lastSeen = lastSeenTimes[userEmail];

  const statusColors = {
    online: "bg-green-500",
    away: "bg-yellow-500",
    offline: "bg-gray-400"
  };

  const formatLastSeen = (date: Date | string | undefined) => {
    if (!date) return "";
    const dateObj = new Date(date);
    if (!isValid(dateObj)) return "";
    
    const now = new Date();
    const daysDifference = differenceInDays(now, dateObj);
    
    if (daysDifference >= 3) {
      return format(dateObj, "MMM d, yyyy"); // Show date for 3+ days ago
    }
    
    // Use strict formatting for more precise times
    return formatDistanceToNowStrict(dateObj, { 
      addSuffix: true,
      roundingMethod: 'floor'
    });
  };

  return (
    <div className={cn("flex items-center gap-2 whitespace-nowrap", className)}>
      <span 
        className={cn(
          "h-2.5 w-2.5 rounded-full shrink-0",
          statusColors[status]
        )}
      />
      <span className="text-sm font-medium capitalize">
        {status === "offline" ? "Last seen" : status}
      </span>
      {showLastSeen && status !== "online" && lastSeen && (
        <span className="text-xs text-muted-foreground truncate">
          {formatLastSeen(lastSeen)}
        </span>
      )}
    </div>
  );
}
