declare global {
  namespace NodeJS {
    interface ProcessEnv {
      /**
       * The current version of MySK. Shown in Landing and Navigation Drawer.
       */
      NEXT_PUBLIC_VERSION: string;

      /**
       * The URL of the Supabase project, retrieved from Settings > API >
       * Project URL.
       */
      NEXT_PUBLIC_SUPABASE_URL: string;

      /**
       * The anon key of the Supabase project, retrieved from Settings > API >
       * Project API Keys > `anon` `public`.
       */
      NEXT_PUBLIC_SUPABASE_ANON_KEY: string;

      /**
       * The service role of the Supabase project, retrieved from Settings >
       * API > Project API Keys > `service_role` `secret`.
       */
      SUPABASE_SERVICE_ROLE: string;

      /**
       * The default password for new accounts.
       */
      NEW_ACCOUNT_DEFAULT_PASS: string;

      /**
       * Whether MySK is currently closed for maintenance. Will close off
       * access to all pages but the maintenance page.
       */
      CLOSED_FOR_MAINTENANCE: "true" | "false";

      /**
       * Whether to generate bundle size analysis files.
       *
       * @see {@link https://github.com/vercel/next.js/tree/canary/packages/next-bundle-analyzer @next/bundle-analyzer}
       */
      ANALYZE: "true" | "false";
    }
  }
}
export {};
