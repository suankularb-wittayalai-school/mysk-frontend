// Imports
import MultiSchemeImage from "@/components/common/MultiSchemeImage";
import LogInSide from "@/components/landing/LogInSide";
import PatchNotesSide from "@/components/landing/PatchNotesSide";
import BlobsFullDark from "@/public/images/graphics/blobs/full-dark.svg";
import BlobsFullLight from "@/public/images/graphics/blobs/full-light.svg";
import cn from "@/utils/helpers/cn";
import useUser from "@/utils/helpers/useUser";
import { CustomPage, LangCode } from "@/utils/types/common";
import { Columns, ContentLayout, Text } from "@suankularb-components/react";
import { LayoutGroup } from "framer-motion";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";

/**
 * The landing for users who have not yet logged in. Contains the Google Sign
 * In (GSI) Button, help links, patch notes, and credits.
 */
const LandingPage: CustomPage = () => {
  const { t } = useTranslation("landing");
  const { t: tx } = useTranslation("common");

  const router = useRouter();
  const { status } = useUser();
  useEffect(() => {
    if (status === "authenticated") router.push("/learn");
  }, [status]);

  return (
    <>
      <Head>
        <title>{tx("appName")}</title>
        <meta name="description" content={tx("brand.description")} />
      </Head>

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
            className={cn(`col-span-2 mx-4 flex min-h-[calc(100vh-4rem)]
              flex-col gap-6 supports-[height:100svh]:min-h-[calc(100svh-4rem)]
              sm:col-span-4 sm:mx-0 md:col-start-2`)}
          >
            <LayoutGroup>
              {/* Main section (centers the card) */}
              <div className="flex grow flex-col justify-center">
                {/* Card */}
                <div
                  className={cn(`grid overflow-hidden rounded-xl border-1
                    border-outline-variant md:grid-cols-2 [&>*]:p-6 [&>*]:px-4
                    [&>*]:sm:p-6 [&>:first-child]:md:pr-3
                    [&>:last-child]:md:pl-3`)}
                >
                  <LogInSide />
                  <PatchNotesSide />
                </div>
              </div>

              {/* Credits */}
              <Text
                type="body-small"
                element="p"
                className="text-on-surface-variant"
              >
                {t("credits")}
              </Text>
            </LayoutGroup>
          </div>
        </Columns>

        {/* Fix Google One Tap UI white box on dark mode */}
        <style jsx global>{`
          #credential_picker_container {
            right: 0.5rem !important;
            top: 0.5rem !important;
            color-scheme: light;
          }
        `}</style>

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
