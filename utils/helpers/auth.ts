// Imports
import {
  getStudentFromUserID,
  getTeacherFromUserID,
} from "@/utils/backend/account/getLoggedInPerson";
import getUserByEmail from "@/utils/backend/account/getUserByEmail";
import { logError } from "@/utils/helpers/debug";
import { useLocale } from "@/utils/hooks/i18n";
import { Student, Teacher, User } from "@/utils/types/person";
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
 * @see {@link SignInOptions} for more options.
 *
 * @returns `isLoading`—if One Tap is loading.
 */
export const useOneTapSignin = (
  options?: {
    parentButtonID?: string;
    buttonWidth?: number;
  } & Pick<SignInOptions, "redirect" | "callbackUrl">,
) => {
  const locale = useLocale();

  const [loading, setLoading] = useState(false);

  const router = useRouter();

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
        callback: async (response) => {
          setLoading(true);
          await signIn("googleonetap", {
            credential: response.credential,
            redirect: true,
            ...options,
          });
          router.push("/learn");
          setLoading(false);
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

export const useLoggedInPerson = (options?: {
  includeContacts: boolean;
  detailed?: boolean;
}) => {
  const { user, status } = useUser();
  const [person, setPerson] = useState<Student | Teacher | null>(null);
  const supabase = useSupabaseClient();

  useEffect(() => {
    if (!user) return;
    (async () => {
      switch (user!.role) {
        case "student":
          const { data, error } = await getStudentFromUserID(
            supabase,
            user!.id,
            options,
          );
          if (error) {
            logError("useLoggedInPerson (student)", error);
          }
          setPerson({ ...data!, is_admin: user!.is_admin });
          break;

        case "teacher":
          const { data: teacherData, error: teacherError } =
            await getTeacherFromUserID(supabase, user!.id, options);
          if (teacherError) {
            logError("useLoggedInPerson (teacher)", teacherError);
          }
          setPerson({ ...teacherData!, is_admin: user!.is_admin });
          break;
      }
    })();
  }, [user]);

  return { person, status };
};
