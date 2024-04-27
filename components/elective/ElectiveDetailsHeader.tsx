import PDFViewerDialog from "@/components/common/PDFViewerDialog";
import cn from "@/utils/helpers/cn";
import getLocaleString from "@/utils/helpers/getLocaleString";
import useLocale from "@/utils/helpers/useLocale";
import { StylableFC } from "@/utils/types/common";
import { ElectiveSubject } from "@/utils/types/elective";
import {
  AssistChip,
  DURATION,
  EASING,
  MaterialIcon,
  Text,
  transition,
} from "@suankularb-components/react";
import va from "@vercel/analytics";
import { motion } from "framer-motion";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import Balancer from "react-wrap-balancer";

/**
 * The header of an Elective Details Card, including the name and syllabus of
 * the Elective Subject.
 *
 * @param electiveSubject The Elective Subject to display.
 */
const ElectiveDetailsHeader: StylableFC<{
  electiveSubject: ElectiveSubject;
}> = ({ electiveSubject, style, className }) => {
  const locale = useLocale();
  const { t } = useTranslation("elective", { keyPrefix: "detail.information" });

  const [syllabusOpen, setSyllabusOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={transition(DURATION.medium2, EASING.standard)}
      style={style}
      className={cn(
        `flex flex-col items-start gap-1 p-4 sm:flex-row sm:items-center sm:px-6
        sm:py-3`,
        className,
      )}
    >
      {/* Title */}
      <Text type="headline-small" element="h2" className="sm:grow sm:pt-1.5">
        <Balancer>{getLocaleString(electiveSubject.name, locale)}</Balancer>
      </Text>

      {/* Syllabus */}
      <AssistChip
        icon={<MaterialIcon icon="book" />}
        disabled={!electiveSubject.syllabus}
        onClick={() => {
          va.track("View Elective Syllabus", {
            sessionCode: electiveSubject.session_code,
          });
          setSyllabusOpen(true);
        }}
        className="mr-10 md:mr-0"
      >
        {t("action.seeSyllabus", {
          context: electiveSubject.syllabus ? "available" : "unavailable",
        })}
      </AssistChip>
      {electiveSubject.syllabus && (
        <PDFViewerDialog
          open={syllabusOpen}
          title={t("dialog.syllabus")}
          url={electiveSubject.syllabus.replace("?", "")}
          onClose={() => setSyllabusOpen(false)}
          onDownload={() => {
            va.track("Download Elective Syllabus", {
              sessionCode: electiveSubject.session_code,
            });
          }}
        />
      )}
    </motion.div>
  );
};

export default ElectiveDetailsHeader;
