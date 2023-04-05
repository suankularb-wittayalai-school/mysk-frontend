// External libraries
import { useTranslation } from "next-i18next";
import { FC } from "react";

const CallStackSection: FC<{ error: Error }> = ({ error }) => {
  const { t } = useTranslation("common");

  return (
    <section
      aria-labelledby="header-call-stack"
      className="flex flex-col gap-1"
    >
      <h2 id="header-call-stack" className="skc-title-medium">
        {t("error.client.callStack")}
      </h2>
      <pre className="skc-body-small overflow-x-auto pb-2 !font-mono">
        {error.stack || error.message}
      </pre>
    </section>
  );
};

export default CallStackSection;
