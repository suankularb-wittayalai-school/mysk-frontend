// Modules
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { useEffect, useMemo, useState } from "react";

import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";

// SK Components
import {
  Actions,
  Button,
  MaterialIcon,
  RegularLayout,
  Search,
  Section,
  Table,
  Title,
} from "@suankularb-components/react";

// Components
import DataTableBody from "@components/data-table/DataTableBody";
import DataTableHeader from "@components/data-table/DataTableHeader";
import ConfirmDelete from "@components/dialogs/ConfirmDelete";
import EditSubjectDialog from "@components/dialogs/EditSubject";
import ImportDataDialog from "@components/dialogs/ImportData";

// Backend
import { db2Subject } from "@utils/backend/database";
import {
  deleteSubject,
  getSubjects,
  importSubjects,
} from "@utils/backend/subject/subject";

// Supabase
import { supabase } from "@utils/supabaseClient";

// Types
import { LangCode } from "@utils/types/common";
import { ImportedSubjectData, Subject } from "@utils/types/subject";
import { SubjectTable as SubjectTableType } from "@utils/types/database/subject";

// Helpers
import { getLocaleYear } from "@utils/helpers/date";
import { getLocaleObj, getLocaleString } from "@utils/helpers/i18n";
import { createTitleStr } from "@utils/helpers/title";

// Hooks
import { useToggle } from "@utils/hooks/toggle";
import { nameJoiner } from "@utils/helpers/name";
import { useInfiniteQuery } from "react-query";
import InfiniteScroll from "react-infinite-scroll-component";

