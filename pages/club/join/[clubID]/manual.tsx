// Imports
import ClubJoinLayout from "@/components/club/join/ClubJoinLayout";
import TintedFilledButton from "@/components/club/join/TintedFilledButton";
import SnackbarContext from "@/contexts/SnackbarContext";
import createMySKClient from "@/utils/backend/mysk/createMySKClient";
import useMySKClient from "@/utils/backend/mysk/useMySKClient";
import calculateLuminance from "@/utils/helpers/club/calculateLuminance";
import logError from "@/utils/helpers/logError";
import { CalculatedClubScheme, Club } from "@/utils/types/club";
import { LangCode } from "@/utils/types/common";
import {
  Button,
  Snackbar,
  TextField,
  transition,
  useAnimationConfig,
} from "@suankularb-components/react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { AnimatePresence, motion } from "framer-motion";
import { GetServerSideProps, NextPage } from "next";
import useTranslation from "next-translate/useTranslation";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { usePlausible } from "next-plausible";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { Balancer } from "react-wrap-balancer";
import getLocaleString from "@/utils/helpers/getLocaleString";
import useLocale from "@/utils/helpers/useLocale";

/**
 * A manual way to join a Club. Uses the Student's email.
 *
 * @param club The Club the user is considering joining.
 * @param pageScheme The calculated color scheme of the page.
 *
 * @returns A Page.
 */

const RequestClubJoinPage: NextPage<{
  club: Club;
  scheme?: CalculatedClubScheme | null;
}> = ({ club, scheme }) => {
  const locale = useLocale();
  const { t } = useTranslation("club/join");
  const { t: tx } = useTranslation("common");
  const mysk = useMySKClient();
  const [email, setEmail] = useState("");
  const supabase = useSupabaseClient();
  const router = useRouter();

  const plausible = usePlausible();

  const { setSnackbar } = useContext(SnackbarContext);
  const { duration, easing } = useAnimationConfig();

  async function addMember(email: string) {
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email + "@student.sk.ac.th")
      .limit(1)
      .single();
    if (userError) {
      logError("userError in manual join", userError);
      setSnackbar(<Snackbar>{tx("snackbar.failure")}</Snackbar>);
    }

    const { data: student, error: studentError } = await supabase
      .from("students")
      .select("id")
      .eq("user_id", user?.id)
      .limit(1)
      .single();
    if (student === null || studentError) {
      logError("studentError in manual join", studentError);
      setSnackbar(<Snackbar>{tx("snackbar.failure")}</Snackbar>);
    }

    const { error } = await mysk.fetch(`/v1/clubs/${club.id}/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: {
          id: student?.id,
        },
      }),
    });
    if (error) {
      logError("API error manual join", error);
      setSnackbar(<Snackbar>{tx("snackbar.failure")}</Snackbar>);
    } else
      router.push(
        `/join/club/${club.id}/welcome?manual=true&student=${student?.id}`,
      );
  }

  return (
    <ClubJoinLayout club={club} pageScheme={scheme?.page} tabName={t("manual.tabName")}>
      <div className="grid flex-grow place-items-center">
        <div className="flex flex-col gap-4">
          <AnimatePresence>
            {club.logo_url && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  ...transition(duration.long2, easing.standardDecelerate),
                  delay: duration.medium2,
                }}
              >
                <Image
                  src={club.logo_url}
                  width={352}
                  height={352}
                  alt={t("manual.logoAlt")}
                  priority
                  className="mx-auto aspect-square"
                  style={{
                    filter: `drop-shadow(0px 0px 96px ${club.accent_color})`,
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
          <h1 className="skc-headline-small z-10 text-center">
            <Balancer>
              {t("manual.title", { club: getLocaleString(club.name, locale) })}
            </Balancer>
          </h1>
        </div>
      </div>
      <div className="my-8 flex flex-col gap-3 text-center">
        <TextField
          appearance="outlined"
          label={t("manual.email.fieldName")}
          align="right"
          trailing="@student.sk.ac.th"
          value={email}
          onChange={(text: string) => setEmail(text)}
        />
        <p>{t("manual.email.desc")}</p>
      </div>
      <div className="z-10 grid max-w-md grid-cols-1 gap-3">
        <TintedFilledButton
          tinted={Boolean(club.accent_color)}
          onClick={() => {
            addMember(email);
            plausible("Add Member Manual", {
              props: {
                method: "Email",
                club: getLocaleString(club.name, "en-US"),
              },
            });
          }}
          className={scheme?.button}
          style={{ backgroundColor: club.accent_color }}
        >
          {t("manual.action.join", { price: 10 })}
        </TintedFilledButton>
        <Button
          appearance="outlined"
          onClick={() =>
            plausible("Exit Join Request Page", {
              props: {
                method: "Email",
                club: getLocaleString(club.name, "en-US"),
              },
            })
          }
          href={`/manage/club/${club.id}`}
          element={Link}
        >
          {t("manual.action.cancel")}
        </Button>
      </div>
    </ClubJoinLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  params,
  req,
}) => {
  const mysk = await createMySKClient(req);

  // Fetch Clubs
  const { data: club, error } = await mysk.fetch<Club>(
    `/v1/clubs/${params?.clubID}`,
    {
      query: {
        fetch_level: "default",
        descendant_fetch_level: "id_only",
      },
    },
  );
  if (error?.code === 404) return { notFound: true };

  // Calculate what scheme the page should use based on the luminance of the
  // background color
  let scheme: CalculatedClubScheme | null = null;
  if (club?.background_color && club?.accent_color)
    scheme = {
      page: calculateLuminance(club.background_color) > 128 ? "light" : "dark",
      button: calculateLuminance(club.accent_color) > 128 ? "dark" : "light",
    };

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, ["common", "join"])),
      club,
      scheme,
    },
  };
};

export default RequestClubJoinPage;
