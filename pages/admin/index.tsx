import PageHeader from "@/components/common/PageHeader";
import ManagePageCard from "@/components/manage/ManagePageCard";
import cn from "@/utils/helpers/cn";
import { CustomPage, LangCode } from "@/utils/types/common";
import {
  Button,
  Columns,
  ContentLayout,
  MaterialIcon,
  Text,
} from "@suankularb-components/react";
import { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { usePlausible } from "next-plausible";
import Head from "next/head";
import Link from "next/link";
import { forwardRef } from "react";

/**
 * A landing page for admins. Contains links to manage the database and the
 * schedule editor.
 */
const AdminPanelPage: CustomPage = () => {
  const { t } = useTranslation("admin");
  const { t: tx } = useTranslation("common");

  const plausible = usePlausible();

  const supabaseURL =
    "https://supabase.com/dashboard/project/" +
    // Find the subdomain inside the Supabase URL.
    // (The subdomain is the project Reference ID, which is used in the URL.)
    new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname.split(".")[0] +
    "/editor";

  return (
    <>
      <Head>
        <title>{tx("tabName", { tabName: t("title") })}</title>
      </Head>
      <PageHeader>{t("title")}</PageHeader>
      <ContentLayout>
        <Columns columns={2} className="mx-4 sm:mx-0">
          <ManagePageCard
            icon={<MaterialIcon icon="bolt" size={48} />}
            title={t("supabase.title")}
            desc={t("supabase.desc")}
          >
            <Button
              appearance="filled"
              href={supabaseURL}
              onClick={() => plausible("Open Supabase Table Editor")}
              // eslint-disable-next-line react/display-name
              element={forwardRef((props, ref) => (
                <a {...props} ref={ref} target="_blank" />
              ))}
            >
              {t("supabase.action.browse")}
            </Button>
            <Button
              appearance="outlined"
              href="https://supabase.com/docs"
              // eslint-disable-next-line react/display-name
              element={forwardRef((props, ref) => (
                <a {...props} ref={ref} target="_blank" />
              ))}
            >
              {t("supabase.action.readDocs")}
            </Button>
          </ManagePageCard>
          <ManagePageCard
            icon={<MaterialIcon icon="dashboard" size={48} />}
            title={t("schedule.title")}
            desc={t("schedule.desc")}
          >
            <Button appearance="filled" href="/admin/schedule" element={Link}>
              {t("schedule.action.continue")}
            </Button>
          </ManagePageCard>
        </Columns>

        <div
          className={cn(`mx-4 flex flex-row items-center gap-5 rounded-xl
            bg-error-container px-6 py-5 text-error sm:mx-auto
            md:w-[calc(50%-3rem)]`)}
        >
          <MaterialIcon icon="warning" />
          <Text type="title-medium">{t("warning")}</Text>
        </div>
      </ContentLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale as LangCode, ["common", "admin"])),
  },
});

export default AdminPanelPage;
