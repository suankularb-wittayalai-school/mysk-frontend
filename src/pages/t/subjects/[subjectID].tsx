// Modules
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { useState } from "react";
import ReactMarkdown from "react-markdown";

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
  SubjectWNameAndCode,
  SubstituteAssignment,
} from "@utils/types/subject";
import { ClassWName } from "@utils/types/class";
import { DialogProps } from "@utils/types/common";
import ImageDialog from "@components/dialogs/Image";

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

// Main
const PeriodLogsSection = ({
  periodLogs,
  setLogEvidence,
  setLogDetails,
}: {
  periodLogs: Array<PeriodLog>;
  setLogEvidence: (value: { show: boolean; evidence?: string }) => void;
  setLogDetails: (value: { show: boolean; periodLog?: PeriodLog }) => void;
}): JSX.Element => {
  const { t } = useTranslation("subjects");
  const locale = useRouter().locale == "en-US" ? "en-US" : "th";

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
                  <PeriodLogMedium
                    mediums={periodLog.mediums}
                    className="justify-center"
                  />
                </td>

                {/* Sentiment */}
                <td>
                  <Sentiment
                    level={periodLog.participationLevel}
                    className="justify-center"
                  />
                </td>

                {/* Actions */}
                <td>
                  <div className="flex flex-row justify-center gap-2">
                    <Button
                      name={t("periodLogs.table.action.seeEvidence")}
                      type="text"
                      iconOnly
                      icon={<MaterialIcon icon="photo" />}
                      onClick={() =>
                        setLogEvidence({
                          show: true,
                          evidence: periodLog.evidence,
                        })
                      }
                    />
                    <Button
                      name={t("periodLogs.table.action.seeDetails")}
                      type="text"
                      iconOnly
                      icon={<MaterialIcon icon="drafts" />}
                      onClick={() => setLogDetails({ show: true, periodLog })}
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

// Components
const PeriodLogMedium = ({
  mediums,
  className,
}: {
  mediums: Array<PeriodMedium>;
  className?: string;
}) => {
  const { t } = useTranslation("subjects");

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
    <div
      className={`flex flex-row flex-wrap items-center gap-2 ${
        className || ""
      }`}
    >
      {/* Icon */}
      {mediums.length > 0 &&
        (mediums[0] == "meet" ? (
          <MaterialIcon icon="videocam" className="text-primary" />
        ) : mediums[0] == "pre-recorded" ? (
          <MaterialIcon icon="ondemand_video" className="text-primary" />
        ) : mediums[0] == "material" ? (
          <MaterialIcon icon="style" className="text-primary" />
        ) : mediums[0] == "assignment" ? (
          <MaterialIcon icon="assignment" className="text-primary" />
        ) : mediums[0] == "on-site" ? (
          <MaterialIcon icon="apartment" className="text-primary" />
        ) : undefined)}

      {/* Text */}
      <span>
        {mediums.length > 0 && tMedium(mediums[0])}{" "}
        {mediums.length > 1 && (
          <abbr
            title={mediums
              .slice(1)
              .map((medium) => tMedium(medium))
              .join(", ")}
            className="font-light text-outline"
          >
            +{mediums.length - 1}
          </abbr>
        )}
      </span>
    </div>
  );
};

const PeriodLogDetailsDialog = ({
  show,
  onClose,
  periodLog,
}: DialogProps & { periodLog: PeriodLog }) => {
  const { t } = useTranslation("subjects");
  const locale = useRouter().locale == "en-US" ? "en-US" : "th";

  return (
    <Dialog
      type="large"
      label="period-log"
      title={new Date(periodLog.date).toLocaleDateString(locale, {
        day: "numeric",
        month: "long",
        year: "numeric",
      })}
      actions={[{ name: "Close", type: "close" }]}
      show={show}
      onClose={onClose}
    >
      <DialogSection name={t("periodLogs.table.topic")}>
        <p>{periodLog.topic}</p>
      </DialogSection>
      <DialogSection name={t("periodLogs.table.medium.title")}>
        <PeriodLogMedium mediums={periodLog.mediums} />
      </DialogSection>
      <DialogSection name={t("periodLogs.table.participationLevel")}>
        <Sentiment level={periodLog.participationLevel} />
      </DialogSection>
    </Dialog>
  );
};

