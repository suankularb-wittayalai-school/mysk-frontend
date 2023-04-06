// External libraries
import { useSupabaseClient } from "@supabase/auth-helpers-react";

import { motion } from "framer-motion";

import { GetStaticProps } from "next";
import Head from "next/head";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { useEffect, useState } from "react";

// SK Components
import { Actions, Button, Progress } from "@suankularb-components/react";

// Types
import { CustomPage, LangCode } from "@/utils/types/common";

const LogOutPage: CustomPage = () => {
  // Translation
  const { t } = useTranslation("account");

  // Log the user out
  const supabase = useSupabaseClient();
  const [loggedOut, setLoggedOut] = useState<boolean>(false);
  let logOutTimeout: NodeJS.Timeout;
  useEffect(() => {
    (async () => {
      await supabase.auth.signOut();
      logOutTimeout = setTimeout(() => setLoggedOut(true), 1000);
    })();
    return () => clearTimeout(logOutTimeout);
  }, []);

  return (
    <>
      <Head>
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
      </Head>
      <div
        className="-mb-20 grid min-h-screen place-content-center
        supports-[height:100svh]:min-h-[100svh] sm:mb-0"
      >
        <div className="flex flex-col items-center gap-4">
          <Progress appearance="circular" alt="Logging you out…" visible />
          <h1 className="skc-label-large">{t("logOut.loading")}</h1>
          {loggedOut && (
            <motion.div
              initial={{ opacity: 0, scale: 1.4 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Actions>
                <Button appearance="outlined">
                  {t("logOut.action.reload")}
                </Button>
                <Button appearance="tonal">
                  {t("logOut.action.goToLanding")}
                </Button>
              </Actions>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale as LangCode, [
      "common",
      "account",
    ])),
  },
});

LogOutPage.navType = "hidden";

export default LogOutPage;
