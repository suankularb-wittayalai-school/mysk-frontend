import PageHeader from "@/components/common/PageHeader";
import SakeCelebration from "@/components/home/sake/SakeCelebration";
import { StylableFC } from "@/utils/types/common";
import { ContentLayout } from "@suankularb-components/react";
import { useTranslation } from "next-i18next";
import Head from "next/head";
import { ReactNode } from "react";

/**
 * A Content Layout with all the common elements of Home pages (like Learn and
 * Teach).
 *
 * @param children The page content.
 */
const HomeLayout: StylableFC<{
  children: ReactNode;
}> = ({ children, style, className }) => {
  const { t: tx } = useTranslation("common");

  // A note on this component: don’t include any elements specific to a role,
  // as this component is for *common elements* of Home pages.

  return (
    <>
      <Head>
        <title>{tx("appName")}</title>
      </Head>
      <PageHeader>{tx("appName")}</PageHeader>
      <ContentLayout style={style} className={className}>
        {children}
        <SakeCelebration />
      </ContentLayout>
    </>
  );
};

export default HomeLayout;
