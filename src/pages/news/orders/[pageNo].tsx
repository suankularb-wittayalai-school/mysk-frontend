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

const OrdersList: FC<{ orders: SchoolDocument[] }> = ({ orders }) => (
  <ul className="flex flex-col divide-y-2 divide-outline !px-0">
    {orders.map((order) => (
      <li key={order.id}>
        <DocumentListItem type="order" document={order} />
      </li>
    ))}
  </ul>
);

const OrdersPage: NextPage<{
  orders: SchoolDocument[];
  pageNo: number;
  isLastPage: boolean;
}> = ({ orders: originalOrders, pageNo, isLastPage }) => {
  const { t } = useTranslation("news");

  const [orders, setOrders] = useState<SchoolDocument[]>(originalOrders);

  const [query, setQuery] = useState<string>("");
  useEffect(() => {
    async function searchAndSetOrders() {
      const { data, error } = await searchSchoolDocs("order", query);
      if (error) setOrders(originalOrders);
      else setOrders(data);
    }
    if (query == "") setOrders(originalOrders);
    else searchAndSetOrders();
  }, [query]);

  return (
    <>
      <Head>
        <title>{createTitleStr(t("schoolDocs.orders.title"), t)}</title>
      </Head>
      <RegularLayout
        Title={
          <Title
            name={{ title: t("schoolDocs.orders.title") }}
            pageIcon={<MaterialIcon icon="inbox" />}
            backGoesTo="/news"
            LinkElement={Link}
          />
        }
      >
        <Section>
          <LayoutGridCols cols={3}>
            <Search
              placeholder={t("schoolDocs.orders.searchPlh")}
              onChange={setQuery}
            />
          </LayoutGridCols>
        </Section>
        <Section>
          <OrdersList orders={orders} />
          {!query && (
            <Actions align="center">
              <LinkButton
                label={t("schoolDocs.action.back")}
                type="tonal"
                url={`/news/orders/${pageNo - 1}`}
                LinkElement={Link}
                disabled={pageNo == 1}
              />
              <LinkButton
                label={t("schoolDocs.action.next")}
                type="tonal"
                url={`/news/orders/${pageNo + 1}`}
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

  const { data: orders, error: ordersError } = await getSchoolDocs(
    "order",
    pageNo
  );
  if (ordersError) console.error(ordersError);

  const { data: noPages, error: numError } = await getNoOfSchoolDocsPages(
    "order"
  );
  const isLastPage = pageNo == noPages;

  if (numError) console.error(numError);

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, ["common", "news"])),
      orders,
      pageNo,
      isLastPage,
    },
    revalidate: 300,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const { data: noPages, error } = await getNoOfSchoolDocsPages("order");
  if (error) console.error(error);

  return {
    paths: range(noPages, 1).map((pageNo) => ({
      params: { pageNo: pageNo.toString() },
    })),
    fallback: "blocking",
  };
};

export default OrdersPage;
