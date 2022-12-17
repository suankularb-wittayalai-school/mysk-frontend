// External libraries
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { FC, useEffect, useState } from "react";

// SK Components
import {
  RegularLayout,
  Title,
  MaterialIcon,
  Section,
  Search,
  LayoutGridCols,
  Actions,
  LinkButton,
} from "@suankularb-components/react";

// Components
import DocumentListItem from "@components/news/DocumentListItem";

// Backend
import {
  getNoOfSchoolDocsPages,
  getSchoolDocs,
  searchSchoolDocs,
} from "@utils/backend/news/document";

// Helpers
import { range } from "@utils/helpers/array";
import { createTitleStr } from "@utils/helpers/title";

// Types
import { LangCode } from "@utils/types/common";
import { SchoolDocument } from "@utils/types/news";

const DocumentsList: FC<{ documents: SchoolDocument[] }> = ({ documents }) => (
  <ul className="flex flex-col divide-y-2 divide-outline !px-0">
    {documents.map((document) => (
      <li key={document.id}>
        <DocumentListItem type="order" document={document} />
      </li>
    ))}
  </ul>
);

const DocumentsPage: NextPage<{
  documents: SchoolDocument[];
  pageNo: number;
  isLastPage: boolean;
}> = ({ documents: originalDocuments, pageNo, isLastPage }) => {
  const { t } = useTranslation("news");

  const [documents, setDocuments] =
    useState<SchoolDocument[]>(originalDocuments);

  const [query, setQuery] = useState<string>("");
  useEffect(() => {
    async function searchAndSetDocuments() {
      const { data, error } = await searchSchoolDocs("document", query);
      if (error) setDocuments(originalDocuments);
      else setDocuments(data);
    }
    if (query == "") setDocuments(originalDocuments);
    else searchAndSetDocuments();
  }, [query]);

  return (
    <>
      <Head>
        <title>{createTitleStr(t("schoolDocs.documents.title"), t)}</title>
      </Head>
      <RegularLayout
        Title={
          <Title
            name={{ title: t("schoolDocs.documents.title") }}
            pageIcon={<MaterialIcon icon="inbox" />}
            backGoesTo="/news"
            LinkElement={Link}
          />
        }
      >
        <Section>
          <LayoutGridCols cols={3}>
            <Search
              placeholder={t("schoolDocs.documents.searchPlh")}
              onChange={setQuery}
            />
          </LayoutGridCols>
        </Section>
        <Section>
          <DocumentsList documents={documents} />
          {!query && (
            <Actions align="center">
              <LinkButton
                label={t("schoolDocs.action.back")}
                type="tonal"
                url={`/news/documents/${pageNo - 1}`}
                LinkElement={Link}
                disabled={pageNo == 1}
              />
              <LinkButton
                label={t("schoolDocs.action.next")}
                type="tonal"
                url={`/news/documents/${pageNo + 1}`}
                LinkElement={Link}
                disabled={isLastPage}
              />
            </Actions>
          )}
        </Section>
      </RegularLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale, params }) => {
  const pageNo = Number(params?.pageNo);

  const { data: documents, error: documentsError } = await getSchoolDocs(
    "document",
    pageNo
  );
  if (documentsError) console.error(documentsError);

  const { data: noPages, error: numError } = await getNoOfSchoolDocsPages(
    "document"
  );
  const isLastPage = pageNo == noPages;

  if (numError) console.error(numError);

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, ["common", "news"])),
      documents,
      pageNo,
      isLastPage,
    },
    revalidate: 300,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const { data: noPages, error } = await getNoOfSchoolDocsPages("document");
  if (error) console.error(error);

  return {
    paths: range(noPages, 1).map((pageNo) => ({
      params: { pageNo: pageNo.toString() },
    })),
    fallback: "blocking",
  };
};

export default DocumentsPage;
