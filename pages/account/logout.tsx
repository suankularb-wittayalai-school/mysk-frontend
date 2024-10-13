import UserContext from "@/contexts/UserContext";
import { CustomPage } from "@/utils/types/common";
import { Progress, Text } from "@suankularb-components/react";
import { GetStaticProps } from "next";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";

/**
 * An emergency page to log the user out, in case authentication completely
 * fails.
 */
const LogOutPage: CustomPage = () => {
  const { t } = useTranslation("account/logOut");

  const router = useRouter();
  const { setUser } = useContext(UserContext);

  // Log the user out.
  useEffect(() => {
    setUser(null);
    document.cookie =
      "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    router.push("/");
  }, []);

  return (
    <div className="-mb-20 grid min-h-svh place-content-center sm:mb-0">
      <div className="flex flex-col items-center gap-4">
        <Progress appearance="circular" alt={t("loading")} visible />
        <Text type="label-large" element="h1">
          {t("loading")}
        </Text>
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = () => ({ props: {} });

LogOutPage.navType = "hidden";

export default LogOutPage;
