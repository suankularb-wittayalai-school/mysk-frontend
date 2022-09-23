// External libraries
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

// SK Components
import {
  Actions,
  Button,
  MaterialIcon,
  Section,
} from "@suankularb-components/react";

const ErrorHeader = ({
  code,
  verbose,
}: {
  code: string | number;
  verbose?: string;
}) => {
  const { t } = useTranslation("common");
  const router = useRouter();

  return (
    <Section>
      <h2 className="font-display text-9xl font-bold">{code}</h2>
      {verbose && (
        <p className="font-display text-4xl font-bold leading-none">
          {verbose}
        </p>
      )}
      <Actions align="left" className={verbose ? "mt-4" : undefined}>
        <Button
          label={t("fallback.action.back")}
          type="filled"
          icon={<MaterialIcon icon="arrow_back" />}
          onClick={() => history.back()}
        />
        <Button
          label={t("fallback.action.reload")}
          type="outlined"
          icon={<MaterialIcon icon="refresh" />}
          onClick={router.reload}
        />
      </Actions>
    </Section>
  );
};

export default ErrorHeader;
