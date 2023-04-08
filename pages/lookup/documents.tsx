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
import DocumentCard from "@/components/lookup/document/DocumentCard";
import DocumentDetails from "@/components/lookup/document/DocumentDetail";

// Backend
import { getUserMetadata } from "@/utils/backend/account";
import {
  getSchoolDocs,
  getSchoolDocsByID,
  searchSchoolDocs,
} from "@/utils/backend/news/document";

// Helpers
import { createTitleStr } from "@/utils/helpers/title";

// Types
import { CustomPage, LangCode } from "@/utils/types/common";
import { SchoolDocument } from "@/utils/types/news";

const LookupDocumentsPage: CustomPage<{
  recentDocs: SchoolDocument[];
  selectedIdx: number;
}> = ({ recentDocs, selectedIdx }) => {
  // Translation
  const { t } = useTranslation(["lookup", "common"]);

  const [documents, setDocuments] = useState<SchoolDocument[]>(recentDocs);

  // Selected Document
  const [selected, setSelected] = useState<SchoolDocument>(
    recentDocs[selectedIdx]
  );

  // If the iframe is loading
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => setLoading(true), [selected]);

  return (
    <>
      <Head>
        <title>{createTitleStr(t("documents.title"), t)}</title>
      </Head>
      <MySKPageHeader
        title={t("documents.title")}
        icon={<MaterialIcon icon="search" />}
        parentURL="/lookup"
      />
      <SplitLayout ratio="list-detail">
        <LookupList
          length={recentDocs.length}
          searchAlt={t("documents.list.searchAlt")}
          onSearch={async (query) => {
            if (!query) {
              setDocuments(recentDocs);
              return;
            }
            const { data } = await searchSchoolDocs("order", query);
            setDocuments(data);
          }}
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
  req,
  res,
}) => {
  const supabase = createServerSupabaseClient({
    req: req as NextApiRequest,
    res: res as NextApiResponse,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { data: metadata } = await getUserMetadata(supabase, session!.user.id);

  const selectedID = Number(query?.id);
  let selectedIdx = 0;

  let recentDocs;
  const { data: defaultDocuments } = await getSchoolDocs(
    "document",
    metadata!.role
  );

  selectedIdx = defaultDocuments.findIndex(
    (document) => selectedID === document.id
  );

  if (selectedID && selectedIdx === -1) {
    const { data: selected } = await getSchoolDocsByID("document", selectedID);
    recentDocs = [selected, ...defaultDocuments];
  } else recentDocs = defaultDocuments;

  selectedIdx = Math.max(selectedIdx, 0);

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "lookup",
      ])),
      recentDocs,
      selectedIdx,
    },
  };
};

export default LookupDocumentsPage;
