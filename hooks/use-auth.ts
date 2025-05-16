import { signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useAuth() {
  const router = useRouter();

  const login = async (email: string, password: string) => {
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Invalid email or password");
        return false;
      }

      toast.success("Logged in successfully");
      router.refresh();
      return true;
    } catch (error) {
      console.error("[AUTH_ERROR]", error);
      toast.error("Something went wrong");
      return false;
    }
  };

  const logout = async () => {
    try {
      // Get the current session token from the cookie
      const cookies = document.cookie.split(';');
      const sessionTokenCookie = cookies.find(cookie => 
        cookie.trim().startsWith('next-auth.session-token=')
      );
      const sessionToken = sessionTokenCookie?.split('=')[1];

      if (sessionToken) {
        // Call our API to expire the session
        await fetch('/api/auth/expire-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-session-token': sessionToken
          }
        });
      }

      // Proceed with NextAuth signOut
      await signOut({ redirect: false });
      
      toast.success("Logged out successfully");
      router.refresh();
      router.push('/');
    } catch (error) {
      console.error("[LOGOUT_ERROR]", error);
      toast.error("Error during logout");
    }
  };

  return {
    login,
    logout
  };
}