const SubjectTable = ({
  subjects,
  query,
  setEditingIdx,
  toggleShowEdit,
  toggleShowConfDel,
}: {
  subjects: Subject[];
  query?: string;
  setEditingIdx: (id: number) => void;
  toggleShowEdit: () => void;
  toggleShowConfDel: () => void;
}) => {
  const { t } = useTranslation("admin");
  const locale = useRouter().locale as LangCode;

  const [globalFilter, setGlobalFilter] = useState<string>("");
  useEffect(() => setGlobalFilter(query || ""), [query]);

  const {
    status,
    data: tableData,
    error,
    isFetching,
    isFetchingNextPage,
    isFetchingPreviousPage,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
  } = useInfiniteQuery("subjects", getSubjects, {
    getNextPageParam: (lastPage) => {
      if (lastPage.length < 20) return undefined;
      // get current page number from total count and page size
      const currentPage = Math.floor(lastPage.length / 20);
      return currentPage + 1; // next page number
    },
    initialData: {
      pages: [subjects],
      pageParams: [undefined],
    },
  });

  const columns = useMemo(
    () => [
      {
        accessorKey: "code",
        header: t("subjectList.table.code"),
        thClass: "w-2/12",
      },
      {
        accessorKey: "name",
        header: t("subjectList.table.name"),
        thClass: "w-4/12",
        tdClass: "!text-left",
      },
      {
        accessorKey: "teachers",
        header: t("subjectList.table.teachers"),
        thClass: "w-2/12",
        render: (subject: Subject) => (
          <>
            {subject.teachers.length > 0 &&
              nameJoiner(locale, subject.teachers[0].name)}
            {((subject.coTeachers && subject.coTeachers.length > 0) ||
              subject.teachers.length > 1) && (
              <abbr
                className="text-surface-variant"
                title={subject.teachers
                  // Start from the 2nd teacher in teachers
                  .slice(1)
                  // Join with co-teachers
                  .concat(subject.coTeachers || [])
                  // Format the name
                  .map((teacher) => nameJoiner(locale, teacher.name))
                  // Format the list
                  .join(", ")}
              >
                {`+${
                  subject.teachers.length -
                  1 +
                  (subject.coTeachers?.length || 0)
                }`}
              </abbr>
            )}
          </>
        ),
      },
      {
        accessorKey: "year",
        header: t("subjectList.table.year"),
        thClass: "w-1/12",
      },
      {
        accessorKey: "semester",
        header: t("subjectList.table.semester"),
        thClass: "w-1/12",
        enableGlobalFilter: false,
      },
    ],
    []
  );
  // const data = useMemo(
  //   () =>
  //     subjects.map((subject, idx) => ({
  //       idx,
  //       code: getLocaleString(subject.code, locale),
  //       name: getLocaleObj(subject.name, locale).name,
  //       teachers: subject.teachers,
  //       coTeachers: subject.coTeachers,
  //       year: getLocaleYear(locale, subject.year).toString(),
  //       semester: subject.semester,
  //     })),
  //   []
  // );

  const data = useMemo(
    () =>
      tableData
        ? tableData.pages
            .flat()
            .map((subject, idx) => ({
              idx,
              code: getLocaleString(subject.code, locale),
              name: getLocaleObj(subject.name, locale).name,
              teachers: subject.teachers,
              coTeachers: subject.coTeachers,
              year: getLocaleYear(locale, subject.year).toString(),
              semester: subject.semester,
            }))
            .filter((subject) =>
              subject.name.toLowerCase().includes(globalFilter.toLowerCase())
            )
        : [],
    [tableData, globalFilter]
  );

  const { getHeaderGroups, getRowModel } = useReactTable({
    data,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  console.log({ hasNextPage });

  return (
    <InfiniteScroll
      dataLength={data.length}
      next={() => {
        if (hasNextPage) fetchNextPage();
        console.log("next");
      }}
      hasMore={hasNextPage ?? false}
      loader={<div className="text-center">Loading...</div>}
    >
      <Table width={800}>
        <DataTableHeader
          headerGroups={getHeaderGroups()}
          endRow={<th className="w-2/12" />}
        />
        <DataTableBody
          rowModel={getRowModel()}
          endRow={(row) => (
            <td>
              <Actions align="center">
                <Button
                  name={t("studentList.table.action.edit")}
                  type="text"
                  iconOnly
                  icon={<MaterialIcon icon="edit" />}
                  onClick={() => {
                    setEditingIdx(row.idx);
                    toggleShowEdit();
                  }}
                />
                <Button
                  type="text"
                  iconOnly
                  icon={<MaterialIcon icon="delete" />}
                  isDangerous
                  onClick={() => {
                    setEditingIdx(row.idx);
                    toggleShowConfDel();
                  }}
                />
              </Actions>
            </td>
          )}
        />
      </Table>
      {/* {isFetching && <div className="text-center">Loading...</div>}
      {isFetchingNextPage && <div className="text-center">Loading More...</div>} */}
    </InfiniteScroll>
  );
};

const Subjects: NextPage<{ subjects: Subject[] }> = ({ subjects }) => {
  const { t } = useTranslation(["admin", "common"]);
  const router = useRouter();

  const [query, setQuery] = useState<string>("");

  const [showAdd, toggleShowAdd] = useToggle();
  const [showImport, toggleShowImport] = useToggle();
  const [showConfDel, toggleShowConfDel] = useToggle();

  const [showEdit, toggleShowEdit] = useToggle();
  const [editingIdx, setEditingIdx] = useState<number>(-1);

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
            backGoesTo="/admin"
            LinkElement={Link}
          />
        }
      >
        <Section>
          <div className="layout-grid-cols-3">
            <Search
              placeholder={t("subjectList.searchSubjects")}
              onChange={setQuery}
            />
            <div className="flex flex-row items-end justify-end gap-2 md:col-span-2">
              <Button
                label={t("common.action.import")}
                type="outlined"
                icon={<MaterialIcon icon="file_upload" />}
                onClick={toggleShowImport}
              />
              <Button
                label={t("subjectList.action.addSubject")}
                type="filled"
                icon={<MaterialIcon icon="add" />}
                onClick={toggleShowAdd}
              />
            </div>
          </div>
          <div>
            <SubjectTable
              subjects={subjects}
              query={query}
              toggleShowEdit={toggleShowEdit}
              setEditingIdx={setEditingIdx}
              toggleShowConfDel={toggleShowConfDel}
            />
          </div>
        </Section>
      </RegularLayout>

      {/* Dialogs */}
      <ImportDataDialog
        show={showImport}
        onClose={toggleShowImport}
        onSubmit={async (data: ImportedSubjectData[]) => {
          await importSubjects(data);
          toggleShowImport();
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
        onClose={toggleShowAdd}
        onSubmit={() => {
          toggleShowAdd();
          router.replace(router.asPath);
        }}
        mode="add"
      />
      <EditSubjectDialog
        show={showEdit}
        onClose={toggleShowEdit}
        onSubmit={() => {
          toggleShowEdit();
          router.replace(router.asPath);
        }}
        subject={subjects[editingIdx]}
        mode="edit"
      />
      <ConfirmDelete
        show={showConfDel}
        onClose={toggleShowConfDel}
        onSubmit={async () => {
          await deleteSubject(subjects[editingIdx]);
          toggleShowConfDel();
          router.replace(router.asPath);
        }}
      />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  // let subjects: Subject[] = [];

  // const { data, error } = await supabase
  //   .from<SubjectTableType>("subject")
  //   .select("*")
  //   .order("code_th", { ascending: true })
  //   .order("group", { ascending: true })
  //   .order("semester", { ascending: true })
  //   .order("year", { ascending: true });

  // if (error) console.error(error);

  // if (data) {
  //   subjects = await Promise.all(
  //     data.map(async (subject) => await db2Subject(subject))
  //   );
  //   // .sort((a, b) => (a.code.th < b.code.th ? -1 : 1))
  //   // .sort((a, b) => a.semester - b.semester)
  //   // .sort((a, b) => a.year - b.year);
  // }
  const subjects = await getSubjects({
    pageParam: 1,
    pageSize: 20,
    search: "",
  });

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "admin",
        "subjects",
      ])),
      subjects,
    },
  };
};

export default Subjects;
