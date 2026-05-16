// Imports
import EmptyState from "@/components/club/EmptyState";
import DiscordLogo from "@/public/images/social/discord.svg";
import LineLogo from "@/public/images/social/line.svg";
import useLocale from "@/utils/helpers/useLocale";
import { Club } from "@/utils/types/club";
import {
  Button,
  Card,
  CardHeader,
  Columns,
  Text,
} from "@suankularb-components/react";
import useTranslation from "next-translate/useTranslation";
import Image from "next/image";
import { FC, forwardRef } from "react";
import getLocaleString from "@/utils/helpers/getLocaleString";

/**
 * A list of joined Clubs with links to Discord and Line.
 *
 * @param clubs An array of joined Clubs.
 *
 * @returns A `<section>`.
 */
const JoinedClubsSection: FC<{ clubs: Club[] }> = ({ clubs }) => {
  const { t } = useTranslation("club");
  const locale = useLocale();

  return (
    <section
      aria-labelledby="header-joined-clubs"
      className="flex flex-col gap-4"
    >
      <Text type="headline-large" element="h2">
        {t("joinedClubs.title")}
      </Text>
      {clubs.length !== 0 ? (
        <Columns
          columns={2}
          element="li"
          className="sm:!grid-cols-1 md:!grid-cols-2"
        >
          {clubs.map((club) => {
            const discordURL = club.contacts.find(
              (contact) => contact.type === "discord",
            )?.value;
            const lineURL = club.contacts.find(
              (contact) => contact.type === "line",
            )?.value;

            return (
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
                      <div className="h-10 w-10">
                        <Image
                          src={club.logo_url}
                          alt=""
                          width={40}
                          height={40}
                        />
                      </div>
                    ) : undefined
                  }
                  title={t("joinedClubs.club", {
                    name: getLocaleString(club.name, locale),
                  })}
                  className="grow"
                />
                <div className="mr-3 flex flex-row">
                  <Button
                    appearance="text"
                    icon={<Image src={DiscordLogo} alt="" />}
                    disabled={!discordURL}
                    href={discordURL}
                    // eslint-disable-next-line react/display-name
                    element={forwardRef<HTMLAnchorElement>((props, ref) => (
                      <a
                        {...props}
                        ref={ref}
                        target="_blank"
                        rel="noreferrer"
                      />
                    ))}
                  />
                  <Button
                    appearance="text"
                    icon={<Image src={LineLogo} alt="" />}
                    disabled={!lineURL}
                    href={lineURL}
                    // eslint-disable-next-line react/display-name
                    element={forwardRef<HTMLAnchorElement>((props, ref) => (
                      <a
                        {...props}
                        ref={ref}
                        target="_blank"
                        rel="noreferrer"
                      />
                    ))}
                  />
                </div>
              </Card>
            );
          })}
        </Columns>
      ) : (
        <EmptyState className="h-44">{t("joinedClubs.empty")}</EmptyState>
      )}
    </section>
  );
};

export default JoinedClubsSection;
