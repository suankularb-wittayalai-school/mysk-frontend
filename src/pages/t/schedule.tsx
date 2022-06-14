// Modules
import { GetStaticProps, NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";

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
import AddPeriodDialog from "@components/dialogs/AddPeriod";
import EditPeriodDialog from "@components/dialogs/EditPeriod";
import Schedule from "@components/schedule/Schedule";

// Types
import {
  Schedule as ScheduleType,
  SchedulePeriod,
} from "@utils/types/schedule";
import { useTeacherAccount } from "@utils/hooks/auth";
import { getSchedule } from "@utils/backend/schedule";
import { createEmptySchedule } from "@utils/helpers/schedule";

const TeacherSchedule: NextPage = () => {
  const { t } = useTranslation("schedule");
  const router = useRouter();
  const [teacher] = useTeacherAccount();

  // Data fetch
  const [schedule, setSchedule] = useState<ScheduleType>(
    createEmptySchedule(1, 5)
  );

  useEffect(() => {
    const fetchAndSetSchedule = async () =>
      teacher && setSchedule(await getSchedule("teacher", teacher.id));
    fetchAndSetSchedule();
  }, [teacher]);

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

  return (
    <>
      <RegularLayout
        Title={
          <Title
            name={{ title: t("title.student") }}
            pageIcon={<MaterialIcon icon="dashboard" />}
            backGoesTo="/t/home"
            LinkElement={Link}
          />
        }
      >
        <Section>
          <Schedule
            schedule={schedule}
            role="teacher"
            setAddPeriod={setAddSubjectToPeriod}
            setEditPeriod={setEditPeriod}
          />
          <div className="flex flex-row items-center justify-end gap-2">
            <Button
              label={t("schedule.action.add")}
              type="filled"
              icon={<MaterialIcon icon="add" />}
              onClick={() => toggleAddPeriod()}
            />
          </div>
        </Section>
      </RegularLayout>
      <AddPeriodDialog
        show={addSubjectToPeriod.show}
        onClose={() =>
          setAddSubjectToPeriod({ ...addSubjectToPeriod, show: false })
        }
        onSubmit={() => router.push(router.asPath)}
        day={addSubjectToPeriod.day}
        schedulePeriod={{
          startTime: addSubjectToPeriod.startTime,
          duration: 1,
        }}
      />
      <EditPeriodDialog
        show={addPeriod}
        onClose={() => toggleAddPeriod()}
        onSubmit={() => router.push(router.asPath)}
        day={1}
        schedulePeriod={{
          startTime: 1,
          duration: 1,
        }}
        mode="add"
      />
      <EditPeriodDialog
        show={editPeriod.show}
        onClose={() => setEditPeriod({ ...editPeriod, show: false })}
        onSubmit={() => router.push(router.asPath)}
        day={editPeriod.day}
        schedulePeriod={editPeriod.schedulePeriod}
        mode="edit"
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
