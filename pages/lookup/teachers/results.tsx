// Imports
import PageHeader from "@/components/common/PageHeader";
import ActiveSearchFiltersCard from "@/components/lookup/ActiveSearchFiltersCard";
import LookupTeacherCard from "@/components/lookup/teachers/LookupTeacherCard";
import getTeachersByLookupFilters from "@/utils/backend/person/getTeachersByLookupFilters";
import getSubjectGroups from "@/utils/backend/subject/getSubjectGroups";
import cn from "@/utils/helpers/cn";
import { LangCode } from "@/utils/types/common";
import { TeacherLookupItem } from "@/utils/types/person";
import { SubjectGroup } from "@/utils/types/subject";
import {
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
import { camel } from "radash";
import { useState } from "react";

export type SearchFilters = Partial<
  {
    fullName: string;
    nickname: string;
    classroom: string;
    contact: string;
  } & { subjectGroup: number | "any" }
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
        <section className="sm:!overflow-visible">
          {Object.keys(filters).length > 0 && (
            <ActiveSearchFiltersCard
              filters={filters}
              subjectGroups={subjectGroups}
            />
          )}
          <div
            className={cn(`mt-4 sm:-mr-3 sm:h-[calc(100dvh-12.75rem)]
              sm:overflow-auto`)}
          >
            <ul className="flex flex-col gap-1 pb-6 sm:pr-3">
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
                    setSelected={setSelected}
                  />
                </motion.li>
              ))}
            </ul>
          </div>
        </section>
        <main className="md:!col-span-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: -10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{
              ...transition(duration.medium2, easing.standardDecelerate),
              delay: duration.medium2,
            }}
            className="h-full rounded-md bg-surface-1"
          ></motion.div>
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

  const { data: teachers } = await getTeachersByLookupFilters(
    supabase,
    filters,
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
