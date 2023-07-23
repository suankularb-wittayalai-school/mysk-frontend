/**
 * `/` TABLE OF CONTENTS
 *
 * Note: `Ctrl` + click to jump to a component.
 *
 * **Sections**
 * - {@link LogInSection}
 * - {@link PatchNotesSection}
 * - {@link CreditsSection}
 *
 * **Page**
 * - {@link LandingPage}
 */

// Imports
import EmailOTPDialog from "@/components/account/EmailOTPDialog";
import MultiSchemeImage from "@/components/common/MultiSchemeImage";
import SnackbarContext from "@/contexts/SnackbarContext";
import MySKDark from "@/public/images/brand/mysk-dark.svg";
import MySKLight from "@/public/images/brand/mysk-light.svg";
import BackgroundDark from "@/public/images/graphics/landing/background-dark.svg";
import BackgroundLight from "@/public/images/graphics/landing/background-light.svg";
import { cn } from "@/utils/helpers/className";
import { logError } from "@/utils/helpers/debug";
import { withLoading } from "@/utils/helpers/loading";
import { useLocale } from "@/utils/hooks/i18n";
import { usePreferences } from "@/utils/hooks/preferences";
import { usePageIsLoading, useRefreshProps } from "@/utils/hooks/routing";
import { useToggle } from "@/utils/hooks/toggle";
import { CustomPage, LangCode } from "@/utils/types/common";
import {
  Button,
  Columns,
  ContentLayout,
  MaterialIcon,
  Progress,
  SegmentedButton,
  Snackbar,
  TextField,
  transition,
  useAnimationConfig,
} from "@suankularb-components/react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import va from "@vercel/analytics";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { Trans, useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useRouter } from "next/router";
import { FC, useContext, useState } from "react";

/**
 * A form for logging in.
 *
 * @returns A `<section>`.
 */
