import PageHeader from "@/components/common/PageHeader";
import ManagePageCard from "@/components/manage/ManagePageCard";
import useMySKClient from "@/utils/backend/mysk/useMySKClient";
import getISODateString from "@/utils/helpers/getISODateString";
import lastWeekday from "@/utils/helpers/lastWeekday";
import { CustomPage } from "@/utils/types/common";
import { UserRole } from "@/utils/types/person";
import {
  Button,
  Columns,
  ContentLayout,
  MaterialIcon,
} from "@suankularb-components/react";
import { toZonedTime } from "date-fns-tz";
import { GetStaticProps } from "next";
import useTranslation from "next-translate/useTranslation";
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
  const { t: ta } = useTranslation("manage/attendance");
  const { t: te } = useTranslation("manage/elective");
  const { t: tc } = useTranslation("manage/classrooms");
  const { t: tp } = useTranslation("manage/participation");
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
            title={ta("title")}
            desc={ta("desc")}
          >
            <Button appearance="filled" href={attendanceURL} element={Link}>
              {ta("action.showMore")}
            </Button>
            <Button
              appearance="outlined"
              onClick={async () => {
                await router.push(attendanceURL);
                setTimeout(() => window.print(), 1000);
              }}
            >
              {ta("action.print")}
            </Button>
          </ManagePageCard>
          <ManagePageCard
            icon={<MaterialIcon icon="collections_bookmark" size={48} />}
            title={te("title")}
            desc={te("desc")}
          >
            <Button appearance="filled" href="/manage/electives" element={Link}>
              {te("action.showMore")}
            </Button>
            <Button
              appearance="outlined"
              href="/manage/electives/print"
              element={Link}
            >
              {te("action.print")}
            </Button>
          </ManagePageCard>
          <ManagePageCard
            icon={<MaterialIcon icon="groups" size={48} />}
            title={tc("title")}
            desc={tc("desc")}
          >
            <Button
              appearance="filled"
              href="/manage/classrooms/print"
              element={Link}
            >
              {tc("action.print")}
            </Button>
          </ManagePageCard>
          <ManagePageCard
            icon={<MaterialIcon icon="person_check" size={48} />}
            title={tp("title")}
            desc={tp("desc")}
          >
            <Button
              appearance="filled"
              href="/manage/participation"
              element={Link}
            >
              {tp("action.showMore")}
            </Button>
          </ManagePageCard>
        </Columns>
      </ContentLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = () => ({ props: {} });

export default ManagePage;
