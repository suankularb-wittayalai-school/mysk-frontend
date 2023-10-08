// Imports
import PageHeader from "@/components/common/PageHeader";
import ActiveSearchFiltersCard from "@/components/lookup/ActiveSearchFiltersCard";
import LookupTeacherCard from "@/components/lookup/teachers/LookupTeacherCard";
import TeacherDetailsCard from "@/components/lookup/teachers/TeacherDetailsCard";
import { getTeacherByID } from "@/utils/backend/person/getTeacherByID";
import getTeachersByLookupFilters from "@/utils/backend/person/getTeachersByLookupFilters";
import getSubjectGroups from "@/utils/backend/subject/getSubjectGroups";
import cn from "@/utils/helpers/cn";
import getLocaleString from "@/utils/helpers/getLocaleString";
import { LangCode } from "@/utils/types/common";
import { Teacher, TeacherLookupItem } from "@/utils/types/person";
import { SubjectGroup } from "@/utils/types/subject";
import {
  Button,
  Card,
  CardHeader,
  FullscreenDialog,
  MaterialIcon,
  SplitLayout,
  Text,
  transition,
  useAnimationConfig,
  useBreakpoint,
} from "@suankularb-components/react";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { motion } from "framer-motion";
import {
  GetServerSideProps,
  NextApiRequest,
  NextApiResponse,
  NextPage,
} from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import Link from "next/link";
import { alphabetical, camel } from "radash";
import { useEffect, useState } from "react";
import Balancer from "react-wrap-balancer";

export type SearchFilters = Partial<{
  fullName: string;
  nickname: string;
  subjectGroup: number;
  classroom: string;
  contact: string;
}>;

