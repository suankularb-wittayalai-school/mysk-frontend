// Imports
import useLocale from "@/utils/helpers/useLocale";
import { Club } from "@/utils/types/club";
import { Card, CardHeader, Columns, Text } from "@suankularb-components/react";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { FC } from "react";
import getLocaleString from "@/utils/helpers/getLocaleString";

/**
 * A list of joined Clubs with links to Discord and Line.
 *
 * @param clubs An array of joined Clubs.
 *
 * @returns A `<section>`.
 */
const PendingClubSection: FC<{ pendingClubs: Club[] }> = ({ pendingClubs }) => {
  const { t } = useTranslation("index", { keyPrefix: "joinedClubs" });
  const { t: tx } = useTranslation("common");
  const locale = useLocale();

  return (
    <section
      aria-labelledby="header-joined-clubs"
      className="flex flex-col gap-4"
    >
      <Text type="headline-large" element="h2">
        Pending Clubs (Placeholder)
      </Text>
      <Columns
        columns={2}
        element="li"
        className="sm:!grid-cols-1 md:!grid-cols-2"
      >
        {pendingClubs.map((club) => (
          <Card
            key={club.id}
            appearance="outlined"
            direction="row"
            className="min-h-[5rem] items-center"
            style={{
              backgroundImage:
                // Left 30%, middle 0%, background color
                `linear-gradient(
                      to right,
                      ${club.background_color}80,
                      ${club.background_color}00 40%
                    )`.replace(/\s+/g, " "),
            }}
          >
            <CardHeader
              avatar={
                club.logo_url ? (
                  <Image src={club.logo_url} alt="" width={40} height={40} />
                ) : undefined
              }
              title={tx("club", {
                name: getLocaleString(club.name, locale),
                ns: "common",
              })}
              className="grow"
            />
          </Card>
        ))}
      </Columns>
    </section>
  );
};

export default PendingClubSection;
