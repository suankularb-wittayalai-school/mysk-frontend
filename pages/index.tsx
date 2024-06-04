import AccountNotFoundDialog from "@/components/account/AccountNotFoundDialog";
import AppDrawer from "@/components/common/AppDrawer";
import MultiSchemeImage from "@/components/common/MultiSchemeImage";
import GSIButton from "@/components/landing/GSIButton";
import LandingActions from "@/components/landing/LandingActions";
import LandingBlobs from "@/components/landing/LandingBlobs";
import LanguageSwitcher from "@/components/landing/LanguageSwitcher";
// import MySKLogoDark from "@/public/icons/petals-dark.svg";
// import MySKLogoLight from "@/public/icons/petals-light.svg";
import MySKLogoDark from "@/public/icons/petals-dark-variant.svg";
import MySKLogoLight from "@/public/icons/petals-light-variant.svg";
import flagUserAsOnboarded from "@/utils/backend/account/flagUserAsOnboarded";
import createMySKClient from "@/utils/backend/mysk/createMySKClient";
import useMySKClient from "@/utils/backend/mysk/useMySKClient";
import cn from "@/utils/helpers/cn";
import prefixLocale from "@/utils/helpers/prefixLocale";
import useLocale from "@/utils/helpers/useLocale";
import { CustomPage, LangCode } from "@/utils/types/common";
import { UserRole } from "@/utils/types/person";
import {
  Actions,
  Button,
  DURATION,
  EASING,
  Text,
  transition,
} from "@suankularb-components/react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { AnimatePresence, motion } from "framer-motion";
import { GetServerSideProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { usePlausible } from "next-plausible";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Balancer from "react-wrap-balancer";

/**
 * The status of the Google Sign In Button.
 */
export enum GSIStatus {
  initial = "initial",
  chooserShown = "chooserShown",
  processing = "processing",
  redirecting = "redirecting",
}

/**
 * The landing for users who have not yet logged in. Contains the Google Sign
 * In (GSI) Button, help links, patch notes, and credits.
 */
const LandingPage: CustomPage = () => {
  const locale = useLocale();
  const { t } = useTranslation("landing");
  const { t: tx } = useTranslation("common");

  const plausible = usePlausible();
  const router = useRouter();
  const mysk = useMySKClient();
  const supabase = useSupabaseClient();

  const [state, setState] = useState<GSIStatus>(GSIStatus.initial);
  const [accountNotFoundOpen, setAccountNotFoundOpen] = useState(false);

  // Determine if and where to redirect depending on user status.
  useEffect(() => {
    (async () => {
      if (!mysk.user) return;
      setState(GSIStatus.redirecting);
      if (!mysk.user.onboarded) {
        // Flag new users as onboarded.
        plausible("Complete Onboarding");
        await flagUserAsOnboarded(supabase, mysk.user.id);
        // Redirect to account page if new Student or Teacher.
        if ([UserRole.student, UserRole.teacher].includes(mysk.user.role))
          router.push("/account");
        // Otherwise redirect to home page (middleware redirects further).
        else router.push("/learn");
      } else router.push("/learn");
    })();
  }, [mysk.user]);

  return (
    <>
      <Head>
        <title>{tx("appName")}</title>
        <meta name="description" content={tx("brand.description")} />
        <meta property="og:title" content={tx("appName")} />
        <meta property="og:description" content={tx("brand.description")} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.mysk.school" />
        <meta property="og:image" content="/images/graphics/og.png" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta
          property="og:locale"
          content={locale === "th" ? "th_TH" : "en_US"}
        />
      </Head>

      {/* Background */}
      <div
        className={cn(`fixed inset-0 -z-10 overflow-hidden sm:bottom-auto
          sm:h-screen`)}
      >
        <LandingBlobs className="inset-0" />
      </div>

      {/* Content */}
      <div
        className={cn(`mx-auto flex min-h-svh max-w-[42.75rem] flex-col
          items-center p-6`)}
      >
        {/* App Drawer */}
        <Actions
          className={cn(`-mb-9 -mt-1 w-[calc(100vw-var(--padding-x)*2)]
            max-w-[70.5rem] [--padding-x:1rem] sm:mb-0 md:[--padding-x:3rem]`)}
        >
          <AppDrawer />
        </Actions>

        <div
          className={cn(`flex grow flex-col gap-6 self-stretch pb-10
            sm:place-content-center sm:gap-3`)}
        >
          {/* Card */}
          <main
            className={cn(`flex grow flex-col gap-6 rounded-xl
              border-outline-variant sm:grid sm:h-[18.75rem] sm:grow-0
              sm:grid-cols-2 sm:border-1 sm:bg-surface sm:p-6`)}
          >
            {/* Aside */}
            <section className="flex flex-col">
              <MultiSchemeImage
                srcLight={MySKLogoLight}
                srcDark={MySKLogoDark}
                alt={t("aside.logoAlt")}
                className="*:w-20"
              />
              <Text element="h1" type="headline-large" className="sm:max-w-48">
                {t("aside.title")}
              </Text>
              <div aria-hidden className="grow" />
              <LanguageSwitcher className="!hidden sm:!flex" />
            </section>

            {/* Main */}
            <AnimatePresence initial={false} mode="popLayout">
              <motion.section
                key={state}
                initial={{ opacity: 0, y: -20, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: 20, filter: "blur(4px)" }}
                transition={transition(DURATION.medium4, EASING.standard)}
                className="flex flex-col"
              >
                <Text element="h2" type="headline-small">
                  {t("main.title")}
                </Text>
                <Text element="p" type="body-medium" className="mt-1.5">
                  <Balancer>{t(`main.desc.${state}`)}</Balancer>
                </Text>
                {
                  {
                    // Show GSI Button initially.
                    [GSIStatus.initial]: (
                      <GSIButton
                        onStateChange={setState}
                        onNotFound={() => setAccountNotFoundOpen(true)}
                        className="mt-5"
                      />
                    ),
                    // Show Cancel Button when waiting for the user to use their
                    // Google account.
                    [GSIStatus.chooserShown]: (
                      <Actions className="grow !items-end pt-5">
                        <Button
                          onClick={() => {
                            plausible("Cancel Log in");
                            setState(GSIStatus.initial);
                          }}
                          appearance="outlined"
                          dangerous
                        >
                          {t("main.action.cancel")}
                        </Button>
                      </Actions>
                    ),
                    // Show nothing when continuing to MySK.
                    [GSIStatus.processing]: null,
                    [GSIStatus.redirecting]: null,
                  }[state]
                }
              </motion.section>
            </AnimatePresence>
          </main>

          {/* Actions */}
          <LandingActions />
        </div>

        {/* Credits */}
        <Text
          type="body-small"
          element="footer"
          className="text-on-surface-variant"
        >
          {t("credits")}
        </Text>

        {/* Google One Tap UI fixes */}
        <style jsx global>{`
          /* Fix Google One Tap UI white box on dark mode */
          #credential_picker_iframe,
          #credential_picker_container {
            color-scheme: light;
          }
          #credential_picker_container {
            right: 0.5rem !important;
            top: 0.5rem !important;
          }

          /* Add bottom padding when Google One Tap UI displays (if on mobile)
            so as to not cover the footer */
          body {
            --_one-tap-height: 12.5rem; /* FedCM */
          }
          body:has(> #credential_picker_iframe) {
            --_one-tap-height: 16rem; /* iframe */
          }

          @media only screen and (min-width: 600px) {
            body {
              --_one-tap-height: 0;
            }
            body:has(> #credential_picker_iframe) {
              --_one-tap-height: 13rem;
            }
          }

          .skc-root-layout {
            height: 100svh;
            min-height: calc(100svh + var(--_one-tap-height));
            padding-bottom: calc(var(--_one-tap-height) + 2rem);
          }
        `}</style>
      </div>

      {/* Account Not Found Dialog */}
      <AccountNotFoundDialog
        open={accountNotFoundOpen}
        onClose={() => setAccountNotFoundOpen(false)}
      />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  req,
}) => {
  const { user } = await createMySKClient(req);

  // Redirect to Learn if user is already logged in
  // (For Teachers, the middleware will redirect them to Teach instead)
  if (user)
    return {
      redirect: {
        destination: prefixLocale("/learn", locale),
        permanent: false,
      },
    };

  return {
    props: await serverSideTranslations(locale as LangCode, [
      "common",
      "account",
      "landing",
    ]),
  };
};

LandingPage.navType = "hidden";

export default LandingPage;