const LookupTeachersResultsPage: NextPage<{
  filters: SearchFilters;
  subjectGroups: SubjectGroup[];
  teachers: TeacherLookupItem[];
}> = ({ filters, subjectGroups, teachers }) => {
  // Translation
  const { t } = useTranslation("lookup", { keyPrefix: "teachers" });
  const { t: tx } = useTranslation(["lookup", "common"]);

  const { duration, easing } = useAnimationConfig();

  const [selectedID, setSelectedID] = useState<string>();
  // Select the first result automatically after a short delay
  useEffect(() => {
    const timeout = setTimeout(
      () => setSelectedID(teachers[0]?.id),
      duration.medium2 * 1000,
    );
    return () => clearTimeout(timeout);
  }, []);

  const supabase = useSupabaseClient();
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher>();
  // Fetch the selected Teacher when the selected Teacher ID changes
  useEffect(() => {
    (async () => {
      // Clear the selected Teacher data first
      // (This, combined with some more logic in child components, prevents the
      // old Teacher data from flashing at selected Teacher ID change)
      setSelectedTeacher(undefined);
      if (!selectedID) return false;

      // Fetch the selected Teacher with the selected ID
      const { data, error } = await getTeacherByID(supabase, selectedID, {
        detailed: true,
        includeContacts: true,
      });
      if (error) return false;

      // Set the state
      setSelectedTeacher(data);
      return true;
    })();
  }, [selectedID]);

  const [detailsOpen, setDetailsOpen] = useState(false);

  // Open the Teacher Details Dialog on mobile, otherwise close it
  const { atBreakpoint } = useBreakpoint();
  useEffect(() => {
    if (atBreakpoint !== "base") setDetailsOpen(false);
    else if (selectedID) setDetailsOpen(true);
  }, [atBreakpoint === "base"]);

  return (
    <>
      <Head>
        <title>{tx("tabName", { tabName: t("title"), ns: "common" })}</title>
      </Head>
      <PageHeader parentURL="/lookup/teachers">{t("title")}</PageHeader>
      <SplitLayout
        ratio="list-detail"
        className="sm:[&>div]:!grid-cols-2 md:[&>div]:!grid-cols-3"
      >
        <section
          className={cn(
            `flex flex-col sm:block sm:!pb-0 md:flex md:!overflow-visible`,
            teachers.length === 0 && `h-[calc(100dvh-9rem)] sm:flex`,
          )}
        >
          {/* Active Search Filters */}
          {Object.keys(filters).length > 0 && (
            <ActiveSearchFiltersCard
              filters={filters}
              subjectGroups={subjectGroups}
            />
          )}

          {/* If the cap is reached, there are likely omitted results */}
          {teachers.length === 100 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: [0, 1, 1], scale: [0.8, 1.05, 1] }}
              transition={{
                ...transition(duration.medium4, easing.standardDecelerate),
                delay: duration.long4,
              }}
              className={cn(`mt-2 rounded-sm bg-error-container
              text-on-error-container`)}
            >
              <CardHeader
                icon={
                  <MaterialIcon
                    icon="warning"
                    className="!text-on-error-container"
                  />
                }
                title={tx("common.list.tooWide.title")}
                subtitle={tx("common.list.tooWide.subtitle")}
              />
            </motion.div>
          )}

          {/* Results */}
          {teachers.length > 0 ? (
            <div
              className={cn(`-mx-4 sm:mx-0 sm:-mr-3 md:grow
              md:overflow-auto`)}
            >
              <ul className="flex flex-col gap-1 pb-6 pt-4 sm:pr-3">
                {teachers.map((teacher, idx) => (
                  <motion.li
                    key={teacher.id}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      ...transition(
                        duration.medium2,
                        easing.standardDecelerate,
                      ),
                      delay:
                        Math.max(
                          (idx / Math.min(teachers.length, 10)) *
                            duration.long2,
                          duration.short4,
                        ) + duration.short4,
                    }}
                  >
                    <LookupTeacherCard
                      teacher={teacher}
                      selected={selectedID}
                      onClick={(id) => {
                        setSelectedID(id);
                        if (atBreakpoint === "base") setDetailsOpen(true);
                      }}
                    />
                  </motion.li>
                ))}
              </ul>
            </div>
          ) : (
            // Empty state
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                ...transition(duration.medium2, easing.standardDecelerate),
                delay: duration.medium2,
              }}
              className="skc-card skc-card--outlined mt-4 flex grow flex-col items-center justify-center gap-1 p-4 sm:mb-6"
            >
              <Text
                type="body-medium"
                element="p"
                className="text-center text-on-surface-variant"
              >
                <Balancer>{tx("common.list.empty.desc")}</Balancer>
              </Text>
              <Button appearance="text" href="/lookup/teachers" element={Link}>
                {tx("common.list.empty.action.clear")}
              </Button>
            </motion.div>
          )}
        </section>

        {/* Details */}
        <main className="md:!col-span-2">
          {(selectedID || teachers.length === 0) && (
            <motion.div
              key={selectedTeacher?.id || selectedID}
              initial={{ opacity: 0, scale: 0.95, x: -10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{
                ...transition(duration.medium2, easing.standardDecelerate),
                delay: teachers.length === 0 ? duration.medium4 : 0,
              }}
              className="h-full"
            >
              <TeacherDetailsCard teacher={selectedTeacher} />
            </motion.div>
          )}
        </main>
      </SplitLayout>

      {/* Details Dialog */}
      <FullscreenDialog
        open={detailsOpen}
        title=""
        width={720}
        onClose={() => setDetailsOpen(false)}
        className={cn(`[&>:first-child]:!flex-row-reverse
          [&>:first-child]:!bg-transparent [&>:last-child>div]:!mx-0
          [&>:last-child>div]:!rounded-none [&>:last-child>div]:!border-0
          [&>:last-child]:h-[100dvh] [&>:last-child]:!p-0`)}
      >
        <TeacherDetailsCard
          teacher={
            selectedID === selectedTeacher?.id ? selectedTeacher : undefined
          }
        />
      </FullscreenDialog>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  query,
  req,
  res,
}) => {
  const supabase = createPagesServerClient({
    req: req as NextApiRequest,
    res: res as NextApiResponse,
  });

  const { data: subjectGroups } = await getSubjectGroups(supabase);

  const filters = Object.fromEntries(
    Object.entries(query)
      .filter(([key]) =>
        [
          "full_name",
          "nickname",
          "subject_group",
          "classroom",
          "contact",
        ].includes(key),
      )
      .map(([key, value]) => [
        camel(key),
        key === "subject_group" && value !== "any" ? Number(value) : value,
      ]),
  ) as SearchFilters;

  const { data } = await getTeachersByLookupFilters(supabase, filters);
  const teachers = alphabetical(
    alphabetical(data!, (teacher) =>
      getLocaleString(teacher.first_name, locale as LangCode),
    ),
    (teacher) =>
      getLocaleString(teacher.subject_group.name, locale as LangCode),
  );

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "lookup",
      ])),
      filters,
      subjectGroups,
      teachers,
    },
  };
};

export default LookupTeachersResultsPage;
