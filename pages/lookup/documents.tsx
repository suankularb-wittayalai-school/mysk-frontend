// Imports
import PageHeader from "@/components/common/PageHeader";
import LookupDetailsSide from "@/components/lookup/LookupDetailsSide";
import LookupListSide from "@/components/lookup/LookupListSide";
import LookupResultsItem from "@/components/lookup/LookupResultsItem";
import LookupResultsList from "@/components/lookup/LookupResultsList";
import DocumentCard from "@/components/lookup/document/DocumentCard";
import DocumentDetails from "@/components/lookup/document/DocumentDetails";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import getLoggedInPerson from "@/utils/backend/account/getLoggedInPerson";
import { getSchoolDocuments } from "@/utils/backend/document/getSchoolDocuments";
import { searchSchoolDocuments } from "@/utils/backend/document/searchSchoolDocuments";
import cn from "@/utils/helpers/cn";
import useLocale from "@/utils/helpers/useLocale";
import { CustomPage, LangCode } from "@/utils/types/common";
import { SchoolDocument, SchoolDocumentType } from "@/utils/types/news";
import { UserRole } from "@/utils/types/person";
import {
  ChipSet,
  FilterChip,
  Search,
  SplitLayout,
} from "@suankularb-components/react";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import va from "@vercel/analytics";
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { camel } from "radash";
import { useEffect, useState } from "react";

const LookupDocumentsPage: CustomPage<{
  recentDocs: SchoolDocument[];
  userRole: UserRole;
}> = ({ recentDocs, userRole }) => {
  // Translation
  const locale = useLocale();
  const { t } = useTranslation("lookup");
  const { t: tx } = useTranslation("common");

  const [documents, setDocuments] = useState<SchoolDocument[]>(recentDocs);
  const supabase = useSupabaseClient();

  // Selected Document
  const [selected, setSelected] = useState<SchoolDocument>(recentDocs[0]);

  // Query
  const [query, setQuery] = useState("");
  async function handleSearch() {
    va.track("Search Document", {
      type: {
        order: "Orders",
        record: "Records",
        announcement: "Announcements",
        big_garuda: "External",
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
  }

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
      <SplitLayout
        ratio="list-detail"
        className="sm:[&>div]:!grid-cols-2 md:[&>div]:!grid-cols-3"
      >
        <LookupListSide length={documents.length}>
          <section className="space-y-3">
            <Search
              alt={t("documents.list.searchAlt")}
              value={query}
              locale={locale}
              onChange={setQuery}
              onSearch={handleSearch}
            />
            <ChipSet
              scrollable
              className={cn(`!-mx-4 w-screen sm:!mx-0 sm:!w-full [&>*]:!px-4
                [&>*]:sm:!px-0`)}
            >
              {(
                [
                  "order",
                  "record",
                  "announcement",
                  "big_garuda",
                  "other",
                ] as SchoolDocumentType[]
              ).map((mapType) => (
                <FilterChip
                  key={mapType}
                  selected={type === mapType}
                  onClick={() => setType(mapType)}
                >
                  {t(`documents.list.filter.${camel(mapType)}`)}
                </FilterChip>
              ))}
            </ChipSet>
          </section>
          <LookupResultsList length={documents.length}>
            {documents.map((document, idx) => (
              <LookupResultsItem
                key={document.id}
                idx={idx}
                length={documents.length}
              >
                <DocumentCard
                  key={document.id}
                  document={document}
                  selected={selected}
                  onSelectedChange={setSelected}
                />
              </LookupResultsItem>
            ))}
          </LookupResultsList>
        </LookupListSide>
        <LookupDetailsSide selectedID={selected?.id} length={documents.length}>
          <DocumentDetails document={selected} {...{ loading, setLoading }} />
        </LookupDetailsSide>
      </SplitLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  req,
  res,
}) => {
  const supabase = createPagesServerClient({
    req: req as NextApiRequest,
    res: res as NextApiResponse,
  });

  const { data: user } = await getLoggedInPerson(
    supabase,
    authOptions,
    req,
    res,
    { includeContacts: true, detailed: true },
  );

  const userRole = user?.role || "student";

  const { data: recentDocs } = await getSchoolDocuments(
    supabase,
    userRole,
    userRole === "teacher" ? "order" : "announcement",
  );

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "lookup",
      ])),
      recentDocs,
      userRole,
    },
  };
};

export default LookupDocumentsPage;
