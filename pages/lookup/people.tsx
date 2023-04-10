// External libraries
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
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

// Backend
import { getUserMetadata } from "@/utils/backend/account";

// Helpers
import { createTitleStr } from "@/utils/helpers/title";

// Types
import { CustomPage, LangCode } from "@/utils/types/common";
import { PersonLookupItem, Role } from "@/utils/types/person";
import { getInitialLookupPeopelList as getInitialPeopleLookupList } from "@/utils/backend/person/person";
import { useToggle } from "@/utils/hooks/toggle";
import { toggleItem } from "@/utils/helpers/array";

const LookupStudentsPage: CustomPage<{
  initialPeople: PersonLookupItem[];
  selectedIdx: number;
}> = ({ initialPeople, selectedIdx }) => {
  // Translation
  const { t } = useTranslation(["lookup", "common"]);

  const [people, setPeople] = useState<PersonLookupItem[]>(initialPeople);

  // Selected Person
  const [selected, setSelected] = useState<number>(initialPeople[0]?.id);

  // If person details is loading
  const [loading, toggleLoading] = useToggle();

  // For showing Filter Chips when the list is already filterred by text
  const [filterred, setFilterred] = useState<boolean>(false);
  const [filters, setFilters] = useState<Role[]>(["student", "teacher"]);

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
          onSearch={(value) => {
            if (!value) {
              setFilterred(false);
              setPeople(initialPeople);
              return;
            }
            setFilterred(true);
          }}
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
        <EmptyDetail />
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
  const selectedID = Number(query?.id);
  let selectedIdx = 0;

  const { data: initialPeople } = await getInitialPeopleLookupList();

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
