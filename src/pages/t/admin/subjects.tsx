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
import { supabase } from "@utils/supabaseClient";
import {
  SubjectDB,
  SubjectTable as SubjectTableType,
} from "@utils/types/database/subject";
import { db2Subject } from "@utils/backend/database";

const Subjects: NextPage<{ allSubjects: Subject[] }> = ({ allSubjects }) => {
  const { t } = useTranslation(["admin", "common"]);
  const router = useRouter();

  const [showAdd, setShowAdd] = useState<boolean>(false);

  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [editingSubject, setEditingSubject] = useState<Subject>();

  const [showConfDel, setShowConfDel] = useState<boolean>(false);

  async function handleDelete() {
    // console.log(editingSubject);
    // delete the syllabus if it exists
    if (editingSubject?.syllabus) {
      const {
        data: syllabus,
        error: syllabusError,
      } = await supabase.storage
        .from("syllabus")
        .remove([editingSubject.syllabus.toString()]);
      if (syllabusError) {
        console.error(syllabusError);
      }
    }
    // delete the subject
    const { data, error } = await supabase
      .from("subject")
      .delete()
      .match({ id: editingSubject?.id });
    if (error) {
      console.error(error);
    }
    setShowConfDel(false);
    router.replace(router.asPath);
  }

  return (
    <>
      {/* Head */}
      <Head>
        <title>
          {t("subjectList.title")}
          {" - "}
          {t("brand.name", { ns: "common" })}
        </title>
      </Head>

      {/* Page */}
      <RegularLayout
        Title={
          <Title
            name={{ title: t("subjectList.title") }}
            pageIcon={<MaterialIcon icon="groups" />}
            backGoesTo="/t/admin"
            LinkElement={Link}
            key="title"
          />
        }
      >
        <Section>
          <div className="layout-grid-cols-3">
            <Search placeholder={t("subjectList.searchSubjects")} />
            <div className="col-span-2 flex flex-row items-end justify-end gap-2">
              <Button
                label={t("subjectList.action.addSubject")}
                type="filled"
                onClick={() => setShowAdd(true)}
              />
            </div>
          </div>
          <div>
            <SubjectTable
              subjects={allSubjects}
              setShowEdit={setShowEdit}
              setEditingSubject={setEditingSubject}
              setShowConfDelSubject={setShowConfDel}
            />
          </div>
        </Section>
      </RegularLayout>

      {/* Dialogs */}
      <EditSubjectDialog
        show={showAdd}
        onClose={() => setShowAdd(false)}
        onSubmit={() => {
          setShowAdd(false);
          router.replace(router.asPath);
        }}
        mode="add"
      />
      <EditSubjectDialog
        show={showEdit}
        onClose={() => setShowEdit(false)}
        onSubmit={() => {
          setShowEdit(false);
          router.replace(router.asPath);
        }}
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
  const { data: subjects, error: subjectSelectingError } = await supabase
    .from<SubjectTableType>("subject")
    .select("*");

  if (subjectSelectingError) {
    console.error(subjectSelectingError);
  }
  if (!subjects) {
    return {
      props: {
        allSubjects: [],
      },
    };
  }

  const allSubjects: Subject[] = await Promise.all(
    subjects.map(async (subject) => await db2Subject(subject))
  );

  return {
    props: {
      ...(await serverSideTranslations(locale as string, [
        "common",
        "admin",
        "subjects",
      ])),
      allSubjects,
    },
  };
};

export default Subjects;
