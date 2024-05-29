import UserContext from "@/contexts/UserContext";
import { CustomPage, LangCode } from "@/utils/types/common";
import { Progress } from "@suankularb-components/react";
import { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";

/**
 * An emergency page to log the user out, in case authentication completely
 * fails.
 */
const LogOutPage: CustomPage = () => {
  const { t } = useTranslation("account");

  const { setUser } = useContext(UserContext);

  // Log the user out
  const router = useRouter();
  useEffect(() => {
    setUser(null);
    document.cookie =
      "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    router.push("/");
  }, []);

  return (
    <div className="-mb-20 grid min-h-svh place-content-center sm:mb-0">
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
