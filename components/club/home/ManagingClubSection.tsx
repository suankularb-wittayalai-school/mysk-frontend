// Imports
import useLocale from "@/utils/helpers/useLocale";
import { Club } from "@/utils/types/club";
import { Card, CardHeader, Columns, Text } from "@suankularb-components/react";
import useTranslation from "next-translate/useTranslation";
import Image from "next/image";
import { FC } from "react";
import getLocaleString from "@/utils/helpers/getLocaleString";
import { useRouter } from "next/router";

/**
 * A list of joined Clubs with links to Discord and Line.
 *
 * @param managingClubs An array of Clubs to manage.
 *
 * @returns A `<section>`.
 */
const ManagingClubSection: FC<{ managingClubs: Club[] }> = ({
  managingClubs,
}) => {
  const { t } = useTranslation("club");
  const locale = useLocale();
  const router = useRouter();

  return (
    <section
      aria-labelledby="header-joined-clubs"
      className="flex flex-col gap-4"
    >
      <Text type="headline-large" element="h2">
        {t("manageClubs.title")}
      </Text>
      <Columns
        columns={2}
        element="li"
        className="sm:!grid-cols-1 md:!grid-cols-2"
      >
        {managingClubs.map((club) => (
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
            onClick={() => router.push(`/club/manage/${club.id}`)}
          >
            <CardHeader
              avatar={
                club.logo_url ? (
                  <div className="h-10 w-10">
                    <Image src={club.logo_url} alt="" width={40} height={40} />
                  </div>
                ) : undefined
              }
              title={t("manageClubs.club", {
                name: getLocaleString(club.name, locale),
              })}
              className="grow"
            />
          </Card>
        ))}
      </Columns>
    </section>
  );
};

export default ManagingClubSection;