// Substitute Assignments Section

// Main
const SubstituteAssignmentsSection = ({
  substAsgn,
  setShowAssgDetails,
  setShowEditAsgn,
  setShowAddAsgn,
  setActiveAsgn,
}: {
  substAsgn: Array<SubstituteAssignment>;
  setShowAssgDetails: Function;
  setShowEditAsgn: Function;
  setShowAddAsgn: Function;
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
        <Button
          type="filled"
          label={t("substAsgn.action.addAsgn")}
          onClick={() => setShowAddAsgn(true)}
        />
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
      actions={[
        { name: t("substAsgn.dialog.asgnDetails.action.close"), type: "close" },
      ]}
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
  onSubmit,
  mode,
  assignment,
  allSubjects,
}: DialogProps & {
  onSubmit: Function;
  mode: "add" | "edit";
  assignment?: SubstituteAssignment;
  allSubjects: Array<SubjectWNameAndCode>;
}): JSX.Element => {
  const { t } = useTranslation("subjects");
  const locale = useRouter().locale == "en-US" ? "en-US" : "th";
  const [showAddClass, setShowAddClass] = useState<boolean>(false);

  // Form control
  const [form, setForm] = useState<{
    subject: number;
    enDesc: string;
    thDesc: string;
    assignedClases: Array<{
      id: string;
      name: string | JSX.Element;
    }>;
  }>(
    mode == "edit" && assignment
      ? {
          subject: assignment.subject.id,
          enDesc: assignment.desc["en-US"],
          thDesc: assignment.desc.th,
          assignedClases: assignment.classes.map((classItem) => ({
            id: classItem.id.toString(),
            name: classItem.name[locale],
          })),
        }
      : {
          subject: allSubjects[0].id,
          enDesc: "",
          thDesc: "",
          assignedClases: [],
        }
  );

  function validateAndSend() {
    let formData = new FormData();

    // TODO: Form validation isn’t here yet!

    return true;
  }

  return (
    <>
      <Dialog
        type="large"
        label="edit-asgn"
        title={t(`substAsgn.dialog.editAsgn.title.${mode}`)}
        actions={[
          { name: t("substAsgn.dialog.editAsgn.action.cancel"), type: "close" },
          { name: t("substAsgn.dialog.editAsgn.action.save"), type: "submit" },
        ]}
        show={show}
        onClose={() => onClose()}
        onSubmit={() => validateAndSend() && onSubmit()}
      >
        <DialogSection
          name={t("substAsgn.dialog.editAsgn.subject")}
          isDoubleColumn
        >
          <Dropdown
            name="subject"
            label={t("substAsgn.dialog.editAsgn.subject")}
            options={allSubjects.map((subject) => ({
              value: subject.id,
              label: subject.name[locale].name,
            }))}
            onChange={(e: number) => setForm({ ...form, subject: e })}
            defaultValue={form.subject}
          />
        </DialogSection>
        <DialogSection name={t("substAsgn.dialog.editAsgn.desc.title")}>
          <TextArea
            name="th-desc"
            label={t("substAsgn.dialog.editAsgn.desc.th")}
            onChange={() => {}}
            defaultValue={form.thDesc}
          />
          <TextArea
            name="en-desc"
            label={t("substAsgn.dialog.editAsgn.desc.en")}
            onChange={() => {}}
            defaultValue={form.enDesc}
          />
        </DialogSection>
        <DialogSection name={t("substAsgn.dialog.asgnDetails.assignedClasses")}>
          <ChipInputList
            list={form.assignedClases}
            onChange={(e) => setForm({ ...form, assignedClases: e })}
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
  allSubjects: Array<SubjectWNameAndCode>;
}> = ({ subject, classesLearningThis, periodLogs, substAsgn, allSubjects }) => {
  const { t } = useTranslation(["subjects", "common"]);
  const locale = useRouter().locale == "en-US" ? "en-US" : "th";
  const [showAdd, setShowAdd] = useState<boolean>(false);

  const [logEvidence, setLogEvidence] = useState<{
    show: boolean;
    evidence?: string;
  }>({ show: false });

  const [logDetails, setLogDetails] = useState<{
    show: boolean;
    periodLog?: PeriodLog;
  }>({ show: false });

  const [showAsgnDetails, setShowAsgnDetails] = useState<boolean>(false);
  const [showEditAsgn, setShowEditAsgn] = useState<boolean>(false);
  const [showAddAsgn, setShowAddAsgn] = useState<boolean>(false);
  const [activeAsgn, setActiveAsgn] = useState<SubstituteAssignment>();

  return (
    <>
      <Head>
        <title>
          {t("title")} - {t("brand.name", { ns: "common" })}
        </title>
      </Head>
      <RegularLayout
        Title={
          <Title
            name={{
              title: subject.name[locale].name,
              subtitle: subject.code[locale],
            }}
            pageIcon={<MaterialIcon icon="school" />}
            backGoesTo="/t/subjects/teaching"
            LinkElement={Link}
          />
        }
      >
        <DetailsSection
          classesLearningThis={classesLearningThis}
          setShowAdd={setShowAdd}
        />
        <PeriodLogsSection
          periodLogs={periodLogs}
          setLogEvidence={setLogEvidence}
          setLogDetails={setLogDetails}
        />
        <SubstituteAssignmentsSection
          substAsgn={substAsgn}
          setShowAssgDetails={setShowAsgnDetails}
          setShowEditAsgn={setShowEditAsgn}
          setShowAddAsgn={setShowAddAsgn}
          setActiveAsgn={setActiveAsgn}
        />
      </RegularLayout>

      {/* Dialogs */}
      <AddClassDialog
        show={showAdd}
        onClose={() => setShowAdd(false)}
        onSubmit={() => {}}
      />
      {logEvidence.evidence && (
        <ImageDialog
          show={logEvidence.show}
          onClose={() => setLogEvidence({ ...logEvidence, show: false })}
          src={logEvidence.evidence}
          className="aspect-[16/9]"
        />
      )}
      {logDetails.periodLog && (
        <PeriodLogDetailsDialog
          show={logDetails.show}
          onClose={() => setLogDetails({ ...logDetails, show: false })}
          periodLog={logDetails.periodLog}
        />
      )}
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
            // TODO: Refetch subst asgns here ↓
            onSubmit={() => setShowEditAsgn(false)}
            mode="edit"
            assignment={activeAsgn}
            allSubjects={allSubjects}
          />
        </>
      )}
      <EditAssignmentDialog
        show={showAddAsgn}
        onClose={() => setShowAddAsgn(false)}
        // TODO: Refetch subst asgns here ↓
        onSubmit={() => setShowAddAsgn(false)}
        mode="add"
        allSubjects={allSubjects}
      />
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
      evidence: "/images/dummybase/zoom-screenshot.webp",
    },
    {
      id: 2,
      date: new Date(2022, 1, 20),
      topic: "Vocabulary Practice (The weather)",
      mediums: ["meet", "material"],
      participationLevel: 3,
      evidence: "/images/dummybase/zoom-screenshot.webp",
    },
    {
      id: 3,
      date: new Date(2022, 1, 15),
      topic: "Grammar in use (Modals)",
      mediums: ["meet"],
      participationLevel: 5,
      evidence: "/images/dummybase/zoom-screenshot.webp",
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
        id: 26,
        code: { "en-US": "ENG32102", th: "อ32102" },
        name: {
          "en-US": { name: "English 4" },
          th: { name: "ภาษาอังกฤษ 4" },
        },
      },
    },
  ];
  const allSubjects: Array<SubjectWNameAndCode> = [
    {
      id: 8,
      code: { "en-US": "I21202", th: "I21202" },
      name: {
        "en-US": { name: "Communication and Presentation" },
        th: { name: "การสื่อสารและการนำเสนอ" },
      },
    },
    {
      id: 19,
      code: { "en-US": "ENG20218", th: "อ20218" },
      name: {
        "en-US": { name: "Reading 6" },
        th: { name: "การอ่าน 6" },
      },
    },
    {
      id: 26,
      code: { "en-US": "ENG32102", th: "อ32102" },
      name: {
        "en-US": { name: "English 4" },
        th: { name: "ภาษาอังกฤษ 4" },
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
      allSubjects,
    },
  };
};

export default SubjectDetails;
