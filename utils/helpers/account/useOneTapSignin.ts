import UserContext from "@/contexts/UserContext";
import { GSIStatus } from "@/pages";
import getLoggedInPerson from "@/utils/backend/account/getLoggedInPerson";
import fetchMySKProxy from "@/utils/backend/mysk/fetchMySKProxy";
import useMySKClient from "@/utils/backend/mysk/useMySKClient";
import initializeGoogle from "@/utils/helpers/account/initializeGoogle";
import renderGoogleUI from "@/utils/helpers/account/renderGoogleUI";
import saveAccessToken from "@/utils/helpers/account/saveAccessToken";
import logError from "@/utils/helpers/logError";
import useLocale from "@/utils/helpers/useLocale";
import { OAuthResponseData } from "@/utils/types/fetch";
import { User } from "@/utils/types/person";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useTranslation } from "next-i18next";
import { usePlausible } from "next-plausible";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";

/**
 * A hook to use Google Identity Services for logging in. Handles initializing,
 * rendering, and logging in with GIS.
 *
 * @param options.parentButtonId The HTML ID of the Sign in Button.
 * @param options.buttonWidth The width of the Sign in Button in pixels.
 * @param options.onStateChange Triggers when the state of the Google Sign in changes.
 * @param options.onNotFound Triggers when the account is not found.
 */
export default function useOneTapSignin(
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
   * When the Google Identity Services script is loaded, initialize Google
   * Identity Services and render the Google One Tap UI.
   */
  async function handleGoogleLoad() {
    // Initialize Google Identity Services.
    initializeGoogle(({ credential, select_by }) => {
      // Upon callback, log in with the credential string.
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
    });

    // Prompt the Google One Tap UI (or FedCM if available) and render the GSI
    // Button.
    renderGoogleUI(
      parentButtonID,
      buttonWidth,
      locale,
      () => onStateChange?.(GSIStatus.chooserShown),
      // Replace the normal GSI flow with a manual credential string prompt
      // when necessary.
      promptForManualCredential,
    );
  }

  // Handle the first mount of the component.
  // See: https://stackoverflow.com/a/55655552
  useEffect(() => {
    // If `window.google` is immediately available on mount, initialize Google
    // Identity Services right away.
    if (window.google) {
      handleGoogleLoad();
      return;
    }
    // If not, wait for the script to load before initializing Google Identity
    // Services.
    const script = document.querySelector("script[src*='accounts.google.com']");
    if (script) script.addEventListener("load", handleGoogleLoad);
  }, []);

  // Re-render the Google One Tap UI when the locale or button width changes.
  useEffect(() => {
    if (!window.google) return;
    renderGoogleUI(
      parentButtonID,
      buttonWidth,
      locale,
      () => onStateChange?.(GSIStatus.chooserShown),
      promptForManualCredential,
    );
  }, [typeof window !== "undefined" && window.google, buttonWidth, locale]);
}
