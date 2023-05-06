// External libraries
import { useSupabaseClient } from "@supabase/auth-helpers-react";

import Head from "next/head";
import { useRouter } from "next/router";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { FC, useContext, useEffect, useState } from "react";

// SK Components
import {
  Actions,
  Button,
  Columns,
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
import RequestForgorDialog from "@/components/account/RequestForgorDialog";
import MultiSchemeImage from "@/components/common/MultiSchemeImage";

// Contexts
import SnackbarContext from "@/contexts/SnackbarContext";

// Images
import LandingBackgroundLight from "@/public/images/graphics/landing/background-light.svg";
import LandingBackgroundDark from "@/public/images/graphics/landing/background-dark.svg";
import LandingPhoneLight from "@/public/images/graphics/landing/phone-light.svg";
import LandingPhoneDark from "@/public/images/graphics/landing/phone-dark.svg";
import SKISoLight from "@/public/images/orgs/skiso-light.svg";
import SKISoDark from "@/public/images/orgs/skiso-dark.svg";
import SKELCLight from "@/public/images/orgs/skelc-light.svg";
import SKELCDark from "@/public/images/orgs/skelc-dark.svg";

// Backend
import { getUserMetadata } from "@/utils/backend/account";

// Helpers
import { cn } from "@/utils/helpers/className";
import { withLoading } from "@/utils/helpers/loading";

// Hooks
import { useLocale } from "@/utils/hooks/i18n";
import { useToggle } from "@/utils/hooks/toggle";

// Types
import { CustomPage, LangCode } from "@/utils/types/common";

const LoginSection: FC = () => {
  // Router
  const locale = useLocale();
  const router = useRouter();

  // Translation
  const { t } = useTranslation(["account", "landing"]);

  // Snackbar
  const { setSnackbar } = useContext(SnackbarContext);

  // Supabase
  const supabase = useSupabaseClient();

  // Form control
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // Form submission
  const [loading, toggleLoading] = useToggle();

  function validate(): boolean {
    if (!email || email.endsWith("sk.ac.th")) return false;
    if (!password) return false;

    return true;
  }

  async function handleSubmit() {
    // Set the current language as the preferred language
    // (If the user can find and click on the Log in Button, they’re most
    // likely most comfortable in the current language)
    localStorage.setItem("preferredLang", locale);

    // Disable Log in Button
    withLoading(async () => {
      // Validate response
      if (!validate()) {
        setSnackbar(
          <Snackbar>{t("snackbar.formInvalid", { ns: "common" })}</Snackbar>
        );
        return false;
      }

      // Log in user in Supabase
      const {
        data: { session },
        error,
      } = await supabase.auth.signInWithPassword({
        email: [email, "sk.ac.th"].join(""),
        password,
      });

      // If the user enter a wrong email or password, inform them
      if (error?.name === "AuthApiError")
        setSnackbar(<Snackbar>{t("snackbar.invalidCreds")}</Snackbar>);

      if (!session || error) return false;

      // Get the user metadata to figure where to redirect to
      const { data: metadata, error: metadataError } = await getUserMetadata(
        supabase,
        session.user.id
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
        error={email.endsWith("sk.ac.th")}
        value={email}
        onChange={(value) => setEmail(value.split("sk.ac.th", 1)[0])}
        locale={locale}
        inputAttr={{ autoCapitalize: "off" }}
      />
      <TextField<string>
        appearance="outlined"
        label={t("logIn.form.password")}
        value={password}
        onChange={(value) => setPassword(value)}
        locale={locale}
        inputAttr={{ type: "password" }}
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

const OptionsSection: FC = () => {
  const locale = useLocale();
  const router = useRouter();

  return (
    <Section className="!gap-4">
      <Select
        appearance="outlined"
        label="Language"
        leading={<MaterialIcon icon="translate" />}
        locale={locale}
        value={locale}
        onChange={(locale) => {
          // Remember the preference
          localStorage.setItem("preferredLang", locale);
          // Redirect back
          router.replace(router.asPath, router.asPath, { locale });
        }}
      >
        <MenuItem value="en-US">English</MenuItem>
        <MenuItem value="th">ภาษาไทย</MenuItem>
      </Select>
      <Actions
        align="full"
        className="grid-cols-1 sm:mr-12 sm:!grid md:mr-0 md:!flex"
      >
        <Button appearance="tonal">Instant log in</Button>
        <Button appearance="tonal">Help</Button>
      </Actions>
    </Section>
  );
};

const PatchNotesSection: FC = () => {
  return (
    <Section className="!gap-5">
      <Header className="skc-headline-large">New in 0.4.0</Header>
      <p className="skc-title-large">
        This version brings a brand new MySK experience.
      </p>
      <ul className="skc-body-medium list-disc pl-6">
        <li>A completely redesigned interface</li>
        <li>MySK Lookup: a database of the entire school at your fingertips</li>
        <li>Bug fixes</li>
      </ul>
      <a
        href="https://github.com/suankularb-wittayalai-school/mysk-frontend/pulls?q=is%3Apr+is%3Aclosed+base%3Amain+release+in%3Atitle"
        target="_blank"
        rel="noreferrer"
        className="link"
      >
        More patch notes…
      </a>
    </Section>
  );
};

// Page
const IndexPage: CustomPage = () => {
  // Translation
  const locale = useLocale();
  const { t } = useTranslation(["landing", "common"]);

  // Language detection redirect
  // Thanks @Jimmy-Tempest!
  const router = useRouter();
  const { setSnackbar } = useContext(SnackbarContext);
  useEffect(() => {
    // Attempt to get the user’s preferred language from local storage
    const preferredLang = localStorage.getItem("preferredLang");

    if (preferredLang) {
      // If the user is already looking at the correct language, don’t redirect
      if (preferredLang === locale) return;

      // Otherwise, redirect to the correct language
      router.replace(router.asPath, router.asPath, { locale: preferredLang });
    }

    // If the user has not set a preferred language, set it to the current one
    else {
      const browserLocale = navigator.language;

      // If the user is already looking at the correct language, don’t redirect
      if (browserLocale === locale) return;

      // If the browser language is not supported by MySK, set to Englsih
      if (!["th", "en-US"].includes(browserLocale)) {
        localStorage.setItem("preferredLang", "en-US");
        router.replace(router.asPath, router.asPath, { locale: "en-US" });
      }

      // Otherwise, set to the browser language
      else {
        localStorage.setItem("preferredLang", browserLocale);

        // Then redirect the user
        router.replace(router.asPath, router.asPath, {
          locale: browserLocale,
        });
      }
    }

    setSnackbar(
      <Snackbar
        action={
          // An option to stay in the current language
          <Button
            appearance="text"
            onClick={() => {
              // Remember the preference
              localStorage.setItem("preferredLang", locale);
              // Redirect back
              router.replace(router.asPath, router.asPath, { locale });
            }}
          >
            {t("snackbar.languageRedirect.action", { ns: "common" })}
          </Button>
        }
      >
        {t("snackbar.languageRedirect.message", { ns: "common" })}
      </Snackbar>
    );
  }, []);

  return (
    <>
      <Head>
        <title>{t("brand.name", { ns: "common" })}</title>
        <meta
          name="description"
          content={t("brand.description", { ns: "common" })}
        />
      </Head>
      <MultiSchemeImage
        srcLight={LandingBackgroundLight}
        srcDark={LandingBackgroundDark}
        alt=""
        className="fixed inset-0 -z-10 [&_img]:h-full [&_img]:object-cover"
      />
      <ContentLayout>
        <div
          className="grid grid-cols-1 gap-6 overflow-hidden sm:grid-cols-2
            sm:overflow-visible md:grid-cols-[4fr,5fr,3fr] -mt-8"
        >
          <div className="flex flex-col-reverse sm:contents">
            <Section className="relative z-10 mx-4 !gap-12 sm:mx-0">
              <h1 className="skc-display-large">Your one-stop school portal</h1>
              <div className="flex flex-col gap-8">
                <LoginSection />
                <Divider />
                <OptionsSection />
              </div>
            </Section>
            <div className="relative grid h-[28rem] sm:h-[calc(100vh-4rem)] place-content-center">
              <MultiSchemeImage
                srcLight={LandingPhoneLight}
                srcDark={LandingPhoneDark}
                alt="Pink and blue hand holding phone with MySK logo."
                className="relative -mx-[18rem] h-full max-w-[calc(100vw+36rem)]
                  sm:-right-16 md:right-0"
              />
            </div>
          </div>

          <Section className="z-10 mx-4 !gap-9 sm:mx-0">
            <PatchNotesSection />
            <Section className="skc-body-small !gap-2">
              <p>
                MySK is supervised by Supannee Supeerath and Atipol
                Sukrisadanon.
              </p>
              <p>
                Its development was led by Siravit Phokeed and Smart
                Wattanapornmongkol with help from Sadudee Theparree and Tempoom
                Leelacharoen.
              </p>
              <p>
                Translations to Thai contributed by{" "}
                <a
                  href="https://www.instagram.com/sk.elc/"
                  target="_blank"
                  rel="noreferrer"
                  className="link"
                >
                  Suankularb English Club
                </a>
                .
              </p>
            </Section>

            <section className="flex flex-row items-center justify-end gap-4">
              <MultiSchemeImage
                srcLight={SKELCLight}
                srcDark={SKELCDark}
                alt="Suankularb English Club"
              />
              <MultiSchemeImage
                srcLight={SKISoLight}
                srcDark={SKISoDark}
                alt="SK IT Solutions"
              />
            </section>
          </Section>
        </div>
      </ContentLayout>
    </>
  );
};

export const getStaticProps = async ({ locale }: { locale: LangCode }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "account", "landing"])),
  },
});

IndexPage.navType = "hidden";

export default IndexPage;
