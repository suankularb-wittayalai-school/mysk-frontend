// Imports
import PageHeader from "@/components/common/PageHeader";
import EmptyDetail from "@/components/lookup/EmptyDetail";
import LookupList from "@/components/lookup/LookupList";
import DocumentCard from "@/components/lookup/document/DocumentCard";
import DocumentDetails from "@/components/lookup/document/DocumentDetails";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import getLoggedInPerson from "@/utils/backend/account/getLoggedInPerson";
import { getSchoolDocumentByID } from "@/utils/backend/document/getSchoolDocumentByID";
import { getSchoolDocuments } from "@/utils/backend/document/getSchoolDocuments";
import { searchSchoolDocuments } from "@/utils/backend/document/searchSchoolDocuments";
import { CustomPage, LangCode } from "@/utils/types/common";
import { SchoolDocument, SchoolDocumentType } from "@/utils/types/news";
import { UserRole } from "@/utils/types/person";
import { ChipSet, FilterChip, SplitLayout } from "@suankularb-components/react";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import va from "@vercel/analytics";
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useEffect, useState } from "react";

const LookupDocumentsPage: CustomPage<{
  recentDocs: SchoolDocument[];
  selectedIdx: number;
  userRole: UserRole;
}> = ({ recentDocs, selectedIdx, userRole }) => {
  // Translation
  const { t } = useTranslation("lookup");
  const { t: tx } = useTranslation("common");

  const [documents, setDocuments] = useState<SchoolDocument[]>(recentDocs);
  const supabase = useSupabaseClient();

  // Selected Document
  const [selected, setSelected] = useState<SchoolDocument>(
    recentDocs[selectedIdx],
  );

  // Type
  const [type, setType] = useState<SchoolDocumentType>(
    userRole === "teacher" ? "order" : "announcement",
  );
  useEffect(() => {
    (async () => {
      const { data } = await getSchoolDocuments(supabase, userRole, type);
      if (!data) return;
      setDocuments(data);
    })();
  }, [type]);

  // If the iframe is loading
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => setLoading(true), [selected]);

  return (
    <>
      <Head>
        <title>{tx("tabName", { tabName: t("documents.title") }, t)}</title>
      </Head>
      <PageHeader parentURL="/lookup">{t("documents.title")}</PageHeader>
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
                  selected={type === "record"}
                  onClick={() => setType("record")}
                >
                  {t("documents.list.filter.records")}
                </FilterChip>
                <FilterChip
                  selected={type === "announcement"}
                  onClick={() => setType("announcement")}
                >
                  {t("documents.list.filter.announcements")}
                </FilterChip>
                <FilterChip
                  selected={type === "other"}
                  onClick={() => setType("other")}
                >
                  {t("documents.list.filter.other")}
                </FilterChip>
              </ChipSet>
            ) : undefined
          }
          onSearch={async (query) => {
            va.track("Search Document", {
              type: {
                order: "Orders",
                record: "Records",
                announcement: "Announcements",
                other: "Other",
              }[type],
            });
            if (!query) {
              setDocuments(recentDocs);
              return;
            }
            const { data } = await searchSchoolDocuments(supabase, query, type);
            if (!data) return;
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

  const { data: user, error } = await getLoggedInPerson(
    supabase,
    authOptions,
    req,
    res,
    { includeContacts: true, detailed: true },
  );

  if (error) {
    return {
      notFound: true,
    };
  }
  const userRole = user!.role;

  const selected = {
    id: query.id ? (query.id as string) : null,
    type: query.type ? (query.type as SchoolDocumentType) : null,
  };
  let selectedIdx = 0;

  let recentDocs;
  const { data: defaultDocuments } = await getSchoolDocuments(
    supabase,
    userRole,
    selected.type || (userRole === "teacher" ? "order" : "announcement"),
  );

  if (!defaultDocuments) {
    selectedIdx = defaultDocuments!.findIndex(
      (document) =>
        selected.id === document.id && selected.type === document.type,
    );
  }

  if (selected.id && selectedIdx === -1) {
    const { data, error } = await getSchoolDocumentByID(supabase, selected.id);
    if (error) recentDocs = defaultDocuments;
    else recentDocs = [data, ...defaultDocuments!];
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
