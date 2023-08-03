// External libraries
import { useSupabaseClient } from "@supabase/auth-helpers-react";

import va from "@vercel/analytics";

import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { useEffect, useState } from "react";

// SK Components
import {
  ChipSet,
  FilterChip,
  MaterialIcon,
  SplitLayout,
  useBreakpoint,
} from "@suankularb-components/react";

// Internal components
import PageHeader from "@/components/common/PageHeader";
import EmptyDetail from "@/components/lookup/EmptyDetail";
import LookupList from "@/components/lookup/LookupList";
import PersonCard from "@/components/lookup/person/PersonCard";
import PersonDetails from "@/components/lookup/person/PersonDetails";

// Backend
// import {
//   getLookupListPerson,
//   getPeopleLookupList,
// } from "@/utils/backend/person/person";
// Helpers
import { toggleItem } from "@/utils/helpers/array";
import { withLoading } from "@/utils/helpers/loading";
import { createTitleStr } from "@/utils/helpers/title";

// Hooks
import { useToggle } from "@/utils/hooks/toggle";

// Types
import { getPeopleLookupList } from "@/utils/backend/person/getPeopleLookupList";
import { getPersonForLookupDetail } from "@/utils/backend/person/getPersonForLookupDetail";
import { getStudentByID } from "@/utils/backend/person/getStudentByID";
import { getTeacherByID } from "@/utils/backend/person/getTeacherByID";
import { CustomPage, LangCode } from "@/utils/types/common";
import {
  PersonLookupItem,
  Student,
  Teacher,
  UserRole,
} from "@/utils/types/person";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";

const LookupPeoplePage: CustomPage<{
  initialPeople: PersonLookupItem[];
  selectedIdx: number;
}> = ({ initialPeople, selectedIdx }) => {
  // Translation
  const { t } = useTranslation(["lookup", "common"]);

  const [people, setPeople] = useState<PersonLookupItem[]>(initialPeople);

  // Information for identifying the selected Person, used in fetch later
  const [selected, setSelected] = useState<
    | {
        id: string;
        role: UserRole;
      }
    | undefined
  >(
    initialPeople[selectedIdx]
      ? {
          id: initialPeople[selectedIdx].id,
          role: initialPeople[selectedIdx].role,
        }
      : undefined,
  );

  // Redirect mobile users to the details page when URL has query
  // (Yes, we have to do this weirdness, otherwise `atBreakpoint` will always
  // be `base` for some reason thus will always redirects)
  const router = useRouter();
  const { atBreakpoint } = useBreakpoint();
  const [breakpointChecked, setBreakpointChecked] = useState<boolean>(false);
  useEffect(() => {
    if (atBreakpoint === "base" && !breakpointChecked) {
      setBreakpointChecked(true);
      return;
    }
    if (selectedIdx && atBreakpoint === "base") {
      const { id, role } = initialPeople[selectedIdx];
      router.push(`/lookup/person/${role}/${id}`);
    }
  }, [breakpointChecked]);

  // Update the URL with the selected Person query, so as to make sharing
  // easier
  useEffect(() => {
    if (selected)
      router.replace(
        `/lookup/person?id=${selected.id}&role=${selected.role}`,
        undefined,
        { shallow: true },
      );
  }, []);

  const supabase = useSupabaseClient();
  const [loading, toggleLoading] = useToggle();

  // Information about the selected Person
  const [selectedPerson, setSelectedPerson] = useState<Student | Teacher>();
  useEffect(() => {
    if (
      !selected ||
      (selected.id === selectedPerson?.id &&
        selected.role === selectedPerson?.role) ||
      atBreakpoint === "base"
    )
      return;

    withLoading(
      async () => {
        let person: Student | Teacher | undefined;

        // If a Student is selected
        if (selected.role === "student") {
          const { data: student, error } = await getStudentByID(
            supabase,
            selected.id,
          );
          if (error) return false;
          person = student;
        }

        // If a Teacher is selected
        else if (selected.role === "teacher") {
          const { data: teacher, error } = await getTeacherByID(
            supabase,
            selected.id,
          );
          if (error) return false;
          person = teacher;
        }

        setSelectedPerson(person);
        return true;
      },
      toggleLoading,
      { hasEndToggle: true },
    );
  }, [selected, atBreakpoint === "base"]);

  // For showing Filter Chips when the list is already filterred by text
  const [filterred, setFilterred] = useState<boolean>(false);
  const [filters, setFilters] = useState<UserRole[]>(["student", "teacher"]);

  async function handleSearch(query: string) {
    va.track("Search Person");

    if (!query) {
      setFilterred(false);
      setPeople(initialPeople);
      return;
    }

    // TODO: Implement search
    const { data: people } = await getPeopleLookupList(supabase, query);
    if (!people) return;
    setPeople(people);
    setFilterred(true);
  }

  return (
    <>
      <Head>
        <title>{createTitleStr(t("people.title"), t)}</title>
      </Head>
      <PageHeader title={t("people.title")} parentURL="/lookup" />
      <SplitLayout ratio="list-detail">
        <LookupList
          length={people.length}
          searchAlt={t("people.list.searchAlt")}
          searchFilters={
            filterred ? (
              <ChipSet>
                <FilterChip
                  selected={filters.includes("student")}
                  onClick={() =>
                    setFilters(toggleItem<UserRole>("student", filters))
                  }
                >
                  {t("people.list.filter.student")}
                </FilterChip>
                <FilterChip
                  selected={filters.includes("teacher")}
                  onClick={() =>
                    setFilters(toggleItem<UserRole>("teacher", filters))
                  }
                >
                  {t("people.list.filter.teacher")}
                </FilterChip>
              </ChipSet>
            ) : undefined
          }
          onSearch={handleSearch}
        >
          {(filterred
            ? people.filter((person) => filters.includes(person.role))
            : people
          ).map((person) => (
            <PersonCard
              key={person.id}
              person={person}
              {...{ selected, setSelected }}
            />
          ))}
        </LookupList>
        {selected ? (
          <PersonDetails person={selectedPerson} loading={loading} />
        ) : (
          <EmptyDetail />
        )}
      </SplitLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  locale,
  query,
}) => {
  const selected = query.id
    ? { id: query.id, role: query.role as UserRole }
    : null;
  let selectedIdx = 0;

  const supabase = createPagesServerClient({
    req: req as NextApiRequest,
    res: res as NextApiResponse,
  });

  let initialPeople: PersonLookupItem[] = [];

  const { data: defaultPeople } = await getPeopleLookupList(supabase);
  if (defaultPeople) initialPeople = defaultPeople;

  if (selected) {
    selectedIdx = initialPeople.findIndex(
      (person) => selected.id === person.id && selected.role === person.role,
    );

    if (selectedIdx === -1) {
      const { data } = await getPersonForLookupDetail(
        supabase,
        selected.id as string,
        selected.role,
      );
      if (data) initialPeople = [data, ...initialPeople];
    }
  }

  selectedIdx = Math.max(selectedIdx, 0);

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "lookup",
      ])),
      initialPeople,
      selectedIdx,
    },
  };
};

export default LookupPeoplePage;
