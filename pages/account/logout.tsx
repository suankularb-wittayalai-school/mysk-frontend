// Imports
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useEffect } from "react";
import { Progress } from "@suankularb-components/react";
import { CustomPage, LangCode } from "@/utils/types/common";
import { signOut } from "next-auth/react";

const LogOutPage: CustomPage = () => {
  // Translation
  const { t } = useTranslation("account");

  // Log the user out
  const router = useRouter();
  useEffect(() => {
    (async () => {
      signOut();
      router.push("/");
    })();
  }, []);

  return (
    <div
      className="-mb-20 grid min-h-screen place-content-center
        supports-[height:100svh]:min-h-[100svh] sm:mb-0"
    >
      <div className="flex flex-col items-center gap-4">
        <Progress appearance="circular" alt={t("logOut.loading")} visible />
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
