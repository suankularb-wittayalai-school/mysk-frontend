// External libraries
import { isThisYear } from "date-fns";

import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { MutableRefObject, useEffect, useRef, useState } from "react";

import ReactToPrint from "react-to-print";

import { User, withPageAuth } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

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

// Components
import AddContactDialog from "@components/dialogs/AddContact";
import AddTeacherDialog from "@components/dialogs/AddTeacher";
import ContactChip from "@components/ContactChip";
import PrintHeader from "@components/PrintHeader";
import TeacherCard from "@components/TeacherCard";

// Backend
import {
  addAdvisorToClassroom,
  addContactToClassroom,
  getClassroom,
} from "@utils/backend/classroom/classroom";
import { createContact } from "@utils/backend/contact";
import { getTeacherFromUser } from "@utils/backend/person/teacher";

// Helpers
import { nameJoiner } from "@utils/helpers/name";
import { createTitleStr } from "@utils/helpers/title";

// Hooks
import { useToggle } from "@utils/hooks/toggle";

// Types
import { Class as ClassType } from "@utils/types/class";
import { LangCode } from "@utils/types/common";
import { Contact } from "@utils/types/contact";
import { Student, Teacher } from "@utils/types/person";
import { StudentFormItem } from "@utils/types/news";
import { Database } from "@utils/types/supabase";

const StudentFormCard = ({ form }: { form: StudentFormItem }): JSX.Element => {
  const locale = useRouter().locale as LangCode;
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
              url={`/${form.type}/${form.id}`}
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
  studentForms: StudentFormItem[];
}): JSX.Element => {
  const { t } = useTranslation(["dashboard", "news", "class"]);
  const [newsFilter, setNewsFilter] = useState<string[]>([]);
  const [filteredNews, setFilteredNews] = useState<StudentFormItem[]>(forms);
  const locale = useRouter().locale as LangCode;

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
        onChange={(newFilter: string[]) => setNewsFilter(newFilter)}
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
  allowEdit,
}: {
  classAdvisors: Teacher[];
  toggleShowAdd: () => void;
  allowEdit?: boolean;
}): JSX.Element => {
  const { t } = useTranslation("class");

  return (
    <Section labelledBy="class-advisors">
      <Header
        icon={<MaterialIcon icon="group" allowCustomSize />}
        text={t("classAdvisors.title")}
      />
      <div className="layout-grid-cols-3 !w-full !flex-col">
        {classAdvisors.map((classAdvisor) => (
          <TeacherCard
            key={classAdvisor.id}
            teacher={classAdvisor}
            hasSubjectGroup
            className="!w-full"
          />
        ))}
      </div>
      <div className="flex flex-row flex-wrap items-center justify-end gap-2">
        <Button
          label={t("classAdvisors.addAdvisors")}
          type="tonal"
          icon={<MaterialIcon icon="person_add_alt_1" />}
          disabled={!allowEdit}
          onClick={() => toggleShowAdd()}
        />
      </div>
    </Section>
  );
};

const ContactSection = ({
  contacts,
  toggleShowAdd,
  allowEdit,
}: {
  contacts: Contact[];
  toggleShowAdd: () => void;
  allowEdit?: boolean;
}): JSX.Element => {
  const { t } = useTranslation("class");

  return (
    <Section labelledBy="class-contacts">
      <Header
        icon={<MaterialIcon icon="contacts" allowCustomSize />}
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
          disabled={!allowEdit}
          onClick={toggleShowAdd}
        />
      </div>
    </Section>
  );
};

