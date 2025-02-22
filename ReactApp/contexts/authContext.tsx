"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { PublicClientApplication, AccountInfo, InteractionRequiredAuthError, SilentRequest } from "@azure/msal-browser";
import { msalConfig, tokenRequest } from "@/app/utils/authUtils";
import { jwtDecode } from "jwt-decode";

// Extend PublicClientApplication to include removeAccount if not present in types
declare module '@azure/msal-browser' {
  interface PublicClientApplication {
    removeAccount?(account: AccountInfo): void;
  }
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: AccountInfo | null;
  roles: string[];
  login: () => Promise<boolean>;
  logout: () => void;
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ✅ Initialize MSAL instance
let msalInstance = new PublicClientApplication(msalConfig);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    // Default to localStorage value if available on mount
    const storedAuth = localStorage.getItem("isAuthenticated") === "true";
    return storedAuth || false;
  });
  const [user, setUser] = useState<AccountInfo | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) as AccountInfo : null;
  });
  const [roles, setRoles] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);

      try {
        await msalInstance.initialize();
        console.log("🔹 MSAL Initialized, Checking Cache...");
        // Clear any stale interaction state but preserve valid cache
        msalInstance.clearCache();
        const accounts = msalInstance.getAllAccounts();
        console.log("🔹 Found Accounts in Cache:", accounts);

        if (accounts.length > 0) {
          // Try to rehydrate the active account and token from cache
          const activeAccount = msalInstance.getActiveAccount() || accounts[0];
          msalInstance.setActiveAccount(activeAccount);
          console.log("🔹 Active Account Rehydrated:", activeAccount);

          const silentRequest: SilentRequest = {
            account: activeAccount,
            scopes: tokenRequest.scopes,
          };

          // Attempt silent token acquisition with a fallback for refresh
          let tokenResponse;
          try {
            tokenResponse = await msalInstance.acquireTokenSilent(silentRequest);
          } catch (error) {
            if (error instanceof InteractionRequiredAuthError) {
              console.log("🔹 Silent Token Acquisition Failed, Attempting Refresh...");
              // Handle interaction-required errors with silent refresh
              tokenResponse = await msalInstance.acquireTokenSilent({
                ...silentRequest,
                forceRefresh: true,
              });
            } else {
              throw error;
            }
          }

          // Store or update the token and user data in localStorage
          const storedToken = localStorage.getItem("accessToken");
          if (!storedToken || storedToken !== tokenResponse.accessToken) {
            console.log("🔹 Updating Access Token in LocalStorage...");
            localStorage.setItem("accessToken", tokenResponse.accessToken);
          }
          localStorage.setItem("isAuthenticated", "true");
          localStorage.setItem("user", JSON.stringify(activeAccount));
          extractRoles(tokenResponse.accessToken);
          setUser(activeAccount);
          setIsAuthenticated(true);
          console.log("🔹 Authentication State Set:", { isAuthenticated: true, user: activeAccount });
        } else {
          // Check localStorage for persisted state as a fallback
          const storedAuth = localStorage.getItem("isAuthenticated");
          if (storedAuth === "true") {
            const storedUser = JSON.parse(localStorage.getItem("user") || "null") as AccountInfo;
            if (storedUser) {
              console.log("🔹 Rehydrating from LocalStorage:", storedUser);
              msalInstance.setActiveAccount(storedUser);
              try {
                const tokenResponse = await msalInstance.acquireTokenSilent({
                  account: storedUser,
                  scopes: tokenRequest.scopes,
                });
                localStorage.setItem("accessToken", tokenResponse.accessToken);
                extractRoles(tokenResponse.accessToken);
                setUser(storedUser);
                setIsAuthenticated(true);
              } catch (error) {
                console.error("🔸 Failed to rehydrate token from localStorage:", error);
                setIsAuthenticated(false);
                setUser(null);
                localStorage.removeItem("isAuthenticated");
                localStorage.removeItem("user");
                localStorage.removeItem("accessToken");
              }
            } else {
              console.log("🔹 No Valid User in LocalStorage, Setting Unauthenticated...");
              setIsAuthenticated(false);
              setUser(null);
              localStorage.removeItem("isAuthenticated");
              localStorage.removeItem("user");
              localStorage.removeItem("accessToken");
            }
          } else {
            console.log("🔹 No Accounts Found in Cache or LocalStorage, Setting Unauthenticated...");
            setIsAuthenticated(false);
            setUser(null);
            localStorage.removeItem("isAuthenticated");
            localStorage.removeItem("user");
            localStorage.removeItem("accessToken");
          }
        }
      } catch (error) {
        console.error("Authentication initialization failed:", error);
        setIsAuthenticated(false);
        setUser(null);
        setError("Failed to initialize authentication. Please log in again.");
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
      }

      setIsInitialized(true);
      setIsLoading(false);
      console.log("🔹 Auth Context Initialized:", { isInitialized: true, isAuthenticated, user });
    };

    initializeAuth();
  }, []);

  const extractRoles = (token: string) => {
    try {
      const decoded: any = jwtDecode(token);
      console.log("🔹 Decoded Token:", decoded);
      setRoles(decoded.roles || []);
    } catch (error) {
      console.error("Failed to extract roles from token:", error);
      setRoles([]);
    }
  };

  const login = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!msalInstance) {
        msalInstance = new PublicClientApplication(msalConfig);
        await msalInstance.initialize();
      }

      // Check for and clear any ongoing interactions
      if (msalInstance.getActiveAccount() || msalInstance.getAllAccounts().length > 0) {
        msalInstance.clearCache(); // Clear cache to prevent interaction conflicts
      }

      const loginResponse = await msalInstance.loginPopup({
        scopes: tokenRequest.scopes,
        prompt: "select_account", // Keep this for initial login, but we'll ensure no prompts on logout
      });

      const account = loginResponse.account;
      msalInstance.setActiveAccount(account);

      const tokenResponse = await msalInstance.acquireTokenSilent({
        account,
        scopes: tokenRequest.scopes,
      }).catch(async (error) => {
        if (error instanceof InteractionRequiredAuthError) {
          // Fallback to popup if silent acquisition fails
          return await msalInstance.acquireTokenPopup({
            account,
            scopes: tokenRequest.scopes,
          });
        }
        throw error;
      });

      localStorage.setItem("accessToken", tokenResponse.accessToken);
      localStorage.setItem("jwtToken", loginResponse.idToken);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("user", JSON.stringify(account)); // Persist user data

      extractRoles(tokenResponse.accessToken);
      setIsAuthenticated(true);
      setUser(account);

      return true;
    } catch (error: any) {
      console.error("Login failed:", error);
      setError(error.message || "Login failed. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = () => {
    const activeAccount = msalInstance.getActiveAccount();
    if (activeAccount) {
      // Log out the specific active account silently without prompting
      msalInstance.logoutRedirect({
        account: activeAccount,
        postLogoutRedirectUri: "/login",
        onRedirectNavigate: () => {
          // Prevent the default redirect behavior if we want to handle it manually
          return false;
        },
      });
    }
    // Clear local storage and cache explicitly to ensure a fresh session and remove all accounts
    localStorage.clear();
    msalInstance.clearCache();
    // Safely remove all accounts (check if removeAccount exists)
    if (typeof msalInstance.removeAccount === "function") {
      msalInstance.getAllAccounts().forEach(account => {
        if (msalInstance.removeAccount) {
          msalInstance.removeAccount(account);
        }
      });
    } else {
      // Fallback for older MSAL versions: Clear cache, which removes accounts
      console.warn("MSAL removeAccount not available. Clearing cache instead.");
      // Remove accounts by clearing cache (older MSAL versions don't support removeAccount)
      msalInstance.clearCache();
      // Optionally, remove accounts manually from localStorage if needed
      const accounts = msalInstance.getAllAccounts();
      accounts.forEach(account => {
        localStorage.removeItem(`msal.account.${account.homeAccountId}`);
      });
    }
    setIsAuthenticated(false);
    setUser(null);
    setRoles([]);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        roles,
        login,
        logout,
        isInitialized,
        isLoading,
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