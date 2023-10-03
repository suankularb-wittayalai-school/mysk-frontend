// Imports
import AppStateContext from "@/contexts/AppStateContext";
import useLocale from "@/utils/helpers/useLocale";
import va from "@vercel/analytics";
import { SignInOptions, signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";

/**
 * Tap into Google Sign in.
 *
 * @param options.parentButtonId The HTML ID of the Sign in Button.
 * @param options.buttonWidth The width of the Sign in Button in pixels.
 *
 * @see {@link SignInOptions} for more options.
 *
 * @returns `loading`—if One Tap is loading.
 */

export default function useOneTapSignin(
  options?: {
    parentButtonID?: string;
    buttonWidth?: number;
  } & Pick<SignInOptions, "redirect" | "callbackUrl">,
) {
  const router = useRouter();
  const locale = useLocale();

  const { setAccountNotFoundOpen } = useContext(AppStateContext);

  const [loading, setLoading] = useState(false);

  /**
   * Signs the user in with a Google One Tap UI credential string and redirects
   * the user afterwards.
   *
   * @param credential Credential string.
   */
  async function logInWithGoogle(credential: string) {
    setLoading(true);
    const { status } = (await signIn("googleonetap", {
      credential,
      redirect: true,
      ...options,
    }))!;
    if (status === 401) {
      setAccountNotFoundOpen(true);
      return;
    }
    router.push("/learn");
    setLoading(false);
  }

  // Prompts the user to enter the credential string manually on environments
  // where the normal Google One Tap UI flow is not possible
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_ALLOW_PASTE_GOOGLE_CREDENTIAL !== "true")
      return;
    if (["localhost:3000", "mysk.school"].includes(window.location.host))
      return;
    const credential = prompt(
      "You are in a dev environment. To log in, copy over your Google \
credential string from your host machine and paste it here.\n\n*You may see \
this dialog box twice. Ignore the second one.",
    );
    if (!credential) return;
    va.track("Log in", { method: "Manual Credential String" });
    logInWithGoogle(credential);
  }, []);

  // If user is unauthenticated, Google One Tap UI is initialized and rendered
  useSession({
    required: true,
    onUnauthenticated() {
      if (loading) return;

      const { google } = window;
      if (!google) return;

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

      // Google One Tap UI
      google.accounts.id.prompt();

      // Render the Google Sign In (GSI) Button if provided with an ID
      const parentButton = options?.parentButtonID
        ? document.getElementById(options.parentButtonID)
        : null;
      if (parentButton)
        google.accounts.id.renderButton(parentButton, {
          shape: "pill",
          text: "continue_with",
          width: options?.buttonWidth,
          locale,
        });
    },
  });

  return { loading };
}
