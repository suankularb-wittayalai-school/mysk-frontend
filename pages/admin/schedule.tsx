import GetClassroomScheduleDialog from "@/components/admin/GetClassroomScheduleDialog";
import PageHeader from "@/components/common/PageHeader";
import Schedule from "@/components/schedule/Schedule";
import getClassSchedule from "@/utils/backend/schedule/getClassSchedule";
import cn from "@/utils/helpers/cn";
import getLocaleString from "@/utils/helpers/getLocaleString";
import useLocale from "@/utils/helpers/useLocale";
import { Classroom } from "@/utils/types/classroom";
import { CustomPage, LangCode } from "@/utils/types/common";
import { UserRole } from "@/utils/types/person";
import { Schedule as ScheduleType } from "@/utils/types/schedule";
import {
  Button,
  Card,
  ContentLayout,
  SegmentedButton,
  Switch,
  Text,
} from "@suankularb-components/react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { alphabetical, unique } from "radash";
import { useState } from "react";
import Balancer from "react-wrap-balancer";

/**
 * A crudely implemented Schedule Editor page for admins. Reuses logic meant for
 * Teachers.
 */
const ScheduleEditorPage: CustomPage = () => {
  const locale = useLocale();
  const { t } = useTranslation("admin", { keyPrefix: "schedule" });
  const { t: tx } = useTranslation("common");

  const supabase = useSupabaseClient();

  const [schedule, setSchedule] = useState<ScheduleType | null>(null);

  const [view, setView] = useState<UserRole>(UserRole.student);
  const [mergeOverlapping, setMergeOverlapping] = useState(true);

  const [getClassroomOpen, setGetClassroomOpen] = useState(false);

  /**
   * Load the Schedule for the given Classroom.
   *
   * @param mergeOverlapping Whether to merge overlapping periods.
   * @param classroom The Classroom to load the Schedule for.
   */
  async function handleLoadSchedule(
    mergeOverlapping: boolean,
    classroom: Pick<Classroom, "id"> | null = schedule?.classroom || null,
  ) {
    if (!classroom) return;
    const { data, error } = await getClassSchedule(supabase, classroom.id, {
      keepOverlapping: !mergeOverlapping,
    });
    if (error) return;
    setSchedule(data);
  }

  return (
    <>
      <Head>
        <title>{tx("tabName", { tabName: t("title") })}</title>
      </Head>
      <PageHeader parentURL="/admin">{t("title")}</PageHeader>
      <ContentLayout className="*:!gap-5">
        <div
          className={cn(`mx-4 flex flex-row justify-between gap-2 sm:mx-0
            [&_button]:!whitespace-nowrap`)}
        >
          {/* View */}
          <SegmentedButton alt={t("view.title")}>
            <Button
              appearance="outlined"
              selected={view === UserRole.student}
              onClick={() => setView(UserRole.student)}
            >
              {t("view.student")}
            </Button>
            {/* Not supported yet. */}
            <Button
              appearance="outlined"
              selected={view === UserRole.teacher}
              onClick={() => setView(UserRole.teacher)}
              disabled={true}
            >
              {t("view.teacher")}
            </Button>
          </SegmentedButton>

          {/* Load Schedule */}
          <Button appearance="filled" onClick={() => setGetClassroomOpen(true)}>
            {t("action.getClassroom")}
          </Button>
          <GetClassroomScheduleDialog
            open={getClassroomOpen}
            onClose={() => setGetClassroomOpen(false)}
            onSubmit={async (classroom) => {
              await handleLoadSchedule(mergeOverlapping, classroom);
              setGetClassroomOpen(false);
            }}
          />
        </div>

        {schedule ? (
          <Schedule
            schedule={schedule}
            subjectsInCharge={alphabetical(
              unique(
                schedule.content.flatMap((row) =>
                  row.content.flatMap((period) =>
                    period.content.map((item) => item.subject),
                  ),
                ),
                (subject) => subject.id,
              ),
              (subject) => getLocaleString(subject.code, locale),
            )}
            view={view}
            editable
            onEdit={() => handleLoadSchedule(mergeOverlapping)}
            // Make the Chip Set scrollable.
            className={cn(`[&>*:first-child>div]:-mb-[25.25rem]
              [&>*:first-child>div]:-mt-2 [&>*:first-child>div]:overflow-auto
              [&>*:first-child>div]:pb-[25.25rem] [&>*:first-child>div]:pt-2
              [&>*:first-child_.skc-chip-set]:w-fit
              [&>*:first-child_.skc-chip-set]:flex-nowrap`)}
          />
        ) : (
          <Card
            appearance="outlined"
            className="grid h-[27.75rem] place-content-center"
          >
            <Text
              type="body-medium"
              className="text-center text-on-surface-variant"
            >
              <Balancer>{t("empty")}</Balancer>
            </Text>
          </Card>
        )}

        {/* Merge overlapping
            Toggle this off if you want to edit Elective Periods. */}
        <div
          className={cn(
            `mx-auto flex w-fit flex-row items-center gap-8 rounded-full p-3
            pl-5 transition-colors`,
            mergeOverlapping ? `bg-primary-container` : `bg-surface-variant`,
          )}
        >
          <Text type="title-medium">{t("mergeOverlapping")}</Text>
          <Switch
            value={mergeOverlapping}
            onChange={(value) => {
              setMergeOverlapping(value);
              handleLoadSchedule(value);
            }}
          />
        </div>
      </ContentLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale as LangCode, ["common", "admin"])),
  },
});

export default ScheduleEditorPage;
