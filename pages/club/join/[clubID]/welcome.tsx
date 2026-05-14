// Imports
import ClubJoinLayout from "@/components/club/join/ClubJoinLayout";
import LogoRays from "@/components/club/join/LogoRays";
import LogoSparkles from "@/components/club/join/LogoSparkles";
import TintedFilledButton from "@/components/club/join/TintedFilledButton";
import createMySKClient from "@/utils/backend/mysk/createMySKClient";
import cn from "@/utils/helpers/cn";
import calculateLuminance from "@/utils/helpers/club/calculateLuminance";
import { CalculatedClubScheme, Club } from "@/utils/types/club";
import {
  Button,
  transition,
  useAnimationConfig,
  Text,
} from "@suankularb-components/react";
import { AnimatePresence, motion } from "framer-motion";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import useTranslation from "next-translate/useTranslation";
import { usePlausible } from "next-plausible";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { forwardRef, useState } from "react";
import useLocale from "@/utils/helpers/useLocale";
import getLocaleString from "@/utils/helpers/getLocaleString";
import DiscordLogo from "@/public/images/social/discord.svg";
import LineLogo from "@/public/images/social/line.svg";

/**
 * Shown when the user is accepted into a club.
 *
 * @param club A Club instance.
 * @param pageScheme The color scheme appropriate for the background.
 * @param manual A bool to specify if this page was redirected from a QR scan or
 * a manual add.
 *
 * @returns A Page.
 */
const WelcomeToClubPage: NextPage<{
  club: Club;
  scheme?: CalculatedClubScheme;
}> = ({ club, scheme }) => {
  const locale = useLocale();
  const { t } = useTranslation("club/join");
  const searchParams = useSearchParams();
  const manual = Boolean(JSON.parse(searchParams.get("manual") || "false"));

  const { duration, easing } = useAnimationConfig();

  const plausible = usePlausible();

  const discordURL = club.contacts.find(
    (contact) => contact.type === "discord",
  )?.value;
  const lineURL = club.contacts.find(
    (contact) => contact.type === "line",
  )?.value;
  const [joined, setJoined] = useState(!(discordURL || lineURL));

  return (
    <ClubJoinLayout
      club={club}
      pageScheme={scheme?.page}
      tabName={t("welcome.tabName", {
        club: getLocaleString(club.name, locale),
      })}
    >
      <div className="z-10 space-y-3 text-center">
        <Text type="display-medium" element="h1" className="text-center">
          {t("welcome.title")}
        </Text>
        <Text type="headline-medium" element="p" className="text-center">
          {t("welcome.subtitle")}
        </Text>
      </div>

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
              `!-mx-10 grid aspect-square !w-screen !max-w-none grow place-items-center text-primary [grid-template-areas:'center']`,
            )}
          >
            <Image
              src={club.logo_url}
              width={224}
              height={224}
              alt={t("welcome.logoAlt")}
              priority
              className={cn(
                `z-10 aspect-square h-[14rem] w-auto object-contain text-on-background [grid-area:center]`,
              )}
              style={{
                filter: `drop-shadow(0px 0px 64px ${club.accent_color})`,
              }}
            />
            <LogoRays
              className={cn(
                `h-[22.5rem] animate-[spin_30s_linear_infinite] [grid-area:center]`,
              )}
            />
            <LogoSparkles
              className={cn(
                `pointer-events-none z-20 h-[22.5rem] [grid-area:center]`,
              )}
              style={{
                filter: `drop-shadow(0px 0px 6px ${club.background_color})`,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="z-10 grid max-w-md grid-cols-1 gap-6">
        <div className="grid grid-cols-1 gap-2">
          {discordURL && (
            <TintedFilledButton
              tinted={Boolean(club.accent_color)}
              icon={<Image src={DiscordLogo} alt="" />}
              href={discordURL}
              onClick={() => {
                plausible("Access Club Contact", {
                  props: { club: getLocaleString(club.name, "en-US") },
                });
                setJoined(true);
              }}
              // eslint-disable-next-line react/display-name
              element={forwardRef<HTMLAnchorElement>((props, ref) => (
                <a {...props} ref={ref} target="_blank" rel="noreferrer" />
              ))}
              className={scheme?.button}
              style={{ backgroundColor: club.accent_color }}
            >
              {t("welcome.action.discord")}
            </TintedFilledButton>
          )}
          {lineURL && (
            <TintedFilledButton
              tinted={Boolean(club.accent_color)}
              icon={<Image src={LineLogo} alt="" />}
              href={lineURL}
              onClick={() => {
                plausible("Access Club Contact", {
                  props: { club: getLocaleString(club.name, "en-US") },
                });
                setJoined(true);
              }}
              // eslint-disable-next-line react/display-name
              element={forwardRef<HTMLAnchorElement>((props, ref) => (
                <a {...props} ref={ref} target="_blank" rel="noreferrer" />
              ))}
              className={scheme?.button}
              style={{ backgroundColor: club.accent_color }}
            >
              {t("welcome.action.line")}
            </TintedFilledButton>
          )}
        </div>
        <Button
          appearance="outlined"
          href="/club"
          disabled={!(manual || joined)}
          element={Link}
        >
          {t("welcome.action.done")}
        </Button>
      </div>
    </ClubJoinLayout>
  );
};

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: "blocking",
});

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const mysk = await createMySKClient();

  // Fetch Club
  const { data: club, error } = await mysk.fetch<Club>(
    `/v1/clubs/${params?.clubID}`,
    {
      query: { fetch_level: "default" },
    },
  );
  if (error?.code === 404) return { notFound: true };

  let scheme: CalculatedClubScheme | null = null;
  if (club?.background_color && club?.accent_color)
    scheme = {
      page: calculateLuminance(club.background_color) > 128 ? "light" : "dark",
      button: calculateLuminance(club.accent_color) > 128 ? "dark" : "light",
    };

  return {
    revalidate: 300,
    props: {
      club,
      scheme,
    },
  };
};

export default WelcomeToClubPage;
