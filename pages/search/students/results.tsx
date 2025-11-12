import PageHeader from "@/components/common/PageHeader";
import LookupDetailsDialog from "@/components/lookup/LookupDetailsDialog";
import LookupDetailsSide from "@/components/lookup/LookupDetailsSide";
import LookupListSide from "@/components/lookup/LookupListSide";
import LookupResultsItem from "@/components/lookup/LookupResultsItem";
import LookupResultsList from "@/components/lookup/LookupResultsList";
import TooWideCard from "@/components/lookup/TooWideCard";
import LookupStudentCard from "@/components/lookup/students/LookupStudentCard";
import StudentActiveFiltersCard from "@/components/lookup/students/StudentActiveFiltersCard";
import StudentDetailsCard from "@/components/lookup/students/StudentDetailsCard";
import useMySKClient from "@/utils/backend/mysk/useMySKClient";
import { getStudentByID } from "@/utils/backend/person/getStudentByID";
import getStudentsByLookupFilters from "@/utils/backend/person/getStudentsByLookupFilters";
import getLocaleString from "@/utils/helpers/getLocaleString";
import useListDetail from "@/utils/helpers/search/useListDetail";
import { Breakpoint } from "@/utils/helpers/useBreakpoint";
import { CustomPage, LangCode } from "@/utils/types/common";
import { Student, StudentLookupItem } from "@/utils/types/person";
import { DURATION, SplitLayout } from "@suankularb-components/react";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import useTranslation from "next-translate/useTranslation";
import Head from "next/head";
import { alphabetical, camel, sort } from "radash";

export type StudentSearchFilters = Partial<{
  fullName: string;
  nickname: string;
  contact: string;
  studentId: string;
}>;

/**
 * The results page for Search Students.
 *
 * @param filters The filters used to search for Students.
 * @param students The Students that match the filters.
 */
const SearchStudentsResultsPage: CustomPage<{
  filters: StudentSearchFilters;
  students: StudentLookupItem[];
}> = ({ filters, students }) => {
  const { t } = useTranslation("search/students/list");

  const mysk = useMySKClient();
  const supabase = useSupabaseClient();

  const {
    selectedID,
    selectedDetail,
    onSelectedChange,
    detailsOpen,
    onDetailsClose,
  } = useListDetail<StudentLookupItem, Student>(
    students,
    (id) => getStudentByID(supabase, mysk, id, { detailed: true }),
    {
      firstByDefault: true,
      initialSelectDelay: DURATION.medium2,
      dialogBreakpoints: [Breakpoint.base],
    },
  );

  return (
    <>
      <Head>
        <title>{t("common:tabName", { tabName: t("title") })}</title>
      </Head>
      <PageHeader parentURL="/search/students">{t("title")}</PageHeader>
      <SplitLayout
        ratio="list-detail"
        className="sm:[&>div]:!grid-cols-2 md:[&>div]:!grid-cols-3"
      >
        <LookupListSide length={students.length}>
          {/* Active Search Filters */}
          {Object.keys(filters).length > 0 && (
            <StudentActiveFiltersCard filters={filters} />
          )}
          <TooWideCard length={students.length} />

          {/* Results */}
          <LookupResultsList
            length={students.length}
            filtersURL="/search/students"
          >
            {students.map((student, idx) => (
              <LookupResultsItem
                key={student.id}
                idx={idx}
                length={students.length}
              >
                <LookupStudentCard
                  student={student}
                  selected={student.id === selectedID}
                  onClick={onSelectedChange}
                />
              </LookupResultsItem>
            ))}
          </LookupResultsList>
        </LookupListSide>

        {/* Details */}
        <LookupDetailsSide
          selectedID={selectedDetail?.id || selectedID}
          length={students.length}
        >
          <StudentDetailsCard student={selectedDetail} />
        </LookupDetailsSide>
      </SplitLayout>

      {/* Details Dialog */}
      <LookupDetailsDialog open={detailsOpen} onClose={onDetailsClose}>
        <StudentDetailsCard student={selectedDetail} />
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

  const filters = Object.fromEntries(
    Object.entries(query)
      .filter(([key]) =>
        ["full_name", "nickname", "contact", "student_id"].includes(key),
      )
      .map(([key, value]) => [camel(key), value]),
  ) as StudentSearchFilters;

  const { data } = await getStudentsByLookupFilters(supabase, filters);
  const students = sort(
    alphabetical(data!, (student) =>
      getLocaleString(student.first_name, locale as LangCode),
    ),
    (student) => student.classroom?.number || 1000,
  );

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "attendance",
        "classes",
      ])),
      filters,
      students,
    },
  };
};

export default SearchStudentsResultsPage;
