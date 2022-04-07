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
  Card,
  CardActions,
  CardHeader,
  CardSupportingText,
  Chip,
  ChipInputList,
  ChipList,
  Dialog,
  DialogSection,
  Dropdown,
  Header,
  MaterialIcon,
  RegularLayout,
  Section,
  Table,
  TextArea,
  Title,
  XScrollContent,
} from "@suankularb-components/react";

// Components
import Sentiment from "@components/Sentiment";

// Types
import {
  PeriodLog,
  PeriodMedium,
  Subject,
  SubstituteAssignment,
} from "@utils/types/subject";
import { ClassWName } from "@utils/types/class";
import { DialogProps } from "@utils/types/common";
import ReactMarkdown from "react-markdown";

// Details Section

// Main
const DetailsSection = ({
  classesLearningThis: orignialClassesLearningThis,
  setShowAdd,
}: {
  classesLearningThis: Array<ClassWName>;
  setShowAdd: Function;
}): JSX.Element => {
  const { t } = useTranslation("subjects");
  const locale = useRouter().locale == "en-US" ? "en-US" : "th";
  const [classesLearningThis, setClassesLearningThis] = useState<
    Array<{
      id: string;
      name: string | JSX.Element;
    }>
  >(
    orignialClassesLearningThis.map((classItem) => ({
      id: classItem.id.toString(),
      name: classItem.name[locale],
    }))
  );

  return (
    <Section>
      <Header
        icon={<MaterialIcon icon="info" allowCustomSize />}
        text={t("details.title")}
      />
      <section className="flex flex-col gap-2">
        <h3 className="font-display text-xl">{t("details.classes.title")}</h3>
        <ChipInputList
          list={classesLearningThis}
          onChange={(newList) => setClassesLearningThis(newList)}
          onAdd={() => setShowAdd(true)}
        />
      </section>
    </Section>
  );
};

// Components
const AddClassDialog = ({
  show,
  onClose,
}: DialogProps & { onSubmit: Function }): JSX.Element => {
  const { t } = useTranslation("subjects");
  const locale = useRouter().locale == "en-US" ? "en-US" : "th";

  return (
    <Dialog
      type="regular"
      label="add-class"
      title={t("details.dialog.addClass.title")}
      supportingText=""
      actions={[
        { name: t("details.dialog.addClass.action.cancel"), type: "close" },
        { name: t("details.dialog.addClass.action.add"), type: "submit" },
      ]}
      show={show}
      onClose={() => onClose()}
      onSubmit={() => onClose()}
    >
      <DialogSection name="">
        <Dropdown
          name="class"
          label={t("details.dialog.addClass.class")}
          options={[
            {
              value: 509,
              label: {
                "en-US": "M.509",
                th: "ม.509",
              }[locale],
            },
          ]}
        />
      </DialogSection>
    </Dialog>
  );
};

