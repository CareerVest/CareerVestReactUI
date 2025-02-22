export const msalConfig = {
    auth: {
      clientId: "3b5b4b15-81ff-4c83-a9fd-569dc8fdf282", // ✅ Backend App Registration Client ID
      authority: "https://login.microsoftonline.com/afd6b282-b8b0-4dbb-9985-f5c3249623f9", // ✅ Tenant ID
      redirectUri: "http://localhost:3000", // ✅ Ensure this is registered in Azure AD
    },
    cache: {
      cacheLocation: "localStorage", // ✅ Store tokens in local storage
      storeAuthStateInCookie: true, // ✅ Helps with cross-site scripting (XSS) prevention
    },
    system: {
      loggerOptions: {
        loggerCallback: (level: any, message: any, containsPii: any) => {
          if (!containsPii) {
            console.log(`[MSAL] ${message}`);
          }
        },
        piiLoggingEnabled: false,
      },
    },
  };
  
  export const tokenRequest = {
    scopes: [
      "api://careervest-backend/access_as_user",
    ],
  };