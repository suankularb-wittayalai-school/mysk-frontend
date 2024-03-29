declare global {
  namespace NodeJS {
    interface ProcessEnv {
      /**
       * The current version of MySK. Shown in Landing and Navigation Drawer.
       */
      NEXT_PUBLIC_VERSION: string;

      /**
       * The Google Client ID of this application, retrieved from Google Cloud
       * Console > APIs and Service > Credentials > OAuth 2.0 Client ID.
       */
      NEXT_PUBLIC_GOOGLE_CLIENT_ID: string;

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
       * The URL of the Google Form that is used to report problems with MySK.
       */
      NEXT_PUBLIC_HELP_FORM_URL: string;

      /**
       * The URL that NextAuth.js will use in redirects.
       */
      NEXTAUTH_URL: string;

      /**
       * Used to encrypt the NextAuth.js JWT, and to hash email verification
       * tokens.
       */
      NEXTAUTH_SECRET: string;

      /**
       * Whether the user is allowed to see and log in with Google credentials.
       */
      NEXT_PUBLIC_ALLOW_PASTE_GOOGLE_CREDENTIAL: "true" | "false";

      /**
       * The service role of the Supabase project, retrieved from Settings >
       * API > Project API Keys > `service_role` `secret`.
       */
      SUPABASE_SERVICE_ROLE: string;

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
