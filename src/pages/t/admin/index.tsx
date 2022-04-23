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
  const someStudents: Array<Student> = [
    {
      id: 985,
      prefix: "master",
      role: "student",
      name: {
        th: {
          firstName: "ธนา",
          lastName: "สัจจะธนาพร",
        },
      },
      studentID: "58268",
      class: {
        id: 101,
        name: {
          "en-US": "M.101",
          th: "ม.101",
        },
      },
      classNo: 1,
    },
    {
      id: 986,
      prefix: "master",
      role: "student",
      name: {
        th: {
          firstName: "กวินภพ",
          lastName: "ดิษสุนรัตน์",
        },
      },
      studentID: "58269",
      class: {
        id: 101,
        name: {
          "en-US": "M.101",
          th: "ม.101",
        },
      },
      classNo: 2,
    },
    {
      id: 987,
      prefix: "master",
      role: "student",
      name: {
        th: {
          firstName: "ณฐกร",
          lastName: "ศรีปรางค์",
        },
      },
      studentID: "58270",
      class: {
        id: 101,
        name: {
          "en-US": "M.101",
          th: "ม.101",
        },
      },
      classNo: 3,
    },
    {
      id: 988,
      prefix: "master",
      role: "student",
      name: {
        th: {
          firstName: "เจตนิพิฐ",
          lastName: "เลาหเรืองรองกุล",
        },
      },
      studentID: "58271",
      class: {
        id: 101,
        name: {
          "en-US": "M.101",
          th: "ม.101",
        },
      },
      classNo: 4,
    },
    {
      id: 988,
      prefix: "master",
      role: "student",
      name: {
        th: {
          firstName: "พิริยกร",
          lastName: "เจริญธรรมรักษา",
        },
      },
      studentID: "58272",
      class: {
        id: 101,
        name: {
          "en-US": "M.101",
          th: "ม.101",
        },
      },
      classNo: 5,
    },
  ];
  const someTeachers: Array<Teacher> = [
    {
      id: 0,
      role: "teacher",
      prefix: "mister",
      name: {
        "en-US": {
          firstName: "Taradol",
          lastName: "Ranarintr",
        },
        th: {
          firstName: "ธราดล",
          lastName: "รานรินทร์",
        },
      },
      profile: "/images/dummybase/taradol.webp",
      teacherID: "skt551",
      classAdvisorAt: {
        id: 405,
        name: {
          "en-US": "M.405",
          th: "ม.405",
        },
      },
      subjectsInCharge: [],
    },
    {
      id: 1,
      role: "teacher",
      prefix: "mister",
      name: {
        "en-US": {
          firstName: "Thanakorn",
          lastName: "Atjanawat",
        },
        th: {
          firstName: "ธนกร",
          lastName: "อรรจนาวัฒน์",
        },
      },
      profile: "/images/dummybase/thanakorn.webp",
      teacherID: "skt416",
      classAdvisorAt: {
        id: 404,
        name: {
          "en-US": "M.404",
          th: "ม.404",
        },
      },
      subjectsInCharge: [],
    },
    {
      id: 2,
      role: "teacher",
      prefix: "missus",
      name: {
        "en-US": {
          firstName: "Mattana",
          lastName: "Tatanyang",
        },
        th: {
          firstName: "มัทนา",
          lastName: "ต๊ะตันยาง",
        },
      },
      profile: "/images/dummybase/mattana.webp",
      teacherID: "skt196",
      classAdvisorAt: {
        id: 405,
        name: {
          "en-US": "M.405",
          th: "ม.405",
        },
      },
      subjectsInCharge: [],
    },
    {
      id: 3,
      role: "teacher",
      prefix: "mister",
      name: {
        "en-US": {
          firstName: "John",
          middleName: "Peter",
          lastName: "Smith",
        },
        th: {
          firstName: "จอห์น",
          middleName: "ปีเตอร์",
          lastName: "สมิธ",
        },
      },
      teacherID: "skt8966",
      subjectsInCharge: [],
    },
  ];

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
