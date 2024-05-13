import PageHeader from "@/components/common/PageHeader";
import ManagePageCard from "@/components/manage/ManagePageCard";
import useMySKClient from "@/utils/backend/mysk/useMySKClient";
import getISODateString from "@/utils/helpers/getISODateString";
import lastWeekday from "@/utils/helpers/lastWeekday";
import { CustomPage, LangCode } from "@/utils/types/common";
import { UserRole } from "@/utils/types/person";
import {
  Button,
  Columns,
  ContentLayout,
  MaterialIcon,
} from "@suankularb-components/react";
import { toZonedTime } from "date-fns-tz";
import { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

/**
 * Management’s counterpart to Learn, where the user can access statistics about
 * the school. This page is only accessible to users with the
 * `can_see_management` permission.
 *
 * Management users see this page as their Home. Other users with the permission
 * can access this page from their Account page.
 */
const ManagePage: CustomPage = () => {
  const { t } = useTranslation("manage");
  const { t: tx } = useTranslation("common");

  const router = useRouter();
  const mysk = useMySKClient();

  const title =
    mysk.user?.role !== UserRole.management ? t("title") : tx("appName");
  const attendanceURL =
    "/manage/attendance/" +
    getISODateString(
      lastWeekday(toZonedTime(new Date(), process.env.NEXT_PUBLIC_SCHOOL_TZ)),
    );

  return (
    <>
      <Head>
        <title>{tx("tabName", { tabName: title })}</title>
      </Head>
      <PageHeader>{title}</PageHeader>
      <ContentLayout>
        <Columns columns={2} className="mx-4 !items-stretch sm:mx-0 sm:!gap-6">
          <ManagePageCard
            icon={<MaterialIcon icon="assignment_turned_in" size={48} />}
            title={t("attendance.title")}
            desc={t("attendance.desc")}
          >
            <Button appearance="filled" href={attendanceURL} element={Link}>
              {t("attendance.action.showMore")}
            </Button>
            <Button
              appearance="outlined"
              onClick={async () => {
                await router.push(attendanceURL);
                setTimeout(() => window.print(), 1000);
              }}
            >
              {t("attendance.action.print")}
            </Button>
          </ManagePageCard>
          <ManagePageCard
            icon={<MaterialIcon icon="collections_bookmark" size={48} />}
            title={t("electives.title")}
            desc={t("electives.desc")}
          >
            <Button appearance="filled" href="/manage/electives" element={Link}>
              {t("electives.action.showMore")}
            </Button>
            <Button
              appearance="outlined"
              href="/manage/electives/print"
              element={Link}
            >
              {t("electives.action.print")}
            </Button>
          </ManagePageCard>
          <ManagePageCard
            icon={<MaterialIcon icon="person_check" size={48} />}
            title={t("participation.title")}
            desc={t("participation.desc")}
          >
            <Button
              appearance="filled"
              href="/manage/participation"
              element={Link}
            >
              {t("participation.action.showMore")}
            </Button>
          </ManagePageCard>
        </Columns>
      </ContentLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale as LangCode, ["common", "manage"])),
  },
});

export default ManagePage;
