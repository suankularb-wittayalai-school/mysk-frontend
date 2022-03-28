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
  Header,
  KeyboardInput,
  MaterialIcon,
  RegularLayout,
  Search,
  Section,
  Table,
  Title,
} from "@suankularb-components/react";

// Components
import Schedule from "@components/Schedule";
import DiscardDraft from "@components/dialogs/DiscardDraft";
import BrandIcon from "@components/icons/BrandIcon";

// Types
import { DialogProps } from "@utils/types/common";
import {
  Schedule as ScheduleType,
  SchedulePeriod as SchedulePeriodType,
} from "@utils/types/schedule";

// Backend
import { addPeriodtoSchedule } from "@utils/backend/schedule";
import { SubjectListItem } from "@utils/types/subject";
import { nameJoiner } from "@utils/helpers/name";

interface AddPeriodProps extends DialogProps {
  onSubmit: (formData: FormData) => void;
}

const AddPeriod = ({
  show,
  onClose,
  onSubmit,
}: AddPeriodProps): JSX.Element => {
  const { t } = useTranslation(["schedule", "common"]);
  const locale = useRouter().locale == "en-US" ? "en-US" : "th";
  const [showDiscard, setShowDiscard] = useState<boolean>(false);

  // Form control
  const [form, setForm] = useState({
    subject: 1,
    day: "1",
    periodStart: "",
    duration: "1",
  });

  function validateAndSend() {
    const periodStart = parseInt(form.periodStart);
    const duration = parseInt(form.duration);
    let formData = new FormData();

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
    onSubmit(formData);
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
            defaultValue="1"
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
            defaultValue="1"
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

const SubjectListSection = ({
  subjectList,
}: {
  subjectList: Array<SubjectListItem>;
}): JSX.Element => {
  const { t } = useTranslation("schedule");
  const locale = useRouter().locale == "en-US" ? "en-US" : "th";

  return (
    <Section>
      <div className="layout-grid-cols-3--header">
        <div className="[grid-area:header]">
          <Header
            text={t("subjectList.title")}
            icon={<MaterialIcon icon="collections_bookmark" allowCustomSize />}
          />
        </div>
        <Search
          placeholder={t("subjectList.search")}
          className="[grid-area:search]"
        />
      </div>
      <div>
        <Table>
          <thead>
            <tr>
              <th>{t("subjectList.table.code")}</th>
              <th>{t("subjectList.table.name")}</th>
              <th>{t("subjectList.table.teachers")}</th>
              <th>{t("subjectList.table.ggcCode")}</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {subjectList.map((subjectListItem) => (
              <tr key={subjectListItem.id}>
                <td>{subjectListItem.subject.code[locale]}</td>
                <td className="w-2/5 !text-left">
                  {subjectListItem.subject.name[locale].name}
                </td>
                <td className="!text-left">
                  {subjectListItem.teachers.length > 0 &&
                    nameJoiner(locale, subjectListItem.teachers[0].name)}
                </td>
                <td>{subjectListItem.ggcCode}</td>
                <td>
                  <div className="flex flex-row justify-center gap-2">
                    {subjectListItem.ggcLink && (
                      <a
                        href={subjectListItem.ggcLink}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Button
                          label={t("subjectList.table.action.copyCode")}
                          type="text"
                          iconOnly
                          icon={<BrandIcon icon="gg-classroom" />}
                        />
                      </a>
                    )}
                    {subjectListItem.ggMeetLink && (
                      <a
                        href={subjectListItem.ggMeetLink}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Button
                          label={t("subjectList.table.action.copyCode")}
                          type="text"
                          iconOnly
                          icon={<BrandIcon icon="gg-meet" />}
                        />
                      </a>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Section>
  );
};

const Subjects: NextPage<{
  schedule: ScheduleType;
  subjectList: Array<SubjectListItem>;
}> = ({ schedule: fetchedSchedule, subjectList }) => {
  const { t } = useTranslation("schedule");
  const [schedule, setSchedule] = useState<ScheduleType>(fetchedSchedule);
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
        <SubjectListSection subjectList={subjectList} />
      </RegularLayout>
      <AddPeriod
        show={showAddPeriod}
        onClose={() => setShowAddPeriod(false)}
        onSubmit={(formData: FormData) => {
          const day = parseInt(formData.get("day")?.toString() || "-1");
          const periodStart = parseInt(
            formData.get("period-start")?.toString() || "-1"
          );
          const duration = parseInt(
            formData.get("duration")?.toString() || "-1"
          );

          setSchedule({
            content: schedule.content.map((scheduleRow) => {
              if (scheduleRow.day == day) {
                // Replace the Period with the `periodStart` in question
                return {
                  // Keep Day the same
                  ...scheduleRow,

                  content: scheduleRow.content
                    // Remove the old Periods that overlap this new Period
                    .filter(
                      (schedulePeriod) =>
                        schedulePeriod.periodStart < periodStart &&
                        schedulePeriod.periodStart >= periodStart + duration
                    )
                    // Append the new Period
                    .concat([
                      {
                        periodStart,
                        duration,
                        // TODO: Fetch this
                        subject: {
                          name: {
                            "en-US": { name: "New Period" },
                            th: { name: "คาบสอนใหม่" },
                          },
                          teachers: [],
                        },
                      },
                    ]),
                };
              } else {
                return scheduleRow;
              }
            }),
          });
        }}
      />
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
  const subjectList: Array<SubjectListItem> = [
    {
      id: 8,
      subject: {
        code: { "en-US": "MA31152", th: "ค31152" },
        name: {
          "en-US": { name: "Fundamental Mathematics 2" },
          th: { name: "คณิตศาสตร์พื้นฐาน 2 (EP)" },
        },
      },
      teachers: [
        {
          id: 9,
          role: "teacher",
          prefix: "mister",
          name: {
            "en-US": { firstName: "Kritchapon", lastName: "Boonpoonmee" },
            th: { firstName: "กฤชพล", lastName: "บุญพูลมี" },
          },
          subjectsInCharge: [
            {
              id: 8,
              code: { "en-US": "MA31152", th: "ค31152" },
              name: {
                "en-US": { name: "Fundamental Mathematics 2" },
                th: { name: "คณิตศาสตร์พื้นฐาน 2 (EP)" },
              },
              subjectSubgroup: {
                name: {
                  "en-US": "Mathematics",
                  th: "คณิตศาสตร์",
                },
                subjectGroup: {
                  name: {
                    "en-US": "Mathematics",
                    th: "คณิตศาสตร์",
                  },
                },
              },
            },
          ],
        },
      ],
      ggcCode: "y53ezt7",
      ggcLink: "https://classroom.google.com/c/NDIyMTc0ODc5NzQw",
    },
    {
      id: 17,
      subject: {
        code: { "en-US": "SCI31205", th: "ว31205" },
        name: {
          "en-US": { name: "Physics 2" },
          th: { name: "ฟิสิกส์ 2 (EP)" },
        },
      },
      teachers: [
        {
          id: 6,
          role: "teacher",
          prefix: "mister",
          name: {
            "en-US": { firstName: "Niruth", lastName: "Prombutr" },
            th: { firstName: "นิรุทธ์", lastName: "พรมบุตร" },
          },
          subjectsInCharge: [
            {
              id: 8,
              code: { "en-US": "SCI31205", th: "ว31205" },
              name: {
                "en-US": { name: "Physics 2" },
                th: { name: "ฟิสิกส์ 2 (EP)" },
              },
              subjectSubgroup: {
                name: {
                  "en-US": "Science",
                  th: "วิทยาศาสตร์",
                },
                subjectGroup: {
                  name: {
                    "en-US": "Science and Technology",
                    th: "วิทยาศาสตร์และเทคโนโลยี",
                  },
                },
              },
            },
          ],
        },
      ],
      ggcLink: "https://classroom.google.com/c/MzQ4MTUyOTI4NjE0",
      ggMeetLink: "https://meet.google.com/xoe-dkpg-gjr",
    },
  ];

  return {
    props: {
      ...(await serverSideTranslations(locale == "en-US" ? "en-US" : "th", [
        "common",
        "schedule",
      ])),
      schedule,
      subjectList,
    },
  };
};

export default Subjects;
