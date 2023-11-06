// Imports
import PageHeader from "@/components/common/PageHeader";
import LookupDetailsSide from "@/components/lookup/LookupDetailsSide";
import LookupListSide from "@/components/lookup/LookupListSide";
import LookupResultsList from "@/components/lookup/LookupResultsList";
import DocumentCard from "@/components/lookup/document/DocumentCard";
import DocumentDetails from "@/components/lookup/document/DocumentDetails";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import getLoggedInPerson from "@/utils/backend/account/getLoggedInPerson";
import { getSchoolDocumentByID } from "@/utils/backend/document/getSchoolDocumentByID";
import { getSchoolDocuments } from "@/utils/backend/document/getSchoolDocuments";
import { searchSchoolDocuments } from "@/utils/backend/document/searchSchoolDocuments";
import useLocale from "@/utils/helpers/useLocale";
import { CustomPage, LangCode } from "@/utils/types/common";
import { SchoolDocument, SchoolDocumentType } from "@/utils/types/news";
import { UserRole } from "@/utils/types/person";
import {
  ChipSet,
  FilterChip,
  Search,
  SplitLayout,
  useAnimationConfig,
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
  selectedIdx: number;
  userRole: UserRole;
}> = ({ recentDocs, selectedIdx, userRole }) => {
  // Translation
  const locale = useLocale();
  const { t } = useTranslation("lookup");
  const { t: tx } = useTranslation("common");

  const { duration, easing } = useAnimationConfig();

  const [documents, setDocuments] = useState<SchoolDocument[]>(recentDocs);
  const supabase = useSupabaseClient();

  // Selected Document
  const [selected, setSelected] = useState<SchoolDocument>(
    recentDocs[selectedIdx],
  );

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
            <ChipSet>
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
            {documents.map((document) => (
              <DocumentCard
                key={document.id}
                document={document}
                selected={selected}
                onSelectedChange={setSelected}
              />
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
