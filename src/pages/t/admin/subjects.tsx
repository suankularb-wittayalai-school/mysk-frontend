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
  MaterialIcon,
  RegularLayout,
  Search,
  Section,
  Title,
} from "@suankularb-components/react";

// Components
import ConfirmDelete from "@components/dialogs/ConfirmDelete";
import EditSubjectDialog from "@components/dialogs/EditSubject";
import SubjectTable from "@components/tables/SubjectTable";

// Types
import { Subject } from "@utils/types/subject";

const Subjects: NextPage<{ allSubjects: Subject[] }> = ({ allSubjects }) => {
  const { t } = useTranslation(["admin", "common"]);
  const router = useRouter();

  const [showAdd, setShowAdd] = useState<boolean>(false);

  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [editingSubject, setEditingSubject] = useState<Subject>();

  const [showConfDel, setShowConfDel] = useState<boolean>(false);

  function handleDelete() {}

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
          <SubjectTable
            subjects={allSubjects}
            setShowEdit={setShowEdit}
            setEditingSubject={setEditingSubject}
            setShowConfDelSubject={setShowConfDel}
          />
        </Section>
      </RegularLayout>

      {/* Dialogs */}
      <EditSubjectDialog
        show={showAdd}
        onClose={() => setShowAdd(false)}
        onSubmit={() => setShowAdd(false)}
        mode="add"
      />
      <EditSubjectDialog
        show={showEdit}
        onClose={() => setShowEdit(false)}
        onSubmit={() => setShowEdit(false)}
        subject={editingSubject}
        mode="edit"
      />
      <ConfirmDelete
        show={showConfDel}
        onClose={() => setShowConfDel(false)}
        onSubmit={() => handleDelete()}
      />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const allSubjects: Subject[] = [
    {
      id: 1,
      code: {
        "en-US": "MA11234",
        th: "ค11234",
      },
      name: {
        "en-US": { name: "Math" },
        th: { name: "คณุต" },
      },
      teachers: [],
      coTeachers: [],
      subjectGroup: {
        id: 8,
        name: { "en-US": "Mathematics", th: "คณิตศาสตร์" },
      },
      year: 2022,
      semester: 1,
      credit: 3,
      syllabus: "https://www.google.com",
    },
  ];

  return {
    props: {
      ...(await serverSideTranslations(locale as string, ["common", "admin"])),
      allSubjects,
    },
  };
};

export default Subjects;
