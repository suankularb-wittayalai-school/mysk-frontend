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
import router from "next/router";
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
      {/* Members Section */}
      <section
        aria-labelledby="header-approved"
        className="flex flex-col gap-4"
      >
        <motion.div
          id="header-approved"
          layout
          transition={transition(duration.medium2, easing.standard)}
          className="flex flex-col justify-between gap-4 md:flex-row md:gap-32"
        >
          <div className="flex shrink-0 flex-col gap-6">
            <Text type="headline-medium" element="h2">
              {t("members.approved.title")}
            </Text>
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
          <Card
            appearance="filled"
            className={cn(
              `col-span-2 h-full w-full !bg-primary-container !text-on-primary-container`,
            )}
          >
            <CardHeader
              title={t("members.manualCard.title")}
              subtitle={t("members.manualCard.desc")}
            />
            <CardContent>
              <Actions align="full" className="!-mt-0">
                <Link href={`/club/join/${club.id}/manual`}>
                  <Button appearance="filled">
                    {t("members.manualCard.button")}
                  </Button>
                </Link>
              </Actions>
            </CardContent>
          </Card>
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
