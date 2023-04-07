// External libraries
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

import { AnimatePresence, motion } from "framer-motion";

import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import Head from "next/head";

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

// Backend
import { getSchoolDocs } from "@/utils/backend/news/document";

// Helpers
import { cn } from "@/utils/helpers/className";
import { getLocaleYear } from "@/utils/helpers/date";
import { createTitleStr } from "@/utils/helpers/title";

// Types
import { CustomPage, LangCode } from "@/utils/types/common";
import { SchoolDocument } from "@/utils/types/news";
import SnackbarContext from "@/contexts/SnackbarContext";
import { useLocale } from "@/utils/hooks/i18n";
import { isThisYear } from "date-fns";

const OrdersList: FC<{
  orders: SchoolDocument[];
  selected: SchoolDocument;
  setSelected: (value: SchoolDocument) => void;
}> = ({ orders, selected, setSelected }) => {
  const { atBreakpoint } = useBreakpoint();
  const locale = useLocale();

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
              : { onClick: () => setSelected(order) })}
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
}> = ({ orders }) => {
  const { t } = useTranslation("lookup");

  const { duration, easing } = useAnimationConfig();

  const { setSnackbar } = useContext(SnackbarContext);

  const [selected, setSelected] = useState<SchoolDocument>(orders[0]);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => setLoading(true), [selected]);

  const mainRef: RefObject<HTMLDivElement> = useRef(null);
  const [iframeSize, setIframeSize] = useState({ width: 640, height: 480 });
  useEffect(() => {
    function handleResize() {
      const main = mainRef.current;
      if (!main) return;
      setIframeSize({
        width: main.clientWidth - 12,
        height: main.clientHeight - 154,
      });
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
        // Remove /view?usp=drivesdk” suffix
        .split("/view?usp=drivesdk")[0]
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
            <div className="flex flex-col gap-2 bg-surface-2 px-5 py-4">
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
                  selected.documentLink.split("/view?usp=drivesdk")[0]
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
  params,
  req,
  res,
}) => {
  const supabase = createServerSupabaseClient({
    req: req as NextApiRequest,
    res: res as NextApiResponse,
  });

  const { data: orders, error: ordersError } = await getSchoolDocs("order");

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "lookup",
      ])),
      orders,
    },
  };
};

export default LookupOrdersPage;