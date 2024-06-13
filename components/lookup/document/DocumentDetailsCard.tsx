import LookupDetailsCard from "@/components/lookup/LookupDetailsCard";
import DocumentHeader from "@/components/lookup/document/DocumentHeader";
import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import { SchoolDocument } from "@/utils/types/news";
import {
  DURATION,
  EASING,
  MaterialIcon,
  Progress,
  Text,
  transition,
} from "@suankularb-components/react";
import { AnimatePresence, motion } from "framer-motion";
import useTranslation from "next-translate/useTranslation";
import { sift } from "radash";
import { RefObject, useEffect, useRef, useState } from "react";

/**
 * A card that displays a Document in the detail section.
 *
 * @param document The Document to display.
 */
const DocumentDetailsCard: StylableFC<{
  document: SchoolDocument;
}> = ({ document, style, className }) => {
  const { t } = useTranslation("search/documents/detail");

  // Loading
  const [loading, setLoading] = useState(true);

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
  useEffect(updateIframeSize, []);

  // Convert the allowed roles to a list of strings that can be used as
  // translation keys
  const allowedRoles = sift([
    document.include_students && "student",
    document.include_teachers && "teacher",
    document.include_parents && "parent",
  ]);

  return (
    <LookupDetailsCard style={style} className={className}>
      <div ref={mainRef} className="h-full">
        {/* Header */}
        <div ref={headerRef}>
          <DocumentHeader document={document} />
          <div
            className={cn(`flex flex-row gap-2 rounded-t-lg bg-surface-container
              px-4 py-3`)}
          >
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
        <div className="bg-surface-container">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              ...transition(DURATION.medium2, EASING.standardDecelerate),
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
                  transition={transition(DURATION.medium4, EASING.standard)}
                />
              )}
            </AnimatePresence>

            {/* Circular Progress */}
            <Progress
              appearance="circular"
              alt={t("loading")}
              visible={loading}
              className="absolute inset-0 !m-auto"
            />

            {/* Embed iframe */}
            <iframe
              key={document.id}
              src={
                document.document_link.includes("drive.google.com")
                  ? document.document_link.replace(
                      /\/view\?usp=.+/,
                      "/preview",
                    )
                  : document.document_link
              }
              width={iframeSize.width}
              height={iframeSize.height}
              allow="autoplay"
              onLoad={() => setLoading(false)}
              className="w-full rounded-t-lg bg-surface"
            />
          </motion.div>
        </div>
      </div>
    </LookupDetailsCard>
  );
};

export default DocumentDetailsCard;
