// External libraries
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { useEffect, useState } from "react";

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

// Backend
import { getNoOfOrderPages } from "@utils/backend/news/order";

// Helpers
import { range } from "@utils/helpers/array";
import { createTitleStr } from "@utils/helpers/title";

// Types
import { LangCode } from "@utils/types/common";

const OrdersPage: NextPage<{
  orders: any[];
  pageNo: number;
  isLastPage: boolean;
}> = ({ orders: originalOrders, pageNo, isLastPage }) => {
  const { t } = useTranslation("news");

  const [orders, setOrders] = useState<any[]>(originalOrders);

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
        <title>{createTitleStr(t("orders.title"), t)}</title>
      </Head>
      <RegularLayout
        Title={
          <Title
            name={{ title: t("orders.title") }}
            pageIcon={<MaterialIcon icon="inbox" />}
            backGoesTo="/news"
            LinkElement={Link}
          />
        }
      >
        <Section>
          <LayoutGridCols cols={3}>
            <Search placeholder="ค้นหาคำสั่ง" onChange={setQuery} />
          </LayoutGridCols>
        </Section>
        <Section>
          {/* TODO */}
          {!query && (
            <Actions align="center">
              <LinkButton
                label="หน้าที่แล้ว"
                type="tonal"
                url={`/news/orders/${pageNo - 1}`}
                LinkElement={Link}
                disabled={pageNo == 1}
              />
              <LinkButton
                label="หน้าต่อไป"
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

  // TODO: Define Orders type and fetch Orders
  const orders: any[] = [];

  const { data: noOfOrders, error } = await getNoOfOrderPages();
  const isLastPage = pageNo == noOfOrders;

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
  const { data: noOfOrders, error } = await getNoOfOrderPages();
  if (error) console.error(error);

  return {
    paths: range(error ? 1 : noOfOrders, 1).map((pageNo) => ({
      params: { pageNo: pageNo.toString() },
    })),
    fallback: "blocking",
  };
};

export default OrdersPage;
