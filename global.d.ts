declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_VERSION: string;
      NEXT_PUBLIC_SUPABASE_URL: string;
      NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
      SUPABASE_SERVICE_ROLE: string;
      NEW_ACCOUNT_DEFAULT_PASS: string;
      DISABLE_PWA: "true" | "false";
      ANALYZE: "true" | "false";
    }
  }
}
export {};
