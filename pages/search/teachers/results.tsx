// Imports
import PageHeader from "@/components/common/PageHeader";
import LookupDetailsDialog from "@/components/lookup/LookupDetailsDialog";
import LookupDetailsSide from "@/components/lookup/LookupDetailsSide";
import LookupListSide from "@/components/lookup/LookupListSide";
import LookupResultsItem from "@/components/lookup/LookupResultsItem";
import LookupResultsList from "@/components/lookup/LookupResultsList";
import TooWideCard from "@/components/lookup/TooWideCard";
import LookupTeacherCard from "@/components/lookup/teachers/LookupTeacherCard";
import TeacherActiveFiltersCard from "@/components/lookup/teachers/TeacherActiveFiltersCard";
import TeacherDetailsCard from "@/components/lookup/teachers/TeacherDetailsCard";
import useMySKClient from "@/utils/backend/mysk/useMySKClient";
import { getTeacherByID } from "@/utils/backend/person/getTeacherByID";
import getTeachersByLookupFilters from "@/utils/backend/person/getTeachersByLookupFilters";
import getSubjectGroups from "@/utils/backend/subject/getSubjectGroups";
import getLocaleString from "@/utils/helpers/getLocaleString";
import { LangCode } from "@/utils/types/common";
import { Teacher, TeacherLookupItem } from "@/utils/types/person";
import { SubjectGroup } from "@/utils/types/subject";
import {
  DURATION,
  SplitLayout,
  useAnimationConfig,
  useBreakpoint,
} from "@suankularb-components/react";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
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

export type TeacherSearchFilters = Partial<{
  fullName: string;
  nickname: string;
  subjectGroup: number;
  classroom: string;
  contact: string;
}>;

const LookupTeachersResultsPage: NextPage<{
  filters: TeacherSearchFilters;
  subjectGroups: SubjectGroup[];
  teachers: TeacherLookupItem[];
}> = ({ filters, subjectGroups, teachers }) => {
  // Translation
  const { t } = useTranslation("lookup", { keyPrefix: "teachers" });
  const { t: tx } = useTranslation(["lookup", "common"]);

  const [selectedID, setSelectedID] = useState<string>();
  // Select the first result automatically after a short delay
  useEffect(() => {
    const timeout = setTimeout(
      () => setSelectedID(teachers[0]?.id),
      DURATION.medium2 * 1000,
    );
    return () => clearTimeout(timeout);
  }, []);

  const supabase = useSupabaseClient();
  const mysk = useMySKClient();
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
      const { data, error } = await getTeacherByID(supabase, mysk, selectedID, {
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
      <PageHeader parentURL="/search/teachers">{t("title")}</PageHeader>
      <SplitLayout
        ratio="list-detail"
        className="sm:[&>div]:!grid-cols-2 md:[&>div]:!grid-cols-3"
      >
        <LookupListSide length={teachers.length}>
          {/* Active Search Filters */}
          {Object.keys(filters).length > 0 && (
            <TeacherActiveFiltersCard
              filters={filters}
              subjectGroups={subjectGroups}
            />
          )}
          <TooWideCard length={teachers.length} />

          {/* Results */}
          <LookupResultsList
            length={teachers.length}
            filtersURL="/search/teachers"
          >
            {teachers.map((teacher, idx) => (
              <LookupResultsItem
                key={teacher.id}
                idx={idx}
                length={teachers.length}
              >
                <LookupTeacherCard
                  teacher={teacher}
                  selected={selectedID}
                  onClick={(id) => {
                    setSelectedID(id);
                    if (atBreakpoint === "base") setDetailsOpen(true);
                  }}
                />
              </LookupResultsItem>
            ))}
          </LookupResultsList>
        </LookupListSide>

        {/* Details */}
        <LookupDetailsSide
          selectedID={selectedTeacher?.id || selectedID}
          length={teachers.length}
        >
          <TeacherDetailsCard teacher={selectedTeacher} />
        </LookupDetailsSide>
      </SplitLayout>

      {/* Details Dialog */}
      <LookupDetailsDialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
      >
        <TeacherDetailsCard
          teacher={
            selectedID === selectedTeacher?.id ? selectedTeacher : undefined
          }
        />
      </LookupDetailsDialog>
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
  ) as TeacherSearchFilters;

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
        "classes",
        "lookup",
        "schedule",
      ])),
      filters,
      subjectGroups,
      teachers,
    },
  };
};

export default LookupTeachersResultsPage;
