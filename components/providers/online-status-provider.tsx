'use client'
import { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { isValid } from "date-fns";

export type UserStatus = "online" | "away" | "offline";

interface User {
  id: string;
  name: string | null;
  email: string;
  lastActive: string | Date | null;
}

interface OnlineStatusContextType {
  userStatuses: Record<string, UserStatus>;
  currentUserStatus: UserStatus;
  lastSeenTimes: Record<string, Date>;
}

const OnlineStatusContext = createContext<OnlineStatusContextType>({
  userStatuses: {},
  currentUserStatus: "offline",
  lastSeenTimes: {},
});

export const useOnlineStatus = () => useContext(OnlineStatusContext);

const calculateStatus = (lastActive: Date | string | null): UserStatus => {
  if (!lastActive) return "offline";
  
  const lastActiveDate = new Date(lastActive);
  if (!isValid(lastActiveDate)) return "offline";

  const now = new Date();
  const diffInMinutes = (now.getTime() - lastActiveDate.getTime()) / 1000 / 60;

  if (diffInMinutes < 5) return "online";
  if (diffInMinutes < 15) return "away";
  return "offline";
};

export const OnlineStatusProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();
  const [userStatuses, setUserStatuses] = useState<Record<string, UserStatus>>({});
  const [lastSeenTimes, setLastSeenTimes] = useState<Record<string, Date>>({});

  useEffect(() => {
    if (!session?.user?.email) return;

    const updateStatus = async () => {
      try {
        await fetch("/api/users/status", { method: "POST" });
      } catch (error) {
        console.error("Failed to update status:", error);
      }
    };

    const fetchStatuses = async () => {
      try {
        const response = await fetch("/api/users/status");
        const users: User[] = await response.json();
        
        const newStatuses: Record<string, UserStatus> = {};
        const newLastSeen: Record<string, Date> = {};
        
        users.forEach(user => {
          if (user.lastActive) {
            const lastActiveDate = new Date(user.lastActive);
            if (isValid(lastActiveDate)) {
              newStatuses[user.email] = calculateStatus(lastActiveDate);
              newLastSeen[user.email] = lastActiveDate;
            } else {
              newStatuses[user.email] = "offline";
            }
          } else {
            newStatuses[user.email] = "offline";
          }
        });

        setUserStatuses(newStatuses);
        setLastSeenTimes(newLastSeen);
      } catch (error) {
        console.error("Failed to fetch statuses:", error);
      }
    };

    // Initial update and fetch
    updateStatus();
    fetchStatuses();

    // Set up polling intervals
    const updateInterval = setInterval(updateStatus, 60000); // Every minute
    const fetchInterval = setInterval(fetchStatuses, 30000); // Every 30 seconds

    return () => {
      clearInterval(updateInterval);
      clearInterval(fetchInterval);
    };
  }, [session?.user?.email]);

  const currentUserStatus = session?.user?.email 
    ? userStatuses[session.user.email] || "offline"
    : "offline";

  return (
    <OnlineStatusContext.Provider 
      value={{ 
        userStatuses, 
        currentUserStatus,
        lastSeenTimes
      }}
    >
      {children}
    </OnlineStatusContext.Provider>
  );
};
