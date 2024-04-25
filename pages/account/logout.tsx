import UserContext from "@/contexts/UserContext";
import { CustomPage, LangCode } from "@/utils/types/common";
import { Progress } from "@suankularb-components/react";
import { GetStaticProps } from "next";
import { signOut } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";

/**
 * An emergency page to log the user out, in case authentication completely
 * fails.
 * 
 * We currently use 2 concurrent methods of authentication: NextAuth and MySK
 * API, and when those get out of sync somehow, we can direct users to this page
 * to log out and log back in.
 */
const LogOutPage: CustomPage = () => {
  const { t } = useTranslation("account");

  const { setUser } = useContext(UserContext);

  // Log the user out
  const router = useRouter();
  useEffect(() => {
    (async () => {
      await signOut({ redirect: false });
      setUser(null);
      document.cookie =
        "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
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
