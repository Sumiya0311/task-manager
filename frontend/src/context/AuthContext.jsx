import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  loginUser,
  getCurrentUser,
} from "../api/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setUser(null);
  };

  useEffect(() => {
    const restoreSession = async () => {
      const access = localStorage.getItem("access");
      const refresh = localStorage.getItem("refresh");

      if (!access && !refresh) {
        setLoading(false);
        return;
      }

      try {
        const profile = await getCurrentUser();
        setUser(profile);
      } catch {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  useEffect(() => {
    const handleSessionExpired = () => {
      logout();
    };

    window.addEventListener(
      "auth:logout",
      handleSessionExpired
    );

    return () => {
      window.removeEventListener(
        "auth:logout",
        handleSessionExpired
      );
    };
  }, []);

  const login = async (credentials) => {
    const tokens = await loginUser(credentials);

    localStorage.setItem("access", tokens.access);
    localStorage.setItem("refresh", tokens.refresh);

    try {
      const profile = await getCurrentUser();
      setUser(profile);
      return profile;
    } catch (error) {
      logout();
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: Boolean(user),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}