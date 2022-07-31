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
import ImportDataDialog from "@components/dialogs/ImportData";
import SubjectTable from "@components/tables/SubjectTable";

// Backend
import { db2Subject } from "@utils/backend/database";
import { createSubject } from "@utils/backend/subject/subject";

// Supabase
import { supabase } from "@utils/supabaseClient";

// Types
import { Subject } from "@utils/types/subject";
import { SubjectTable as SubjectTableType } from "@utils/types/database/subject";

// Helpers
import { createTitleStr } from "@utils/helpers/title";

// Hooks
import { useSession } from "@utils/hooks/auth";

interface ImportedSubject {
  name_th: string;
  name_en: string;
  short_name_th?: string;
  short_name_en?: string;
  code_th: string;
  code_en: string;
  type:
    | "รายวิชาพื้นฐาน"
    | "รายวิชาเพิ่มเติม"
    | "รายวิชาเลือก"
    | "กิจกรรมพัฒนาผู้เรียน";
  group:
    | "วิทยาศาสตร์"
    | "คณิตศาสตร์"
    | "ภาษาต่างประเทศ"
    | "ภาษาไทย"
    | "สุขศึกษาและพลศึกษา"
    | "การงานอาชีพและเทคโนโลยี"
    | "ศิลปะ"
    | "สังคมศึกษา ศาสนา และวัฒนธรรม"
    | "การศึกษาค้นคว้าด้วยตนเอง";
  credit: number;
  description_th?: string;
  description_en?: string;
  year: number;
  semester: 1 | 2;
}

const subjectGroupMap = {
  วิทยาศาสตร์: 1,
  คณิตศาสตร์: 2,
  ภาษาต่างประเทศ: 3,
  ภาษาไทย: 4,
  สุขศึกษาและพลศึกษา: 5,
  การงานอาชีพและเทคโนโลยี: 6,
  ศิลปะ: 7,
  "สังคมศึกษา ศาสนา และวัฒนธรรม": 8,
  การศึกษาค้นคว้าด้วยตนเอง: 9,
} as const;

const subjectTypeMap = {
  รายวิชาพื้นฐาน: "Core Courses",
  รายวิชาเพิ่มเติม: "Additional Courses",
  รายวิชาเลือก: "Elective Courses",
  กิจกรรมพัฒนาผู้เรียน: "Learner’s Development Activities",
} as const;

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
      const { data: syllabus, error: syllabusError } = await supabase.storage
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

  async function handleImport(data: ImportedSubject[]) {
    const subjects: Subject[] = data.map((subject) => ({
      id: 0,
      code: {
        th: subject.code_th,
        "en-US": subject.code_en,
      },
      name: {
        th: {
          name: subject.name_th,
          shortName: subject.short_name_th,
        },
        "en-US": {
          name: subject.name_en,
          shortName: subject.short_name_en,
        },
      },
      type: {
        th: subject.type,
        "en-US": subjectTypeMap[subject.type],
      },
      subjectGroup: {
        id: subjectGroupMap[subject.group],
        name: {
          th: subject.group,
          "en-US": subject.group,
        },
      },
      credit: subject.credit,
      description: {
        th: subject.description_th ? subject.description_th : "",
        "en-US": subject.description_en ? subject.description_en : "",
      },
      year: subject.year,
      semester: subject.semester,
      syllabus: null,
      teachers: [],
    }));

    await Promise.all(
      subjects.map(async (subject) => await createSubject(subject))
    );
  }

  return (
    <>
      {/* Head */}
      <Head>
        <title>{createTitleStr(t("subjectList.title"), t)}</title>
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
        onSubmit={(e: ImportedSubject[]) => {
          handleImport(e).then(() => {
            setShowImport(false);
            router.replace(router.asPath);
          });
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
          { name: "group", type: '"วิทยาศาสตร์" | "คณิตศาสตร์" | "ภาษาต่างประเทศ" | "ภาษาไทย" | "สุขศึกษาและพลศึกษา" | "การงานอาชีพและเทคโนโลยี" | "ศิลปะ" | "สังคมศึกษา ศาสนา และวัฒนธรรม" | "การศึกษาค้นคว้าด้วยตนเอง"' },
          { name: "credit", type: "numeric" },
          { name: "description_th", type: "text", optional: true },
          { name: "description_en", type: "text", optional: true },
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
