// Modules
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import { Trans, useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { useState } from "react";

// SK Components
import {
  Button,
  Chip,
  ChipList,
  Header,
  KeyboardInput,
  LinkButton,
  MaterialIcon,
  RegularLayout,
  Search,
  Section,
  Title,
} from "@suankularb-components/react";

// Components
import ConfirmDelete from "@components/dialogs/ConfirmDelete";
import EditPersonDialog from "@components/dialogs/EditPerson";
import StudentTable from "@components/tables/StudentTable";
import TeacherTable from "@components/tables/TeacherTable";

// Types
import { Student, Teacher } from "@utils/types/person";
import { ClassWName } from "@utils/types/class";
import { range } from "@utils/helpers/array";
import { supabase } from "@utils/supabaseClient";
import {
  StudentDB,
  StudentTable as StudentTableType,
  TeacherDB,
  TeacherTable as TeacherTableType,
} from "@utils/types/database/person";
import { db2student, db2teacher } from "@utils/backend/database";

const StudentSection = ({
  someStudents,
  setShowEdit,
  setEditingPerson,
  setShowConfDelStudent,
}: {
  someStudents: Array<Student>;
  setShowEdit: (value: boolean) => void;
  setEditingPerson: (student: Student) => void;
  setShowConfDelStudent: (value: boolean) => void;
}): JSX.Element => {
  const { t } = useTranslation("admin");
  const locale = useRouter().locale == "en-US" ? "en-US" : "th";

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
        <StudentTable
          students={someStudents}
          setShowEdit={setShowEdit}
          setEditingPerson={setEditingPerson}
          setShowConfDelStudent={setShowConfDelStudent}
        />
      </div>
      <div className="flex flex-row items-center justify-end gap-2">
        <LinkButton
          type="filled"
          label={t("studentList.action.seeAll")}
          url="/t/admin/students"
          LinkElement={Link}
        />
      </div>
    </Section>
  );
};

const TeacherSection = ({
  someTeachers,
  setShowEdit,
  setEditingPerson,
  setShowConfDelTeacher,
}: {
  someTeachers: Array<Teacher>;
  setShowEdit: (value: boolean) => void;
  setEditingPerson: (teacher: Teacher) => void;
  setShowConfDelTeacher: (value: boolean) => void;
}): JSX.Element => {
  const { t } = useTranslation("admin");

  return (
    <Section>
      <div className="layout-grid-cols-3--header">
        <div className="[grid-area:header]">
          <Header
            icon={<MaterialIcon icon="group" allowCustomSize />}
            text={t("teacherList.title")}
          />
        </div>
        <Search
          placeholder={t("teacherList.searchTeachers")}
          className="[grid-area:search]"
        />
      </div>
      <div>
        <TeacherTable
          teachers={someTeachers}
          setShowEdit={setShowEdit}
          setEditingPerson={setEditingPerson}
          setShowConfDelTeacher={setShowConfDelTeacher}
        />
      </div>
      <div className="flex flex-row items-center justify-end gap-2">
        <LinkButton
          type="filled"
          label={t("studentList.action.seeAll")}
          url="/t/admin/teachers"
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
              <Chip
                name={
                  <Trans i18nKey="schedule.gradeItem" ns="admin">
                    M.{{ grade: grade + 1 }}
                  </Trans>
                }
              />
            </a>
          </Link>
        ))}
      </ChipList>
    </Section>
  );
};

const Admin: NextPage<{
  someStudents: Array<Student>;
  someTeachers: Array<Teacher>;
}> = ({ someStudents, someTeachers }) => {
  const { t } = useTranslation(["admin", "common"]);

  // Edit Person dialog
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [editingPerson, setEditingPerson] = useState<Student | Teacher>();

  // Confirm Delete dialogs
  const [showConfDelStudent, setShowConfDelStudent] = useState<boolean>(false);
  const [showConfDelTeacher, setShowConfDelTeacher] = useState<boolean>(false);

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
        <StudentSection
          someStudents={someStudents}
          setShowEdit={setShowEdit}
          setEditingPerson={setEditingPerson}
          setShowConfDelStudent={setShowConfDelStudent}
        />
        <TeacherSection
          someTeachers={someTeachers}
          setShowEdit={setShowEdit}
          setEditingPerson={setEditingPerson}
          setShowConfDelTeacher={setShowConfDelTeacher}
        />
        <ScheduleSection />
      </RegularLayout>
      {/* // FIXME: This should not be here */}
      <EditPersonDialog
        show={showEdit}
        onClose={() => setShowEdit(false)}
        // TODO: Refetch students here ↓
        onSubmit={() => setShowEdit(false)}
        mode="edit"
        person={editingPerson}
      />
      <ConfirmDelete
        show={showConfDelStudent}
        onClose={() => setShowConfDelStudent(false)}
        // TODO: Refetch students here ↓
        onSubmit={() => setShowConfDelStudent(false)}
      />
      <ConfirmDelete
        show={showConfDelTeacher}
        onClose={() => setShowConfDelTeacher(false)}
        // TODO: Refetch students here ↓
        onSubmit={() => setShowConfDelTeacher(false)}
      />
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

  let someStudents: Array<Student> = [];
  let someTeachers: Array<Teacher> = [];

  if (!studentSelectingError && students) {
    someStudents = await Promise.all(
      students.map(async (student) => await db2student(student))
    );
  }

  if (!teacherSelectingError && teachers) {
    someTeachers = await Promise.all(
      teachers.map(async (teacher) => await db2teacher(teacher))
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
    },
  };
};

export default Admin;
