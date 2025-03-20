"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { AccountInfo, InteractionRequiredAuthError } from "@azure/msal-browser";
import { msalInstance, tokenRequest } from "@/app/utils/authUtils";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

interface AuthContextType {
  isAuthenticated: boolean;
  user: AccountInfo | null;
  roles: string[];
  getToken: () => Promise<string | null>;
  login: () => Promise<boolean>;
  logout: (selectedAccount?: AccountInfo) => Promise<void>;
  isInitialized: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<AccountInfo | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  let tokenRefreshPromise: Promise<string | null> | null = null;

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // No need to call initialize() here; it's done in authUtils.tsx
        const accounts = msalInstance.getAllAccounts();
        console.log("🔹 Accounts in Cache:", accounts);

        if (accounts.length > 0) {
          const activeAccount = msalInstance.getActiveAccount() || accounts[0];
          msalInstance.setActiveAccount(activeAccount);
          console.log("🔹 Set Active Account:", activeAccount);

          const accessToken = await acquireTokenSilently(activeAccount);
          setToken(accessToken);
          setUser(activeAccount);
          extractRoles(accessToken);
          setIsAuthenticated(true);
          console.log("🔹 Session Rehydrated:", { user: activeAccount });
        } else {
          console.log("🔹 No Accounts Found, User Must Log In");
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error("🔸 Auth Initialization Failed:", err);
        setError("Failed to initialize authentication");
        setIsAuthenticated(false);
      } finally {
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, []);

  const acquireTokenSilently = async (
    account: AccountInfo
  ): Promise<string> => {
    try {
      const response = await msalInstance.acquireTokenSilent({
        account,
        scopes: tokenRequest.scopes,
      });
      return response.accessToken;
    } catch (err) {
      if (err instanceof InteractionRequiredAuthError) {
        console.log("🔸 Silent Token Failed, Interaction Required");
        throw err;
      }
      throw err;
    }
  };

  const extractRoles = (accessToken: string) => {
    try {
      const decoded: any = jwtDecode(accessToken);
      const tokenRoles = decoded.roles || [];
      setRoles(tokenRoles);
      console.log("🔹 Roles Extracted:", tokenRoles);
    } catch (err) {
      console.error("🔸 Failed to Decode Token for Roles:", err);
      setRoles([]);
    }
  };

  const getToken = useCallback(async (): Promise<string | null> => {
    if (!isInitialized || !isAuthenticated || !user) return null;

    if (token) {
      const decoded: any = jwtDecode(token);
      if (decoded.exp > Date.now() / 1000) {
        return token;
      }
    }

    if (tokenRefreshPromise) return tokenRefreshPromise;

    tokenRefreshPromise = (async () => {
      try {
        console.log("🔹 Refreshing Token...");
        const newToken = await acquireTokenSilently(user);
        setToken(newToken);
        extractRoles(newToken);
        return newToken;
      } catch (err) {
        console.error("🔸 Token Refresh Failed:", err);
        setIsAuthenticated(false);
        setUser(null);
        setToken(null);
        setRoles([]);
        router.push("/login");
        return null;
      } finally {
        tokenRefreshPromise = null;
      }
    })();

    return tokenRefreshPromise;
  }, [isInitialized, isAuthenticated, user, token, router]);

  const login = useCallback(async (): Promise<boolean> => {
    try {
      console.log("🔹 Starting Login...");
      const loginResponse = await msalInstance.loginPopup({
        scopes: tokenRequest.scopes,
        prompt: "select_account",
      });

      const account = loginResponse.account;
      msalInstance.setActiveAccount(account);
      const accessToken = await acquireTokenSilently(account);

      setUser(account);
      setToken(accessToken);
      extractRoles(accessToken);
      setIsAuthenticated(true);
      setError(null);
      console.log("✅ Login Successful:", account);
      router.push("/");
      return true;
    } catch (err) {
      console.error("🔸 Login Failed:", err);
      setError("Login failed. Please try again.");
      return false;
    }
  }, [router]);

  const logout = useCallback(
    async (selectedAccount?: AccountInfo) => {
      try {
        const accounts = msalInstance.getAllAccounts();
        if (accounts.length === 0) return;

        const accountToLogout =
          selectedAccount || msalInstance.getActiveAccount();
        if (!accountToLogout) return;

        console.log("🔹 Logging Out Account:", accountToLogout);
        await msalInstance.logoutRedirect({
          account: accountToLogout,
          postLogoutRedirectUri: "/login",
          onRedirectNavigate: () => false,
        });

        msalInstance.clearCache();
        localStorage.clear();

        setIsAuthenticated(false);
        setUser(null);
        setToken(null);
        setRoles([]);
        setError(null);
        router.push("/login");
      } catch (err) {
        console.error("🔸 Logout Failed:", err);
        setError("Logout failed. Please try again.");
      }
    },
    [router]
  );

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        roles,
        getToken,
        login,
        logout,
        isInitialized,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
