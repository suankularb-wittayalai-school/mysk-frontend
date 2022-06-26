// Modules
import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { useEffect, useReducer, useState } from "react";

// SK Components
import {
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

// Hooks
import { useTeacherAccount } from "@utils/hooks/auth";

// Types
import {
  Schedule as ScheduleType,
  SchedulePeriod,
} from "@utils/types/schedule";

const TeacherSchedule: NextPage = () => {
  const { t } = useTranslation("schedule");
  const [teacher] = useTeacherAccount();

  // Data fetch
  const plhSchedule = {
    content: range(5).map((day) => ({ day: (day + 1) as Day, content: [] })),
  };
  const [schedule, setSchedule] = useState<ScheduleType>(plhSchedule);
  const [fetched, toggleFetched] = useReducer(
    (state: boolean) => !state,
    false
  );

  useEffect(() => {
    const fetchAndSetSchedule = async () => {
      if (!fetched && teacher) {
        setSchedule(await getSchedule("teacher", teacher.id));
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

  const [addPeriod, toggleAddPeriod] = useReducer(
    (state: boolean) => !state,
    false
  );

  const [editPeriod, setEditPeriod] = useState<{
    show: boolean;
    day: Day;
    schedulePeriod: SchedulePeriod;
  }>({ show: false, day: 1, schedulePeriod: { startTime: 1, duration: 1 } });

  const [deletePeriod, setDeletePeriod] = useState<{
    show: boolean;
    periodID: number;
  }>({ show: false, periodID: 0 });

  // Component display
  return (
    <>
      <Head>
        <title>
          {t("title.teacher")}
          {" - "}
          {t("brand.name", { ns: "common" })}
        </title>
      </Head>

      {/* Component */}
      <RegularLayout
        Title={
          <Title
            name={{ title: t("title.teacher") }}
            pageIcon={<MaterialIcon icon="dashboard" />}
            backGoesTo="/t/subjects/teaching"
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
          <div className="flex flex-row items-center justify-end gap-2">
            <Button
              name={t("schedule.action.sync")}
              type="outlined"
              icon={<MaterialIcon icon="sync" />}
              iconOnly
              disabled={!fetched}
              onClick={() => toggleFetched()}
            />
            <Button
              label={t("schedule.action.add")}
              type="filled"
              icon={<MaterialIcon icon="add" />}
              onClick={() => toggleAddPeriod()}
            />
          </div>
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
      ...(await serverSideTranslations(locale as string, [
        "common",
        "schedule",
      ])),
    },
  };
};

export default TeacherSchedule;
