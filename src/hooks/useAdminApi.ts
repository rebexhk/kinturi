import { useAdmin } from "@/contexts/AdminContext";
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook to make authenticated requests to admin edge functions
 * Uses supabase.functions.invoke to avoid preview fetch proxy issues
 */
export function useAdminApi() {
  const { token } = useAdmin();

  const adminFetch = async (
    functionNameWithParams: string,
    options: RequestInit = {}
  ) => {
    // Split "admin-retreats?id=xxx" into function name and query string
    const [functionName, queryString] = functionNameWithParams.split("?");
    
    // For GET/DELETE with query params, append them to the function path
    const method = (options.method || "GET") as string;
    
    // Build the body - parse if it's a string
    let body: any = undefined;
    if (options.body) {
      body = typeof options.body === "string" ? JSON.parse(options.body) : options.body;
    }

    // Use supabase.functions.invoke which goes through the SDK and avoids proxy issues
    const { data, error } = await supabase.functions.invoke(
      queryString ? `${functionName}?${queryString}` : functionName,
      {
        method,
        headers: {
          "x-admin-token": token || "",
        },
        body: method === "GET" || method === "DELETE" ? undefined : body,
      }
    );

    if (error) {
      throw new Error(error.message || "Request failed");
    }

    return data;
  };

  return { adminFetch, token };
}
