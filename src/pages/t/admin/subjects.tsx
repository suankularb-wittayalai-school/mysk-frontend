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

// Backend
import { db2Subject } from "@utils/backend/database";

// Supabase
import { supabase } from "@utils/supabaseClient";

// Types
import { Subject } from "@utils/types/subject";
import ImportDataDialog from "@components/dialogs/ImportData";
import {
  SubjectDB,
  SubjectTable as SubjectTableType,
} from "@utils/types/database/subject";

// Hooks
import { useSession } from "@utils/hooks/auth";

const Subjects: NextPage<{ allSubjects: Subject[] }> = ({ allSubjects }) => {
  const { t } = useTranslation(["admin", "common"]);
  const router = useRouter();

  const [showAdd, setShowAdd] = useState<boolean>(false);
  const [showImport, setShowImport] = useState<boolean>(false);
  const [showConfDel, setShowConfDel] = useState<boolean>(false);

  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [editingSubject, setEditingSubject] = useState<Subject>();

  const session = useSession({ loginRequired: true, adminOnly: true });

  async function handleDelete() {
    // Delete the syllabus if it exists
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
    // Delete the subject
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
            pageIcon={<MaterialIcon icon="school" />}
            backGoesTo="/t/admin"
            LinkElement={Link}
            key="title"
          />
        }
      >
        <Section>
          <div className="layout-grid-cols-3">
            <Search placeholder={t("subjectList.searchSubjects")} />
            <div className="flex flex-row items-end justify-end gap-2 md:col-span-2">
              <Button
                label={t("common.action.import")}
                type="outlined"
                icon={<MaterialIcon icon="file_upload" />}
                onClick={() => setShowImport(true)}
              />
              <Button
                label={t("subjectList.action.addSubject")}
                type="filled"
                icon={<MaterialIcon icon="add" />}
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
      <ImportDataDialog
        show={showImport}
        onClose={() => setShowImport(false)}
        onSubmit={() => {
          setShowImport(false);
          router.replace(router.asPath);
        }}
        // prettier-ignore
        columns={[
          { name: "name_th", type: "text" },
          { name: "name_en", type: "text" },
          { name: "short_name_th", type: "text", optional: true },
          { name: "short_name_en", type: "text", optional: true },
          { name: "code_th", type: "text" },
          { name: "code_en", type: "text" },
          { name: "type", type: '"รายวิชาพื้นฐาน" | "รายวิชาเพิ่มเติม" | "รายวิชาเลือก" | "กิจกรรมพัฒนาผู้เรียน"' },
          { name: "credit", type: "numeric" },
          { name: "description_th", type: "numeric", optional: true },
          { name: "description_en", type: "numeric", optional: true },
          { name: "year", type: "number (in AD)" },
          { name: "semester", type: "1 | 2" },
        ]}
      />
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
  let allSubjects: Subject[] = [];

  const { data: subjects, error: subjectSelectingError } = await supabase
    .from<SubjectTableType>("subject")
    .select("*");

  if (subjectSelectingError) {
    console.error(subjectSelectingError);
  }

  if (subjects) {
    allSubjects = await Promise.all(
      subjects.map(async (subject) => await db2Subject(subject))
    );
  }

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
