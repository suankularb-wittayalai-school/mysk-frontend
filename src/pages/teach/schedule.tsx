// External libraries
import {
  GetServerSideProps,
  NextApiRequest,
  NextApiResponse,
  NextPage,
} from "next";
import Head from "next/head";
import Link from "next/link";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { useEffect, useState } from "react";

import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

// SK Components
import {
  Actions,
  Button,
  MaterialIcon,
  RegularLayout,
  Section,
  Title,
} from "@suankularb-components/react";

// Components
import ConfirmDelete from "@components/dialogs/ConfirmDelete";
import EditPeriodDialog from "@components/dialogs/EditPeriod";
import Schedule from "@components/schedule/Schedule";

// Backend
import { getUserMetadata } from "@utils/backend/account";
import {
  deleteScheduleItem,
  getSchedule,
} from "@utils/backend/schedule/schedule";

// Helpers
import { createTitleStr } from "@utils/helpers/title";

// Hooks
import { useToggle } from "@utils/hooks/toggle";

// Types
import { LangCode } from "@utils/types/common";
import {
  Schedule as ScheduleType,
  PeriodContentItemOptSubj,
} from "@utils/types/schedule";

const TeacherSchedule: NextPage<{
  teacherID: number;
  schedule: ScheduleType;
}> = ({ teacherID, schedule: defaultSchedule }) => {
  const { t } = useTranslation("schedule");
  const supabase = useSupabaseClient();

  // Data fetch
  const [schedule, setSchedule] = useState<ScheduleType>(defaultSchedule);
  const [fetched, toggleFetched] = useToggle(true);

  useEffect(() => {
    const fetchAndSetSchedule = async () => {
      if (!fetched) {
        const { data, error } = await getSchedule(
          supabase,
          "teacher",
          teacherID
        );
        if (error) toggleFetched();
        setSchedule(data);
        toggleFetched();
      }
    };
    fetchAndSetSchedule();
  }, [fetched]);

  // Dialog control
  const [addSubjectToPeriod, setAddSubjectToPeriod] = useState<{
    show: boolean;
    day: Day;
    startTime: number;
  }>({ show: false, day: 1, startTime: 1 });

  const [addPeriod, toggleAddPeriod] = useToggle();

  const [editPeriod, setEditPeriod] = useState<{
    show: boolean;
    day: Day;
    schedulePeriod: PeriodContentItemOptSubj;
  }>({ show: false, day: 1, schedulePeriod: { startTime: 1, duration: 1 } });

  const [deletePeriod, setDeletePeriod] = useState<{
    show: boolean;
    periodID: number;
  }>({ show: false, periodID: 0 });

  // Component display
  return (
    <>
      <Head>
        <title>{createTitleStr(t("title.teacher"), t)}</title>
      </Head>

      {/* Component */}
      <RegularLayout
        Title={
          <Title
            name={{ title: t("title.teacher") }}
            pageIcon={<MaterialIcon icon="dashboard" />}
            backGoesTo="/teach"
            LinkElement={Link}
          />
        }
      >
        <Section className="!max-w-[81.5rem]">
          <Schedule
            schedule={schedule}
            role="teacher"
            allowEdit
            setAddPeriod={setAddSubjectToPeriod}
            setEditPeriod={setEditPeriod}
            setDeletePeriod={setDeletePeriod}
            toggleFetched={toggleFetched}
          />
          <Actions className="w-full max-w-[70.5rem]">
            <Button
              name={t("schedule.action.sync")}
              type="outlined"
              icon={<MaterialIcon icon="sync" />}
              iconOnly
              disabled={!fetched}
              onClick={toggleFetched}
            />
            <Button
              label={t("schedule.action.add")}
              type="filled"
              icon={<MaterialIcon icon="add" />}
              onClick={toggleAddPeriod}
            />
          </Actions>
        </Section>
      </RegularLayout>

      {/* Dialogs */}

      {/* Add from Schedule */}
      <EditPeriodDialog
        show={addSubjectToPeriod.show}
        onClose={() =>
          setAddSubjectToPeriod({ ...addSubjectToPeriod, show: false })
        }
        onSubmit={() => {
          setAddSubjectToPeriod({ ...addSubjectToPeriod, show: false });
          toggleFetched();
        }}
        day={addSubjectToPeriod.day}
        schedulePeriod={{
          startTime: addSubjectToPeriod.startTime,
          duration: 1,
        }}
        mode="add"
      />

      {/* Add from Button */}
      <EditPeriodDialog
        show={addPeriod}
        onClose={() => toggleAddPeriod()}
        onSubmit={() => {
          toggleAddPeriod();
          toggleFetched();
        }}
        mode="add"
        canEditStartTime
      />

      {/* Edit Period */}
      <EditPeriodDialog
        show={editPeriod.show}
        onClose={() => setEditPeriod({ ...editPeriod, show: false })}
        onSubmit={() => {
          setEditPeriod({ ...editPeriod, show: false });
          toggleFetched();
        }}
        day={editPeriod.day}
        schedulePeriod={editPeriod.schedulePeriod}
        mode="edit"
        canEditStartTime
      />

      {/* Confirm delete */}
      <ConfirmDelete
        show={deletePeriod.show}
        onClose={() => setDeletePeriod({ ...deletePeriod, show: false })}
        onSubmit={async () => {
          setDeletePeriod({ ...deletePeriod, show: false });
          await deleteScheduleItem(supabase, deletePeriod.periodID);
          toggleFetched();
        }}
      />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  req,
  res,
}) => {
  const supabase = createServerSupabaseClient({
    req: req as NextApiRequest,
    res: res as NextApiResponse,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const { data: metadata } = await getUserMetadata(supabase, session!.user.id);
  const teacherID = metadata!.teacher!;

  const { data: schedule } = await getSchedule(supabase, "teacher", teacherID);

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "schedule",
      ])),
      teacherID,
      schedule,
    },
  };
};

export default TeacherSchedule;
