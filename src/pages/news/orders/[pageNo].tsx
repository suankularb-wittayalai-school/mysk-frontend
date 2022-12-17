// External libraries
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { Trans, useTranslation } from "next-i18next";
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
import { getNoOfSchoolDocsPages } from "@utils/backend/news/document";

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
    if (query == "") {
      setOrders(originalOrders);
    } else if (query.length > 3) {
      // TODO: Search with query
    }
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

  // TODO: Fetch Orders
  // (Replace hard-coded `orders` array with the `getOrders` function below.)
  const orders: SchoolDocument[] = [
    {
      id: 1,
      code: "270",
      date: "2022-12-17",
      subject:
        "แต่งตั้งครูที่ปรึกษากิตกรรมชุมนุมนักเรียน ปีการศึกษา 2565 (เพิ่มเติม)",
      includes: { teachers: true },
      documentLink:
        "https://drive.google.com/file/d/1p9KfIKUyvDegLxPtd6L32O0sRJ0bvGhp/view?usp=drivesdk",
    },
  ];
  // const { data: orders, error: ordersError } = await getOrders("order", pageNo);
  // if (ordersError) console.error(ordersError);

  const { data: noOfOrders, error: numError } = await getNoOfSchoolDocsPages(
    "order"
  );
  const isLastPage = pageNo == noOfOrders;

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
  const { data: noOfOrders, error } = await getNoOfSchoolDocsPages("order");
  if (error) console.error(error);

  return {
    paths: range(error ? 1 : noOfOrders, 1).map((pageNo) => ({
      params: { pageNo: pageNo.toString() },
    })),
    fallback: "blocking",
  };
};

export default OrdersPage;
