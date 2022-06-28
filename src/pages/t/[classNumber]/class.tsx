// Modules
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { isThisYear } from "date-fns";

// SK Components
import {
  Button,
  Card,
  CardHeader,
  ChipFilterList,
  Header,
  LinkButton,
  MaterialIcon,
  RegularLayout,
  Search,
  Section,
  Table,
  Title,
  XScrollContent,
} from "@suankularb-components/react";

// External Libraries
import { useEffect, useReducer, useState } from "react";

// Components
import ContactChip from "@components/ContactChip";
import TeacherCard from "@components/TeacherCard";
import AddTeacherDialog from "@components/dialogs/AddTeacher";

// Backend
import {
  addAdvisorToClassroom,
  addContactToClassroom,
  getClassroom,
} from "@utils/backend/classroom/classroom";

// Helpers
import { nameJoiner } from "@utils/helpers/name";

// Hooks
import { useTeacherAccount } from "@utils/hooks/auth";

// Types
import { Class as ClassType } from "@utils/types/class";
import { Contact } from "@utils/types/contact";
import { Student, Teacher } from "@utils/types/person";
import { StudentForm } from "@utils/types/news";
import AddContactDialog from "@components/dialogs/AddContact";

const StudentFormCard = ({ form }: { form: StudentForm }): JSX.Element => {
  const locale = useRouter().locale as "en-US" | "th";
  const { t } = useTranslation("news");

  return (
    <Card type="horizontal">
      <CardHeader
        // Title
        title={
          <h3 className="break-all text-lg font-bold">
            {form.content[locale]?.title || form.content.th.title}
          </h3>
        }
        // Type and post date
        label={
          <div className="flex divide-x divide-outline">
            <span className="pr-2">{t(`itemType.${form.type}`)}</span>
            <time className="pl-2 text-outline">
              {form.postDate.toLocaleDateString(locale, {
                year: isThisYear(form.postDate) ? undefined : "numeric",
                month: "short",
                day: "numeric",
              })}
            </time>
          </div>
        }
        // Completion and link
        end={
          <div className="flex flex-row items-center gap-2">
            <div
              className={`rounded-lg py-2 px-3 font-sans font-bold ${
                form.percentDone < 25
                  ? "error"
                  : form.percentDone < 50
                  ? "container-tertiary"
                  : "container-primary"
              }`}
            >
              {form.percentDone}%
            </div>
            <LinkButton
              name={t("action.seeDetails")}
              type="tonal"
              iconOnly
              icon={<MaterialIcon icon="arrow_forward" />}
              url={`/t/${form.type}/${form.id}`}
              LinkElement={Link}
            />
          </div>
        }
        className="font-display"
      />
    </Card>
  );
};

const FormSection = ({
  studentForms: forms,
}: {
  studentForms: Array<StudentForm>;
}): JSX.Element => {
  const { t } = useTranslation(["dashboard", "news", "class"]);
  const [newsFilter, setNewsFilter] = useState<Array<string>>([]);
  const [filteredNews, setFilteredNews] = useState<Array<StudentForm>>(forms);
  const locale = useRouter().locale as "en-US" | "th";

  useEffect(
    () => {
      // Reset filtered news if all filters are deselected
      if (newsFilter.length == 0) {
        setFilteredNews(forms);

        // Handles done
      } else if (
        newsFilter.includes("few-done") ||
        newsFilter.includes("most-done") ||
        newsFilter.includes("all-done")
      ) {
        if (newsFilter.length > 1) {
          setFilteredNews(
            forms.filter(
              (newsItem) =>
                newsFilter.includes(newsItem.type) &&
                (newsFilter.includes("few-done")
                  ? newsItem.percentDone < 25
                  : newsFilter.includes("most-done")
                  ? newsItem.percentDone >= 25 && newsItem.percentDone < 50
                  : newsFilter.includes("all-done") &&
                    newsItem.percentDone >= 50)
            )
          );
        } else {
          setFilteredNews(
            forms.filter((newsItem) =>
              newsFilter.includes("few-done")
                ? newsItem.percentDone < 25
                : newsFilter.includes("most-done")
                ? newsItem.percentDone >= 25 && newsItem.percentDone < 50
                : newsFilter.includes("all-done") && newsItem.percentDone >= 50
            )
          );
        }
      }

      // Handles types
      else {
        setFilteredNews(
          forms.filter((newsItem) => newsFilter.includes(newsItem.type))
        );
      }
    },

    // Adding `forms` as a dependency causes an inifinie loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [newsFilter]
  );

  return (
    <Section>
      <Header
        icon={<MaterialIcon icon="groups" allowCustomSize={true} />}
        text={t("studentForms.title", { ns: "class" })}
      />
      <ChipFilterList
        choices={[
          { id: "form", name: t("news.filter.forms") },
          { id: "payment", name: t("news.filter.payments") },
          [
            { id: "few-done", name: t("news.filter.amountDone.fewDone") },
            { id: "most-done", name: t("news.filter.amountDone.mostDone") },
            { id: "all-done", name: t("news.filter.amountDone.allDone") },
          ],
        ]}
        onChange={(newFilter: Array<string>) => setNewsFilter(newFilter)}
        scrollable={true}
      />
      {filteredNews.length == 0 ? (
        <ul className="px-4">
          <li
            className="grid h-[4.8125rem] place-content-center rounded-xl
              bg-surface-1 text-center text-on-surface"
          >
            {t("class.noRelevantForms")}
          </li>
        </ul>
      ) : (
        <XScrollContent>
          {filteredNews.map((form) => (
            <li key={form.id}>
              <StudentFormCard form={form} />
            </li>
          ))}
        </XScrollContent>
      )}
    </Section>
  );
};

