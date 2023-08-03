/**
 * `/` TABLE OF CONTENTS
 *
 * Note: `Ctrl` + click to jump to a component.
 *
 * **Sections**
 * - {@link LogInSection}
 * - {@link PatchNotesSection}
 *
 * **Page**
 * - {@link LandingPage}
 */

// Imports
import MultiSchemeImage from "@/components/common/MultiSchemeImage";
import MySKDark from "@/public/images/brand/mysk-dark.svg";
import MySKLight from "@/public/images/brand/mysk-light.svg";
import BlobsFullDark from "@/public/images/graphics/blobs/full-dark.svg";
import BlobsFullLight from "@/public/images/graphics/blobs/full-light.svg";
import { useOneTapSignin } from "@/utils/helpers/auth";
import { useLocale } from "@/utils/hooks/i18n";
import { usePreferences } from "@/utils/hooks/preferences";
import { usePageIsLoading, useRefreshProps } from "@/utils/hooks/routing";
import { CustomPage, LangCode } from "@/utils/types/common";
import {
  Button,
  Columns,
  ContentLayout,
  MaterialIcon,
  Progress,
  SegmentedButton,
  useBreakpoint,
} from "@suankularb-components/react";
import { LayoutGroup } from "framer-motion";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { FC, forwardRef, useEffect, useRef, useState } from "react";

/**
 * A form for logging in.
 *
 * @returns A `<section>`.
 */
const LogInSection: FC = () => {
  const { t } = useTranslation("landing", { keyPrefix: "main" });

  const sectionRef = useRef<HTMLDivElement>(null);

  const { atBreakpoint } = useBreakpoint();
  const [buttonWidth, setButtonWidth] = useState<number>();

  useOneTapSignin({
    redirect: false,
    parentButtonID: "button-google-sign-in",
    buttonWidth,
  });

  function handleResize() {
    setButtonWidth(
      (sectionRef?.current as HTMLDivElement)?.clientWidth -
        (atBreakpoint === "base" ? 32 : 36),
    );
  }
  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex flex-col gap-6 bg-surface"
    >
      {/* Header */}
      <div>
        <MultiSchemeImage
          srcLight={MySKLight}
          srcDark={MySKDark}
          alt={t("logoAlt")}
          className="[&>img]:w-16"
        />
        <h2 className="skc-headline-medium">{t("title")}</h2>
      </div>

      {/* Log in with Google */}
      <div className="flex grow flex-col gap-2">
        <div
          id="button-google-sign-in"
          className="h-[38px] rounded-full [color-scheme:light]
            [&:not(:has(iframe))]:animate-pulse
            [&:not(:has(iframe))]:bg-surface-variant"
        />
        <p className="skc-body-small mx-4 text-on-surface-variant">
          {t("googleHelper")}
        </p>
      </div>

      {/* Supplementary actions */}
      <div className="flex flex-col gap-2 [&>*]:!bg-surface-3 [&>*]:state-layer:!bg-primary">
        <Button
          appearance="tonal"
          icon={<MaterialIcon icon="help" />}
          href="https://docs.google.com/document/d/1yAEVK09BgbpFIPpG5j1xvfCRUGUdRyL9S1gAxh9UjfU/edit?usp=sharing"
          // eslint-disable-next-line react/display-name
          element={forwardRef((props, ref) => (
            <a ref={ref} {...props} target="_blank" rel="noreferrer" />
          ))}
        >
          {t("action.help")}
        </Button>
        <Button
          appearance="tonal"
          icon={<MaterialIcon icon="report" />}
          href="https://forms.gle/v73WxeTx4hE9fbSX6"
          // eslint-disable-next-line react/display-name
          element={forwardRef((props, ref) => (
            <a ref={ref} {...props} target="_blank" rel="noreferrer" />
          ))}
        >
          {t("action.report")}
        </Button>
      </div>
    </section>
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
  const [visibleLocale, setVisibleLocale] = useState<LangCode>(locale);
  const { t } = useTranslation("landing", { keyPrefix: "aside" });

  const { setPreference } = usePreferences();
  const refreshProps = useRefreshProps();

  function changeLocaleTo(locale: LangCode) {
    // Give immediate visual feedback
    setVisibleLocale(locale);
    // Remember the preference
    setPreference("locale", locale);
    // Redirect to the new language
    refreshProps({ locale });
  }

  return (
    <section className="relative flex flex-col gap-6 bg-surface-variant">
      {/* Language Switcher */}
      <SegmentedButton
        alt={t("languageSwitcher.title")}
        full
        className="rounded-full bg-surface sm:mb-2"
      >
        <Button
          appearance="outlined"
          selected={visibleLocale === "th"}
          onClick={() => changeLocaleTo("th")}
        >
          {t("languageSwitcher.th")}
        </Button>
        <Button
          appearance="outlined"
          selected={visibleLocale === "en-US"}
          onClick={() => changeLocaleTo("en-US")}
        >
          {t("languageSwitcher.en")}
        </Button>
      </SegmentedButton>

      {/* Patch notes */}
      <article aria-label={t("patchNotes.alt")} className="contents">
        <header>
          <h2 className="skc-title-small text-on-surface-variant">
            {t("patchNotes.overline", {
              version: process.env.NEXT_PUBLIC_VERSION || "Preview",
            })}
          </h2>
          <p className="skc-title-large">{t("patchNotes.title")}</p>
        </header>
        <ul className="grow list-disc pl-6">
          <li>{t("patchNotes.list.1")}</li>
          <li>{t("patchNotes.list.2")}</li>
          <li>{t("patchNotes.list.3")}</li>
        </ul>
      </article>

      {/* Links */}
      <p className="skc-body-small">
        <a
          href="https://github.com/suankularb-wittayalai-school/mysk-frontend/pulls?q=is%3Apr+is%3Aclosed+base%3Amain+release+in%3Atitle"
          target="_blank"
          className="link"
        >
          {t("action.patchNotes")}
        </a>
      </p>
    </section>
  );
};

