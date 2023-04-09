// External libraries
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import Head from "next/head";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { useEffect, useState } from "react";

// SK Components
import { MaterialIcon, SplitLayout } from "@suankularb-components/react";

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
import { PersonLookupItem } from "@/utils/types/person";
import { getInitialLookupPeopelList as getInitialPeopleLookupList } from "@/utils/backend/person/person";

const LookupStudentsPage: CustomPage<{
  initialPeople: PersonLookupItem[];
  selectedIdx: number;
}> = ({ initialPeople, selectedIdx }) => {
  // Translation
  const { t } = useTranslation(["lookup", "common"]);

  const [students, setStudents] = useState<PersonLookupItem[]>(initialPeople);

  // Selected Order
  const [selected, setSelected] = useState<number>(initialPeople[0]?.id);

  // If the iframe is loading
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => setLoading(true), [selected]);

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
          length={students.length}
          searchAlt="Search students"
          onSearch={() => {}}
        >
          {students.map((student) => (
            <PersonCard
              key={student.id}
              person={student}
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
