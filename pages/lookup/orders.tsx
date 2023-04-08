// External libraries
import { isThisYear } from "date-fns";

import { AnimatePresence, motion } from "framer-motion";

import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { FC, RefObject, useContext, useEffect, useRef, useState } from "react";

// SK Components
import {
  AssistChip,
  Card,
  CardHeader,
  ChipSet,
  MaterialIcon,
  Progress,
  Search,
  Snackbar,
  SplitLayout,
  transition,
  useAnimationConfig,
  useBreakpoint,
} from "@suankularb-components/react";

// Internal components
import MySKPageHeader from "@/components/common/MySKPageHeader";

// Contexts
import SnackbarContext from "@/contexts/SnackbarContext";

// Backend
import {
  getSchoolDocs,
  getSchoolDocsByID,
} from "@/utils/backend/news/document";

// Helpers
import { cn } from "@/utils/helpers/className";
import { getLocaleYear } from "@/utils/helpers/date";
import { createTitleStr } from "@/utils/helpers/title";

// Hooks
import { useLocale } from "@/utils/hooks/i18n";

// Types
import { CustomPage, LangCode } from "@/utils/types/common";
import { SchoolDocument } from "@/utils/types/news";

const OrdersList: FC<{
  orders: SchoolDocument[];
  selected: SchoolDocument;
  setSelected: (value: SchoolDocument) => void;
}> = ({ orders, selected, setSelected }) => {
  const { atBreakpoint } = useBreakpoint();
  const locale = useLocale();
  const router = useRouter();

  return (
    <div className="flex flex-col gap-2">
      {orders.map((order) => {
        const orderDate = new Date(order.date);
        return (
          <Card
            key={order.id}
            appearance="filled"
            direction="row"
            stateLayerEffect
            className={cn([
              "text-left",
              selected.id === order.id
                ? "!bg-primary-container"
                : "!border-transparent !bg-transparent",
            ])}
            {...(atBreakpoint === "base"
              ? {
                  href: order.documentLink,
                  aAttr: { target: "_blank", rel: "noreferrer" },
                }
              : {
                  onClick: () => {
                    setSelected(order);
                    router.replace(`/lookup/orders?id=${order.id}`, undefined, {
                      shallow: true,
                    });
                  },
                })}
          >
            <CardHeader
              title={order.subject}
              subtitle={`№ ${order.code}/${getLocaleYear(
                "th",
                orderDate.getFullYear()
              )} • ${orderDate.toLocaleDateString(locale, {
                year: !isThisYear(orderDate)
                  ? locale === "en-US"
                    ? "numeric"
                    : "2-digit"
                  : undefined,
                month: "short",
                day: "numeric",
              })}`}
            />
          </Card>
        );
      })}
      <Card appearance="outlined">
        <p className="py-2 px-4 text-on-surface-variant">
          {orders.length === 100
            ? "For performance reasons, we limit the number of search results to 100. If you can’t find what you’re looking for, try a more specific query."
            : orders.length > 10 && "You’ve reached the end."}
        </p>
      </Card>
    </div>
  );
};

const LookupOrdersPage: CustomPage<{
  orders: SchoolDocument[];
  selectedIdx: number;
}> = ({ orders, selectedIdx }) => {
  // Translation
  const { t } = useTranslation("lookup");

  // Animation
  const { duration, easing } = useAnimationConfig();

  // Snackbar
  const { setSnackbar } = useContext(SnackbarContext);

  // Selected Order
  const [selected, setSelected] = useState<SchoolDocument>(orders[selectedIdx]);

  // iframe

  // If the iframe is loading
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => setLoading(true), [selected]);

  // Responsive iframe size
  const mainRef: RefObject<HTMLDivElement> = useRef(null);
  const headerRef: RefObject<HTMLDivElement> = useRef(null);
  const [iframeSize, setIframeSize] = useState({ width: 640, height: 480 });

  /**
   * Sets the iframe size according to the width and height of relevant
   * components.
   */
  function updateIframeSize() {
    const main = mainRef.current;
    const header = headerRef.current;
    if (!main || !header) return;
    setIframeSize({
      width: main.clientWidth - 12,
      height: main.clientHeight - header.clientHeight - 48,
    });
  }

  useEffect(() => {
    window.addEventListener("resize", updateIframeSize);
    return () => window.removeEventListener("resize", updateIframeSize);
  }, []);
  useEffect(updateIframeSize, [selected]);

  /**
   * Opens the native share sheet (if available) for the Drive link. As a
   * fallback, this function puts the link in the clipboard.
   */
  async function handleShare() {
    const shareData = {
      title: selected.subject,
      url: selected.documentLink,
    };
    if (navigator.canShare && navigator.canShare(shareData))
      await navigator.share(shareData);
    else navigator.clipboard.writeText(window.location.href);
  }

  /**
   * Downloads the PDF file from Google Drive.
   */
  function handleDownload() {
    window.location.href = `https://drive.google.com/u/1/uc?id=${
      selected.documentLink
        // Remove “https://drive.google.com/file/d/” prefix
        .slice(32)
        // Remove “/view?usp=___” suffix
        .split(/\/view\?usp=[a-z]+/)[0]
    }&export=download`;
    setSnackbar(<Snackbar>Getting that file for you…</Snackbar>);
  }

  return (
    <>
      <Head>
        <title>{createTitleStr("Lookup orders", t)}</title>
      </Head>
      <MySKPageHeader title="Lookup orders" parentURL="/lookup" />
      <SplitLayout ratio="list-detail">
        <aside className="flex flex-col gap-6">
          <Search alt="Search documents" />
          <OrdersList
            orders={orders}
            selected={selected}
            setSelected={setSelected}
          />
        </aside>
        <main ref={mainRef} className="hidden sm:block">
          <Card
            appearance="outlined"
            className="relative h-full overflow-hidden"
          >
            <div
              ref={headerRef}
              className="flex flex-col gap-2 bg-surface-2 px-5 py-4"
            >
              <h2 className="skc-headline-small">{selected.subject}</h2>
              <ChipSet>
                <AssistChip
                  icon={<MaterialIcon icon="share" />}
                  onClick={handleShare}
                >
                  Share
                </AssistChip>
                <AssistChip
                  icon={<MaterialIcon icon="download" />}
                  onClick={handleDownload}
                >
                  Download
                </AssistChip>
              </ChipSet>
            </div>
            <div className="relative w-full">
              <AnimatePresence initial={false}>
                {loading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-surface"
                    transition={transition(duration.medium4, easing.standard)}
                  />
                )}
              </AnimatePresence>
              <Progress
                appearance="linear"
                alt="Loading document from Google Drive…"
                visible={loading}
                className="absolute inset-0 bottom-auto"
              />
              <iframe
                key={selected.id}
                src={`${
                  selected.documentLink.split(/\/view\?usp=[a-z]+/)[0]
                }/preview`}
                width={iframeSize.width}
                height={iframeSize.height}
                allow="autoplay"
                onLoad={() => setLoading(false)}
                className="w-full"
              />
            </div>
          </Card>
        </main>
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

  selectedIdx = Math.max(
    defaultOrders.findIndex((order) => selectedID === order.id),
    0
  );

  if (selectedID && !selectedIdx) {
    const { data: selected } = await getSchoolDocsByID("order", selectedID);
    orders = [selected, ...defaultOrders];
  } else orders = defaultOrders;

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
