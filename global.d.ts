declare global {
  namespace NodeJS {
    interface ProcessEnv {
      /**
       * The current version of MySK. Shown in Landing and Navigation Drawer.
       */
      NEXT_PUBLIC_VERSION: string;

      /**
       * The timezone of the school, in IANA format.
       * 
       * @see {@link https://en.wikipedia.org/wiki/List_of_tz_database_time_zones List of tz database time zones}
       */
      NEXT_PUBLIC_SCHOOL_TZ: string;

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
       * The URL of the MySK API.
       */
      NEXT_PUBLIC_MYSK_API_URL: string;

      /**
       * The URL of the Google Form that is used to report problems with MySK.
       */
      NEXT_PUBLIC_HELP_FORM_URL: string;

      /**
       * Whether the user is allowed to see and log in with Google credentials.
       */
      NEXT_PUBLIC_ALLOW_PASTE_GOOGLE_CREDENTIAL: "true" | "false";

      /**
       * The service role of the Supabase project, retrieved from Settings >
       * API > Project API Keys > `service_role` `secret`.
       * 
       * **Important**: This is a secret key. Do not expose it to the client.
       */
      SUPABASE_SERVICE_ROLE: string;

      /**
       * The API key for accessing the MySK API.
       * 
       * **Important**: This is a secret key. Do not expose it to the client.
       */
      MYSK_API_KEY: string;

      /**
       * Whether MySK is currently closed for maintenance. Will close off
       * access to all pages but the maintenance page.
       */
      CLOSED_FOR_MAINTENANCE: "true" | "false";


      /**
       * The date to open attendnace system in special weekends. Currently 
       * limited to only one date per time.
       * 
       * **To-do**: Deprecate this ASAP and use arrays from a database instead.
       */
      NEXT_PUBLIC_ATTENDANCE_SPECIAL_DATE: string
    }
  }
}

export {};
