import SnackbarContext from "@/contexts/SnackbarContext";
import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import {
  Button,
  MaterialIcon,
  Snackbar,
  Text,
} from "@suankularb-components/react";
import { useTranslation } from "next-i18next";
import { useContext } from "react";

/**
 * A section that displays the call stack of an error.
 *
 * @param error The error to display the call stack of.
 */
const CallStackSection: StylableFC<{
  error: Error;
}> = ({ error, style, className }) => {
  const { t } = useTranslation("common", { keyPrefix: "error.client" });
  const { t: tx } = useTranslation("common");

  const { setSnackbar } = useContext(SnackbarContext);

  return (
    <section
      aria-labelledby="header-call-stack"
      style={style}
      className={cn(`space-y-1`, className)}
    >
      {/* Header */}
      <div className="flex flex-row items-end gap-2">
        <Text
          type="title-medium"
          element={(props) => <h2 id="header-call-stack" {...props} />}
          className="grow"
        >
          {t("callStack")}
        </Text>
        <Button
          appearance="outlined"
          icon={<MaterialIcon icon="content_copy" />}
          tooltip={t("action.copyToClipboard")}
          onClick={() => {
            navigator.clipboard.writeText(error.stack || error.message);
            setSnackbar(
              <Snackbar>{tx("snackbar.copiedToClipboard")}</Snackbar>,
            );
          }}
        />
      </div>

      {/* Call stack */}
      {[
        `${error.name}: ${error.message}`,
        ...(error.stack ? error.stack.split("\n") : []),
      ].map((line, idx) => (
        <Text
          type="body-small"
          key={idx}
          className="block pl-6 -indent-6 !font-mono"
        >
          {line}
        </Text>
      ))}
    </section>
  );
};

export default CallStackSection;
