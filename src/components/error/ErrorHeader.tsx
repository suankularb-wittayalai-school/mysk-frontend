// External libraries
import Head from "next/head";
import { useRouter } from "next/router";

import { useTranslation } from "next-i18next";

// SK Components
import {
  Actions,
  Button,
  MaterialIcon,
  Section,
} from "@suankularb-components/react";

// Helpers
import { createTitleStr } from "@utils/helpers/title";

const ErrorHeader = ({ code, verbose }: { code?: number; verbose: string }) => {
  const { t } = useTranslation("common");
  const router = useRouter();

  return (
    <>
      <Head>
        <title>{createTitleStr([code, verbose].join(": "), t)}</title>
      </Head>
      <Section>
        {code ? (
          <h2 className="font-display text-9xl">
            <span className="font-thin">{code}: </span>
            <span className="font-bold">{verbose}</span>
          </h2>
        ) : (
          <h2 className="font-display text-9xl font-bold">{verbose}</h2>
        )}
        <Actions align="left">
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
    </>
  );
};

export default ErrorHeader;
