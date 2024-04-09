import AppStateContext from "@/contexts/AppStateContext";
import { GSIStatus } from "@/pages";
import useMySKClient from "@/utils/backend/mysk/useMySKClient";
import saveAccessToken from "@/utils/helpers/account/saveAccessToken";
import logError from "@/utils/helpers/logError";
import useLocale from "@/utils/helpers/useLocale";
import { OAuthResponseData } from "@/utils/types/fetch";
import va from "@vercel/analytics";
import { GsiButtonConfiguration } from "google-one-tap";
import { SignInOptions, signIn, useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useContext, useState } from "react";

/**
 * Tap into Google Sign in.
 *
 * @param options.parentButtonId The HTML ID of the Sign in Button.
 * @param options.buttonWidth The width of the Sign in Button in pixels.
 * @param options.onStateChange Triggers when the state of the Google Sign in changes.
 *
 * @see {@link SignInOptions} for more options.
 *
 * @returns Whether Google Sign in is verifying the credential string.
 */

export default function useOneTapSignin(
  options?: {
    parentButtonID?: string;
    buttonWidth?: number;
    onStateChange?: (state: GSIStatus) => void;
  } & Pick<SignInOptions, "redirect" | "callbackUrl">,
) {
  const { parentButtonID, buttonWidth, onStateChange } = options || {};

  const router = useRouter();
  const locale = useLocale();
  const { t } = useTranslation("landing");

  const mysk = useMySKClient();

  const { setAccountNotFoundOpen } = useContext(AppStateContext);

  const [loading, setLoading] = useState(false);

  /**
   * Signs the user in with a Google One Tap UI credential string and redirects
   * the user afterwards. We have to account for both NextAuth and MySK API.
   *
   * @param credential Credential string.
   */
  async function logInWithGoogle(credential: string) {
    setLoading(true);
    onStateChange?.(GSIStatus.processing);

    // Sign in with NextAuth.
    const { status } = (await signIn("googleonetap", {
      credential,
      redirect: true,
      ...options,
    }))!;
    if (status === 401) {
      setTimeout(() => onStateChange?.(GSIStatus.initial), 400);
      setAccountNotFoundOpen(true);
      return;
    }

    // Sign in with MySK API.
    const { data, error } = await mysk.fetch<OAuthResponseData>(
      "/auth/oauth/google",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: credential + "penis" }),
      },
    );
    if (error) {
      logError("logInWithGoogle", error);
      return;
    }

    saveAccessToken(data);
    if (router.asPath !== "/") await router.push("/learn");
    setLoading(false);
  }

  /**
   * Prompts the user to enter the credential string manually on environments
   * where the normal Google One Tap UI flow is not possible.
   */
  async function promptForManualCredential() {
    onStateChange?.(GSIStatus.chooserShown);
    setTimeout(() => {
      const credential = prompt(t("dialog.gsiUnavailable"));
      if (!credential) return;
      va.track("Log in", { method: "Manual Credential String" });
      logInWithGoogle(credential);
    }, 400);
  }

  // If user is unauthenticated, Google One Tap UI is initialized and rendered
  useSession({
    required: true,
    onUnauthenticated() {
      if (loading) return;

      const { google } = window;
      if (!google) return;

      // Initialize Google One Tap UI.
      google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        cancel_on_tap_outside: false,
        log_level: "info",
        callback: async ({ credential, select_by }) => {
          va.track(
            "Log in",
            /btn|user/.test(select_by)
              ? {
                  method: select_by.includes("btn")
                    ? "GSI Button"
                    : "Google One Tap UI",
                }
              : undefined,
          );
          if (process.env.NEXT_PUBLIC_ALLOW_PASTE_GOOGLE_CREDENTIAL === "true")
            console.log(
              `[Google One Tap UI] Logged in with credential \`${credential}\``,
            );
          logInWithGoogle(credential);
        },
      });

      // Render the Google One Tap UI.
      google.accounts.id.prompt();

      // Render the Google Sign In (GSI) Button if provided with an ID.
      const parentButton = parentButtonID
        ? document.getElementById(parentButtonID)
        : null;
      if (parentButton)
        google.accounts.id.renderButton(
          parentButton,
          {
            shape: "pill",
            text: "continue_with",
            width: buttonWidth,
            click_listener: () => onStateChange?.(GSIStatus.chooserShown),
            locale,
          } as GsiButtonConfiguration,
          // Replace the normal GSI flow with a manual credential string prompt
          // when necessary.
          process.env.NEXT_PUBLIC_ALLOW_PASTE_GOOGLE_CREDENTIAL === "true" &&
            !["localhost:3000", "mysk.school"].includes(window.location.host)
            ? promptForManualCredential
            : undefined,
        );
    },
  });
}
