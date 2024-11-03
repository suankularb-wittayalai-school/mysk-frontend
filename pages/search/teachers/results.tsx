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
import useListDetail from "@/utils/helpers/search/useListDetail";
import { Breakpoint } from "@/utils/helpers/useBreakpoint";
import { CustomPage, LangCode } from "@/utils/types/common";
import { Teacher, TeacherLookupItem } from "@/utils/types/person";
import { SubjectGroup } from "@/utils/types/subject";
import { DURATION, SplitLayout } from "@suankularb-components/react";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import useTranslation from "next-translate/useTranslation";
import Head from "next/head";
import { alphabetical, camel } from "radash";

export type TeacherSearchFilters = Partial<{
  fullName: string;
  nickname: string;
  subjectGroup: number;
  classroom: string;
  contact: string;
}>;

/**
 * The results page for Search Teachers.
 *
 * @param filters The filters used to search for Teachers.
 * @param subjectGroups The list of all Subject Groups.
 * @param teachers The Teachers that match the filters.
 */
const SearchTeachersResultsPage: CustomPage<{
  filters: TeacherSearchFilters;
  subjectGroups: SubjectGroup[];
  teachers: TeacherLookupItem[];
}> = ({ filters, subjectGroups, teachers }) => {
  const { t } = useTranslation("search/teachers/list");

  const supabase = useSupabaseClient();
  const mysk = useMySKClient();

  const {
    selectedID,
    selectedDetail,
    onSelectedChange,
    detailsOpen,
    onDetailsClose,
  } = useListDetail<TeacherLookupItem, Teacher>(
    teachers,
    (id) =>
      getTeacherByID(supabase, mysk, id, {
        detailed: true,
        includeContacts: true,
      }),
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
                  selected={teacher.id === selectedID}
                  onClick={onSelectedChange}
                />
              </LookupResultsItem>
            ))}
          </LookupResultsList>
        </LookupListSide>

        {/* Details */}
        <LookupDetailsSide
          selectedID={selectedDetail?.id || selectedID}
          length={teachers.length}
        >
          <TeacherDetailsCard teacher={selectedDetail} />
        </LookupDetailsSide>
      </SplitLayout>

      {/* Details Dialog */}
      <LookupDetailsDialog open={detailsOpen} onClose={onDetailsClose}>
        <TeacherDetailsCard teacher={selectedDetail} />
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

  return { props: { filters, subjectGroups, teachers } };
};

export default SearchTeachersResultsPage;
