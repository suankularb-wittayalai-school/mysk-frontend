// Modules
import type { GetServerSideProps, NextPage } from "next";
import Link from "next/link";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { useState } from "react";

// SK Components
import {
  Button,
  MaterialIcon,
  RegularLayout,
  Search,
  Section,
  Title,
} from "@suankularb-components/react";

// Components
import ConfirmDelete from "@components/dialogs/ConfirmDelete";
import EditPersonDialog from "@components/dialogs/EditPerson";
import TeacherTable from "@components/tables/TeacherTable";

// Types
import { Teacher } from "@utils/types/person";
import Head from "next/head";

// Page
const Teachers: NextPage<{ allTeachers: Array<Teacher> }> = ({
  allTeachers,
}): JSX.Element => {
  const { t } = useTranslation("admin");

  const [showAdd, setShowAdd] = useState<boolean>(false);

  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [editingPerson, setEditingPerson] = useState<Teacher>();

  const [showConfDel, setShowConfDel] = useState<boolean>(false);

  return (
    <>
      {/* Head */}
      <Head>
        <title>
          {t("teacherList.title")}
          {" - "}
          {t("brand.name", { ns: "common" })}
        </title>
      </Head>

      {/* Page */}
      <RegularLayout
        Title={
          <Title
            name={{ title: t("teacherList.title") }}
            pageIcon={<MaterialIcon icon="groups" />}
            backGoesTo="/t/admin"
            LinkElement={Link}
            key="title"
          />
        }
      >
        <Section>
          <div className="layout-grid-cols-3">
            <Search placeholder={t("teacherList.searchTeachers")} />
            <div className="col-span-2 flex flex-row items-end justify-end gap-2">
              <Button
                label={t("teacherList.action.addTeacher")}
                type="filled"
                onClick={() => setShowAdd(true)}
              />
            </div>
          </div>
          <TeacherTable
            teachers={allTeachers}
            setShowEdit={setShowEdit}
            setEditingPerson={setEditingPerson}
            setShowConfDelTeacher={setShowConfDel}
          />
        </Section>
      </RegularLayout>

      {/* Dialogs */}
      <EditPersonDialog
        show={showEdit}
        onClose={() => setShowEdit(false)}
        // TODO: Refetch teachers here ↓
        onSubmit={() => setShowEdit(false)}
        mode="edit"
        person={editingPerson}
      />
      <EditPersonDialog
        show={showAdd}
        onClose={() => setShowAdd(false)}
        // TODO: Refetch teachers here ↓
        onSubmit={() => setShowAdd(false)}
        mode="add"
        userRole="teacher"
      />
      <ConfirmDelete
        show={showConfDel}
        onClose={() => setShowConfDel(false)}
        // TODO: Refetch teachers here ↓
        onSubmit={() => setShowConfDel(false)}
      />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  // (@SiravitPhokeed) Not in the mood to do all the dummybase.
  // Just pretend there are more teachers here.
  const allTeachers: Array<Teacher> = [
    {
      id: 0,
      role: "teacher",
      prefix: "Mr.",
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
      citizen_id: "1234567890123",
      birthdate: "1995-01-01",
      subjectsInCharge: [],
    },
    {
      id: 1,
      role: "teacher",
      prefix: "Mr.",
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
      citizen_id: "1234567890123",
      birthdate: "1995-01-01",
      subjectsInCharge: [],
    },
    {
      id: 2,
      role: "teacher",
      prefix: "Miss.",
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
      birthdate: "1995-01-01",
      citizen_id: "1234567890123",
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
      prefix: "Mr.",
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
      citizen_id: "1234567890123",
      birthdate: "1995-01-01",
    },
  ];

  return {
    props: {
      ...(await serverSideTranslations(locale as string, [
        "common",
        "admin",
        "account",
      ])),
      allTeachers,
    },
  };
};

export default Teachers;
