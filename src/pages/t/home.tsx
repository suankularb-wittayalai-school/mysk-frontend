// Modules
import { GetStaticProps, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// SK Components
import { RegularLayout } from "@suankularb-components/react";

const TeacherHome: NextPage = () => {
  return <RegularLayout>Teacher Home</RegularLayout>;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale as string, [
      "common",
      "account",
      "news",
      "dashboard",
    ])),
  },
});

export default TeacherHome;
