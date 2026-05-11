// Imports
import useMySKClient from "@/utils/backend/mysk/useMySKClient";
import logError from "@/utils/helpers/logError";
import cn from "@/utils/helpers/cn";
import useLocale from "@/utils/helpers/useLocale";
import getLocaleString from "@/utils/helpers/getLocaleString";
import useRefreshProps from "@/utils/helpers/useRefreshProps";
import { ClubJoinRequest } from "@/utils/types/club";
import {
  Actions,
  Avatar,
  Button,
  Card,
  CardContent,
  CardHeader,
  MaterialIcon,
  transition,
  useAnimationConfig,
} from "@suankularb-components/react";
import { formatDistanceToNowStrict } from "date-fns";
import { th } from "date-fns/locale";
import { motion } from "framer-motion";
import { useTranslation } from "next-i18next";
import { FC } from "react";

/**
 * A Card for when a Student requests a membership at your Club. Show a live
 * relative timestamp as well as Buttons to reject or approve the membership.
 *
 * @param request A Club Join Request instance.
 * @param timerReady Whether the relative timestamp can be safely shown without messing up the hydration.
 *
 * @returns A Card.
 */
const JoinRequestCard: FC<{
  request: ClubJoinRequest;
  timerReady?: boolean;
}> = ({ request, timerReady }) => {
  const locale = useLocale();
  const { t } = useTranslation("manage", {
    keyPrefix: "club.members.awaiting",
  });
  const refreshProps = useRefreshProps();

  const { duration, easing } = useAnimationConfig();

  const mysk = useMySKClient();

  async function handleRespondToRequest(
    requestID: ClubJoinRequest["id"],
    response: Exclude<ClubJoinRequest["membership_status"], "pending">,
  ) {
    const { error } = await mysk.fetch<ClubJoinRequest>(
      `/v1/clubs/requests/${requestID}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fetch_level: "id_only",
          data: { status: response },
        }),
      },
    );
    if (error) {
      logError("handleRespondToRequest in MembersView", error);
      return;
    }
    refreshProps();
  }

  return (
    <motion.li
      initial={{ opacity: 0, scale: 0.8, y: -60 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.2, y: 0 }}
      layoutId={String(request.student.id)}
      transition={{
        ...transition(duration.medium2, easing.standard),
        delay: duration.medium2,
      }}
    >
      <Card appearance="filled">
        <CardHeader
          avatar={<Avatar />}
          title={[
            getLocaleString(request.student.first_name, locale),
            getLocaleString(request.student.last_name, locale),
          ].join(" ")}
          subtitle={
            timerReady ? (
              formatDistanceToNowStrict(
                // Technically speaking, every new row after 2024 will have the
                // created_at column generated automatically. But still, I'll
                // admit it -- my bad Model.                            - Galax
                new Date(request.created_at || "1970-01-01"),
                {
                  addSuffix: true,
                  locale: locale === "th" ? th : undefined,
                },
              )
            ) : (
              <div
                className={cn(
                  `h-[1.3125rem] w-20 animate-pulse rounded-xs bg-outline`,
                )}
              />
            )
          }
          className="[font-feature-settings:'tnum'on,'lnum'on]"
        />
        <CardContent className="!pt-1">
          <Actions align="full" className="!mt-0">
            <Button
              appearance="outlined"
              icon={<MaterialIcon icon="close" />}
              dangerous
              onClick={() => handleRespondToRequest(request.id, "declined")}
            >
              {t("action.reject")}
            </Button>
            <Button
              appearance="outlined"
              icon={<MaterialIcon icon="done" />}
              onClick={() => handleRespondToRequest(request.id, "approved")}
            >
              {t("action.approve")}
            </Button>
          </Actions>
        </CardContent>
      </Card>
    </motion.li>
  );
};

export default JoinRequestCard;
