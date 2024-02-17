// Imports
import PageHeader from "@/components/common/PageHeader";
import ManagePageCard from "@/components/manage/ManagePageCard";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import getUserByEmail from "@/utils/backend/account/getUserByEmail";
import getISODateString from "@/utils/helpers/getISODateString";
import lastWeekday from "@/utils/helpers/lastWeekday";
import { CustomPage, LangCode } from "@/utils/types/common";
import { User, UserRole } from "@/utils/types/person";
import {
  Button,
  Columns,
  ContentLayout,
  MaterialIcon,
} from "@suankularb-components/react";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
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
 *
 * @param user The currently logged in user.
 */
const ManagePage: CustomPage<{ user: User }> = ({ user }) => {
  const { t } = useTranslation("manage");
  const { t: tx } = useTranslation("common");

  const router = useRouter();

  const title = user.role === UserRole.management ? tx("appName") : t("title");
  const attendanceURL =
    "/manage/attendance/" + getISODateString(lastWeekday(new Date()));

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <PageHeader>{title}</PageHeader>
      <ContentLayout>
        <Columns columns={2} className="mx-4 sm:mx-0">
          <ManagePageCard
            icon={<MaterialIcon icon="assignment_turned_in" size={48} />}
            title={t("attendance.title")}
            desc={t("attendance.desc")}
          >
            <Button appearance="filled" href={attendanceURL} element={Link}>
              {t("attendance.action.seeMore")}
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
            icon={<MaterialIcon icon="person_check" size={48} />}
            title={t("participation.title")}
            desc={t("participation.desc")}
          >
            <Button
              appearance="filled"
              href="/manage/participation"
              element={Link}
            >
              {t("participation.action.seeMore")}
            </Button>
          </ManagePageCard>
        </Columns>
      </ContentLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  req,
  res,
}) => {
  const supabase = createPagesServerClient({
    req: req as NextApiRequest,
    res: res as NextApiResponse,
  });

  const session = await getServerSession(req, res, authOptions);
  const { data: user } = await getUserByEmail(supabase, session!.user!.email!);

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "manage",
      ])),
      user,
    },
  };
};

export default ManagePage;