/**
 * The landing for users who have not yet logged in. Contains the Google Sign
 * In (GSI) Button, help links, patch notes, and credits.
 *
 * @returns A Page.
 */
const LandingPage: CustomPage = () => {
  const { t } = useTranslation("landing");
  const { t: tx } = useTranslation("common");

  const { pageIsLoading } = usePageIsLoading();

  return (
    <>
      <Head>
        <title>{tx("brand.name")}</title>
        <meta name="description" content={tx("brand.description")} />
        <meta
          name="theme-color"
          content="#fbfcff"
          media="(prefers-color-scheme: light)"
          key="theme-light"
        />
        <meta
          name="theme-color"
          content="#191c1e"
          media="(prefers-color-scheme: dark)"
          key="theme-dark"
        />
      </Head>

      {/* Page Loading Indicator */}
      <Progress
        appearance="linear"
        alt={tx("pageLoading")}
        visible={pageIsLoading}
      />

      {/* Background */}
      <MultiSchemeImage
        srcLight={BlobsFullLight}
        srcDark={BlobsFullDark}
        alt=""
        priority
        className="fixed inset-0 -z-10 [&_img]:h-full [&_img]:object-cover"
      />

      {/* Content */}
      <ContentLayout className="overflow-hidden md:overflow-visible">
        <Columns columns={6}>
          <div
            className="col-span-2 mx-4 flex min-h-[calc(100vh-4rem)] flex-col
              gap-6 supports-[height:100svh]:min-h-[calc(100svh-4rem)]
              sm:col-span-4 sm:mx-0 md:col-start-2"
          >
            <LayoutGroup>
              {/* Main section (centers the card) */}
              <div className="flex grow flex-col justify-center">
                {/* Card */}
                <div
                  className="grid overflow-hidden rounded-xl border-1
                    border-outline-variant md:grid-cols-2 [&>*]:p-6 [&>*]:px-4
                    [&>*]:sm:p-6 [&>:first-child]:md:pr-3
                    [&>:last-child]:md:pl-3"
                >
                  <LogInSection />
                  <PatchNotesSection />
                </div>
              </div>

              {/* Credits */}
              <p className="skc-body-small text-on-surface-variant">
                {t("credits")}
              </p>
            </LayoutGroup>
          </div>
        </Columns>

        {/* Add bottom padding when Google One Tap UI displays if on mobile so
            as to not cover the footer */}
        <style jsx global>{`
          body:has(> #credential_picker_iframe) .skc-content-layout {
            padding-bottom: 9.5625rem;
          }

          @media only screen and (min-width: 600px) {
            body:has(> #credential_picker_iframe) .skc-content-layout {
              padding-bottom: 2rem;
            }
          }
        `}</style>
      </ContentLayout>
    </>
  );
};

export const getStaticProps = async ({ locale }: { locale: LangCode }) => ({
  props: await serverSideTranslations(locale, ["common", "account", "landing"]),
});

LandingPage.navType = "hidden";

export default LandingPage;
