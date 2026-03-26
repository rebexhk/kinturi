import { createContext, useContext, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

interface AdminContextType {
  isAdmin: boolean;
  token: string | null;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType>({
  isAdmin: false,
  token: null,
  login: async () => false,
  logout: () => {},
});

export function AdminProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    sessionStorage.getItem("admin_token")
  );

  const login = async (password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-auth', {
        method: 'POST',
        body: { password },
      });
      if (error) return false;
      if (data?.success && data?.token) {
        setToken(data.token);
        sessionStorage.setItem("admin_token", data.token);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setToken(null);
    sessionStorage.removeItem("admin_token");
  };

  return (
    <AdminContext.Provider value={{ isAdmin: !!token, token, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => useContext(AdminContext);
