// External libraries
import { GetServerSideProps } from "next";
import Head from "next/head";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { useEffect, useState } from "react";

// SK Components
import { Card, MaterialIcon, SplitLayout } from "@suankularb-components/react";

// Internal components
import MySKPageHeader from "@/components/common/MySKPageHeader";
import DocumentCard from "@/components/lookup/document/DocumentCard";
import DocumentDetails from "@/components/lookup/document/DocumentDetail";
import LookupList from "@/components/lookup/LookupList";

// Backend
import {
  getSchoolDocs,
  getSchoolDocsByID,
} from "@/utils/backend/news/document";

// Helpers
import { createTitleStr } from "@/utils/helpers/title";

// Types
import { CustomPage, LangCode } from "@/utils/types/common";
import { SchoolDocument } from "@/utils/types/news";
import EmptyDetail from "@/components/lookup/EmptyDetail";

const LookupDocumentsPage: CustomPage<{
  documents: SchoolDocument[];
  selectedIdx: number;
}> = ({ documents, selectedIdx }) => {
  // Translation
  const { t } = useTranslation(["lookup", "common"]);

  // Selected Document
  const [selected, setSelected] = useState<SchoolDocument>(
    documents[selectedIdx]
  );

  // If the iframe is loading
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => setLoading(true), [selected]);

  // Query
  const [query, setQuery] = useState<string>("");

  return (
    <>
      <Head>
        <title>{createTitleStr("Lookup documents", t)}</title>
      </Head>
      <MySKPageHeader
        title="Lookup documents"
        icon={<MaterialIcon icon="search" />}
        parentURL="/lookup"
      />
      <SplitLayout ratio="list-detail">
        <LookupList
          length={documents.length}
          searchAlt="Search documents"
          query={query}
          setQuery={setQuery}
        >
          {documents.map((document) => (
            <DocumentCard
              key={document.id}
              document={document}
              {...{ selected, setSelected }}
            />
          ))}
        </LookupList>
        {selected ? (
          <DocumentDetails document={selected} {...{ loading, setLoading }} />
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

  let documents;
  const { data: defaultDocuments } = await getSchoolDocs("document");

  selectedIdx = defaultDocuments.findIndex(
    (document) => selectedID === document.id
  );

  if (selectedID && selectedIdx === -1) {
    const { data: selected } = await getSchoolDocsByID("document", selectedID);
    documents = [selected, ...defaultDocuments];
  } else documents = defaultDocuments;

  selectedIdx = Math.max(selectedIdx, 0);

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "lookup",
      ])),
      documents,
      selectedIdx,
    },
  };
};

export default LookupDocumentsPage;
