// Modules
import type { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// Page
const Developers: NextPage = (): JSX.Element => (
  <main className="content-layout"></main>
);

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "about"])),
  },
});

export default Developers;