const ClassAdvisorsSection = ({
  classAdvisors,
  toggleShowAdd,
}: {
  classAdvisors: Array<Teacher>;
  toggleShowAdd: () => void;
}): JSX.Element => {
  const { t } = useTranslation("class");

  return (
    <Section labelledBy="class-advisors">
      <Header
        icon={<MaterialIcon icon="group" />}
        text={t("classAdvisors.title")}
      />
      <div className="layout-grid-cols-3 !w-full !flex-col">
        {classAdvisors.map((classAdvisor) => (
          <TeacherCard
            key={classAdvisor.id}
            teacher={classAdvisor}
            hasSubjectSubgroup
            className="!w-full"
          />
        ))}
      </div>
      <div className="flex flex-row flex-wrap items-center justify-end gap-2">
        <Button
          label={t("classAdvisors.addAdvisors")}
          type="tonal"
          icon={<MaterialIcon icon="person_add_alt_1" />}
          onClick={() => toggleShowAdd()}
        />
      </div>
    </Section>
  );
};

const ContactSection = ({
  contacts,
  toggleShowAdd,
}: {
  contacts: Array<Contact>;
  toggleShowAdd: () => void;
}): JSX.Element => {
  const { t } = useTranslation("class");

  return (
    <Section labelledBy="class-contacts">
      <Header
        icon={<MaterialIcon icon="contacts" />}
        text={t("classContacts.title")}
      />
      <div className="layout-grid-cols-3 !w-full !flex-col">
        {contacts.map((contact) => (
          <ContactChip
            key={contact.id}
            contact={contact}
            className="!w-initial"
          />
        ))}
      </div>
      <div className="flex flex-row flex-wrap items-center justify-end gap-2">
        <Button
          label={t("classContacts.addClassContacts")}
          type="tonal"
          icon={<MaterialIcon icon="add" />}
          onClick={() => toggleShowAdd()}
        />
      </div>
    </Section>
  );
};

const StudentListSection = ({
  students,
}: {
  students: Student[];
}): JSX.Element => {
  const { t } = useTranslation(["class", "common"]);
  const locale = useRouter().locale == "th" ? "th" : "en-US";

  return (
    <Section labelledBy="student-list">
      <div className="layout-grid-cols-3 items-start">
        <div className="md:col-span-2">
          <Header
            icon={<MaterialIcon icon="groups" />}
            text={t("studentList.title")}
          />
        </div>
        <Search placeholder={t("studentList.searchStudents")} />
      </div>
      <div>
        <Table width={320}>
          <thead>
            <tr>
              <th className="w-24">{t("studentList.table.classNo")}</th>
              <th>{t("studentList.table.name")}</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.classNo}</td>
                <td className="!text-left">
                  {nameJoiner(
                    locale,
                    student.name,
                    t(`name.prefix.${student.prefix}`, { ns: "common" }),
                    {
                      prefix: true,
                    }
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <div className="flex flex-row flex-wrap items-center justify-end gap-2">
        <Button
          label={t("studentList.printList")}
          type="filled"
          icon={<MaterialIcon icon="printer" />}
        />
      </div>
    </Section>
  );
};

// Page
const Class: NextPage<{
  classItem: ClassType;
  studentForms: Array<StudentForm>;
}> = ({ classItem, studentForms }) => {
  const router = useRouter();
  const { t } = useTranslation("common");

  const [showAddTeacher, toggleShowAddTeacher] = useReducer(
    (state: boolean) => !state,
    false
  );
  const [showAddContact, toggleShowAddContact] = useReducer(
    (state: boolean) => !state,
    false
  );

  useTeacherAccount({ loginRequired: true });

  return (
    <>
      <Head>
        <title>
          {t("class", { number: classItem.number })} - {t("brand.name")}
        </title>
      </Head>

      <RegularLayout
        Title={
          <Title
            name={{ title: t("class", { number: classItem.number }) }}
            pageIcon={<MaterialIcon icon="groups" />}
            backGoesTo="/s/home"
            LinkElement={Link}
          />
        }
      >
        <FormSection
          studentForms={studentForms.map((newsItem) => ({
            ...newsItem,
            postDate: new Date(newsItem.postDate),
          }))}
        />
        <ClassAdvisorsSection
          classAdvisors={classItem.classAdvisors}
          toggleShowAdd={toggleShowAddTeacher}
        />
        <ContactSection
          contacts={classItem.contacts}
          toggleShowAdd={toggleShowAddContact}
        />
        <StudentListSection students={classItem.students} />
      </RegularLayout>

      {/* Dialogs */}
      <AddTeacherDialog
        show={showAddTeacher}
        onClose={() => toggleShowAddTeacher()}
        onSubmit={async (teacher) => {
          toggleShowAddTeacher();
          await addAdvisorToClassroom(teacher.id, classItem.id);
          router.replace(router.asPath);
        }}
      />
      <AddContactDialog
        show={showAddContact}
        onClose={() => toggleShowAddContact()}
        onSubmit={async (contact) => {
          toggleShowAddContact();
          await addContactToClassroom(contact.id, classItem.id);
          router.replace(router.asPath);
        }}
        isGroup
      />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  params,
}) => ({
  props: {
    ...(await serverSideTranslations(locale as string, [
      "account",
      "news",
      "dashboard",
      "common",
      "class",
      "teacher",
    ])),
    classItem: await getClassroom(Number(params?.classNumber)),
    studentForms: ([] as StudentForm[]).map((newsItem) => ({
      ...newsItem,
      postDate: newsItem.postDate.getTime(),
    })),
  },
});

export default Class;
