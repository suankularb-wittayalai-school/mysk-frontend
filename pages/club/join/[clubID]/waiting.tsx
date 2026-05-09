// Imports
import CandlesBackground from "@/components/club/join/CandlesBackground";
import ClubJoinLayout from "@/components/club/join/ClubJoinLayout";
import SnackbarContext from "@/contexts/SnackbarContext";
import createMySKClient from "@/utils/backend/mysk/createMySKClient";
import useMySKClient from "@/utils/backend/mysk/useMySKClient";
import { logAPIError } from "@/utils/debug";
import calculateLuminance from "@/utils/helpers/club/calculateLuminance";
import { Club, ClubJoinRequest } from "@/utils/types/club";
import { CalculatedClubScheme } from "@/utils/types/club";
import { LangCode } from "@/utils/types/common";
import {
  Actions,
  Button,
  MaterialIcon,
  Snackbar,
} from "@suankularb-components/react";
import { GetServerSideProps, NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { Balancer } from "react-wrap-balancer";

/**
 * Indicate to the user that the Club staff has recieved their request and
 * instruct the user what to do next.
 *
 * @param club The Club the user requested to join.
 * @param scheme The calculated color scheme of the page.
 *
 * @returns A Page.
 */
const WaitingClubJoinPage: NextPage<{
  club: Club;
  scheme?: CalculatedClubScheme;
}> = ({ club, scheme }) => {
  const { t } = useTranslation("join", { keyPrefix: "waiting" });
  const { t: tx } = useTranslation("common");
  const router = useRouter();

  const { setSnackbar } = useContext(SnackbarContext);

  const mysk = useMySKClient();

  const [requestID, setRequestID] = useState<ClubJoinRequest["id"]>();

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
        logAPIError("useEffect in WaitingClubJoinPage", error);
        if (error.code === 409) router.replace("/");
        else setSnackbar(<Snackbar>{tx("snackbar.failure")}</Snackbar>);
        return;
      }

      setRequestID(request.id);
    })();
  }, []);

  /**
   * Fetch a Join Request via its ID and redirect the user if the Request is
   * approved or rejected.
   *
   * @param requestID The ID of the Request.
   */
  async function checkRequestStatus(requestID: ClubJoinRequest["id"]) {
    // Fetch the Join Request
    const { data: request, error } = await mysk.fetch<ClubJoinRequest>(
      `/v1/clubs/requests/${requestID}`,
      { query: { fetch_level: "default" } },
    );
    if (error) {
      logAPIError("checkRequestStatus in WaitingClubJoinPage", error);
      setSnackbar(<Snackbar>{tx("snackbar.failure")}</Snackbar>);
      return;
    }

    // Check the Request status and redirect accordingly
    switch (request.membership_status) {
      case "approved":
        router.push(`/join/club/${club.id}/welcome`);
        break;
      case "declined":
        router.replace("/");
    }
  }

  useEffect(() => {
    if (!requestID) return;

    // We will check if the Request is approved every second to give the
    // illusion of this being real-time

    // We create an interval that runs every 1 second (1000 ms), the interval
    // is cleared after 10 seconds as to not overwhelm the server

    let requestCheckInterval = setInterval(
      () => checkRequestStatus(requestID),
      1000,
    );

    // After 10 seconds, the interval now runs every 5 seconds
    let interval10SecClearTimeout = setTimeout(() => {
      clearInterval(requestCheckInterval);
      requestCheckInterval = setInterval(
        () => checkRequestStatus(requestID),
        5000,
      );
    }, 10000);

    // After 1 minute, the interval runs every minute
    let interval1MinClearTimeout = setTimeout(() => {
      clearInterval(requestCheckInterval);
      requestCheckInterval = setInterval(
        () => checkRequestStatus(requestID),
        60000,
      );
    }, 60000);

    // Clear intervals and timeouts if the user prematurely exits the page
    return () => {
      clearInterval(requestCheckInterval);
      clearTimeout(interval10SecClearTimeout);
      clearTimeout(interval1MinClearTimeout);
    };
  }, [requestID]);

  return (
    <ClubJoinLayout club={club} pageScheme={scheme?.page} tabName={"tabName"}>
      {/* <CandlesBackground /> */}
      <div className="h-10" />
      <div className="flex flex-col items-center gap-3 text-center">
        <MaterialIcon
          icon="pending"
          size={48}
          className="animate-bounce text-primary"
        />
        <h1 className="skc-headline-medium">
          <Balancer>{t("title")}</Balancer>
        </h1>
        <p className="skc-body-medium mt-7">
          <Balancer>{t("desc")}</Balancer>
        </p>
      </div>
      <Actions align="full">
        <Button appearance="outlined" href="/" element={Link}>
          {t("action.checkLater")}
        </Button>
      </Actions>
    </ClubJoinLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  params,
  req,
}) => {
  const mysk = await createMySKClient(req);

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
    props: {
      ...(await serverSideTranslations(locale as LangCode, ["common", "join"])),
      club,
      scheme,
    },
  };
};

export default WaitingClubJoinPage;
