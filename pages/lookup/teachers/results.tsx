// Imports
import PageHeader from "@/components/common/PageHeader";
import ActiveSearchFiltersCard from "@/components/lookup/ActiveSearchFiltersCard";
import LookupTeacherCard from "@/components/lookup/teachers/LookupTeacherCard";
import TeacherDetailsCard from "@/components/lookup/teachers/TeacherDetailsCard";
import getTeachersByLookupFilters from "@/utils/backend/person/getTeachersByLookupFilters";
import getSubjectGroups from "@/utils/backend/subject/getSubjectGroups";
import cn from "@/utils/helpers/cn";
import getLocaleString from "@/utils/helpers/getLocaleString";
import { LangCode } from "@/utils/types/common";
import { TeacherLookupItem } from "@/utils/types/person";
import { SubjectGroup } from "@/utils/types/subject";
import {
  CardHeader,
  MaterialIcon,
  SplitLayout,
  transition,
  useAnimationConfig,
} from "@suankularb-components/react";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
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
import { alphabetical, camel } from "radash";
import { useEffect, useState } from "react";

export type SearchFilters = Partial<
  {
    fullName: string;
    nickname: string;
    subjectGroup: number;
    classroom: string;
    contact: string;
  }
>;

const LookupTeachersResultsPage: NextPage<{
  filters: SearchFilters;
  subjectGroups: SubjectGroup[];
  teachers: TeacherLookupItem[];
}> = ({ filters, subjectGroups, teachers }) => {
  // Translation
  const { t } = useTranslation("lookup", { keyPrefix: "teachers" });
  const { t: tx } = useTranslation("common");

  const { duration, easing } = useAnimationConfig();

  const [selected, setSelected] = useState<string>();
  useEffect(() => {
    const timeout = setTimeout(
      () => setSelected(teachers[0]?.id),
      duration.medium2 * 1000,
    );
    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <Head>
        <title>{tx("tabName", { tabName: t("title") })}</title>
      </Head>
      <PageHeader parentURL="/lookup/teachers">{t("title")}</PageHeader>
      <SplitLayout
        ratio="list-detail"
        className="sm:[&>div]:!grid-cols-2 md:[&>div]:!grid-cols-3"
      >
        <section className="md:flex md:flex-col md:!overflow-visible sm:!pb-0">
          {/* Active Search Filters */}
          {Object.keys(filters).length > 0 && (
            <ActiveSearchFiltersCard
              filters={filters}
              subjectGroups={subjectGroups}
            />
          )}

          {/* If the cap is reached, there are likely omitted results */}
          {teachers.length === 50 && (
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
                title="Filters too wide"
                subtitle="Results are incomplete"
              />
            </motion.div>
          )}

          {/* Results */}
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
                    ...transition(duration.medium2, easing.standardDecelerate),
                    delay:
                      Math.max(
                        (idx / Math.min(teachers.length, 10)) * duration.long2,
                        duration.short4,
                      ) + duration.short4,
                  }}
                >
                  <LookupTeacherCard
                    teacher={teacher}
                    selected={selected}
                    onClick={setSelected}
                  />
                </motion.li>
              ))}
            </ul>
          </div>
        </section>

        <main className="md:!col-span-2">
          {selected && (
            <motion.div
              key={selected}
              initial={{ opacity: 0, scale: 0.95, x: -10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={transition(
                duration.medium2,
                easing.standardDecelerate,
              )}
              className="h-full"
            >
              <TeacherDetailsCard id={selected} />
            </motion.div>
          )}
        </main>
      </SplitLayout>
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
