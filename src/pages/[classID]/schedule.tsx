// Modules
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useState } from "react";

// SK Components
import {
  Button,
  Dialog,
  DialogSection,
  Dropdown,
  KeyboardInput,
  MaterialIcon,
  RegularLayout,
  Section,
  Title,
} from "@suankularb-components/react";

// Components
import Schedule from "@components/Schedule";
import DiscardDraft from "@components/dialogs/DiscardDraft";

// Types
import { DialogProps } from "@utils/types/common";
import { Schedule as ScheduleType } from "@utils/types/schedule";

// Backend
import { addPeriodtoSchedule } from "@utils/backend/schedule";

const AddPeriod = ({ show, onClose }: DialogProps): JSX.Element => {
  const { t } = useTranslation(["schedule", "common"]);
  const locale = useRouter().locale == "en-US" ? "en-US" : "th";
  const [showDiscard, setShowDiscard] = useState<boolean>(false);

  // Form control
  const [form, setForm] = useState({
    subject: 1,
    day: "1",
    periodStart: "",
    duration: "",
  });

  function validateAndSend() {
    const periodStart = parseInt(form.periodStart);
    const duration = parseInt(form.duration);
    let formData = new FormData();
    console.log("validating");

    // Validates
    if (form.subject < 0) return false;
    if (!form.day) return false;
    if (periodStart < 0 || periodStart > 10) return false;
    if (duration < 1 || duration > 10) return false;

    // Appends to form data
    formData.append("subject", form.subject.toString());
    formData.append("day", form.day);
    formData.append("period-start", form.periodStart);
    formData.append("duration", form.duration);

    // Send
    addPeriodtoSchedule(formData);

    return true;
  }

  return (
    <>
      <Dialog
        type="large"
        label="add-period"
        title={t("dialog.add.title")}
        actions={[
          { name: t("dialog.add.action.cancel"), type: "close" },
          { name: t("dialog.add.action.save"), type: "submit" },
        ]}
        show={show}
        onClose={() => setShowDiscard(true)}
        onSubmit={() => validateAndSend() && onClose()}
      >
        <DialogSection name={t("dialog.add.form.title")} isDoubleColumn>
          <Dropdown
            name="subject"
            label={t("dialog.add.form.subject")}
            options={[
              {
                value: 1,
                label: {
                  "en-US": "English 1",
                  th: "ภาษาอังกฤษ 1",
                }[locale],
              },
            ]}
            onChange={(e: number) => setForm({ ...form, subject: e })}
          />
          <Dropdown
            name="day"
            label={t("dialog.add.form.day")}
            options={[
              {
                value: "1",
                label: t("datetime.day.1", { ns: "common" }),
              },
              {
                value: "2",
                label: t("datetime.day.2", { ns: "common" }),
              },
              {
                value: "3",
                label: t("datetime.day.3", { ns: "common" }),
              },
              {
                value: "4",
                label: t("datetime.day.4", { ns: "common" }),
              },
              {
                value: "5",
                label: t("datetime.day.5", { ns: "common" }),
              },
            ]}
            onChange={(e: string) => setForm({ ...form, day: e })}
          />
          <KeyboardInput
            name="period-start"
            type="number"
            label={t("dialog.add.form.periodStart")}
            onChange={(e: string) => setForm({ ...form, periodStart: e })}
            attr={{
              min: 1,
              max: 10,
            }}
          />
          <KeyboardInput
            name="duration"
            type="number"
            label={t("dialog.add.form.duration")}
            onChange={(e: string) => setForm({ ...form, duration: e })}
            attr={{
              min: 1,
              max: 10,
            }}
          />
        </DialogSection>
      </Dialog>
      <DiscardDraft
        show={showDiscard}
        onClose={() => setShowDiscard(false)}
        onSubmit={() => {
          setShowDiscard(false);
          onClose();
        }}
      />
    </>
  );
};

const ScheduleSection = ({
  schedule,
  setShowAddPeriod,
}: {
  schedule: ScheduleType;
  setShowAddPeriod: Function;
}): JSX.Element => {
  const { t } = useTranslation("schedule");

  return (
    <Section>
      <Schedule schedule={schedule} />
      <div className="flex flex-row items-center justify-end gap-2">
        <Button name={t("schedule.action.edit")} type="outlined" />
        <Button
          name={t("schedule.action.add")}
          type="filled"
          icon={<MaterialIcon icon="add" />}
          onClick={() => setShowAddPeriod(true)}
        />
      </div>
    </Section>
  );
};

const Subjects: NextPage<{ schedule: ScheduleType }> = ({ schedule }) => {
  const { t } = useTranslation("schedule");
  const [showAddPeriod, setShowAddPeriod] = useState<boolean>(false);

  return (
    <>
      <RegularLayout
        Title={
          <Title
            name={{ title: t("title.student") }}
            pageIcon={<MaterialIcon icon="dashboard" />}
            backGoesTo="/home"
            LinkElement={Link}
          />
        }
      >
        <ScheduleSection
          schedule={schedule}
          setShowAddPeriod={setShowAddPeriod}
        />
      </RegularLayout>
      <AddPeriod show={showAddPeriod} onClose={() => setShowAddPeriod(false)} />
    </>
  );
};

export const getStaticPaths: GetStaticPaths<{ classID: string }> = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ locale, params }) => {
  const schedule: ScheduleType = {
    content: [
      {
        day: 1,
        content: [
          { periodStart: 1, duration: 1 },
          {
            periodStart: 2,
            duration: 1,
            subject: {
              name: {
                "en-US": {
                  name: "Chemistry",
                  shortName: "Chem",
                },
                th: {
                  name: "เคมี",
                  shortName: "เคมี",
                },
              },
              teachers: [
                {
                  name: {
                    "en-US": {
                      firstName: "Thanthapatra",
                      lastName: "Bunchuay",
                    },
                    th: {
                      firstName: "ธันฐภัทร",
                      lastName: "บุญช่วย",
                    },
                  },
                },
              ],
            },
          },
        ],
      },
      {
        day: 2,
        content: [],
      },
      {
        day: 3,
        content: [],
      },
      {
        day: 4,
        content: [],
      },
      {
        day: 5,
        content: [],
      },
    ],
  };

  return {
    props: {
      ...(await serverSideTranslations(locale == "en-US" ? "en-US" : "th", [
        "common",
        "schedule",
      ])),
      schedule,
    },
  };
};

export default Subjects;
