// External libraries
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// SK Components
import {
  RegularLayout,
  Title,
  MaterialIcon,
} from "@suankularb-components/react";

// Backend
import { getNoOfOrderPages } from "@utils/backend/news/order";

// Helpers
import { range } from "@utils/helpers/array";
import { createTitleStr } from "@utils/helpers/title";

// Types
import { LangCode } from "@utils/types/common";

const OrdersPage: NextPage = () => {
  const { t } = useTranslation("news");
  return (
    <>
      <Head>
        <title>{createTitleStr(t("orders.title"), t)}</title>
      </Head>
      <RegularLayout
        Title={
          <Title
            name={{
              title: t("orders.title"),
            }}
            pageIcon={<MaterialIcon icon="inbox" />}
            backGoesTo="/news"
            LinkElement={Link}
          />
        }
      >
        {/* TODO */}
      </RegularLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale, params }) => ({
  props: await serverSideTranslations(locale as LangCode, ["common", "news"]),
  revalidate: 300,
});

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
