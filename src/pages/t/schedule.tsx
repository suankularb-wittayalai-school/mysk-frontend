// Modules
import { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { useState } from "react";

// SK Components
import {
  Button,
  MaterialIcon,
  RegularLayout,
  Section,
  Title,
} from "@suankularb-components/react";

// Components
import EditPeriod from "@components/dialogs/EditPeriod";
import Schedule from "@components/schedule/Schedule";

// Types
import {
  Schedule as ScheduleType,
  SchedulePeriod,
} from "@utils/types/schedule";

const TeacherSchedule: NextPage<{ schedule: ScheduleType }> = ({
  schedule: fetchedSchedule,
}) => {
  const { t } = useTranslation("schedule");
  const router = useRouter();
  const [schedule, setSchedule] = useState<ScheduleType>(fetchedSchedule);

  // Dialog control
  const [addPeriod, setAddPeriod] = useState<{
    show: boolean;
    day: Day;
    startTime: number;
  }>({ show: false, day: 1, startTime: 1 });
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
            setAddPeriod={setAddPeriod}
            setEditPeriod={setEditPeriod}
          />
          <div className="flex flex-row items-center justify-end gap-2">
            <Button
              label={t("schedule.action.add")}
              type="filled"
              icon={<MaterialIcon icon="add" />}
              onClick={() => setAddPeriod({ show: true, day: 1, startTime: 1 })}
            />
          </div>
        </Section>
      </RegularLayout>
      <EditPeriod
        show={addPeriod.show}
        onClose={() => setAddPeriod({ ...addPeriod, show: false })}
        onSubmit={() => {
          // TODO: Send and refresh
          router.push(router.asPath);
        }}
        day={addPeriod.day}
        schedulePeriod={{ startTime: addPeriod.startTime, duration: 1 }}
        mode="add"
      />
      <EditPeriod
        show={editPeriod.show}
        onClose={() => setEditPeriod({ ...editPeriod, show: false })}
        onSubmit={() => {
          // TODO: Send and refresh
          router.push(router.asPath);
        }}
        day={editPeriod.day}
        schedulePeriod={editPeriod.schedulePeriod}
        mode="edit"
      />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  params,
}) => {
  const schedule: ScheduleType = {
    id: 0,
    content: [
      {
        day: 1,
        content: [
          {
            startTime: 1,
            duration: 1,
            subject: {
              id: 16,
              name: { th: { name: "การอ่าน-การเขียน 3 (EP)" } },
              teachers: [],
            },
            class: { id: 45, number: 206 },
          },
          {
            startTime: 2,
            duration: 1,
            subject: {
              id: 1,
              name: { th: { name: "ภาษาอังกฤษ 3" } },
              teachers: [],
            },
            class: { id: 61, number: 506 },
          },
          { startTime: 3, duration: 1 },
          { startTime: 4, duration: 1 },
          { startTime: 5, duration: 1 },
          {
            startTime: 6,
            duration: 1,
            subject: {
              id: 1,
              name: { th: { name: "ภาษาอังกฤษ 3" } },
              teachers: [],
            },
            class: { id: 59, number: 502 },
          },
          { startTime: 7, duration: 1 },
          { startTime: 8, duration: 1 },
          { startTime: 9, duration: 1 },
          { startTime: 10, duration: 1 },
        ],
      },
      {
        day: 2,
        content: [
          { startTime: 1, duration: 1 },
          {
            startTime: 2,
            duration: 2,
            subject: {
              id: 5,
              name: { th: { name: "การศึกษาค้นคว้าและสร้างองค์ความรู้" } },
              teachers: [],
            },
            class: { id: 6, number: 106 },
          },
          { startTime: 4, duration: 1 },
          { startTime: 5, duration: 1 },
          { startTime: 6, duration: 1 },
          { startTime: 7, duration: 1 },
          { startTime: 8, duration: 1 },
          { startTime: 9, duration: 1 },
          { startTime: 10, duration: 1 },
        ],
      },
      {
        day: 3,
        content: [
          { startTime: 1, duration: 1 },
          { startTime: 2, duration: 1 },
          { startTime: 3, duration: 1 },
          { startTime: 4, duration: 1 },
          { startTime: 5, duration: 1 },
          { startTime: 6, duration: 1 },
          { startTime: 7, duration: 1 },
          { startTime: 8, duration: 1 },
          { startTime: 9, duration: 1 },
          { startTime: 10, duration: 1 },
        ],
      },
      {
        day: 4,
        content: [
          { startTime: 1, duration: 1 },
          { startTime: 2, duration: 1 },
          { startTime: 3, duration: 1 },
          { startTime: 4, duration: 1 },
          { startTime: 5, duration: 1 },
          { startTime: 6, duration: 1 },
          { startTime: 7, duration: 1 },
          { startTime: 8, duration: 1 },
          { startTime: 9, duration: 1 },
          { startTime: 10, duration: 1 },
        ],
      },
      {
        day: 5,
        content: [
          { startTime: 1, duration: 1 },
          { startTime: 2, duration: 1 },
          { startTime: 3, duration: 1 },
          { startTime: 4, duration: 1 },
          { startTime: 5, duration: 1 },
          { startTime: 6, duration: 1 },
          { startTime: 7, duration: 1 },
          { startTime: 8, duration: 1 },
          { startTime: 9, duration: 1 },
          { startTime: 10, duration: 1 },
        ],
      },
    ],
  };

  return {
    props: {
      ...(await serverSideTranslations(locale as string, [
        "common",
        "schedule",
      ])),
      schedule,
    },
  };
};

export default TeacherSchedule;
