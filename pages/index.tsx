/**
 * `/` TABLE OF CONTENTS
 *
 * Note: `Ctrl` + click to jump to a component.
 *
 * **Sections**
 * - {@link LogInSection}
 * - {@link OptionsSection}
 * - {@link PatchNotesSection}
 * - {@link CreditsSection}
 *
 * **Page**
 * - {@link LandingPage}
 */

// External libraries
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";

import va from "@vercel/analytics";

import Head from "next/head";
import { useRouter } from "next/router";

import { Trans, useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { FC, forwardRef, useContext, useEffect, useState } from "react";

// SK Components
import {
  Actions,
  Button,
  ContentLayout,
  Divider,
  Header,
  MaterialIcon,
  MenuItem,
  Section,
  Select,
  Snackbar,
  TextField,
} from "@suankularb-components/react";

// Internal components
import MagicLinkDialog from "@/components/account/MagicLinkDialog";
import MultiSchemeImage from "@/components/common/MultiSchemeImage";

// Contexts
import SnackbarContext from "@/contexts/SnackbarContext";

// Images
import LandingBackgroundDark from "@/public/images/graphics/landing/background-dark.svg";
import LandingBackgroundLight from "@/public/images/graphics/landing/background-light.svg";

import LandingPhoneDark from "@/public/images/graphics/landing/phone-dark.svg";
import LandingPhoneLight from "@/public/images/graphics/landing/phone-light.svg";

import SKELCDark from "@/public/images/orgs/skelc-dark.svg";
import SKELCLight from "@/public/images/orgs/skelc-light.svg";

import SKISoDark from "@/public/images/orgs/skiso-dark.svg";
import SKISoLight from "@/public/images/orgs/skiso-light.svg";

// Backend
import { getUserMetadata } from "@/utils/backend/account";

// Helpers
import { withLoading } from "@/utils/helpers/loading";

// Hooks
import { useLocale } from "@/utils/hooks/i18n";
import { useRefreshProps } from "@/utils/hooks/routing";
import { useToggle } from "@/utils/hooks/toggle";

// Types
import { CustomPage, LangCode } from "@/utils/types/common";

/**
 * A form for logging in.
 *
 * @returns A Section.
 */
const LogInSection: FC = () => {
  const locale = useLocale();
  const { t } = useTranslation(["account", "landing"]);

  const { setSnackbar } = useContext(SnackbarContext);

  const supabase = useSupabaseClient();

  // Form control
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // Form submission
  const [loading, toggleLoading] = useToggle();

  /**
   * Check if the form is valid.
   *
   * @returns A boolean representing if the log in form is valid.
   */
  function validate(): boolean {
    if (!email || email.endsWith("sk.ac.th") || !/@(student.)?$/.test(email))
      return false;
    if (!password) return false;

    return true;
  }

  /**
   * Logs the user in or inform the user of mistakes in the form.
   */
  async function handleSubmit() {
    withLoading(async () => {
      // Validate response
      if (!validate()) {
        setSnackbar(
          <Snackbar>{t("snackbar.formInvalid", { ns: "common" })}</Snackbar>
        );
        return false;
      }

      // Blur focus from the form
      (document.activeElement as HTMLInputElement)?.blur?.();

      // Log in user in Supabase
      const {
        data: { session },
        error,
      } = await supabase.auth.signInWithPassword({
        email: [email, "sk.ac.th"].join(""),
        password,
      });

      // Track event
      va.track("Log in");

      // If the user enter a wrong email or password, inform them
      if (error?.name === "AuthApiError")
        setSnackbar(<Snackbar>{t("snackbar.invalidCreds")}</Snackbar>);

      if (!session || error) return false;

      return true;
    }, toggleLoading);
  }

  return (
    <Section className="!gap-y-5">
      <Header>{t("logIn.title")}</Header>
      <TextField<string>
        appearance="outlined"
        label={t("logIn.form.email")}
        align="right"
        trailing="sk.ac.th"
        error={
          email.length !== 0 &&
          (email.endsWith("sk.ac.th") || !/@(student.)?$/.test(email))
        }
        value={email}
        onChange={(value) => setEmail(value.split("sk.ac.th", 1)[0])}
        locale={locale}
        inputAttr={{
          autoCapitalize: "off",
          spellCheck: false,
          onKeyUp: (event) => event.key === "Enter" && handleSubmit(),
        }}
      />
      <TextField<string>
        appearance="outlined"
        label={t("logIn.form.password")}
        value={password}
        onChange={(value) => setPassword(value)}
        locale={locale}
        inputAttr={{
          type: "password",
          onKeyUp: (event) => event.key === "Enter" && handleSubmit(),
        }}
      />
      <Actions>
        <Button
          appearance="filled"
          loading={loading || undefined}
          onClick={handleSubmit}
        >
          {t("logIn.action.logIn")}
        </Button>
      </Actions>
    </Section>
  );
};

/**
 * A locale selector, a Forgot Password process initiator, and a link to the
 * Help page (now just a prompt to email SK IT Solutions).
 *
 * @returns A Section.
 */
const OptionsSection: FC = () => {
  const locale = useLocale();
  const { t } = useTranslation("landing", { keyPrefix: "main.options" });

  const refreshProps = useRefreshProps();

  // Dialog control
  const [magicLinkOpen, setMagicLinkOpen] = useState<boolean>(false);

  return (
    <Section className="!gap-4">
      {/* Language selector */}
      <Select
        appearance="outlined"
        label={t("language")}
        leading={<MaterialIcon icon="translate" />}
        locale={locale}
        value={locale}
        onChange={(locale) => {
          // Remember the preference
          localStorage.setItem("preferredLang", locale);
          // Redirect to the new language
          refreshProps({ locale });
        }}
      >
        <MenuItem value="en-US">English</MenuItem>
        <MenuItem value="th">ภาษาไทย</MenuItem>
      </Select>

      {/* Actions */}
      <Actions
        align="full"
        className="grid-cols-1 sm:mr-12 sm:!grid md:mr-0 md:!flex"
      >
        {/* Magic link */}
        <Button appearance="tonal" onClick={() => setMagicLinkOpen(true)}>
          {t("action.magicLink")}
        </Button>
        <MagicLinkDialog
          open={magicLinkOpen}
          onClose={() => setMagicLinkOpen(false)}
        />

        {/* Help */}
        <Button
          appearance="tonal"
          // TODO: Change this back to `/help` when the Help page is done
          href="https://docs.google.com/document/d/1yAEVK09BgbpFIPpG5j1xvfCRUGUdRyL9S1gAxh9UjfU/edit?usp=share_link"
          // eslint-disable-next-line react/display-name
          element={forwardRef((props, ref) => (
            <a
              {...props}
              ref={ref}
              onClick={() =>
                va.track("Open User Guide", { location: "Landing" })
              }
              target="_blank"
              rel="noreferrer"
            />
          ))}
        >
          {t("action.help")}
        </Button>
      </Actions>
    </Section>
  );
};

/**
 * A summary of all the changes in the latest patch (and the latest minor and
 * major versions). Must be manually updated here in every update.
 *
 * @returns A Section.
 */
const PatchNotesSection: FC = () => {
  const { t } = useTranslation("landing", { keyPrefix: "aside.patchNotes" });

  return (
    <Section className="!gap-5">
      <Header className="skc-headline-large">
        {t("title", {
          version: process.env.NEXT_PUBLIC_VERSION || "[Preview]",
        })}
      </Header>
      <p className="skc-title-large">{t("subtitle")}</p>
      <ul className="skc-body-medium list-disc pl-6">
        <li>{t("list.1")}</li>
        <li>{t("list.2")}</li>
        <li>{t("list.3")}</li>
      </ul>
      <p>
        <a
          href="https://github.com/suankularb-wittayalai-school/mysk-frontend/pulls?q=is%3Apr+is%3Aclosed+base%3Amain+release+in%3Atitle"
          target="_blank"
          rel="noreferrer"
          className="link"
        >
          {t("action.more")}
        </a>
      </p>
    </Section>
  );
};

/**
 * Credits to supervisors, developers, and organizations involved in creating
 * and maintaining MySK.
 *
 * @returns 2 Sections.
 */
const CreditsSection: FC = () => {
  const { t } = useTranslation("landing", { keyPrefix: "aside.credits" });

  return (
    <>
      <Section className="skc-body-small !gap-2">
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
      </Section>
      <section className="flex flex-row items-center justify-end gap-4">
        <MultiSchemeImage
          srcLight={SKELCLight}
          srcDark={SKELCDark}
          alt={t("logo.skelc")}
          priority
        />
        <MultiSchemeImage
          srcLight={SKISoLight}
          srcDark={SKISoDark}
          alt={t("logo.skiso")}
          priority
        />
      </section>
    </>
  );
};

/**
 * The landing for users who have not yet logged in. Contains the form for
 * logging in, links to public pages, patch notes, and credits.
 *
 * @returns A Page.
 */
const LandingPage: CustomPage = () => {
  const { t } = useTranslation(["landing", "common"]);

  // Log in (both methods) redirect
  const user = useUser();
  const supabase = useSupabaseClient();
  const router = useRouter();
  useEffect(() => {
    if (!user) return;
    (async () => {
      // Get the user metadata to figure where to redirect to
      const { data: metadata, error: metadataError } = await getUserMetadata(
        supabase,
        user.id
      );
      if (metadataError) return false;

      // Onboard the user if this is their first log in
      if (!metadata!.onboarded) {
        router.push("/account/welcome");
        return true;
      }

      // Redirect the user accoridng to their role
      if (metadata!.role === "teacher") router.push("/teach");
      if (metadata!.role === "student") router.push("/learn");
    })();
  }, [user?.id]);

  return (
    <>
      <Head>
        <title>{t("brand.name", { ns: "common" })}</title>
        <meta
          name="description"
          content={t("brand.description", { ns: "common" })}
        />
      </Head>

      {/* Background */}
      <MultiSchemeImage
        srcLight={LandingBackgroundLight}
        srcDark={LandingBackgroundDark}
        alt=""
        priority
        className="fixed inset-0 -z-10 [&_img]:h-full [&_img]:object-cover"
      />

      {/* Content */}
      <ContentLayout className="overflow-hidden md:overflow-visible">
        <div
          className="-mt-8 grid grid-cols-1 gap-6 sm:my-4
            sm:grid-cols-2 md:grid-cols-[minmax(0,4fr),5fr,3fr]"
        >
          <div className="flex flex-col-reverse sm:contents">
            {/* Main section */}
            <Section className="relative z-20 mx-4 !gap-12 sm:mx-0">
              <h1 className="skc-display-large lg:min-w-[12ch]">
                {t("main.title")}
              </h1>
              <div className="flex flex-col gap-8">
                <LogInSection />
                <Divider />
                <OptionsSection />
              </div>
            </Section>

            {/* Image */}
            <div className="h-[28rem]">
              <div
                className="relative grid h-full place-content-center sm:fixed
                  sm:-right-8 sm:top-8 sm:h-[calc(100vh-5rem)] md:static"
              >
                <MultiSchemeImage
                  srcLight={LandingPhoneLight}
                  srcDark={LandingPhoneDark}
                  alt={t("imageAlt")}
                  priority
                  className="-mx-[18rem] h-full max-w-[calc(100vw+36rem)]"
                />
              </div>
            </div>
          </div>

          {/* Supplementary section */}
          <Section className="z-10 mx-4 mt-16 !gap-9 sm:mx-0 md:mt-0">
            <PatchNotesSection />
            <CreditsSection />
          </Section>
        </div>
      </ContentLayout>
    </>
  );
};

export const getStaticProps = async ({ locale }: { locale: LangCode }) => ({
  props: await serverSideTranslations(locale, ["common", "account", "landing"]),
});

LandingPage.navType = "hidden";

export default LandingPage;
