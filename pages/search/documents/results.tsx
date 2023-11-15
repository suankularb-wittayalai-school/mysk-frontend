// Imports
import PageHeader from "@/components/common/PageHeader";
import ActiveSearchFiltersCard from "@/components/lookup/ActiveSearchFiltersCard";
import LookupDetailsSide from "@/components/lookup/LookupDetailsSide";
import LookupListSide from "@/components/lookup/LookupListSide";
import LookupResultsItem from "@/components/lookup/LookupResultsItem";
import LookupResultsList from "@/components/lookup/LookupResultsList";
import DocumentDetailsCard from "@/components/lookup/document/DocumentDetailsCard";
import LookupDocumentCard from "@/components/lookup/document/LookupDocumentCard";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import getLoggedInPerson from "@/utils/backend/account/getLoggedInPerson";
import getDocumentsByLookupFilters from "@/utils/backend/document/getDocumentsByLookupFilters";
import useLocale from "@/utils/helpers/useLocale";
import { CustomPage, LangCode } from "@/utils/types/common";
import { SchoolDocument, SchoolDocumentType } from "@/utils/types/news";
import { SplitLayout } from "@suankularb-components/react";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { camel } from "radash";
import { useState } from "react";

export type DocumentSearchFilters = Partial<{
  types: SchoolDocumentType[];
  subject: string;
  attendTo: string;
  month: string;
  code: string;
}>;

const LookupDocumentsPage: CustomPage<{
  filters: DocumentSearchFilters;
  documents: SchoolDocument[];
}> = ({ filters, documents }) => {
  // Translation
  const locale = useLocale();
  const { t } = useTranslation("lookup");
  const { t: tx } = useTranslation("common");

  // Selected Document
  const [selectedDocument, setSelectedDocument] = useState<SchoolDocument>(
    documents[0],
  );

  return (
    <>
      <Head>
        <title>{tx("tabName", { tabName: t("documents.title") }, t)}</title>
      </Head>
      <PageHeader parentURL="/search/documents">
        {t("documents.title")}
      </PageHeader>
      <SplitLayout
        ratio="list-detail"
        className="sm:[&>div]:!grid-cols-2 md:[&>div]:!grid-cols-3"
      >
        <LookupListSide length={documents.length}>
          <ActiveSearchFiltersCard>
            {/* TODO: Document filter Chips */}
            <pre>{JSON.stringify(filters)}</pre>
          </ActiveSearchFiltersCard>
          <LookupResultsList length={documents.length}>
            {documents.map((document, idx) => (
              <LookupResultsItem
                key={document.id}
                idx={idx}
                length={documents.length}
              >
                <LookupDocumentCard
                  key={document.id}
                  document={document}
                  selected={selectedDocument}
                  onClick={setSelectedDocument}
                />
              </LookupResultsItem>
            ))}
          </LookupResultsList>
        </LookupListSide>
        <LookupDetailsSide
          selectedID={selectedDocument?.id}
          length={documents.length}
        >
          <DocumentDetailsCard document={selectedDocument} />
        </LookupDetailsSide>
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

  const filters = Object.fromEntries([
    ["types", (query.types as string | undefined)?.split(",") || []],
    ...Object.entries(query)
      .filter(([key]) =>
        ["subject", "attend_to", "month", "code"].includes(key),
      )
      .map(([key, value]) => [camel(key), value]),
  ]) as DocumentSearchFilters;

  const { data: user } = await getLoggedInPerson(
    supabase,
    authOptions,
    req,
    res,
    { includeContacts: true, detailed: true },
  );

  const userRole = user?.role || "student";

  const { data: documents } = await getDocumentsByLookupFilters(
    supabase,
    userRole,
    filters,
  );

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "lookup",
      ])),
      filters,
      documents,
    },
  };
};

export default LookupDocumentsPage;
