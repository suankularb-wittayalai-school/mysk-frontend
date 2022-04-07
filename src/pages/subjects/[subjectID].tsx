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
  ChipInputList,
  Dialog,
  DialogSection,
  Dropdown,
  Header,
  MaterialIcon,
  RegularLayout,
  Section,
  Table,
  Title,
} from "@suankularb-components/react";

// Components
import Sentiment from "@components/Sentiment";

// Types
import { PeriodLog, PeriodMedium, Subject } from "@utils/types/subject";
import { ClassWName } from "@utils/types/class";
import { DialogProps } from "@utils/types/common";

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

const SubstituteAssignmentsSection = (): JSX.Element => {
  const { t } = useTranslation("subjects");

  return (
    <Section>
      <Header
        icon={<MaterialIcon icon="swap_horizontal_circle" allowCustomSize />}
        text={t("substituteAssignments.title")}
      />
      <p>{t("substituteAssignments.supportingText")}</p>
    </Section>
  );
};

const SubjectDetails: NextPage<{
  subject: Subject;
  classesLearningThis: Array<ClassWName>;
  periodLogs: Array<PeriodLog>;
}> = ({ subject, classesLearningThis, periodLogs }) => {
  const { t } = useTranslation("subjects");
  const locale = useRouter().locale == "en-US" ? "en-US" : "th";
  const [showAdd, setShowAdd] = useState<boolean>(false);

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
        <SubstituteAssignmentsSection />
      </RegularLayout>
      <AddClassDialog
        show={showAdd}
        onClose={() => setShowAdd(false)}
        onSubmit={() => {}}
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
    },
  };
};

export default SubjectDetails;