const LogInSection: FC = () => {
  const locale = useLocale();
  const { t } = useTranslation("account");
  const { t: tx } = useTranslation("common");

  const router = useRouter();
  const { setSnackbar } = useContext(SnackbarContext);
  const { duration, easing } = useAnimationConfig();

  const [showPasswordField, setShowPasswordField] = useState(false);

  // Form control
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const emailIsValid = /@(student\.)?sk\.ac\.th$/.test(email);
  const passwordIsValid = password.length >= 6;

  // Dialog control
  const [showAskOTP, setShowAskOTP] = useState(false);

  // Database interaction
  const supabase = useSupabaseClient();
  const [otpLoading, toggleOTPLoading] = useToggle();
  const [passwordLoading, togglePasswordLoading] = useToggle();

  /**
   * Logs the user in with email and password.
   */
  async function handlePasswordLogIn() {
    if (!(emailIsValid && passwordIsValid)) {
      setSnackbar(<Snackbar>{t("snackbar.invalidCreds")}</Snackbar>);
      return;
    }

    withLoading(async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.signInWithPassword({ email, password });

      // Track event
      va.track("Log in", { method: "Password" });

      // If the user enter a wrong email or password, inform them
      if (error?.name === "AuthApiError")
        setSnackbar(<Snackbar>{t("snackbar.invalidCreds")}</Snackbar>);

      if (!session || error) return false;
      await router.push("/learn");
      return true;
    }, togglePasswordLoading);
  }

  /**
   * Sends an OTP to the user’s email address.
   */
  async function handleRequestOTP() {
    if (!emailIsValid) {
      setSnackbar(<Snackbar>{tx("snackbar.formInvalid")}</Snackbar>);
      return;
    }

    withLoading(
      async () => {
        const { error } = await supabase.auth.signInWithOtp({ email });

        // Track event
        va.track("Request Email OTP");

        if (error) {
          logError("handleRequestOTP", error);
          if (error.status === 429)
            setSnackbar(
              <Snackbar>
                You’ve made too many OTP requests; we’ve temporarily disabled
                OTP for you as a security measure
              </Snackbar>,
            );
          else setSnackbar(<Snackbar>{tx("snackbar.failure")}</Snackbar>);
          return false;
        }

        // Ask the user for the OTP
        setShowAskOTP(true);

        return true;
      },
      toggleOTPLoading,
      { hasEndToggle: true },
    );
  }

  return (
    <>
      {/* Close Button (for exiting password mode) */}
      <AnimatePresence>
        {showPasswordField && (
          <motion.div
            layout="position"
            initial={{ opacity: 0, rotate: "-90deg" }}
            animate={{ opacity: 1, rotate: "0deg" }}
            exit={{ opacity: 0, rotate: "90deg" }}
            transition={transition(duration.short4, easing.standard)}
            className="absolute right-4 top-4"
          >
            <Button
              appearance="text"
              icon={<MaterialIcon icon="close" />}
              onClick={() => setShowPasswordField(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        layout="position"
        transition={transition(duration.medium4, easing.standard)}
      >
        <MultiSchemeImage
          srcLight={MySKLight}
          srcDark={MySKDark}
          alt="MySK logo"
          className="[&>img]:w-16"
        />
        <h2 className="skc-headline-medium">Log in to MySK</h2>
      </motion.div>

      {/* Form */}
      <motion.div
        layout
        transition={transition(duration.medium4, easing.standard)}
        className={cn([`flex flex-col gap-8`, !showPasswordField && `pb-5`])}
      >
        <motion.div layout="position">
          <TextField<string>
            appearance="outlined"
            label="School email"
            helperMsg="Use the email ending in sk.ac.th"
            value={email}
            onChange={setEmail}
            locale={locale}
            inputAttr={{
              type: "email",
              onKeyUp: (event) =>
                event.key === "Enter" &&
                (passwordIsValid
                  ? handlePasswordLogIn()
                  : setShowPasswordField(true)),
            }}
          />
        </motion.div>
        <TextField<string>
          appearance="outlined"
          label="Password"
          value={password}
          onChange={setPassword}
          locale={locale}
          inputAttr={{
            id: "field-password",
            type: "password",
            onKeyUp: (event) => event.key === "Enter" && handlePasswordLogIn(),
          }}
          className={!showPasswordField ? "!hidden" : ""}
        />
      </motion.div>

      {/* Actions */}
      <motion.div
        layout="position"
        transition={transition(duration.medium4, easing.standard)}
        className="flex flex-col gap-2"
      >
        <Button
          appearance={showPasswordField ? "filled" : "tonal"}
          icon={
            showPasswordField ? (
              <MaterialIcon icon="login" />
            ) : (
              <MaterialIcon icon="password" />
            )
          }
          loading={passwordLoading || undefined}
          onClick={
            showPasswordField || password.length >= 6
              ? handlePasswordLogIn
              : () => setShowPasswordField(true)
          }
        >
          {showPasswordField ? "Log in" : "Continue with password"}
        </Button>
        {!showPasswordField && (
          <Button
            appearance="tonal"
            icon={<MaterialIcon icon="send" />}
            loading={otpLoading || undefined}
            onClick={handleRequestOTP}
          >
            Send OTP
          </Button>
        )}
        <EmailOTPDialog
          open={showAskOTP}
          onClose={() => setShowAskOTP(false)}
          email={email}
        />
      </motion.div>
    </>
  );
};

/**
 * Credits to supervisors, developers, and organizations involved in creating
 * and maintaining MySK.
 *
 * @returns The contents of a `<section>`.
 */
const PatchNotesSection: FC = () => {
  const locale = useLocale();

  const { setPreference } = usePreferences();
  const refreshProps = useRefreshProps();

  function changeLocaleTo(locale: LangCode) {
    // Remember the preference
    setPreference("locale", locale);
    // Redirect to the new language
    refreshProps({ locale });
  }

  return (
    <>
      {/* Language Switcher */}
      <SegmentedButton alt="Language / ภาษา" full>
        <Button
          appearance="outlined"
          selected={locale === "th"}
          onClick={() => changeLocaleTo("th")}
        >
          ภาษาไทย
        </Button>
        <Button
          appearance="outlined"
          selected={locale === "en-US"}
          onClick={() => changeLocaleTo("en-US")}
        >
          English
        </Button>
      </SegmentedButton>

      {/* Patch notes */}
      <article aria-label="Patch notes" className="contents">
        <header>
          <h2 className="skc-title-small text-on-surface-variant">
            MySK {process.env.NEXT_PUBLIC_VERSION}
          </h2>
          <p className="skc-title-large">Schedule just got more helpful</p>
        </header>
        <ul className="list-disc pl-6">
          <li>
            Schedule at a Glance shows the most relevant information from your
            schedule.
          </li>
          <li>Find any teacher’s schedule with Lookup.</li>
          <li>Email OTP—a new, easier way to log in without a password.</li>
        </ul>
      </article>

      {/* Links */}
      <p className="skc-body-small">
        <a
          href="https://github.com/suankularb-wittayalai-school/mysk-frontend/pulls?q=is%3Apr+is%3Aclosed+base%3Amain+release+in%3Atitle"
          target="_blank"
          className="link"
        >
          Patch notes
        </a>
        &nbsp;&nbsp;
        <a
          href="https://docs.google.com/forms/d/e/1FAIpQLSdXtOFHSDoiwkWfh2geoORRB4HvacBbzoLseIpF0dXjfFaqPg/viewform?usp=sf_link"
          target="_blank"
          rel="noreferrer"
          className="link"
        >
          Report issue
        </a>
      </p>
    </>
  );
};

/**
 * Credits to supervisors, developers, and organizations involved in creating
 * and maintaining MySK.
 *
 * @returns A `<div>`.
 */
const CreditsSection: FC = () => {
  const { t } = useTranslation("landing", { keyPrefix: "aside.credits" });

  return (
    <motion.div
      layout="position"
      className="skc-body-small flex flex-col gap-2 text-on-surface-variant"
    >
      <p>{t("supervisors")}</p>
      <p>{t("developers")}</p>
      <p>
        <Trans
          i18nKey="aside.credits.translations"
          ns="landing"
          components={{
            a: (
              <a
                href="https://www.instagram.com/sk.elc/"
                target="_blank"
                rel="noreferrer"
                className="link"
              />
            ),
          }}
        />
      </p>
    </motion.div>
  );
};

/**
 * The landing for users who have not yet logged in. Contains the form for
 * logging in, links to public pages, patch notes, and credits.
 *
 * @returns A Page.
 */
const LandingPage: CustomPage = () => {
  const { t } = useTranslation("landing");
  const { t: tx } = useTranslation("common");

  const { duration, easing } = useAnimationConfig();

  const { pageIsLoading } = usePageIsLoading();

  return (
    <>
      <Head>
        <title>{tx("brand.name")}</title>
        <meta name="description" content={tx("brand.description")} />
      </Head>

      {/* Page Loading Indicator */}
      <Progress
        appearance="linear"
        alt={tx("pageLoading")}
        visible={pageIsLoading}
      />

      {/* Background */}
      <MultiSchemeImage
        srcLight={BackgroundLight}
        srcDark={BackgroundDark}
        alt=""
        priority
        className="fixed inset-0 -z-10 [&_img]:h-full [&_img]:object-cover"
      />

      {/* Content */}
      <ContentLayout className="overflow-hidden md:overflow-visible">
        <Columns columns={6}>
          <div
            className="col-span-2 mx-4 flex flex-col gap-6 sm:col-span-4
              sm:mx-0 md:col-start-2"
          >
            <LayoutGroup>
              <div
                className="flex flex-col justify-center
                  sm:min-h-[calc(100vh-10.5rem)]"
              >
                <motion.div
                  layout
                  transition={transition(duration.medium4, easing.standard)}
                  className="grid overflow-hidden rounded-xl border-1
                    border-outline-variant bg-surface-variant md:grid-cols-2
                    [&>*]:p-6 [&>:first-child]:md:pr-3 [&>:last-child]:md:pl-3"
                  style={{ borderRadius: 28 }}
                >
                  <motion.section
                    layout
                    transition={transition(duration.medium4, easing.standard)}
                    className="relative flex flex-col gap-6 bg-surface"
                  >
                    <LogInSection />
                  </motion.section>
                  <motion.section
                    layout="position"
                    transition={transition(duration.medium4, easing.standard)}
                    className="flex flex-col gap-3 bg-surface-variant"
                  >
                    <PatchNotesSection />
                  </motion.section>
                </motion.div>
              </div>
              <CreditsSection />
            </LayoutGroup>
          </div>
        </Columns>
      </ContentLayout>
    </>
  );
};

export const getStaticProps = async ({ locale }: { locale: LangCode }) => ({
  props: await serverSideTranslations(locale, ["common", "account", "landing"]),
});

LandingPage.navType = "hidden";

export default LandingPage;
