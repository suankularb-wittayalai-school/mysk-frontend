// Imports
import ClubJoinLayout from "@/components/club/join/ClubJoinLayout";
import TintedFilledButton from "@/components/club/join/TintedFilledButton";
import createMySKClient from "@/utils/backend/mysk/createMySKClient";
import cn from "@/utils/helpers/cn";
import calculateLuminance from "@/utils/helpers/club/calculateLuminance";
import { CalculatedClubScheme, Club } from "@/utils/types/club";
import { LangCode } from "@/utils/types/common";
import {
  Button,
  transition,
  useAnimationConfig,
  Text,
} from "@suankularb-components/react";
import { AnimatePresence, motion } from "framer-motion";
import { GetServerSideProps, NextPage } from "next";
import useTranslation from "next-translate/useTranslation";
import { usePlausible } from "next-plausible";
import Image from "next/image";
import Link from "next/link";
import getLocaleString from "@/utils/helpers/getLocaleString";
import useLocale from "@/utils/helpers/useLocale";

/**
 * The result of touching the NFC in a Club booth. Prompt the user to join the
 * Club.
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

  const plausible = usePlausible();

  const { duration, easing } = useAnimationConfig();

  return (
    <ClubJoinLayout
      club={club}
      pageScheme={scheme?.page}
      tabName={t("club.tabName", { club: getLocaleString(club.name, locale) })}
    >
      <Text type="headline-medium" element="h1" className="z-10 text-center">
        {t("club.title", { club: getLocaleString(club.name, locale) })}
      </Text>
      <AnimatePresence>
        {club.logo_url && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              ...transition(duration.long2, easing.standardDecelerate),
              delay: duration.medium2,
            }}
            className={cn(
              `!-mx-10 grid !w-screen !max-w-none grow place-content-center`,
            )}
          >
            <Image
              src={club.logo_url}
              width={352}
              height={352}
              alt={t("club.logoAlt")}
              priority
              className="h-[22rem] w-auto object-contain"
              style={{
                filter: `drop-shadow(0px 0px 96px ${club.accent_color})`,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <div className="z-10 grid max-w-md grid-cols-1 gap-3">
        <TintedFilledButton
          tinted={Boolean(club.accent_color)}
          onClick={() =>
            plausible("Request to Join Club", {
              props: {
                method: "QR code",
                club: getLocaleString(club.name, "en-US"),
              },
            })
          }
          href={`/club/join/${club.id}/waiting`}
          element={Link}
          className={scheme?.button}
          style={{ backgroundColor: club.accent_color }}
        >
          {t("club.action.join", { price: 10 })}
        </TintedFilledButton>
        <Button
          appearance="outlined"
          onClick={() =>
            plausible("Exit Join Request Page", {
              props: {
                method: "QR code",
                club: getLocaleString(club.name, "en-US"),
              },
            })
          }
          href="/club"
          element={Link}
        >
          {t("club.action.cancel")}
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
      query: { fetch_level: "default" },
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
      club,
      scheme,
    },
  };
};

export default RequestClubJoinPage;
