// External libraries
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";

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

// Animations
import { animationTransition } from "@utils/animations/config";

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
    <LayoutGroup>
      <AnimatePresence initial={false}>
        {orders.map((order) => (
          <motion.li
            key={order.id}
            layoutId={`order-${order.id}`}
            initial={{ scale: 0.95, y: 10, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 10, opacity: 0 }}
            transition={animationTransition}
          >
            <DocumentListItem type="order" document={order} />
          </motion.li>
        ))}
      </AnimatePresence>
    </LayoutGroup>
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
          <AnimatePresence>
            {!query && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={animationTransition}
              >
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
              </motion.div>
            )}
          </AnimatePresence>
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
