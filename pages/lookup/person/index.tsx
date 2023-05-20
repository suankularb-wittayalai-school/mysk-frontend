// External libraries
import { useSupabaseClient } from "@supabase/auth-helpers-react";

import va from "@vercel/analytics";

import { GetServerSideProps } from "next";
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
import MySKPageHeader from "@/components/common/MySKPageHeader";
import EmptyDetail from "@/components/lookup/EmptyDetail";
import LookupList from "@/components/lookup/LookupList";
import PersonCard from "@/components/lookup/person/PersonCard";
import PersonDetails from "@/components/lookup/person/PersonDetails";

// Backend
import {
  getLookupListPerson,
  getPeopleLookupList,
} from "@/utils/backend/person/person";
import { getStudent } from "@/utils/backend/person/student";
import { getTeacher } from "@/utils/backend/person/teacher";

// Helpers
import { toggleItem } from "@/utils/helpers/array";
import { withLoading } from "@/utils/helpers/loading";
import { createTitleStr } from "@/utils/helpers/title";

// Hooks
import { useToggle } from "@/utils/hooks/toggle";

// Types
import { CustomPage, LangCode } from "@/utils/types/common";
import { PersonLookupItem, Role, Student, Teacher } from "@/utils/types/person";

const LookupPeoplePage: CustomPage<{
  initialPeople: PersonLookupItem[];
  selectedIdx: number;
}> = ({ initialPeople, selectedIdx }) => {
  // Translation
  const { t } = useTranslation(["lookup", "common"]);

  const [people, setPeople] = useState<PersonLookupItem[]>(initialPeople);

  // Information for identifying the selected Person, used in fetch later
  const [selected, setSelected] = useState(
    initialPeople[selectedIdx]
      ? {
          id: initialPeople[selectedIdx].id,
          role: initialPeople[selectedIdx].role,
        }
      : undefined
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
        { shallow: true }
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
          const { data: student, error } = await getStudent(
            supabase,
            selected.id
          );
          if (error) return false;
          person = student;
        }

        // If a Teacher is selected
        else if (selected.role === "teacher") {
          const { data: teacher, error } = await getTeacher(
            supabase,
            selected.id
          );
          if (error) return false;
          person = teacher;
        }

        setSelectedPerson(person);
        return true;
      },
      toggleLoading,
      { hasEndToggle: true }
    );
  }, [selected, atBreakpoint === "base"]);

  // For showing Filter Chips when the list is already filterred by text
  const [filterred, setFilterred] = useState<boolean>(false);
  const [filters, setFilters] = useState<Role[]>(["student", "teacher"]);

  async function handleSearch(query: string) {
    va.track("Search Person");

    if (!query) {
      setFilterred(false);
      setPeople(initialPeople);
      return;
    }

    const { data: people } = await getPeopleLookupList(query);
    setFilterred(true);
    setPeople(people);
  }

  return (
    <>
      <Head>
        <title>{createTitleStr(t("people.title"), t)}</title>
      </Head>
      <MySKPageHeader
        title={t("people.title")}
        icon={<MaterialIcon icon="search" />}
        parentURL="/lookup"
      />
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
                    setFilters(toggleItem<Role>("student", filters))
                  }
                >
                  {t("people.list.filter.student")}
                </FilterChip>
                <FilterChip
                  selected={filters.includes("teacher")}
                  onClick={() =>
                    setFilters(toggleItem<Role>("teacher", filters))
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
  locale,
  query,
}) => {
  const selected = query.id
    ? { id: Number(query.id), role: query.role as Role }
    : null;
  let selectedIdx = 0;

  let initialPeople: PersonLookupItem[];

  const { data: defaultPeople } = await getPeopleLookupList();
  initialPeople = defaultPeople;

  if (selected) {
    selectedIdx = initialPeople.findIndex(
      (person) => selected.id === person.id && selected.role === person.role
    );

    if (selectedIdx === -1) {
      const { data, error } = await getLookupListPerson(
        selected.id,
        selected.role
      );
      if (error) initialPeople = defaultPeople;
      else initialPeople = [data, ...defaultPeople];
    } else initialPeople = defaultPeople;
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
