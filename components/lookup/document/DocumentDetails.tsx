// Imports
import DocumentActions from "@/components/lookup/document/DocumentActions";
import SnackbarContext from "@/contexts/SnackbarContext";
import { SchoolDocument } from "@/utils/types/news";
import {
  Card,
  MaterialIcon,
  Progress,
  Text,
  transition,
  useAnimationConfig,
} from "@suankularb-components/react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "next-i18next";
import { sift } from "radash";
import { FC, RefObject, useContext, useEffect, useRef, useState } from "react";
import Balancer from "react-wrap-balancer";

const DocumentDetails: FC<{
  document: SchoolDocument;
  loading: boolean;
  setLoading: (value: boolean) => void;
}> = ({ document, loading, setLoading }) => {
  // Translation
  const { t } = useTranslation("lookup", { keyPrefix: "documents.header" });

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
      height: main.clientHeight - header.clientHeight,
    });
  }

  // Update iframe size on window resize and selected document change
  useEffect(() => {
    window.addEventListener("resize", updateIframeSize);
    return () => window.removeEventListener("resize", updateIframeSize);
  }, []);
  useEffect(updateIframeSize, [document]);

  const allowedRoles = sift([
    document.include_students && "student",
    document.include_teachers && "teacher",
    document.include_parents && "parent",
  ]);

  return (
    <main ref={mainRef} className="h-full">
      <Card
        appearance="outlined"
        className="relative h-full overflow-hidden !rounded-lg !bg-surface-2"
      >
        {/* Header */}
        <div ref={headerRef} className="bg-surface-5">
          <div className="space-y-2 p-4">
            <Text type="headline-small" element="h2">
              <Balancer>{document.subject}</Balancer>
            </Text>
            <DocumentActions document={document} />
          </div>

          <div className="flex flex-row gap-2 rounded-t-lg bg-surface-2 px-4 py-3">
            <MaterialIcon
              icon="lock"
              size={20}
              className="text-on-surface-variant"
            />
            <Text type="label-large" element="p">
              {t("restrictions.desc", {
                roles: allowedRoles.map((role) =>
                  t(`restrictions.descSegment.${role}`),
                ),
              })}
            </Text>
          </div>
        </div>

        {/* Google Drive embed */}
        <motion.div
          key={document.id}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            ...transition(duration.medium2, easing.standardDecelerate),
            delay: 0.2,
          }}
          className="relative w-full"
        >
          <AnimatePresence initial={false}>
            {/* Hide embed while loading */}
            {loading && (
              <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 rounded-lg bg-surface"
                transition={transition(duration.medium4, easing.standard)}
              />
            )}
          </AnimatePresence>

          {/* Linear Progress */}
          <Progress
            appearance="circular"
            alt="Loading document from Google Drive…"
            visible={loading}
            className="absolute inset-0 !m-auto"
          />

          {/* Embed iframe */}
          <iframe
            key={document.id}
            src={`${
              document.document_link.split(/\/view\?usp=[a-z]+/)[0]
            }/preview`}
            width={iframeSize.width}
            height={iframeSize.height}
            allow="autoplay"
            onLoad={() => setLoading(false)}
            className="w-full rounded-lg"
          />
        </motion.div>
      </Card>
    </main>
  );
};

export default DocumentDetails;
