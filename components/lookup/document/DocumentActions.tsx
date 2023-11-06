// Imports
import SnackbarContext from "@/contexts/SnackbarContext";
import { StylableFC } from "@/utils/types/common";
import { SchoolDocument } from "@/utils/types/news";
import {
  AssistChip,
  ChipSet,
  MaterialIcon,
  Snackbar,
} from "@suankularb-components/react";
import va from "@vercel/analytics";
import { useTranslation } from "next-i18next";
import { useContext } from "react";

/**
 * A set of actions for a School Document.
 *
 * @param document The Document to display actions for.
 */
const DocumentActions: StylableFC<{
  document: SchoolDocument;
}> = ({ document, style, className }) => {
  // Translation
  const { t } = useTranslation("lookup", { keyPrefix: "documents" });

  // Snackbar
  const { setSnackbar } = useContext(SnackbarContext);

  /**
   * Opens the native share sheet (if available) for the Drive link. As a
   * fallback, this function puts the link in the clipboard.
   */
  async function handleShare() {
    va.track("Share Document", { subject: document.subject });

    const shareData = {
      title: document.subject,
      url: document.document_link,
    };
    if (navigator.canShare && navigator.canShare(shareData))
      await navigator.share(shareData);
    else navigator.clipboard.writeText(window.location.href);
  }

  /**
   * Open the Google Drive PDF file in a new window.
   */
  function handlePopOut() {
    va.track("Pop out Document", { subject: document.subject });

    window.open(document.document_link, "_blank", "popup, noreferrer");
  }

  /**
   * Downloads the PDF file from Google Drive.
   */
  function handleDownload() {
    va.track("Download Document", { subject: document.subject });

    window.location.href = `https://drive.google.com/u/1/uc?id=${
      document.document_link
        // Remove “https://drive.google.com/file/d/” prefix
        .slice(32)
        // Remove “/view?usp=___” suffix
        .split(/\/view\?usp=[a-z]+/)[0]
    }&export=download`;

    setSnackbar(<Snackbar>{t("snackbar.download")}</Snackbar>);
  }

  return (
    <ChipSet style={style} className={className}>
      <AssistChip icon={<MaterialIcon icon="share" />} onClick={handleShare}>
        {t("header.action.share")}
      </AssistChip>
      <AssistChip
        icon={<MaterialIcon icon="open_in_new" />}
        onClick={handlePopOut}
      >
        {t("header.action.popOut")}
      </AssistChip>
      <AssistChip
        icon={<MaterialIcon icon="download" />}
        onClick={handleDownload}
      >
        {t("header.action.download")}
      </AssistChip>
    </ChipSet>
  );
};

export default DocumentActions;
