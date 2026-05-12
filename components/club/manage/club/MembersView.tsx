// Imports
import EmptyState from "@/components/club/EmptyState";
import JoinRequestCard from "@/components/club/manage/club/JoinRequestCard";
import MemberCard from "@/components/club/manage/club/MemberCard";
import SnackbarContext from "@/contexts/SnackbarContext";
import cn from "@/utils/helpers/cn";
import useRefreshProps from "@/utils/helpers/useRefreshProps";
import { Club, ClubJoinRequest } from "@/utils/types/club";
import {
  Actions,
  Button,
  Card,
  CardContent,
  CardHeader,
  Columns,
  MaterialIcon,
  Snackbar,
  transition,
  useAnimationConfig,
  Text,
} from "@suankularb-components/react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { FC, useContext, useEffect, useState } from "react";

/**
 * A view of Manage Club to view existing and approve new Members into a Club.
 *
 * @returns A Fragment.
 */
const MembersView: FC<{
  club: Club;
  requests: ClubJoinRequest[];
}> = ({ club, requests }) => {
  const { t } = useTranslation("club/manage");
  const { t: tx } = useTranslation("common");
  const refreshProps = useRefreshProps();

  const { setSnackbar } = useContext(SnackbarContext);
  const { duration, easing } = useAnimationConfig();

  // Update the relative time formatting every second
  const [now, setNow] = useState<Date>();
  let updateInterval: NodeJS.Timeout;
  useEffect(() => {
    updateInterval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(updateInterval);
  }, []);

  return (
    <LayoutGroup>
      <section
        aria-labelledby="header-awaiting"
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col-reverse gap-6 sm:flex-row sm:items-end">
          <div id="header-awaiting">
            <Text type="headline-medium" className="grow" element="h2">
              {t("members.awaiting.title")}
            </Text>
          </div>
          <Button
            appearance="filled"
            icon={<MaterialIcon icon="refresh" />}
            onClick={async () => {
              await refreshProps();
              setSnackbar(<Snackbar>{tx("snackbar.refreshed")}</Snackbar>);
            }}
          >
            {t("members.awaiting.action.refresh")}
          </Button>
        </div>
        <Text type="body-medium" element="p">
          {t("members.awaiting.desc")}
        </Text>

        {/* TODO: Translation, don't get this pass PR check :skull: */}
        <Columns columns={3} element="ul">
          <Card
            appearance="filled"
            className={cn(
              `h-full w-full !bg-primary-container !text-on-primary-container`,
            )}
          >
            <CardHeader
              title={t("members.manualCard.title")}
              subtitle={t("members.manualCard.desc")}
            />
            <CardContent>
              <Actions align="full" className="!-mt-0">
                <Link href={`/join/club/${club.id}/manual`}>
                  <Button appearance="filled">
                    {t("members.manualCard.button")}
                  </Button>
                </Link>
              </Actions>
            </CardContent>
          </Card>
          {requests?.length ? (
            <AnimatePresence initial={false}>
              {requests.map((request) => (
                <JoinRequestCard
                  key={request.id}
                  request={request}
                  timerReady={now !== undefined}
                />
              ))}
            </AnimatePresence>
          ) : (
            <>
              <EmptyState className="h-full min-h-[8.75rem] md:col-span-2">
                {t("members.awaiting.empty")}
              </EmptyState>
            </>
          )}
        </Columns>
      </section>

      {/* Approved Members Section */}
      <section
        aria-labelledby="header-approved"
        className="flex flex-col gap-4"
      >
        <motion.div
          id="header-approved"
          layout
          transition={transition(duration.medium2, easing.standard)}
        >
          <Text type="headline-medium" element="h2">
            {t("members.approved.title")}
          </Text>
        </motion.div>
        {club.members.length ? (
          <Columns columns={3} element="ul">
            <LayoutGroup>
              <AnimatePresence initial={false}>
                {club.members.map((member) => (
                  <MemberCard key={member.id} member={member} />
                ))}
              </AnimatePresence>
            </LayoutGroup>
          </Columns>
        ) : (
          <EmptyState className="h-[8.75rem]">
            {t("members.approved.empty")}
          </EmptyState>
        )}
      </section>
    </LayoutGroup>
  );
};

export default MembersView;
