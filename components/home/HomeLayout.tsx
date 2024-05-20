import PageHeader from "@/components/common/PageHeader";
import ScheduleInaccurateGlance from "@/components/home/glance/ScheduleInaccurateGlance";
import SakeCelebration from "@/components/home/sake/SakeCelebration";
import { StylableFC } from "@/utils/types/common";
import { ContentLayout } from "@suankularb-components/react";
import useTranslation from "next-translate/useTranslation";
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
  const { t } = useTranslation("common");

  // A note on this component: don’t include any elements specific to a role,
  // as this component is for *common elements* of Home pages.

  return (
    <>
      <Head>
        <title>{t("appName")}</title>
      </Head>
      <PageHeader>{t("appName")}</PageHeader>
      <ContentLayout style={style} className={className}>
        <ScheduleInaccurateGlance />
        {children}
        <SakeCelebration />
      </ContentLayout>
    </>
  );
};

export default HomeLayout;
