// Modules
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// SK Components
import {
  Chip,
  ChipList,
  Header,
  LinkButton,
  MaterialIcon,
  RegularLayout,
  Search,
  Section,
  Title,
} from "@suankularb-components/react";

// Components
import ClassTable from "@components/tables/ClassTable";
import StudentTable from "@components/tables/StudentTable";
import SubjectTable from "@components/tables/SubjectTable";
import TeacherTable from "@components/tables/TeacherTable";

// Types
import { Student, Teacher } from "@utils/types/person";
import { Class } from "@utils/types/class";
import { StudentDB, TeacherDB } from "@utils/types/database/person";
import { Subject } from "@utils/types/subject";
import { SubjectTable as SubjectTableType } from "@utils/types/database/subject";

// Supabase
import { supabase } from "@utils/supabaseClient";

// Helpers
import { range } from "@utils/helpers/array";

// Backend
import {
  db2Class,
  db2Student,
  db2Subject,
  db2Teacher,
} from "@utils/backend/database";
import { ClassroomDB } from "@utils/types/database/class";

const StudentSection = ({
  someStudents,
}: {
  someStudents: Array<Student>;
}): JSX.Element => {
  const { t } = useTranslation("admin");
  const locale = useRouter().locale as "en-US" | "th";

  return (
    <Section>
      <div className="layout-grid-cols-3--header">
        <div className="[grid-area:header]">
          <Header
            icon={<MaterialIcon icon="groups" allowCustomSize />}
            text={t("studentList.title")}
          />
        </div>
        <Search
          placeholder={t("studentList.searchStudents")}
          className="[grid-area:search]"
        />
      </div>
      <div>
        <StudentTable students={someStudents} />
      </div>
      <div className="flex flex-row items-center justify-end gap-2">
        <LinkButton
          type="filled"
          label={t("common.action.seeAll")}
          url="/t/admin/students"
          LinkElement={Link}
        />
      </div>
    </Section>
  );
};

const TeacherSection = ({
  someTeachers,
}: {
  someTeachers: Array<Teacher>;
}): JSX.Element => {
  const { t } = useTranslation("admin");

  return (
    <Section>
      <div className="layout-grid-cols-3">
        <div className="md:col-span-2">
          <Header
            icon={<MaterialIcon icon="group" allowCustomSize />}
            text={t("teacherList.title")}
          />
        </div>
        <Search placeholder={t("teacherList.searchTeachers")} />
      </div>
      <div>
        <TeacherTable teachers={someTeachers} />
      </div>
      <div className="flex flex-row items-center justify-end gap-2">
        <LinkButton
          type="filled"
          label={t("teacherList.action.seeAll")}
          url="/t/admin/teachers"
          LinkElement={Link}
        />
      </div>
    </Section>
  );
};

const SubjectSection = ({ someSubjects }: { someSubjects: Subject[] }) => {
  const { t } = useTranslation("admin");

  return (
    <Section>
      <div className="layout-grid-cols-3">
        <div className="md:col-span-2">
          <Header
            icon={<MaterialIcon icon="school" allowCustomSize />}
            text={t("subjectList.title")}
          />
        </div>
        <Search placeholder={t("subjectList.searchSubjects")} />
      </div>
      <div>
        <SubjectTable subjects={someSubjects} />
      </div>
      <div className="flex flex-row items-center justify-end gap-2">
        <LinkButton
          type="filled"
          label={t("common.action.seeAll")}
          url="/t/admin/subjects"
          LinkElement={Link}
        />
      </div>
    </Section>
  );
};

const ClassSection = ({ someClasses }: { someClasses: Class[] }) => {
  const { t } = useTranslation("admin");

  return (
    <Section>
      <div className="layout-grid-cols-3">
        <div className="md:col-span-2">
          <Header
            icon={<MaterialIcon icon="meeting_room" allowCustomSize />}
            text={t("classList.title")}
          />
        </div>
        <Search placeholder={t("classList.searchClasses")} />
      </div>
      <div>
        <ClassTable classes={someClasses} />
      </div>
      <div className="flex flex-row items-center justify-end gap-2">
        <LinkButton
          type="filled"
          label={t("common.action.seeAll")}
          url="/t/admin/classes"
          LinkElement={Link}
        />
      </div>
    </Section>
  );
};

const ScheduleSection = (): JSX.Element => {
  const { t } = useTranslation("admin");

  return (
    <Section>
      <Header
        icon={<MaterialIcon icon="dashboard" allowCustomSize />}
        text={t("schedule.title")}
      />
      <ChipList>
        {range(6).map((grade) => (
          <Link key={grade} href={`/t/admin/schedule/${grade + 1}`}>
            <a>
              <Chip name={t("schedule.gradeItem", { grade: grade + 1 })} />
            </a>
          </Link>
        ))}
      </ChipList>
    </Section>
  );
};

const Admin: NextPage<{
  someStudents: Student[];
  someTeachers: Teacher[];
  someSubjects: Subject[];
  someClasses: Class[];
}> = ({ someStudents, someTeachers, someSubjects, someClasses }) => {
  const { t } = useTranslation(["admin", "common"]);

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
            name={{ title: t("title") }}
            pageIcon={<MaterialIcon icon="security" />}
            backGoesTo="/t/home"
            LinkElement={Link}
          />
        }
      >
        <StudentSection someStudents={someStudents} />
        <TeacherSection someTeachers={someTeachers} />
        <SubjectSection someSubjects={someSubjects} />
        <ClassSection someClasses={someClasses} />
        <ScheduleSection />
      </RegularLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const { data: students, error: studentSelectingError } = await supabase
    .from<StudentDB>("student")
    .select("id, std_id, people:person(*)")
    .limit(5);
  const { data: teachers, error: teacherSelectingError } = await supabase
    .from<TeacherDB>("teacher")
    .select("id, teacher_id, people:person(*), SubjectGroup:subject_group(*)")
    .limit(5);
  const { data: subjects, error: subjectSelectingError } = await supabase
    .from<SubjectTableType>("subject")
    .select("*")
    .limit(5);
  const { data: classes, error: classSelectingError } = await supabase
    .from<ClassroomDB>("classroom")
    .select("*, schedule:schedule(*)")
    .order("number", { ascending: true })
    .limit(5);

  let someStudents: Array<Student> = [];
  let someTeachers: Array<Teacher> = [];
  let someSubjects: Array<Subject> = [];
  let someClasses: Array<Class> = [];

  if (!studentSelectingError && students) {
    someStudents = await Promise.all(
      students.map(async (student) => await db2Student(student))
    );
  }

  if (!teacherSelectingError && teachers) {
    someTeachers = await Promise.all(
      teachers.map(async (teacher) => await db2Teacher(teacher))
    );
  }

  if (!subjectSelectingError && subjects) {
    someSubjects = await Promise.all(
      subjects.map(async (subject) => await db2Subject(subject))
    );
  }

  if (!classSelectingError && classes) {
    someClasses = await Promise.all(
      classes.map(async (classroom) => await db2Class(classroom))
    );
  }

  return {
    props: {
      ...(await serverSideTranslations(locale as string, [
        "common",
        "admin",
        "account",
      ])),
      someStudents,
      someTeachers,
      someSubjects,
      someClasses,
    },
  };
};

export default Admin;
