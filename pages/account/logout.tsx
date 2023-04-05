// External libraries
import { useSupabaseClient } from "@supabase/auth-helpers-react";

import { GetStaticProps } from "next";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { useEffect } from "react";

// SK Components
import { Progress } from "@suankularb-components/react";

// Types
import { CustomPage, LangCode } from "@/utils/types/common";

const LogOutPage: CustomPage = () => {
  // Translation
  const { t } = useTranslation("account");

  // Log the user out
  const supabase = useSupabaseClient();
  useEffect(() => {
    supabase.auth.signOut();
  }, []);

  return (
    <div
      className="-mb-20 grid min-h-screen place-content-center
        supports-[height:100svh]:min-h-[100svh] sm:mb-0"
    >
      <div className="flex flex-col items-center gap-4">
        <Progress appearance="circular" alt="Logging you out…" visible />
        <h1 className="skc-label-large">{t("logOut.loading")}</h1>
      </div>
    </div>
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
