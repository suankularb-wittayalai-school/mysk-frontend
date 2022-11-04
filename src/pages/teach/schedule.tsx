// External libraries
import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { useEffect, useState } from "react";

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
import {
  deleteScheduleItem,
  getSchedule,
} from "@utils/backend/schedule/schedule";

// Helpers
import { range } from "@utils/helpers/array";
import { createTitleStr } from "@utils/helpers/title";

// Hooks
import { useTeacherAccount } from "@utils/hooks/auth";
import { useToggle } from "@utils/hooks/toggle";

// Supabase
import { useSupabaseClient } from "@supabase/auth-helpers-react";

// Types
import { LangCode } from "@utils/types/common";
import {
  Schedule as ScheduleType,
  PeriodContentItemOptSubj,
} from "@utils/types/schedule";

const TeacherSchedule: NextPage = () => {
  const { t } = useTranslation("schedule");
  const supabase = useSupabaseClient();
  const [teacher] = useTeacherAccount();

  // Data fetch
  const plhSchedule = {
    content: range(5, 1).map((day) => ({ day: day as Day, content: [] })),
  };
  const [schedule, setSchedule] = useState<ScheduleType>(plhSchedule);
  const [fetched, toggleFetched] = useToggle();

  useEffect(() => {
    const fetchAndSetSchedule = async () => {
      if (!fetched && teacher) {
        const { data, error } = await getSchedule(
          supabase,
          "teacher",
          teacher.id
        );
        if (error) toggleFetched();
        setSchedule(data);
        toggleFetched();
      }
    };
    fetchAndSetSchedule();
  }, [fetched, teacher]);

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
        <Section>
          <Schedule
            schedule={schedule}
            role="teacher"
            allowEdit
            setAddPeriod={setAddSubjectToPeriod}
            setEditPeriod={setEditPeriod}
            setDeletePeriod={setDeletePeriod}
            toggleFetched={toggleFetched}
          />
          <Actions>
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
          await deleteScheduleItem(deletePeriod.periodID);
          toggleFetched();
        }}
      />
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "schedule",
      ])),
    },
  };
};

export default TeacherSchedule;
