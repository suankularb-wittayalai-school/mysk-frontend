// External libraries
import { useSupabaseClient } from "@supabase/auth-helpers-react";

import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import { Trans, useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { FC, useContext, useEffect, useState } from "react";

// SK Components
import {
  Actions,
  Button,
  Columns,
  ContentLayout,
  Header,
  MaterialIcon,
  Section,
  Snackbar,
  TextField,
} from "@suankularb-components/react";

// Internal components
import RequestForgorDialog from "@/components/account/RequestForgorDialog";
import MultiSchemeImage from "@/components/common/MultiSchemeImage";

// Contexts
import SnackbarContext from "@/contexts/SnackbarContext";

// Images
import LandingImageLight from "@/public/images/landing-light.webp";
import LandingImageDark from "@/public/images/landing-dark.webp";

// Backend
import { getUserMetadata } from "@/utils/backend/account";

// Helpers
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

      if (error?.name === "AuthApiError")
        setSnackbar(<Snackbar>{t("snackbar.invalidCreds")}</Snackbar>);

      if (!session || error) return false;

      const { data: metadata, error: metadataError } = await getUserMetadata(
        supabase,
        session.user.id
      );
      if (metadataError) return false;

      // Onboard the user if this is their first log in
      if (!metadata!.onboarded) router.push("/account/welcome");

      // Role redirect
      if (metadata!.role == "teacher") router.push("/teach");
      if (metadata!.role == "student") router.push("/learn");

      return true;
    }, toggleLoading);
  }

  // Forgot Password Dialog control
  const [showForgor, setShowForgor] = useState<boolean>(false);

  return (
    <Section className="!gap-y-5">
      <Header>{t("logIn.title")}</Header>
      <Columns columns={3}>
        <div className="col-span-2 flex flex-col gap-4">
          <TextField<string>
            appearance="outlined"
            label={t("logIn.form.email")}
            align="right"
            trailing="sk.ac.th"
            error={email.endsWith("sk.ac.th")}
            value={email}
            onChange={(value) =>
              setEmail(value.endsWith("sk.ac.th") ? value.slice(0, -8) : value)
            }
            locale={locale}
            inputAttr={{ autoCapitalize: "off" }}
            className="bg-surface"
          />
          <TextField<string>
            appearance="outlined"
            label={t("logIn.form.password")}
            value={password}
            onChange={(value) => setPassword(value)}
            locale={locale}
            inputAttr={{ type: "password" }}
            className="bg-surface"
          />
          <Actions align="full">
            <Button
              appearance="outlined"
              onClick={() => setShowForgor(true)}
              className="!bg-surface"
            >
              {t("logIn.action.forgotPassword")}
            </Button>
            <RequestForgorDialog
              open={showForgor}
              onClose={() => setShowForgor(false)}
              inputEmail={email}
            />
            <Button
              appearance="filled"
              loading={loading || undefined}
              onClick={handleSubmit}
            >
              {t("logIn.action.logIn")}
            </Button>
          </Actions>
        </div>
      </Columns>
    </Section>
  );
};

const ImageSection: FC = () => (
  <div
    aria-hidden
    className="-z-10 bg-gradient-to-b from-surface-5 via-transparent
      sm:bg-none md:relative"
  >
    {/* Image in center */}
    <div
      className="md:absolute md:left-0 md:right-0 md:h-[calc(100vh-6rem)]
        supports-[height:100svh]:md:h-[calc(100svh-6rem)]"
    >
      <MultiSchemeImage
        srcLight={LandingImageLight}
        srcDark={LandingImageDark}
        width={1080}
        height={1080}
        priority
        alt=""
        className="relative md:absolute md:right-[-10.5rem] md:left-[-10.5rem]
          md:top-1/2 md:-translate-y-1/2"
      />
    </div>
  </div>
);

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
      <ContentLayout className="-mb-20 !pb-6 !pt-0 sm:mb-0 md:!py-12">
        {/* 6rem is the combined padding height put on Content Layout */}
        <div
          className="flex flex-col justify-between gap-16
            md:min-h-[calc(100vh-6rem)]
            supports-[height:100svh]:md:min-h-[calc(100svh-6rem)]"
        >
          {/* Tagline, log in form, and image */}
          <Columns
            columns={2}
            className="!flex !flex-col-reverse md:!grid md:!items-stretch"
          >
            {/* Left side */}
            <div className="mx-4 sm:mx-0">
              <div className="mb-12 flex flex-col gap-4">
                {/* Tagline */}
                {/* `sm:!text-8xl sm:!leading-[4rem]` is a simulation of
                    `skc-display-large`; since that is not a Tailwind class, we
                    cannot apply the `sm:` suffix */}
                <h1
                  className="skc-display-medium sm:!text-8xl
                    sm:!leading-[4rem]"
                >
                  <Trans i18nKey="hero.title" ns="landing">
                    MySK ปีนี้มาใหม่หมด{" "}
                    <span
                      className="bg-gradient-to-r from-primary to-secondary
                      bg-clip-text font-bold text-transparent"
                    >
                      ใช้ง่าย ทำได้มากกว่าเดิม
                    </span>
                  </Trans>
                </h1>
                <p className="skc-display-medium hidden sm:block">
                  {t("hero.subtitle")}
                </p>
              </div>

              {/* Log in form */}
              <LoginSection />

              <div className="mt-9 flex flex-col gap-1">
                <div className="flex flex-row gap-1">
                  <MaterialIcon icon="contact_support" />
                  <p>
                    <Trans i18nKey="action.help" ns="landing">
                      สงสัยอะไรเปิด
                      <Link href="/help" className="link">
                        หน้าช่วยเหลือ
                      </Link>
                    </Trans>
                  </p>
                </div>
                <div className="flex flex-row gap-1">
                  <MaterialIcon icon="translate" />
                  <p>
                    <Trans i18nKey="action.changeLang" ns="landing">
                      เปลี่ยนภาษาเป็น:{" "}
                      <Link
                        href="/"
                        locale={locale == "en-US" ? "th" : "en-US"}
                        onClick={() =>
                          localStorage.setItem(
                            "preferredLang",
                            locale == "en-US" ? "th" : "en-US"
                          )
                        }
                        className="link"
                      >
                        English
                      </Link>
                    </Trans>
                  </p>
                </div>
              </div>
            </div>

            {/* Right side */}
            <ImageSection />
          </Columns>

          {/* Footnote */}
          <footer
            className="skc-body-small mx-4 text-on-surface-variant
              sm:mx-0"
          >
            <p className="mb-2 sm:mb-0">
              <Trans
                i18nKey="footnote.supervisors"
                ns="landing"
                values={{ version: "0.4.0" }}
              />
            </p>
            <p>
              <Trans
                i18nKey="footnote.developers"
                ns="landing"
                components={{
                  a: (
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href="https://github.com/suankularb-wittayalai-school/mysk-frontend/graphs/contributors"
                      className="link"
                    />
                  ),
                }}
              />
            </p>
          </footer>
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
