import UserContext from "@/contexts/UserContext";
import { GSIStatus } from "@/pages";
import getLoggedInPerson from "@/utils/backend/account/getLoggedInPerson";
import fetchMySKProxy from "@/utils/backend/mysk/fetchMySKProxy";
import useMySKClient from "@/utils/backend/mysk/useMySKClient";
import saveAccessToken from "@/utils/helpers/account/saveAccessToken";
import logError from "@/utils/helpers/logError";
import useLocale from "@/utils/helpers/useLocale";
import { OAuthResponseData } from "@/utils/types/fetch";
import { User } from "@/utils/types/person";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { GsiButtonConfiguration, IdConfiguration } from "google-one-tap";
import { useTranslation } from "next-i18next";
import { usePlausible } from "next-plausible";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";

/**
 * The default width of the Google Sign in Button in pixels.
 */
const DEFAULT_BUTTON_WIDTH = 281;

/**
 * A hook to use Google Identity Services for logging in. Handles initializing,
 * rendering, and logging in with GIS.
 *
 * @param options.parentButtonId The HTML ID of the Sign in Button.
 * @param options.buttonWidth The width of the Sign in Button in pixels.
 * @param options.onStateChange Triggers when the state of the Google Sign in changes.
 * @param options.onNotFound Triggers when the account is not found.
 */
export default function useGoogleIdentityServices(
  options: Partial<{
    parentButtonID: string;
    buttonWidth: number;
    onStateChange: (state: GSIStatus) => void;
    onNotFound: () => void;
  }> = {},
) {
  const { parentButtonID, buttonWidth, onStateChange, onNotFound } = options;

  const locale = useLocale();
  const { t } = useTranslation("landing");

  const plausible = usePlausible();
  const supabase = useSupabaseClient();
  const mysk = useMySKClient();
  const { setUser, setPerson } = useContext(UserContext);
  const router = useRouter();

  /**
   * Signs the user in with a Google Identity Services credential string and
   * redirects the user afterwards.
   *
   * @param credential Credential string.
   */
  async function logInWithGoogle(credential: string) {
    onStateChange?.(GSIStatus.processing);

    // Sign in with MySK API.
    const { data, error } = await mysk.fetch<OAuthResponseData>(
      "/auth/oauth/gsi",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential }),
      },
    );
    if (error) {
      logError("logInWithGoogle", error);
      if (error.code === 401) {
        plausible("Account Not Found");
        onNotFound?.();
      }
      setTimeout(() => onStateChange?.(GSIStatus.initial), 400);
      return;
    }

    // Save the access token.
    saveAccessToken(data);

    // Set the user context.
    const { data: user } = await fetchMySKProxy<User>("/auth/user");
    if (user) setUser(user);
    const { data: person } = await getLoggedInPerson(
      supabase,
      { ...mysk, user },
      {
        detailed: true,
        includeContacts: true,
        includeCertificates: true,
      },
    );
    if (person) setPerson(person);

    if (router.asPath !== "/") await router.push("/learn");
  }

  /**
   * Prompts the user to enter the credential string manually on environments
   * where the normal Google Identity Services flow is not possible.
   */
  async function promptForManualCredential() {
    onStateChange?.(GSIStatus.chooserShown);
    setTimeout(() => {
      const credential = prompt(t("dialog.gsiUnavailable"));
      if (!credential) return;
      plausible("Log in", { props: { method: "Manual Credential String" } });
      logInWithGoogle(credential);
    }, 400);
  }

  /**
   * Initializes Google Identity Services. Should only be called once and only
   * after `window.google` is available.
   */
  async function initializeGoogle() {
    window.google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      cancel_on_tap_outside: false,
      use_fedcm_for_prompt: true,
      hd: "*", // Limit the account chooser to Workspace accounts only.
      log_level: "info",
      callback: async ({ credential, select_by }) => {
        plausible("Log in", {
          props: /btn|user/.test(select_by)
            ? select_by.includes("btn")
              ? { method: "GSI Button" }
              : { method: "Google One Tap UI" }
            : undefined,
        });
        if (process.env.NEXT_PUBLIC_ALLOW_PASTE_GOOGLE_CREDENTIAL === "true")
          console.log(
            `[Google One Tap UI] Logged in with credential \`${credential}\``,
          );
        logInWithGoogle(credential);
      },
    } as IdConfiguration);
  }

  /**
   * Prompts the Google One Tap UI.
   */
  async function promptOneTapUI() {
    window.google.accounts.id.prompt((notification) => {
      if (notification.isSkippedMoment()) plausible("Close One Tap UI");
    });
  }

  /**
   * Renders the Google Sign In (GSI) Button.
   */
  async function renderGSIButton() {
    const parentButton = parentButtonID
      ? document.getElementById(parentButtonID)
      : null;
    if (!parentButton) return;
    window.google.accounts.id.renderButton(
      parentButton,
      {
        theme: "outline",
        text: "signin_with",
        shape: "pill",
        width: buttonWidth || DEFAULT_BUTTON_WIDTH,
        locale,
        click_listener: () => onStateChange?.(GSIStatus.chooserShown),
      } as GsiButtonConfiguration,
      // Replace the normal GSI flow with a manual credential string prompt
      // when necessary.
      process.env.NEXT_PUBLIC_ALLOW_PASTE_GOOGLE_CREDENTIAL === "true" &&
        !["localhost:3000", "mysk.school"].includes(window.location.host)
        ? promptForManualCredential
        : undefined,
    );
  }

  /**
   * When the Google Identity Services script is loaded, initialize Google
   * Identity Services and render the UI components.
   */
  async function handleLoad() {
    initializeGoogle();
    promptOneTapUI();
    renderGSIButton();
  }

  // Handle the first mount of the component.
  // See: https://stackoverflow.com/a/55655552
  useEffect(() => {
    // If `window.google` is immediately available on mount, initialize Google
    // Identity Services right away.
    if (window.google) {
      handleLoad();
      return;
    }
    // If not, wait for the script to load first.
    const script = document.querySelector("script[src*='accounts.google.com']");
    if (script) script.addEventListener("load", handleLoad);
  }, []);

  // Re-render the Google One Tap UI when the locale or button width changes.
  useEffect(() => {
    if (!window.google) return;
    renderGSIButton();
  }, [typeof window !== "undefined" && window.google, buttonWidth, locale]);
}
