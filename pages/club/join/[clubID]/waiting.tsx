// Imports
// import CandlesBackground from "@/components/club/join/CandlesBackground";
import ClubJoinLayout from "@/components/club/join/ClubJoinLayout";
import createMySKClient from "@/utils/backend/mysk/createMySKClient";
import useMySKClient from "@/utils/backend/mysk/useMySKClient";
import logError from "@/utils/helpers/logError";
import calculateLuminance from "@/utils/helpers/club/calculateLuminance";
import { Club, ClubJoinRequest } from "@/utils/types/club";
import { CalculatedClubScheme } from "@/utils/types/club";
import {
  Actions,
  Button,
  MaterialIcon,
  Text,
} from "@suankularb-components/react";
import { GetStaticPaths, GetStaticProps } from "next";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { CustomPage } from "@/utils/types/common";

/**
 * Indicate to the user that the Club staff has recieved their request and
 * instruct the user what to do next.
 *
 * @param club The Club the user requested to join.
 * @param scheme The calculated color scheme of the page.
 *
 * @returns A Page.
 */
const WaitingClubJoinPage: CustomPage<{
  club: Club;
  scheme?: CalculatedClubScheme;
}> = ({ club, scheme }) => {
  const { t } = useTranslation("club/join");
  const router = useRouter();

  const [joinErrorStatus, setjoinErrorStatus] = useState(false);

  const mysk = useMySKClient();

  // Create a Join Request
  useEffect(() => {
    (async () => {
      const { data: request, error } = await mysk.fetch<ClubJoinRequest>(
        `/v1/clubs/${club.id}/join`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fetch_level: "id_only" }),
        },
      );

      if (error) {
        logError("useEffect in WaitingClubJoinPage", error);
        if (error.code === 409) router.replace("/");
        else {
          setjoinErrorStatus(true);
        }
        return;
      }

      if (!error) router.push(`/club/join/${club.id}/welcome`);
    })();
  }, []);

  return (
    <ClubJoinLayout
      club={club}
      pageScheme={scheme?.page}
      tabName={t(`waiting.${joinErrorStatus ? "error" : "success"}.tabName`)}
    >
      <div className="flex grow flex-col items-center justify-center gap-3 text-center">
        <MaterialIcon
          icon={joinErrorStatus ? "warning_amber" : "pending"}
          size={48}
          className="animate-bounce text-primary"
        />
        <Text
          type="headline-medium"
          element="h1"
          className="text-center text-on-background"
        >
          {t(`waiting.${joinErrorStatus ? "error" : "success"}.title`)}
        </Text>
        <Text
          type="body-medium"
          element="p"
          className="mt-7 text-center text-on-background"
        >
          {t(`waiting.${joinErrorStatus ? "error" : "success"}.desc`)}
        </Text>
      </div>
      {joinErrorStatus && (
        <Actions align="full">
          <Button appearance="outlined" href="/club" element={Link}>
            {t("waiting.action.close")}
          </Button>
        </Actions>
      )}
    </ClubJoinLayout>
  );
};

WaitingClubJoinPage.navType = "hidden";

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: "blocking",
});

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const mysk = await createMySKClient();

  // Fetch Club
  const { data: club, error } = await mysk.fetch<Club>(
    `/v1/clubs/${params?.clubID}`,
    {
      query: { fetch_level: "default" },
    },
  );
  if (error?.code === 404) return { notFound: true };

  let scheme: CalculatedClubScheme | null = null;
  if (club?.background_color && club?.accent_color)
    scheme = {
      page: calculateLuminance(club.background_color) > 128 ? "light" : "dark",
      button: calculateLuminance(club.accent_color) > 128 ? "dark" : "light",
    };

  return {
    revalidate: 300,
    props: {
      club,
      scheme,
    },
  };
};

export default WaitingClubJoinPage;
