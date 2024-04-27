import cn from "@/utils/helpers/cn";
import useLocale from "@/utils/helpers/useLocale";
import { StylableFC } from "@/utils/types/common";
import {
  Button,
  FullscreenDialog,
  MaterialIcon,
  Progress,
  useBreakpoint,
} from "@suankularb-components/react";
import { useTranslation } from "next-i18next";
import { forwardRef, useEffect, useRef, useState } from "react";

/**
 * The default size of the PDF viewer.
 */
const DEFAULT_VIEWER_SIZE = { width: 800, height: 600 };

/**
 * A Full-screen Dialog that displays a PDF file.
 *
 * @param open If the Full-screen Dialog is open and shown.
 * @param title The title of the PDF file, shown in the Top App Bar.
 * @param url The source URL of the PDF file.
 * @param onClose Triggers when the Full-screen Dialog is closed.
 */
const PDFViewerDialog: StylableFC<{
  open?: boolean;
  title: string | JSX.Element;
  url: string;
  onClose: () => void;
}> = ({ open, title, url, onClose, style, className }) => {
  const locale = useLocale();
  const { t } = useTranslation("common", { keyPrefix: "dialog.pdf" });

  // As fallback for browsers that do not support PDF embedding, we use Google
  // Drive’s PDF viewer. This is much slower than the native PDF viewer, but it
  // works.
  const driveViewerURL = `https://drive.google.com/viewerng/viewer?embedded=true&url=${url}`;

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    // Safari on macOS does not call `onLoad` for PDF objects, so we need don't
    // show the loading spinner for Safari. Thanks, Tim Apple.
    // (Safari on other platforms straight up don’t support PDF embedding.)
    // See: https://stackoverflow.com/a/42189492
    if (!("safari" in window)) setLoading(true);
  }, [url]);

  const dialogRef = useRef<HTMLDivElement>(null);
  const { atBreakpoint } = useBreakpoint();
  const [{ width, height }, setSize] = useState(DEFAULT_VIEWER_SIZE);

  /**
   * Updates the size of the PDF viewer to fit the dialog.
   */
  function updateSize() {
    // This function is only called when `dialogRef.current` is not null.
    const dialog = dialogRef.current!;
    if (atBreakpoint === "base")
      setSize({
        width: dialog.clientWidth,
        height: dialog.clientHeight - 64, // Remove Top App Bar height.
      });
    else setSize(DEFAULT_VIEWER_SIZE);
  }
  useEffect(() => {
    if (!dialogRef.current) return;
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [dialogRef.current]);

  return (
    <FullscreenDialog
      open={open}
      title={title}
      action={
        <Button
          appearance="text"
          icon={<MaterialIcon icon="download" />}
          tooltip={t("action.download")}
          href={url}
          // eslint-disable-next-line react/display-name
          element={forwardRef((props, ref) => (
            <a {...props} ref={ref} target="_blank" />
          ))}
        />
      }
      width={DEFAULT_VIEWER_SIZE.width}
      locale={locale}
      onClose={onClose}
      style={style}
      className={cn(
        String.raw`*:overflow-hidden
        [&>.skc-fullscreen-dialog\_\_content]:relative`,
        className,
      )}
    >
      <div
        ref={dialogRef}
        className={cn(
          `pointer-events-none absolute inset-0 !mx-0 grid h-dvh
          place-content-center transition-colors sm:h-auto`,
          // Hide the viewer while loading.
          loading
            ? `bg-surface sm:bg-surface-container-high`
            : `bg-transparent`,
        )}
      >
        <Progress appearance="circular" alt={t("loading")} visible={loading} />
      </div>

      <object
        data={url}
        width={width}
        height={height}
        onLoad={() => setLoading(false)}
        className="!mx-0 -mb-24 -mt-4 sm:!-m-6"
      >
        <object
          data={driveViewerURL}
          width={width}
          height={height}
          onLoad={() => setLoading(false)}
        />
      </object>
    </FullscreenDialog>
  );
};

export default PDFViewerDialog;
