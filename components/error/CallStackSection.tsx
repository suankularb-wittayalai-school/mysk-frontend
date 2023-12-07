// External libraries
import { Text } from "@suankularb-components/react";
import { useTranslation } from "next-i18next";
import { FC } from "react";

const CallStackSection: FC<{ error: Error }> = ({ error }) => {
  const { t } = useTranslation("common", { keyPrefix: "error.client" });

  return (
    <section
      aria-labelledby="header-call-stack"
      className="flex flex-col gap-1"
    >
      <Text
        type="title-medium"
        element={(props) => <h2 id="header-call-stack" {...props} />}
      >
        {t("callStack")}
      </Text>
      <Text
        type="body-small"
        element="pre"
        className="overflow-x-auto pb-2 !font-mono"
      >
        {error.stack || error.message}
      </Text>
    </section>
  );
};

export default CallStackSection;
