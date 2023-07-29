// Imports
import getUserByEmail from "@/utils/backend/account/getUserByEmail";
import { logError } from "@/utils/helpers/debug";
import { useLocale } from "@/utils/hooks/i18n";
import { User } from "@/utils/types/person";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { SignInOptions, signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

/**
 * Tap into Google Sign in.
 *
 * @param options.parentContainerId The HTML ID of the One Tap’s container.
 * @param options.parentButtonId The HTML ID of the Sign in Button.
 * @param options.buttonWidth The width of the Sign in Button in pixels.
 *
 * @returns `isLoading`—if One Tap is loading.
 */
export const useOneTapSignin = (
  options?: {
    parentContainerId?: string;
    parentButtonId?: string;
    buttonWidth?: number;
  } & Pick<SignInOptions, "redirect" | "callbackUrl">,
) => {
  const locale = useLocale();

  const { parentContainerId, parentButtonId, buttonWidth } = options || {};
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  // Taking advantage in recent development of useSession hook
  // If user is unauthenticated, google one tap ui is initialized and rendered
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      if (isLoading) return;

      const { google } = window;
      if (!google) return;

      try {
        google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
          // itp_support: false,
          callback: async (response: any) => {
            setIsLoading(true);

            // Here we call our Provider with the token provided by google
            await signIn("googleonetap", {
              credential: response.credential,
              redirect: true,
              ...options,
            });
            router.push("/learn");

            setIsLoading(false);
          },
          prompt_parent_id: parentContainerId,
        });

        // Render Google One Tap on supported browser
        if (!/(Safari|Firefox)/i.test(navigator.userAgent))
          google.accounts.id.prompt((notification) => {
            if (notification.isNotDisplayed())
              logError("useOneTapSignin", {
                code: "getNotDisplayedReason",
                hint: notification.getNotDisplayedReason(),
              });
            else if (notification.isSkippedMoment())
              logError("useOneTapSignin", {
                code: "getNotDisplayedReason",
                hint: notification.getSkippedReason(),
              });
            else if (notification.isDismissedMoment())
              logError("useOneTapSignin", {
                code: "getDismissedReason",
                hint: notification.getDismissedReason(),
              });
          });

        // Render the Sign in button if provided with an ID
        if (parentButtonId) {
          google.accounts.id.renderButton(
            document.getElementById(parentButtonId) as HTMLElement,
            {
              shape: "pill",
              text: "continue_with",
              width: buttonWidth,
              locale,
            },
          );
        }
      } catch (error) {
        logError("useOneTapSignin", {
          code: "googleOneTap",
          hint: error as string,
        });
      }
    },
  });

  return { isLoading };
};

export const useUser = () => {
  const { data, status } = useSession();
  const [user, setUser] = useState<User | null>(null);

  const supabase = useSupabaseClient();

  useEffect(() => {
    const email = data?.user?.email;
    if (email) {
      (async () => {
        const { data, error } = await getUserByEmail(supabase, email);
        if (error) logError("useUser", error);
        setUser(data);
      })();
    }
  }, [data]);

  return { user, status };
};
