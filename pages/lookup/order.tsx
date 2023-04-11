// External libraries
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import Head from "next/head";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { useEffect, useState } from "react";

// SK Components
import { MaterialIcon, SplitLayout } from "@suankularb-components/react";

// Internal components
import MySKPageHeader from "@/components/common/MySKPageHeader";
import EmptyDetail from "@/components/lookup/EmptyDetail";
import LookupList from "@/components/lookup/LookupList";
import DocumentCard from "@/components/lookup/document/DocumentCard";
import DocumentDetails from "@/components/lookup/document/DocumentDetails";

// Backend
import { getUserMetadata } from "@/utils/backend/account";
import {
  getSchoolDocs,
  getSchoolDocsByID,
  searchSchoolDocs,
} from "@/utils/backend/news/document";

// Helpers
import { createTitleStr } from "@/utils/helpers/title";

// Types
import { CustomPage, LangCode } from "@/utils/types/common";
import { SchoolDocument } from "@/utils/types/news";

const LookupOrdersPage: CustomPage<{
  recentOrders: SchoolDocument[];
  selectedIdx: number;
}> = ({ recentOrders, selectedIdx }) => {
  // Translation
  const { t } = useTranslation(["lookup", "common"]);

  const [orders, setOrders] = useState<SchoolDocument[]>(recentOrders);

  // Selected Order
  const [selected, setSelected] = useState<SchoolDocument>(
    recentOrders[selectedIdx]
  );

  // If the iframe is loading
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => setLoading(true), [selected]);

  return (
    <>
      <Head>
        <title>{createTitleStr(t("orders.title"), t)}</title>
      </Head>
      <MySKPageHeader
        title={t("orders.title")}
        icon={<MaterialIcon icon="search" />}
        parentURL="/lookup"
      />
      <SplitLayout ratio="list-detail">
        <LookupList
          length={orders.length}
          searchAlt={t("orders.list.searchAlt")}
          onSearch={async (query) => {
            if (!query) {
              setOrders(recentOrders);
              return;
            }
            const { data } = await searchSchoolDocs("order", query);
            setOrders(data);
          }}
        >
          {orders.map((order) => (
            <DocumentCard
              key={order.id}
              document={order}
              {...{ selected, setSelected }}
            />
          ))}
        </LookupList>
        {selected ? (
          <DocumentDetails document={selected} {...{ loading, setLoading }} />
        ) : (
          <EmptyDetail />
        )}
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
  const supabase = createServerSupabaseClient({
    req: req as NextApiRequest,
    res: res as NextApiResponse,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { data: metadata } = await getUserMetadata(supabase, session!.user.id);

  let recentOrders;
  const { data: defaultOrders } = await getSchoolDocs("order", metadata!.role);

  const selectedID = Number(query?.id);
  let selectedIdx = 0;

  selectedIdx = defaultOrders.findIndex((order) => selectedID === order.id);

  if (selectedID && selectedIdx === -1) {
    const { data: selected } = await getSchoolDocsByID("order", selectedID);
    recentOrders = [selected, ...defaultOrders];
  } else recentOrders = defaultOrders;

  selectedIdx = Math.max(selectedIdx, 0);

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "lookup",
      ])),
      recentOrders,
      selectedIdx,
    },
  };
};

export default LookupOrdersPage;
