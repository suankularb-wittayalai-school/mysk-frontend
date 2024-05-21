import PageHeader from "@/components/common/PageHeader";
import LookupDetailsDialog from "@/components/lookup/LookupDetailsDialog";
import LookupDetailsSide from "@/components/lookup/LookupDetailsSide";
import LookupListSide from "@/components/lookup/LookupListSide";
import LookupResultsItem from "@/components/lookup/LookupResultsItem";
import LookupResultsList from "@/components/lookup/LookupResultsList";
import TooWideCard from "@/components/lookup/TooWideCard";
import DocumentActiveFiltersCard from "@/components/lookup/document/DocumentActiveFiltersCard";
import DocumentDetailsCard from "@/components/lookup/document/DocumentDetailsCard";
import LookupDocumentCard from "@/components/lookup/document/LookupDocumentCard";
import getDocumentsByLookupFilters from "@/utils/backend/document/getDocumentsByLookupFilters";
import createMySKClient from "@/utils/backend/mysk/createMySKClient";
import { CustomPage, LangCode } from "@/utils/types/common";
import { SchoolDocument, SchoolDocumentType } from "@/utils/types/news";
import {
  DURATION,
  SplitLayout,
  useBreakpoint,
} from "@suankularb-components/react";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { camel } from "radash";
import { useEffect, useState } from "react";

export type DocumentSearchFilters = Partial<{
  types: SchoolDocumentType[];
  subject: string;
  attendTo: string;
  month: string;
  code: string;
}>;

/**
 * The results page for Search Documents.
 *
 * @param filters The filters used to search for Documents.
 * @param documents The Documents that match the filters.
 */
const SearchDocumentsResultsPage: CustomPage<{
  filters: DocumentSearchFilters;
  documents: SchoolDocument[];
}> = ({ filters, documents }) => {
  // Translation
  const { t } = useTranslation("lookup");
  const { t: tx } = useTranslation("common");

  // Selected Document
  const [selectedDocument, setSelectedDocument] = useState<SchoolDocument>();

  // Select the first result automatically after a short delay
  useEffect(() => {
    const timeout = setTimeout(
      () => setSelectedDocument(documents[0]),
      DURATION.medium2 * 1000,
    );
    return () => clearTimeout(timeout);
  }, []);

  const [detailsOpen, setDetailsOpen] = useState(false);

  // Open the Document Details Dialog on mobile, otherwise close it
  const { atBreakpoint } = useBreakpoint();
  useEffect(() => {
    if (atBreakpoint !== "base") setDetailsOpen(false);
    else if (selectedDocument) setDetailsOpen(true);
  }, [atBreakpoint === "base"]);

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
          {/* Active Search Filters */}
          {Object.keys(filters).length > 0 && (
            <DocumentActiveFiltersCard filters={filters} />
          )}
          <TooWideCard length={documents.length} />

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
                  onClick={(document) => {
                    setSelectedDocument(document);
                    if (atBreakpoint === "base") setDetailsOpen(true);
                  }}
                />
              </LookupResultsItem>
            ))}
          </LookupResultsList>
        </LookupListSide>
        <LookupDetailsSide
          selectedID={selectedDocument?.id}
          length={documents.length}
        >
          {selectedDocument && (
            <DocumentDetailsCard document={selectedDocument} />
          )}
        </LookupDetailsSide>
      </SplitLayout>

      {/* Details Dialog */}
      <LookupDetailsDialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
      >
        {selectedDocument && (
          <DocumentDetailsCard document={selectedDocument} />
        )}
      </LookupDetailsDialog>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  query,
  req,
  res,
}) => {
  const mysk = await createMySKClient(req);
  const supabase = createPagesServerClient({
    req: req as NextApiRequest,
    res: res as NextApiResponse,
  });
  if (!mysk.user) return { notFound: true };

  const filters = Object.fromEntries([
    ["types", (query.types as string | undefined)?.split(",") || []],
    ...Object.entries(query)
      .filter(([key]) =>
        ["subject", "attend_to", "month", "code"].includes(key),
      )
      .map(([key, value]) => [camel(key), value]),
  ]) as DocumentSearchFilters;

  const { data: documents } = await getDocumentsByLookupFilters(
    supabase,
    mysk.user,
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

export default SearchDocumentsResultsPage;
