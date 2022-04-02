// Modules
import { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// SK Components
import {
  Button,
  Chip,
  ChipList,
  Header,
  MaterialIcon,
  RegularLayout,
  Section,
  Table,
  Title,
} from "@suankularb-components/react";

// Types
import { Subject } from "@utils/types/subject";

const DetailsSection = (): JSX.Element => {
  const { t } = useTranslation("subjects");

  return (
    <Section>
      <Header
        icon={<MaterialIcon icon="information" allowCustomSize />}
        text={t("details.title")}
      />
      <section className="flex flex-col gap-2">
        <h3 className="font-display text-xl">{t("details.classes.title")}</h3>
        <ChipList>
          <Chip name="M.506" />
        </ChipList>
      </section>
    </Section>
  );
};

const PeriodLogsSection = (): JSX.Element => {
  const { t } = useTranslation("subjects");
  const locale = useRouter().locale == "en-US" ? "en-US" : "th";

  return (
    <Section>
      <Header
        icon={<MaterialIcon icon="assignment_turned_in" allowCustomSize />}
        text={t("periodLogs.title")}
      />
      <div>
        <Table width={1020}>
          <thead>
            <tr>
              <th className="w-2/12">{t("periodLogs.table.date")}</th>
              <th className="w-4/12">{t("periodLogs.table.topic")}</th>
              <th className="w-3/12">{t("periodLogs.table.medium")}</th>
              <th className="w-2/12">
                {t("periodLogs.table.participationLevel")}
              </th>
              <th className="w-1/12" />
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                {new Date().toLocaleDateString(locale, {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </td>
              <td className="!text-left">Future Perfect Tense</td>
              <td>
                <div className="flex flex-row flex-wrap justify-center gap-2">
                  {<MaterialIcon icon="videocam" className="!inline text-primary" />}
                  <span>
                    Pre-recorded material{" "}
                    <abbr title="Reee" className="font-light text-outline">
                      +1
                    </abbr>
                  </span>
                </div>
              </td>
              <td></td>
              <td>
                <div className="flex flex-row justify-center gap-2">
                  <Button
                    label={t("periodLogs.table.action.seeEvidence")}
                    type="text"
                    iconOnly
                    icon={<MaterialIcon icon="photo" />}
                  />
                  <Button
                    label={t("periodLogs.table.action.seeDetails")}
                    type="text"
                    iconOnly
                    icon={<MaterialIcon icon="drafts" />}
                  />
                </div>
              </td>
            </tr>
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

const SubjectDetails: NextPage<{ subject: Subject }> = ({ subject }) => {
  const { t } = useTranslation("subjects");
  const locale = useRouter().locale == "en-US" ? "en-US" : "th";

  return (
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
      <DetailsSection />
      <PeriodLogsSection />
      <SubstituteAssignmentsSection />
    </RegularLayout>
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

  return {
    props: {
      ...(await serverSideTranslations(locale as string, [
        "common",
        "subjects",
      ])),
      subject,
    },
  };
};

export default SubjectDetails;
