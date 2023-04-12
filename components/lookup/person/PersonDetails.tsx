// External libraries
import { useTranslation } from "next-i18next";
import Head from "next/head";
import { ComponentProps, FC } from "react";

// SK Components
import { Card, Progress } from "@suankularb-components/react";

// Internal components
import PersonDetailsContent from "@/components/lookup/person/PersonDetailsContent";
import PersonHeader from "@/components/lookup/person/PersonHeader";

// Helpers
import { nameJoiner } from "@/utils/helpers/name";
import { createTitleStr } from "@/utils/helpers/title";

// Hooks
import { useLocale } from "@/utils/hooks/i18n";

const PersonDetails: FC<
  ComponentProps<typeof PersonHeader> & { loading?: boolean }
> = ({ person, suggestionsType, loading }) => {
  const locale = useLocale();
  const { t } = useTranslation(["lookup", "common"]);

  return (
    <>
      <Head>
        {person && (
          <title>{createTitleStr(nameJoiner(locale, person.name), t)}</title>
        )}
      </Head>
      <main aria-labelledby="header-person-details">
        <Card appearance="outlined" className="relative h-full overflow-auto">
          <PersonHeader {...{ person, suggestionsType }} />
          <Progress
            appearance="linear"
            alt="Loading person details…"
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
