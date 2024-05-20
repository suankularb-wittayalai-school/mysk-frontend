import { IdConfiguration } from "google-one-tap";

/**
 * Initializes Google Identity Services with the provided callback.
 *
 * @param callback The callback to execute when a credential string is received.
 */
export default function initializeGoogle(
  callback: IdConfiguration["callback"],
) {
  const { google } = window;
  google.accounts.id.initialize({
    client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    cancel_on_tap_outside: false,
    use_fedcm_for_prompt: true,
    log_level: "info",
    callback,
  } as IdConfiguration);
}
