// Imports
import LookupDetailsCard from "@/components/lookup/LookupDetailsCard";
import DocumentHeader from "@/components/lookup/document/DocumentHeader";
import { StylableFC } from "@/utils/types/common";
import { SchoolDocument } from "@/utils/types/news";
import {
  MaterialIcon,
  Progress,
  Text,
  transition,
  useAnimationConfig,
} from "@suankularb-components/react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "next-i18next";
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
  // Translation
  const { t } = useTranslation("lookup", { keyPrefix: "documents.header" });

  // Animation
  const { duration, easing } = useAnimationConfig();

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
  useEffect(updateIframeSize, [document]);

  // Convert the allowed roles to a list of strings that can be used as
  // translation keys
  const allowedRoles = sift([
    document.include_students && "student",
    document.include_teachers && "teacher",
    document.include_parents && "parent",
  ]);

  return (
    <LookupDetailsCard style={style} className={className}>
      {/* Header */}
      <div ref={headerRef} className="bg-surface-5">
        <DocumentHeader document={document} />

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
      <div className="bg-surface-2">
        <motion.div
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
            className="w-full rounded-lg bg-surface"
          />
        </motion.div>
      </div>
    </LookupDetailsCard>
  );
};

export default DocumentDetailsCard;