const StudentListSection = ({
  students,
  classNumber,
}: {
  students: Student[];
  classNumber: number;
}): JSX.Element => {
  const { t } = useTranslation(["class", "common"]);
  const locale = useRouter().locale as LangCode;
  const tableRef: MutableRefObject<any> = useRef(null);

  const [query, setQuery] = useState<string>("");

  return (
    <Section labelledBy="student-list">
      <div className="layout-grid-cols-3 items-start">
        <div className="md:col-span-2">
          <Header
            icon={<MaterialIcon icon="groups" allowCustomSize />}
            text={t("studentList.title")}
          />
        </div>
        <Search
          placeholder={t("studentList.searchStudents")}
          onChange={setQuery}
        />
      </div>
      <div ref={tableRef} className="print:p-12">
        <PrintHeader
          title={t("class", { ns: "common", number: classNumber })}
        />
        <Table width={320}>
          <thead>
            <tr>
              <th className="w-24">{t("studentList.table.classNo")}</th>
              <th className="print:w-5/12">{t("studentList.table.name")}</th>
              {/* Empty columns for print */}
              <th className="hidden print:table-cell">&nbsp;</th>
              <th className="hidden print:table-cell">&nbsp;</th>
              <th className="hidden print:table-cell">&nbsp;</th>
              <th className="hidden print:table-cell">&nbsp;</th>
              <th className="hidden print:table-cell">&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            {students
              .map((student) => ({
                id: student.id,
                classNo: student.classNo,
                name: nameJoiner(locale, student.name, student.prefix, {
                  prefix: true,
                }),
              }))
              .filter((student) => student.name.includes(query))
              .map((student) => (
                <tr key={student.id}>
                  <td>{student.classNo}</td>
                  <td className="!text-left">{student.name}</td>
                  {/* Empty columns for print */}
                  <td className="hidden print:table-cell" />
                  <td className="hidden print:table-cell" />
                  <td className="hidden print:table-cell" />
                  <td className="hidden print:table-cell" />
                  <td className="hidden print:table-cell" />
                </tr>
              ))}
          </tbody>
        </Table>
      </div>
      <div className="flex flex-row flex-wrap items-center justify-end gap-2">
        <ReactToPrint
          content={() => tableRef.current}
          trigger={() => (
            <Button
              label={t("studentList.printList")}
              type="filled"
              icon={<MaterialIcon icon="printer" />}
            />
          )}
        />
      </div>
    </Section>
  );
};

// Page
const Class: NextPage<{
  classItem: ClassType;
  studentForms: StudentFormItem[];
  isAdvisor: boolean;
}> = ({ classItem, studentForms, isAdvisor }) => {
  const router = useRouter();
  const supabase = useSupabaseClient();
  const { t } = useTranslation("common");

  const [showAddTeacher, toggleShowAddTeacher] = useToggle();
  const [showAddContact, toggleShowAddContact] = useToggle();

  return (
    <>
      <Head>
        <title>
          {createTitleStr(t("class", { number: classItem.number }), t)}
        </title>
      </Head>

      <RegularLayout
        Title={
          <Title
            name={{ title: t("class", { number: classItem.number }) }}
            pageIcon={<MaterialIcon icon="groups" />}
            backGoesTo="/learn"
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
          allowEdit={isAdvisor}
        />
        <ContactSection
          contacts={classItem.contacts}
          toggleShowAdd={toggleShowAddContact}
          allowEdit={isAdvisor}
        />
        <StudentListSection
          students={classItem.students}
          classNumber={classItem.number}
        />
      </RegularLayout>

      {/* Dialogs */}
      <AddTeacherDialog
        show={showAddTeacher}
        onClose={toggleShowAddTeacher}
        onSubmit={async (teacher) => {
          await addAdvisorToClassroom(supabase, teacher.id, classItem.id);
          router.replace(router.asPath);
          toggleShowAddTeacher();
        }}
      />
      <AddContactDialog
        show={showAddContact}
        onClose={toggleShowAddContact}
        onSubmit={async (contact) => {
          const { data: createdContact, error: contactCreationError } =
            await createContact(contact);

          if (contactCreationError) {
            console.error(contactCreationError);
            return;
          }

          await addContactToClassroom(
            supabase,
            (createdContact as Database["public"]["Tables"]["contact"]["Row"])
              .id,
            classItem.id
          );
          router.replace(router.asPath);
          toggleShowAddContact();
        }}
        isGroup
      />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = withPageAuth({
  async getServerSideProps({ locale, params }, supabase) {
    const classItem = await getClassroom(supabase, Number(params?.classNumber));

    const studentForms: StudentFormItem[] = [];

    const { data: sbUser } = await supabase.auth.getUser();
    const { data: teacher } = await getTeacherFromUser(
      supabase,
      sbUser.user as User
    );
    const isAdvisor = teacher
      ? teacher.classAdvisorAt?.id == classItem.id
      : false;

    return {
      props: {
        ...(await serverSideTranslations(locale as LangCode, [
          "common",
          "account",
          "class",
          "dashboard",
          "news",
          "teacher",
        ])),
        classItem,
        studentForms,
        isAdvisor,
      },
    };
  },
});

export default Class;
