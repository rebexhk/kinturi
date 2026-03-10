import { useAdmin } from "@/contexts/AdminContext";

/**
 * Hook to make authenticated requests to admin edge functions
 */
export function useAdminApi() {
  const { token } = useAdmin();
  
  const baseUrl = import.meta.env.VITE_SUPABASE_PROJECT_ID
    ? `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1`
    : `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;

  const adminFetch = async (
    functionName: string,
    options: RequestInit = {}
  ) => {
    const res = await fetch(`${baseUrl}/${functionName}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        "x-admin-token": token || "",
        ...options.headers,
      },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "Request failed" }));
      throw new Error(err.error || "Request failed");
    }
    return res.json();
  };

  return { adminFetch, baseUrl, token };
}
