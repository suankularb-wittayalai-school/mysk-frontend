// External libraries
import { GetServerSideProps } from "next";
import Head from "next/head";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { useEffect, useState } from "react";

// SK Components
import { SplitLayout } from "@suankularb-components/react";

// Internal components
import MySKPageHeader from "@/components/common/MySKPageHeader";
import LookupList from "@/components/lookup/LookupList";
import DocumentCard from "@/components/lookup/document/DocumentCard";

// Backend
import {
  getSchoolDocs,
  getSchoolDocsByID,
} from "@/utils/backend/news/document";

// Helpers
import { createTitleStr } from "@/utils/helpers/title";

// Types
import { CustomPage, LangCode } from "@/utils/types/common";
import { SchoolDocument } from "@/utils/types/news";
import DocumentDetails from "@/components/lookup/document/DocumentDetail";

const LookupOrdersPage: CustomPage<{
  orders: SchoolDocument[];
  selectedIdx: number;
}> = ({ orders, selectedIdx }) => {
  // Translation
  const { t } = useTranslation(["lookup", "common"]);

  // Selected Order
  const [selected, setSelected] = useState<SchoolDocument>(orders[selectedIdx]);

  // If the iframe is loading
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => setLoading(true), [selected]);

  // Query
  const [query, setQuery] = useState<string>("");

  return (
    <>
      <Head>
        <title>{createTitleStr("Lookup orders", t)}</title>
      </Head>
      <MySKPageHeader title="Lookup orders" parentURL="/lookup" />
      <SplitLayout ratio="list-detail">
        <LookupList
          length={orders.length}
          searchAlt="Search orders"
          query={query}
          setQuery={setQuery}
        >
          {orders.map((order) => (
            <DocumentCard
              key={order.id}
              document={order}
              {...{ selected, setSelected }}
            />
          ))}
        </LookupList>
        <DocumentDetails document={selected} {...{ loading, setLoading }} />
      </SplitLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  query,
}) => {
  const selectedID = Number(query?.id);
  let selectedIdx = 0;

  let orders;
  const { data: defaultOrders } = await getSchoolDocs("order");

  selectedIdx = defaultOrders.findIndex((order) => selectedID === order.id);

  if (selectedID && selectedIdx === -1) {
    const { data: selected } = await getSchoolDocsByID("order", selectedID);
    orders = [selected, ...defaultOrders];
  } else orders = defaultOrders;

  selectedIdx = Math.max(selectedIdx, 0);

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "lookup",
      ])),
      orders,
      selectedIdx,
    },
  };
};

export default LookupOrdersPage;
