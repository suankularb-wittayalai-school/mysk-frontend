import ProfileNavigation from "@/components/account/ProfileNavigation";
import PageHeader from "@/components/common/PageHeader";
import { CustomPage, LangCode } from "@/utils/types/common";
import { ContentLayout } from "@suankularb-components/react";
import { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";

const ProfilePage: CustomPage = () => {
  const { t } = useTranslation("account");
  const { t: tx } = useTranslation("common");

  return (
    <>
      <Head>
        <title>{tx("tabName", { tabName: "Profile" })}</title>
      </Head>
      <PageHeader>Profile</PageHeader>
      <ContentLayout>
        <ProfileNavigation className="mx-1 sm:-mx-3" />
      </ContentLayout>
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

export default ProfilePage;