// Period Logs Section
const PeriodLogsSection = ({
  periodLogs,
}: {
  periodLogs: Array<PeriodLog>;
}): JSX.Element => {
  const { t } = useTranslation("subjects");
  const locale = useRouter().locale == "en-US" ? "en-US" : "th";

  // Component specific utilities
  function tMedium(medium: PeriodMedium) {
    return t(
      `periodLogs.table.medium.${
        medium == "meet"
          ? "meet"
          : medium == "pre-recorded"
          ? "preRecorded"
          : medium == "material"
          ? "material"
          : medium == "assignment"
          ? "assignment"
          : medium == "on-site"
          ? "onSite"
          : undefined
      }`
    );
  }

  return (
    <Section>
      <Header
        icon={<MaterialIcon icon="assignment_turned_in" allowCustomSize />}
        text={t("periodLogs.title")}
      />
      <div>
        <Table width={820}>
          <thead>
            <tr>
              <th className="w-2/12">{t("periodLogs.table.date")}</th>
              <th className="w-4/12">{t("periodLogs.table.topic")}</th>
              <th className="w-3/12">{t("periodLogs.table.medium.title")}</th>
              <th className="w-2/12">
                {t("periodLogs.table.participationLevel")}
              </th>
              <th className="w-1/12" />
            </tr>
          </thead>
          <tbody>
            {periodLogs.map((periodLog) => (
              <tr key={periodLog.id}>
                {/* Date */}
                <td>
                  {new Date(periodLog.date).toLocaleDateString(locale, {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>

                {/* Topic */}
                <td className="!text-left">{periodLog.topic}</td>

                {/* Medium */}
                <td>
                  <div className="flex flex-row flex-wrap items-center justify-center gap-2">
                    {/* Icon */}
                    {periodLog.mediums.length > 0 &&
                      (periodLog.mediums[0] == "meet" ? (
                        <MaterialIcon
                          icon="videocam"
                          className="text-primary"
                        />
                      ) : periodLog.mediums[0] == "pre-recorded" ? (
                        <MaterialIcon
                          icon="ondemand_video"
                          className="text-primary"
                        />
                      ) : periodLog.mediums[0] == "material" ? (
                        <MaterialIcon icon="style" className="text-primary" />
                      ) : periodLog.mediums[0] == "assignment" ? (
                        <MaterialIcon
                          icon="assignment"
                          className="text-primary"
                        />
                      ) : periodLog.mediums[0] == "on-site" ? (
                        <MaterialIcon
                          icon="apartment"
                          className="text-primary"
                        />
                      ) : undefined)}

                    {/* Text */}
                    <span>
                      {periodLog.mediums.length > 0 &&
                        tMedium(periodLog.mediums[0])}{" "}
                      {periodLog.mediums.length > 1 && (
                        <abbr
                          title={periodLog.mediums
                            .slice(1)
                            .map((medium) => tMedium(medium))
                            .join(", ")}
                          className="font-light text-outline"
                        >
                          +{periodLog.mediums.length - 1}
                        </abbr>
                      )}
                    </span>
                  </div>
                </td>

                {/* Sentiment */}
                <td>
                  <Sentiment level={periodLog.participationLevel} />
                </td>

                {/* Actions */}
                <td>
                  <div className="flex flex-row justify-center gap-2">
                    <Button
                      name={t("periodLogs.table.action.seeEvidence")}
                      type="text"
                      iconOnly
                      icon={<MaterialIcon icon="photo" />}
                    />
                    <Button
                      name={t("periodLogs.table.action.seeDetails")}
                      type="text"
                      iconOnly
                      icon={<MaterialIcon icon="drafts" />}
                    />
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

// Substitute Assignments Section

// Main
const SubstituteAssignmentsSection = ({
  substAsgn,
  setShowAssgDetails,
  setShowEditAsgn,
  setActiveAsgn,
}: {
  substAsgn: Array<SubstituteAssignment>;
  setShowAssgDetails: Function;
  setShowEditAsgn: Function;
  setActiveAsgn: Function;
}): JSX.Element => {
  const { t } = useTranslation("subjects");
  const locale = useRouter().locale == "en-US" ? "en-US" : "th";

  return (
    <Section>
      <Header
        icon={<MaterialIcon icon="swap_horizontal_circle" allowCustomSize />}
        text={t("substAsgn.title")}
      />
      <p>{t("substAsgn.supportingText")}</p>
      <XScrollContent>
        {substAsgn.map((assignment) => (
          <li key={assignment.id}>
            <Card type="stacked">
              <CardHeader
                title={
                  <h3 className="text-lg font-medium">
                    {assignment.name[locale]}
                  </h3>
                }
                className="font-display"
              />
              <div className="scroll-w-0 mx-[2px] overflow-x-auto py-1 px-[calc(1rem-2px)]">
                <ChipList noWrap>
                  {assignment.classes.map((classItem) => (
                    <Chip key={classItem.id} name={classItem.name[locale]} />
                  ))}
                </ChipList>
              </div>
              <CardSupportingText>
                <p className="max-lines-2">{assignment.desc[locale]}</p>
              </CardSupportingText>
              <CardActions>
                <Button
                  type="text"
                  label={t("substAsgn.action.editAsgn")}
                  onClick={() => {
                    setShowEditAsgn(true);
                    setActiveAsgn(assignment);
                  }}
                />
                <Button
                  type="tonal"
                  label={t("substAsgn.action.seeDetails")}
                  onClick={() => {
                    setShowAssgDetails(true);
                    setActiveAsgn(assignment);
                  }}
                />
              </CardActions>
            </Card>
          </li>
        ))}
      </XScrollContent>
      <div className="flex flex-row flex-wrap items-center justify-end gap-2">
        <Button type="outlined" label={t("substAsgn.action.seeAll")} />
        <Button type="filled" label={t("substAsgn.action.addAsgn")} />
      </div>
    </Section>
  );
};

// Components
const AssignmentDetailsDialog = ({
  show,
  onClose,
  assignment,
}: DialogProps & { assignment: SubstituteAssignment }): JSX.Element => {
  const { t } = useTranslation("subjects");
  const locale = useRouter().locale == "en-US" ? "en-US" : "th";

  return (
    <Dialog
      type="large"
      label="asgn-details"
      title={assignment.name[locale]}
      actions={[{ name: "Done", type: "close" }]}
      show={show}
      onClose={() => onClose()}
    >
      <DialogSection name={t("substAsgn.dialog.asgnDetails.subject")}>
        <p>
          {assignment.subject.code[locale]}{" "}
          {assignment.subject.name[locale].name}
        </p>
      </DialogSection>
      <DialogSection name={t("substAsgn.dialog.asgnDetails.desc")}>
        <div className="markdown">
          <ReactMarkdown>{assignment.desc[locale]}</ReactMarkdown>
        </div>
      </DialogSection>
      <DialogSection name={t("substAsgn.dialog.asgnDetails.assignedClasses")}>
        <ChipList>
          {assignment.classes.map((classItem) => (
            <Chip key={classItem.id} name={classItem.name[locale]} />
          ))}
        </ChipList>
      </DialogSection>
    </Dialog>
  );
};

const EditAssignmentDialog = ({
  show,
  onClose,
  assignment,
}: DialogProps & { assignment: SubstituteAssignment }): JSX.Element => {
  const { t } = useTranslation("subjects");
  const locale = useRouter().locale == "en-US" ? "en-US" : "th";
  const [showAddClass, setShowAddClass] = useState<boolean>(false);

  return (
    <>
      <Dialog
        type="large"
        label="edit-asgn"
        title={t("substAsgn.dialog.editAsgn.title")}
        actions={[
          { name: t("substAsgn.dialog.editAsgn.action.cancel"), type: "close" },
          { name: t("substAsgn.dialog.editAsgn.action.save"), type: "submit" },
        ]}
        show={show}
        onClose={() => onClose()}
        onSubmit={() => onClose()}
      >
        <DialogSection
          name={t("substAsgn.dialog.editAsgn.subject")}
          isDoubleColumn
        >
          <Dropdown
            name="subject"
            label={t("substAsgn.dialog.editAsgn.subject")}
            options={[]}
            defaultValue={assignment.subject.id}
          />
        </DialogSection>
        <DialogSection name={t("substAsgn.dialog.editAsgn.desc.title")}>
          <TextArea
            name="th-desc"
            label={t("substAsgn.dialog.editAsgn.desc.th")}
            onChange={() => {}}
            defaultValue={assignment.desc.th}
          />
          <TextArea
            name="en-desc"
            label={t("substAsgn.dialog.editAsgn.desc.en")}
            onChange={() => {}}
            defaultValue={assignment.desc["en-US"]}
          />
        </DialogSection>
        <DialogSection name={t("substAsgn.dialog.asgnDetails.assignedClasses")}>
          <ChipInputList
            list={assignment.classes.map((classItem) => ({
              id: classItem.id.toString(),
              name: classItem.name[locale],
            }))}
            onChange={() => {}}
            onAdd={() => setShowAddClass(true)}
          />
        </DialogSection>
      </Dialog>
      <AddClassDialog
        show={showAddClass}
        onClose={() => setShowAddClass(false)}
        onSubmit={() => setShowAddClass(false)}
      />
    </>
  );
};

// Page
const SubjectDetails: NextPage<{
  subject: Subject;
  classesLearningThis: Array<ClassWName>;
  periodLogs: Array<PeriodLog>;
  substAsgn: Array<SubstituteAssignment>;
}> = ({ subject, classesLearningThis, periodLogs, substAsgn }) => {
  const locale = useRouter().locale == "en-US" ? "en-US" : "th";
  const [showAdd, setShowAdd] = useState<boolean>(false);

  const [showAsgnDetails, setShowAsgnDetails] = useState<boolean>(false);
  const [showEditAsgn, setShowEditAsgn] = useState<boolean>(false);
  const [activeAsgn, setActiveAsgn] = useState<SubstituteAssignment>();

  return (
    <>
      <RegularLayout
        Title={
          <Title
            name={{
              title: subject.name[locale].name,
              subtitle: subject.code[locale],
            }}
            pageIcon={<MaterialIcon icon="school" />}
            backGoesTo="/subjects/teaching"
            LinkElement={Link}
          />
        }
      >
        <DetailsSection
          classesLearningThis={classesLearningThis}
          setShowAdd={setShowAdd}
        />
        <PeriodLogsSection periodLogs={periodLogs} />
        <SubstituteAssignmentsSection
          substAsgn={substAsgn}
          setShowAssgDetails={setShowAsgnDetails}
          setShowEditAsgn={setShowEditAsgn}
          setActiveAsgn={setActiveAsgn}
        />
      </RegularLayout>

      {/* Dialogs */}
      <AddClassDialog
        show={showAdd}
        onClose={() => setShowAdd(false)}
        onSubmit={() => {}}
      />
      {activeAsgn && (
        <>
          <AssignmentDetailsDialog
            show={showAsgnDetails}
            onClose={() => setShowAsgnDetails(false)}
            assignment={activeAsgn}
          />
          <EditAssignmentDialog
            show={showEditAsgn}
            onClose={() => setShowEditAsgn(false)}
            assignment={activeAsgn}
          />
        </>
      )}
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  params,
}) => {
  const subject: Subject = {
    id: 26,
    code: { "en-US": "ENG32102", th: "อ32102" },
    name: {
      "en-US": { name: "English 4" },
      th: { name: "ภาษาอังกฤษ 4" },
    },
    teachers: [],
    subjectSubgroup: {
      name: { "en-US": "English", th: "ภาษาอังกฤษ" },
      subjectGroup: {
        name: { "en-US": "Foreign Language", th: "ภาษาต่างประเทศ" },
      },
    },
  };
  const classesLearningThis: Array<ClassWName> = [
    {
      id: 506,
      name: {
        "en-US": "M.506",
        th: "ม.506",
      },
    },
    {
      id: 507,
      name: {
        "en-US": "M.507",
        th: "ม.507",
      },
    },
    {
      id: 508,
      name: {
        "en-US": "M.508",
        th: "ม.508",
      },
    },
    {
      id: 510,
      name: {
        "en-US": "M.510",
        th: "ม.510",
      },
    },
    {
      id: 511,
      name: {
        "en-US": "M.511",
        th: "ม.511",
      },
    },
    {
      id: 512,
      name: {
        "en-US": "M.512",
        th: "ม.512",
      },
    },
    {
      id: 513,
      name: {
        "en-US": "M.513",
        th: "ม.513",
      },
    },
  ];
  const periodLogs: Array<PeriodLog> = [
    {
      id: 1,
      date: new Date(2022, 1, 22),
      topic: "Forces of nature (Reading)",
      mediums: ["pre-recorded"],
      participationLevel: 5,
    },
    {
      id: 2,
      date: new Date(2022, 1, 20),
      topic: "Vocabulary Practice (The weather)",
      mediums: ["meet", "material"],
      participationLevel: 3,
    },
    {
      id: 3,
      date: new Date(2022, 1, 15),
      topic: "Grammar in use (Modals)",
      mediums: ["meet"],
      participationLevel: 5,
    },
  ];
  const substAsgn: Array<SubstituteAssignment> = [
    {
      id: 0,
      name: {
        "en-US": "Environmental Leaflet",
        th: "Environmental Leaflet",
      },
      desc: {
        "en-US":
          "Make a leaflet on the environment. The assignment must consist of:\n1) A picture representing the selected environmental problem; and\n2) Quotes to campaign or solve environmental problems.\n\nPeriod 1 = Choose environmental issues, think of quotes, and come up with ideas for visual presentations.\n\nPeriod 2 = Use the data planned in the first period made into a real piece.",
        th: "จัดทำใบปลิวเรื่องสิ่งแวดล้อม โดยในชิ้นงานจะต้องประกอบด้วย\n1) รูปภาพที่แสดงถึงปัญหาสิ่งแวดล้อมที่เลือก และ\n2) คำคมเพื่อรณรงค์หรือแก้ไขปัญหาสิ่งแวดล้อมนั้น\n\nชดเชยครั้งที่ 1 = เลือกปัญหาสิ่งแวดล้อม คิดคำคม และหาไอเดียการนำเสนอภาพ\n\nชดเชยครั้งที่ 2 = นำข้อมูลที่วางแผนไว้ในคาบแรก จัดทำเป็นชิ้นงานจริง",
      },
      classes: [
        {
          id: 506,
          name: {
            "en-US": "M.506",
            th: "ม.506",
          },
        },
        {
          id: 507,
          name: {
            "en-US": "M.507",
            th: "ม.507",
          },
        },
        {
          id: 508,
          name: {
            "en-US": "M.508",
            th: "ม.508",
          },
        },
        {
          id: 510,
          name: {
            "en-US": "M.510",
            th: "ม.510",
          },
        },
        {
          id: 511,
          name: {
            "en-US": "M.511",
            th: "ม.511",
          },
        },
        {
          id: 512,
          name: {
            "en-US": "M.512",
            th: "ม.512",
          },
        },
        {
          id: 513,
          name: {
            "en-US": "M.513",
            th: "ม.513",
          },
        },
      ],
      subject: {
        id: 84,
        code: {
          "en-US": "ENG32101",
          th: "อ32101",
        },
        name: {
          "en-US": { name: "English 3" },
          th: { name: "ภาษาอังกฤษ 3" },
        },
      },
    },
  ];

  return {
    props: {
      ...(await serverSideTranslations(locale as string, [
        "common",
        "subjects",
      ])),
      subject,
      classesLearningThis,
      periodLogs: periodLogs.map((periodLog) => ({
        ...periodLog,
        date: periodLog.date.getTime(),
      })),
      substAsgn,
    },
  };
};

export default SubjectDetails;
