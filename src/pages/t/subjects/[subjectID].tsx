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
import ImageDialog from "@components/dialogs/Image";
import Sentiment from "@components/Sentiment";

// Types
import {
  PeriodLog,
  PeriodMedium,
  Subject,
  SubjectWNameAndCode,
  SubstituteAssignment,
} from "@utils/types/subject";
import { ClassWNumber } from "@utils/types/class";
import { DialogProps } from "@utils/types/common";

// Details Section

// Main
const DetailsSection = ({
  classesLearningThis: orignialClassesLearningThis,
  setShowAdd,
}: {
  classesLearningThis: Array<ClassWNumber>;
  setShowAdd: Function;
}): JSX.Element => {
  const { t } = useTranslation(["subjects", "common"]);
  const locale = useRouter().locale as "en-US" | "th";
  const [classesLearningThis, setClassesLearningThis] = useState<
    Array<{
      id: string;
      name: string | JSX.Element;
    }>
  >(
    orignialClassesLearningThis.map((classItem) => ({
      id: classItem.id.toString(),
      name: t("grade", { ns: "common", number: classItem.number }),
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
  const locale = useRouter().locale as "en-US" | "th";

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
  const locale = useRouter().locale as "en-US" | "th";

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
  const locale = useRouter().locale as "en-US" | "th";

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
  const { t } = useTranslation(["subjects", "common"]);
  const locale = useRouter().locale as "en-US" | "th";

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
                    <Chip
                      key={classItem.id}
                      name={t("grade", {
                        ns: "common",
                        number: classItem.number,
                      })}
                    />
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
  const { t } = useTranslation(["subjects", "common"]);
  const locale = useRouter().locale as "en-US" | "th";

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
            <Chip
              key={classItem.id}
              name={t("grade", { ns: "common", number: classItem.number })}
            />
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
  const { t } = useTranslation(["subjects", "common"]);
  const locale = useRouter().locale as "en-US" | "th";
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
            name: t("grade", { ns: "common", number: classItem.number }),
          })),
        }
      : {
          subject: allSubjects.length == 0 ? 0 : allSubjects[0].id,
          enDesc: "",
          thDesc: "",
          assignedClases: [],
        }
  );

  function validate(): boolean {
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
        onSubmit={() => onSubmit()}
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
  classesLearningThis: Array<ClassWNumber>;
  periodLogs: Array<PeriodLog>;
  substAsgn: Array<SubstituteAssignment>;
  allSubjects: Array<SubjectWNameAndCode>;
}> = ({ subject, classesLearningThis, periodLogs, substAsgn, allSubjects }) => {
  const { t } = useTranslation(["subjects", "common"]);
  const locale = useRouter().locale as "en-US" | "th";
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
    type: {
      "en-US": "Core Courses",
      th: "รายวิชาพื้นฐาน",
    },
    credit: 1,
    year: 2022,
    semester: 1,
    syllabus: null,
    subjectGroup: {
      id: 1,
      name: { "en-US": "ENG", th: "อ" },
    },
  };
  const classesLearningThis: Array<ClassWNumber> = [];
  const substAsgn: Array<SubstituteAssignment> = [];
  const allSubjects: Array<SubjectWNameAndCode> = [];
  const periodLogs: Array<PeriodLog> = [];

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
