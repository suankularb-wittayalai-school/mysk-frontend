// External libraries
import { GetServerSideProps } from "next";
import Head from "next/head";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { useEffect, useState } from "react";

// SK Components
import {
  ChipSet,
  FilterChip,
  MaterialIcon,
  SplitLayout,
} from "@suankularb-components/react";

// Internal components
import MySKPageHeader from "@/components/common/MySKPageHeader";
import EmptyDetail from "@/components/lookup/EmptyDetail";
import LookupList from "@/components/lookup/LookupList";
import PersonCard from "@/components/lookup/person/PersonCard";
import PersonDetails from "@/components/lookup/person/PersonDetails";

// Backend
import { getPeopleLookupList } from "@/utils/backend/person/person";

// Helpers
import { toggleItem } from "@/utils/helpers/array";
import { createTitleStr } from "@/utils/helpers/title";

// Types
import { CustomPage, LangCode } from "@/utils/types/common";
import { PersonLookupItem, Role, Student, Teacher } from "@/utils/types/person";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { getStudent } from "@/utils/backend/person/student";
import { getTeacher } from "@/utils/backend/person/teacher";
import { withLoading } from "@/utils/helpers/loading";
import { useToggle } from "@/utils/hooks/toggle";

const LookupStudentsPage: CustomPage<{
  initialPeople: PersonLookupItem[];
  selectedIdx: number;
}> = ({ initialPeople, selectedIdx }) => {
  // Translation
  const { t } = useTranslation(["lookup", "common"]);

  const [people, setPeople] = useState<PersonLookupItem[]>(initialPeople);

  // Selected Person
  const [selected, setSelected] = useState(
    initialPeople[selectedIdx]
      ? {
          id: initialPeople[selectedIdx].id,
          role: initialPeople[selectedIdx].role,
        }
      : undefined
  );

  const supabase = useSupabaseClient();
  const [loading, toggleLoading] = useToggle();

  const [selectedPerson, setSelectedPerson] = useState<Student | Teacher>();
  useEffect(() => {
    if (!selected) return;

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
  }, [selected]);

  // For showing Filter Chips when the list is already filterred by text
  const [filterred, setFilterred] = useState<boolean>(false);
  const [filters, setFilters] = useState<Role[]>(["student", "teacher"]);

  async function handleSearch(query: string) {
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
                  Students
                </FilterChip>
                <FilterChip
                  selected={filters.includes("teacher")}
                  onClick={() =>
                    setFilters(toggleItem<Role>("teacher", filters))
                  }
                >
                  Teachers
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
  const selectedID = Number(query?.id);
  let selectedIdx = 0;

  const { data: initialPeople } = await getPeopleLookupList();

  // selectedIdx = initialPeople.findIndex((person) => selectedID === person.id);

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

export default LookupStudentsPage;
