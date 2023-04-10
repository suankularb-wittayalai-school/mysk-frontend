// External libraries
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "next-i18next";
import { FC, RefObject, useContext, useEffect, useRef, useState } from "react";

// SK Components
import {
  AssistChip,
  Card,
  ChipSet,
  MaterialIcon,
  Progress,
  Snackbar,
  transition,
  useAnimationConfig,
} from "@suankularb-components/react";

// Contexts
import SnackbarContext from "@/contexts/SnackbarContext";

// Types
import { SchoolDocument } from "@/utils/types/news";
import { Role } from "@/utils/types/person";

const DocumentActions: FC<{ document: SchoolDocument }> = ({ document }) => {
  // Translation
  const { t } = useTranslation("lookup", {
    keyPrefix: "documents.header.action",
  });

  // Snackbar
  const { setSnackbar } = useContext(SnackbarContext);

  /**
   * Opens the native share sheet (if available) for the Drive link. As a
   * fallback, this function puts the link in the clipboard.
   */
  async function handleShare() {
    const shareData = {
      title: document.subject,
      url: document.documentLink,
    };
    if (navigator.canShare && navigator.canShare(shareData))
      await navigator.share(shareData);
    else navigator.clipboard.writeText(window.location.href);
  }

  /**
   * Open the Google Drive PDF file in a new window.
   */
  function handlePopOut() {
    window.open(document.documentLink, "_blank", "popup, noreferrer");
  }

  /**
   * Downloads the PDF file from Google Drive.
   */
  function handleDownload() {
    window.location.href = `https://drive.google.com/u/1/uc?id=${
      document.documentLink
        // Remove “https://drive.google.com/file/d/” prefix
        .slice(32)
        // Remove “/view?usp=___” suffix
        .split(/\/view\?usp=[a-z]+/)[0]
    }&export=download`;

    setSnackbar(<Snackbar>{t("snackbar.download")}</Snackbar>);
  }

  return (
    <ChipSet>
      <AssistChip icon={<MaterialIcon icon="share" />} onClick={handleShare}>
        {t("share")}
      </AssistChip>
      <AssistChip
        icon={<MaterialIcon icon="open_in_new" />}
        onClick={handlePopOut}
      >
        {t("popOut")}
      </AssistChip>
      <AssistChip
        icon={<MaterialIcon icon="download" />}
        onClick={handleDownload}
      >
        {t("download")}
      </AssistChip>
    </ChipSet>
  );
};

const RestrictionsCard: FC<{
  includes?: SchoolDocument["includes"];
}> = ({ includes }) => {
  // Translation
  const { t } = useTranslation("lookup", {
    keyPrefix: "documents.header.restrictions",
  });

  const allowedRoles = [
    includes?.students && "student",
    includes?.teachers && "teacher",
    includes?.parents && "parent",
  ].filter((role) => role) as (Role | "parent")[];

  return (
    <Card
      appearance="outlined"
      className="mx-5 mb-4 gap-1.5 !rounded-sm p-3 md:col-span-3 md:my-3
        md:mr-3 md:min-h-[5.25rem]"
    >
      <div className="flex flex-row gap-1.5">
        <MaterialIcon
          icon="lock"
          size={20}
          className="text-on-surface-variant"
        />
        <h2 className="skc-title-small">{t("title")}</h2>
      </div>
      <p className="skc-body-small">
        {allowedRoles.length === 1
          ? t("desc_one", { role: t(`descSegment.${allowedRoles[0]}`) })
          : allowedRoles.length === 2
          ? t("desc_two", {
              role1: t(`descSegment.${allowedRoles[0]}`),
              role2: t(`descSegment.${allowedRoles[1]}`),
            })
          : t("desc_all")}
      </p>
    </Card>
  );
};

const DocumentDetails: FC<{
  document: SchoolDocument;
  loading: boolean;
  setLoading: (value: boolean) => void;
}> = ({ document, loading, setLoading }) => {
  // Animation
  const { duration, easing } = useAnimationConfig();

  // Snackbar
  const { setSnackbar } = useContext(SnackbarContext);

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

  // Update iframe size on window resize and selected document change
  useEffect(() => {
    window.addEventListener("resize", updateIframeSize);
    return () => window.removeEventListener("resize", updateIframeSize);
  }, []);
  useEffect(updateIframeSize, [document]);

  return (
    <main ref={mainRef} className="hidden sm:block">
      <Card appearance="outlined" className="relative h-full overflow-hidden">
        {/* Top App Bar */}
        <div
          ref={headerRef}
          className="grid items-start bg-surface-2 md:grid-cols-8"
        >
          <div className="flex flex-col gap-2 px-5 py-4 md:col-span-5">
            <h2 className="skc-headline-small">{document.subject}</h2>
            <DocumentActions document={document} />
          </div>
          <RestrictionsCard includes={document.includes} />
        </div>

        {/* Google Drive embed */}
        <div className="relative w-full">
          <AnimatePresence initial={false}>
            {/* Hide embed while loading */}
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

          {/* Linear Progress */}
          <Progress
            appearance="linear"
            alt="Loading document from Google Drive…"
            visible={loading}
            className="absolute inset-0 bottom-auto"
          />

          {/* Embed iframe */}
          <iframe
            key={document.id}
            src={`${
              document.documentLink.split(/\/view\?usp=[a-z]+/)[0]
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
  );
};

export default DocumentDetails;
