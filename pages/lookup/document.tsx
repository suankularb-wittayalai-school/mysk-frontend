// External libraries
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";

import va from "@vercel/analytics";

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
import DocumentCard from "@/components/lookup/document/DocumentCard";
import DocumentDetails from "@/components/lookup/document/DocumentDetails";

// Backend
import { getUserMetadata } from "@/utils/backend/account/getUserByEmail";
import {
  getSchoolDocs,
  getSchoolDocsByID,
  searchSchoolDocs,
} from "@/utils/backend/news/document";

// Helpers
import { createTitleStr } from "@/utils/helpers/title";

// Types
import { CustomPage, LangCode } from "@/utils/types/common";
import { SchoolDocument, SchoolDocumentType } from "@/utils/types/news";
import { Role } from "@/utils/types/person";

const LookupDocumentsPage: CustomPage<{
  recentDocs: SchoolDocument[];
  selectedIdx: number;
  userRole: Role;
}> = ({ recentDocs, selectedIdx, userRole }) => {
  // Translation
  const { t } = useTranslation(["lookup", "common"]);

  const [documents, setDocuments] = useState<SchoolDocument[]>(recentDocs);

  // Selected Document
  const [selected, setSelected] = useState<SchoolDocument>(
    recentDocs[selectedIdx]
  );

  // Type
  const [type, setType] = useState<SchoolDocumentType>(
    userRole === "teacher" ? "order" : "document"
  );
  useEffect(() => {
    (async () => {
      const { data } = await getSchoolDocs(type, userRole);
      setDocuments(data);
    })();
  }, [type]);

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
          length={documents.length}
          searchAlt={t("documents.list.searchAlt")}
          searchFilters={
            userRole === "teacher" ? (
              <ChipSet>
                <FilterChip
                  selected={type === "order"}
                  onClick={() => setType("order")}
                >
                  {t("documents.list.filter.orders")}
                </FilterChip>
                <FilterChip
                  selected={type === "document"}
                  onClick={() => setType("document")}
                >
                  {t("documents.list.filter.documents")}
                </FilterChip>
              </ChipSet>
            ) : undefined
          }
          onSearch={async (query) => {
            va.track("Search Document", {
              type: type === "order" ? "Order" : "School Document",
            });
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
  const supabase = createPagesServerClient({
    req: req as NextApiRequest,
    res: res as NextApiResponse,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { data: metadata } = await getUserMetadata(supabase, session!.user.id);
  const userRole = metadata!.role;

  const selected = {
    id: query.id ? Number(query.id) : null,
    type: query.type ? (query.type as SchoolDocumentType) : null,
  };
  let selectedIdx = 0;

  let recentDocs;
  const { data: defaultDocuments } = await getSchoolDocs(
    selected.type || (userRole === "teacher" ? "order" : "document"),
    userRole
  );

  selectedIdx = defaultDocuments.findIndex(
    (document) => selected.id === document.id && selected.type === document.type
  );

  if (selected.id && selectedIdx === -1) {
    const { data, error } = await getSchoolDocsByID("document", selected.id);
    if (error) recentDocs = defaultDocuments;
    else recentDocs = [data, ...defaultDocuments];
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
      userRole,
    },
  };
};

export default LookupDocumentsPage;
