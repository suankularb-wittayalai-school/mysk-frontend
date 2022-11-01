// Modules
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
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
  LinkButton,
  MaterialIcon,
  RegularLayout,
  Section,
  Table,
  TextArea,
  Title,
  XScrollContent,
} from "@suankularb-components/react";

// Components
import AddClassDialog from "@components/dialogs/AddClass";
import ConnectSubjectDialog from "@components/dialogs/ConnectSubject";
import ConfirmDelete from "@components/dialogs/ConfirmDelete";
import ImageDialog from "@components/dialogs/Image";
import BrandIcon from "@components/icons/BrandIcon";
import HoverList from "@components/HoverList";
import Markdown from "@components/Markdown";
import Sentiment from "@components/Sentiment";

// Types
import {
  PeriodLog,
  PeriodMedium,
  Subject,
  SubjectListItem,
  SubjectWNameAndCode,
  SubstituteAssignment,
} from "@utils/types/subject";
import { DialogProps, LangCode } from "@utils/types/common";

// Backend
import { db2Subject, db2SubjectListItem } from "@utils/backend/database";

// Supbase
import { supabase } from "@utils/supabase-client";

// Helpers
import { createTitleStr } from "@utils/helpers/title";

// Details Section
const DetailsSection = ({
  description,
  subjectRooms,
  setShowAddConnection,
  setEditConnection,
  setDeleteConnection,
}: {
  description?: string;
  subjectRooms: SubjectListItem[];
  setShowAddConnection: (value: boolean) => void;
  setEditConnection: (value: {
    show: boolean;
    connection?: SubjectListItem;
  }) => void;
  setDeleteConnection: (value: {
    show: boolean;
    connection?: SubjectListItem;
  }) => void;
}): JSX.Element => {
  const { t } = useTranslation(["subjects", "common"]);
  const locale = useRouter().locale as LangCode;

  return (
    <Section>
      <Header
        icon={<MaterialIcon icon="info" allowCustomSize />}
        text={t("details.title")}
      />

      {/* Subject desciption */}
      {description && <p>{description}</p>}

      {/* Subject-classroom connections */}
      <div>
        <Table width={720}>
          <thead>
            <tr>
              <th className="w-2/12">{t("details.table.class")}</th>
              <th className="w-2/12">{t("details.table.ggcCode")}</th>
              <th className="w-3/12">{t("details.table.teachers")}</th>
              <th className="w-3/12">{t("details.table.coTeachers")}</th>
              <th className="w-2/12"></th>
            </tr>
          </thead>
          <tbody>
            {subjectRooms.map((subjectRoom) => (
              <tr key={subjectRoom.id}>
                {/* Class */}
                <td>
                  {t("class", {
                    ns: "common",
                    number: subjectRoom.classroom.number,
                  })}
                </td>

                {/* GGC Code */}
                <td className="font-mono">{subjectRoom.ggcCode}</td>

                {/* Teachers */}
                <td className="!text-left">
                  <HoverList people={subjectRoom.teachers} useFullName />
                </td>

                {/* Co-teachers */}
                <td className="!text-left">
                  {subjectRoom.coTeachers && (
                    <HoverList people={subjectRoom.coTeachers} useFullName />
                  )}
                </td>

                {/* Actions */}
                <td>
                  <div className="flex flex-row flex-wrap justify-center gap-2">
                    {/* Go to Google Classroom */}
                    <LinkButton
                      name={t("details.table.action.ggcLink")}
                      type="text"
                      icon={<BrandIcon icon="gg-classroom" />}
                      url={
                        subjectRoom.ggcLink || "https://classroom.google.com/"
                      }
                      iconOnly
                      disabled={!subjectRoom.ggcLink}
                      attr={{
                        target: "_blank",
                      }}
                    />
                    {/* Go to Google Meet */}
                    <LinkButton
                      name={t("details.table.action.ggMeetLink")}
                      type="text"
                      icon={<BrandIcon icon="gg-meet" />}
                      url={subjectRoom.ggMeetLink || "https://meet.google.com/"}
                      iconOnly
                      disabled={!subjectRoom.ggMeetLink}
                      attr={{
                        target: "_blank",
                      }}
                    />
                    {/* Edit this connection */}
                    <Button
                      name={t("details.table.action.edit")}
                      type="text"
                      icon={<MaterialIcon icon="edit" />}
                      iconOnly
                      onClick={() =>
                        setEditConnection({
                          show: true,
                          connection: subjectRoom,
                        })
                      }
                    />
                    {/* Delete this connection */}
                    <Button
                      name={t("details.table.action.delete")}
                      type="text"
                      icon={<MaterialIcon icon="delete" />}
                      iconOnly
                      isDangerous
                      onClick={() =>
                        setDeleteConnection({
                          show: true,
                          connection: subjectRoom,
                        })
                      }
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <div className="flex flex-row flex-wrap items-center justify-end gap-2">
        <Button
          type="tonal"
          label={t("details.action.addConnection")}
          icon={<MaterialIcon icon="link" />}
          onClick={() => setShowAddConnection(true)}
        />
      </div>
    </Section>
  );
};

// Period Logs Section

// Main
const PeriodLogsSection = ({
  subjectID,
  periodLogs,
  setLogEvidence,
  setLogDetails,
}: {
  subjectID: number;
  periodLogs: Array<PeriodLog>;
  setLogEvidence: (value: { show: boolean; evidence?: string }) => void;
  setLogDetails: (value: { show: boolean; periodLog?: PeriodLog }) => void;
}): JSX.Element => {
  const { t } = useTranslation("subjects");
  const locale = useRouter().locale as LangCode;

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
      <div className="flex flex-row flex-wrap items-center justify-end gap-2">
        <LinkButton
          type="outlined"
          label={t("periodLogs.action.seeAll")}
          url={`/subjects/${subjectID}/period-logs`}
        />
        <Button
          type="filled"
          label={t("periodLogs.action.logAPeriod")}
          icon={<MaterialIcon icon="add" />}
        />
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
  const locale = useRouter().locale as LangCode;

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
  subjectID,
  substAsgn,
  setShowAssgDetails,
  setShowEditAsgn,
  setShowAddAsgn,
  setActiveAsgn,
}: {
  subjectID: number;
  substAsgn: Array<SubstituteAssignment>;
  setShowAssgDetails: Function;
  setShowEditAsgn: Function;
  setShowAddAsgn: Function;
  setActiveAsgn: Function;
}): JSX.Element => {
  const { t } = useTranslation(["subjects", "common"]);
  const locale = useRouter().locale as LangCode;

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
        <LinkButton
          type="outlined"
          label={t("substAsgn.action.seeAll")}
          url={`/subjects/${subjectID}/substitute-assignments`}
        />
        <Button
          type="filled"
          label={t("substAsgn.action.addAsgn")}
          icon={<MaterialIcon icon="add" />}
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
  const locale = useRouter().locale as LangCode;

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
          {(assignment.subject.name[locale] || assignment.subject.name.th).name}
        </p>
      </DialogSection>
      <DialogSection name={t("substAsgn.dialog.asgnDetails.desc")}>
        <Markdown>{assignment.desc[locale]}</Markdown>
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
  const locale = useRouter().locale as LangCode;
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
              label: (subject.name[locale] || subject.name.th).name,
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
  subjectRooms: SubjectListItem[];
  periodLogs: PeriodLog[];
  substAsgn: SubstituteAssignment[];
  allSubjects: SubjectWNameAndCode[];
}> = ({ subject, subjectRooms, periodLogs, substAsgn, allSubjects }) => {
  const { t } = useTranslation(["subjects", "common"]);
  const router = useRouter();
  const locale = router.locale as LangCode;

  // Subject details
  const [showAddConnection, setShowAddConnection] = useState<boolean>(false);
  const [editConnection, setEditConnection] = useState<{
    show: boolean;
    connection?: SubjectListItem;
  }>({ show: false });
  const [deleteConnection, setDeleteConnection] = useState<{
    show: boolean;
    connection?: SubjectListItem;
  }>({ show: false });

  // Period logs
  const [logEvidence, setLogEvidence] = useState<{
    show: boolean;
    evidence?: string;
  }>({ show: false });

  const [logDetails, setLogDetails] = useState<{
    show: boolean;
    periodLog?: PeriodLog;
  }>({ show: false });

  // Substitute assignments
  const [showAsgnDetails, setShowAsgnDetails] = useState<boolean>(false);
  const [showEditAsgn, setShowEditAsgn] = useState<boolean>(false);
  const [showAddAsgn, setShowAddAsgn] = useState<boolean>(false);
  const [activeAsgn, setActiveAsgn] = useState<SubstituteAssignment>();

  async function handleDelete() {
    await supabase
      .from("room_subjects")
      .delete()
      .match({ id: deleteConnection.connection?.id });
    // console.log(deleteConnection.connection);
  }

  return (
    <>
      <Head>
        <title>
          {createTitleStr((subject.name[locale] || subject.name.th).name, t)}
        </title>
      </Head>
      <RegularLayout
        Title={
          <Title
            name={{
              title: (subject.name[locale] || subject.name.th).name,
              subtitle: subject.code[locale],
            }}
            pageIcon={<MaterialIcon icon="school" />}
            backGoesTo="/teach"
            LinkElement={Link}
          />
        }
      >
        <DetailsSection
          description={
            subject.description
              ? subject.description[locale] || subject.description.th
              : undefined
          }
          subjectRooms={subjectRooms}
          setShowAddConnection={setShowAddConnection}
          setEditConnection={setEditConnection}
          setDeleteConnection={setDeleteConnection}
        />
        <PeriodLogsSection
          subjectID={subject.id}
          periodLogs={periodLogs}
          setLogEvidence={setLogEvidence}
          setLogDetails={setLogDetails}
        />
        <SubstituteAssignmentsSection
          subjectID={subject.id}
          substAsgn={substAsgn}
          setShowAssgDetails={setShowAsgnDetails}
          setShowEditAsgn={setShowEditAsgn}
          setShowAddAsgn={setShowAddAsgn}
          setActiveAsgn={setActiveAsgn}
        />
      </RegularLayout>

      {/* Dialogs */}
      <ConnectSubjectDialog
        show={showAddConnection}
        onClose={() => setShowAddConnection(false)}
        onSubmit={() => {
          router.replace(router.asPath);
          setShowAddConnection(false);
        }}
        mode="add"
        subject={subject}
      />
      <ConnectSubjectDialog
        show={editConnection.show}
        onClose={() => setEditConnection({ show: false })}
        onSubmit={() => {
          router.replace(router.asPath);
          setEditConnection({ show: false });
        }}
        mode="edit"
        subject={subject}
        subjectRoom={editConnection.connection}
      />
      <ConfirmDelete
        show={deleteConnection.show}
        onClose={() => setDeleteConnection({ show: false })}
        onSubmit={async () => {
          await handleDelete();
          setDeleteConnection({ show: false });
          router.replace(router.asPath);
        }}
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
            onSubmit={() => {
              setShowEditAsgn(false);
              router.replace(router.asPath);
            }}
            mode="edit"
            assignment={activeAsgn}
            allSubjects={allSubjects}
          />
        </>
      )}
      <EditAssignmentDialog
        show={showAddAsgn}
        onClose={() => setShowAddAsgn(false)}
        onSubmit={() => {
          setShowAddAsgn(false);
          router.replace(router.asPath);
        }}
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
  const { data: dbSubject, error: dbSubjectError } = await supabase
    .from("subject")
    .select("*")
    .match({ id: params?.subjectID })
    .limit(1)
    .single();

  const { data: roomSubjects, error: roomSubjectsError } = await supabase
    .from("room_subjects")
    .select("*, subject:subject(*), class(*)")
    .eq("subject", params?.subjectID as string);

  if (dbSubjectError) console.error(dbSubjectError);
  if (roomSubjectsError) console.error(roomSubjectsError);

  const subject: Subject | undefined = dbSubject
    ? await db2Subject(dbSubject)
    : undefined;

  const subjectRooms: SubjectListItem[] = roomSubjects
    ? await Promise.all(roomSubjects.map(db2SubjectListItem))
    : [];

  subjectRooms.sort((a, b) => b.classroom.number - a.classroom.number);

  const substAsgn: SubstituteAssignment[] = [];
  const allSubjects: SubjectWNameAndCode[] = [];
  const periodLogs: PeriodLog[] = [];

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "subjects",
      ])),
      subject,
      subjectRooms,
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
