// Imports
import PersonDetailsContent from "@/components/lookup/person/PersonDetailsContent";
import PersonHeader from "@/components/lookup/person/PersonHeader";
import getLocaleName from "@/utils/helpers/getLocaleName";
import useLocale from "@/utils/helpers/useLocale";
import { Card, Progress } from "@suankularb-components/react";
import { useTranslation } from "next-i18next";
import Head from "next/head";
import { ComponentProps, FC } from "react";

const PersonDetails: FC<
  ComponentProps<typeof PersonHeader> & { loading?: boolean }
> = ({ person, suggestionsType, loading }) => {
  const locale = useLocale();
  const { t } = useTranslation("lookup");
  const { t: tx } = useTranslation("common");

  return (
    <>
      <Head>
        {person && (
          <title>
            {tx("tabName", { tabName: getLocaleName(locale, person) })}
          </title>
        )}
      </Head>
      <main
        aria-live="polite"
        aria-busy={loading}
        aria-labelledby="header-person-details"
      >
        <Card appearance="outlined" className="relative h-full overflow-auto">
          <PersonHeader {...{ person, suggestionsType }} />
          <Progress
            appearance="linear"
            alt={t("people.detail.loading")}
            visible={loading}
            className="sticky -mb-1"
          />
          {person && <PersonDetailsContent {...{ person }} />}
        </Card>
      </main>
    </>
  );
};

export default PersonDetails;
