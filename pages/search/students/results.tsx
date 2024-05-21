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
import { CustomPage, LangCode } from "@/utils/types/common";
import { Student, StudentLookupItem } from "@/utils/types/person";
import {
  DURATION,
  SplitLayout,
  useBreakpoint,
} from "@suankularb-components/react";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { alphabetical, camel, sort } from "radash";
import { useEffect, useState } from "react";

export type StudentSearchFilters = Partial<{
  fullName: string;
  nickname: string;
  contact: string;
}>;

/**
 * The results page for Search Students.
 *
 * @param filters The filters used to search for Students.
 * @param students The Students that match the filters.
 */
const LookupStudentsResultsPage: CustomPage<{
  filters: StudentSearchFilters;
  students: StudentLookupItem[];
}> = ({ filters, students }) => {
  const { t } = useTranslation("lookup", { keyPrefix: "students" });
  const { t: tx } = useTranslation("common");

  const [selectedID, setSelectedID] = useState<string>();
  // Select the first result automatically after a short delay
  useEffect(() => {
    const timeout = setTimeout(
      () => setSelectedID(students[0]?.id),
      DURATION.medium2 * 1000,
    );
    return () => clearTimeout(timeout);
  }, []);

  const mysk = useMySKClient();
  const supabase = useSupabaseClient();

  const [selectedStudent, setSelectedStudent] = useState<Student>();
  // Fetch the selected Student when the selected Student ID changes
  useEffect(() => {
    (async () => {
      // Clear the selected Student data first
      // (This, combined with some more logic in child components, prevents the
      // old Student data from flashing at selected Student ID change)
      setSelectedStudent(undefined);
      if (!selectedID) return false;

      // Fetch the selected Student with the selected ID
      const { data, error } = await getStudentByID(supabase, mysk, selectedID, {
        detailed: true,
        includeContacts: true,
      });
      if (error) return false;

      // Set the state
      setSelectedStudent(data);
      return true;
    })();
  }, [selectedID]);

  const [detailsOpen, setDetailsOpen] = useState(false);

  // Open the Student Details Dialog on mobile, otherwise close it
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
          selectedID={selectedStudent?.id || selectedID}
          length={students.length}
        >
          <StudentDetailsCard student={selectedStudent} />
        </LookupDetailsSide>
      </SplitLayout>

      {/* Details Dialog */}
      <LookupDetailsDialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
      >
        <StudentDetailsCard student={selectedStudent} />
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
      .filter(([key]) => ["full_name", "nickname", "contact"].includes(key))
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
        "lookup",
      ])),
      filters,
      students,
    },
  };
};

export default LookupStudentsResultsPage;
