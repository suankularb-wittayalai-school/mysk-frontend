import ConfirmDeleteDialog from "@/components/common/ConfirmDeleteDialog";
import MultilangText from "@/components/common/MultilingualText";
import ClassroomSubjectDialog from "@/components/home/ClassroomSubjectDialog";
import BrandIcon from "@/components/icons/BrandIcon";
import SnackbarContext from "@/contexts/SnackbarContext";
import deleteClassroomSubject from "@/utils/backend/subject/deleteClassroomSubject";
import getClassroomSubjectsOfSubject from "@/utils/backend/subject/getClassroomSubjectsOfSubject";
import getLocaleName from "@/utils/helpers/getLocaleName";
import getLocaleString from "@/utils/helpers/getLocaleString";
import useLocale from "@/utils/helpers/useLocale";
import useRefreshProps from "@/utils/helpers/useRefreshProps";
import useToggle from "@/utils/helpers/useToggle";
import withLoading from "@/utils/helpers/withLoading";
import { StylableFC } from "@/utils/types/common";
import { ClassroomSubject, Subject } from "@/utils/types/subject";
import {
  Actions,
  Button,
  Columns,
  DURATION,
  DataTable,
  DataTableBody,
  DataTableColumnDef,
  DataTableContent,
  DataTableHead,
  DataTablePagination,
  DataTableSearch,
  EASING,
  FullscreenDialog,
  MaterialIcon,
  Progress,
  SegmentedButton,
  Snackbar,
  Text,
  transition,
} from "@suankularb-components/react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import {
  PaginationState,
  SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { AnimatePresence, motion } from "framer-motion";
import useTranslation from "next-translate/useTranslation";
import {
  ForwardedRef,
  forwardRef,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

/**
 * Row actions for a Class this subject is taught to.
 *
 * @param row The Subject List Item.
 */
const ClassRowActions: StylableFC<{
  row: ClassroomSubject;
  onEditOpen: () => void;
  onDeleteOpen: () => void;
}> = ({ row, onEditOpen, onDeleteOpen, style, className }) => {
  const { t } = useTranslation("home/subjectClassesDialog");

  return (
    <SegmentedButton
      alt={t("rowAction.alt")}
      style={style}
      className={className}
    >
      {/* Links */}
      {row.ggc_link && (
        <Button
          appearance="outlined"
          icon={<BrandIcon icon="gg-classroom" />}
          tooltip={t("rowAction.classLink")}
          href={row.ggc_link}
          // eslint-disable-next-line react/display-name
          element={forwardRef((props, ref: ForwardedRef<HTMLAnchorElement>) => (
            <a {...props} ref={ref} target="_blank" rel="noreferrer" />
          ))}
          className="!text-secondary state-layer:!bg-secondary"
        />
      )}
      {row.gg_meet_link && (
        <Button
          appearance="outlined"
          icon={<BrandIcon icon="gg-meet" />}
          tooltip={t("rowAction.meetLink")}
          href={row.gg_meet_link}
          // eslint-disable-next-line react/display-name
          element={forwardRef((props, ref: ForwardedRef<HTMLAnchorElement>) => (
            <a {...props} ref={ref} target="_blank" rel="noreferrer" />
          ))}
          className="!text-secondary state-layer:!bg-secondary"
        />
      )}

      {/* Edit */}
      <Button
        appearance="outlined"
        icon={<MaterialIcon icon="edit" />}
        tooltip={t("rowAction.edit")}
        onClick={onEditOpen}
      />

      {/* Delete */}
      <Button
        appearance="outlined"
        icon={<MaterialIcon icon="delete" />}
        tooltip={t("rowAction.delete")}
        dangerous
        onClick={onDeleteOpen}
      />
    </SegmentedButton>
  );
};

/**
 * Allows the Teacher to view and edit the Classes that they teach this Subject
 * to. Behind the scenes, this is a list of Classroom Subjects connected to
 * this Teacher and this Subject.
 *
 * @param open If the Full-screen Dialog is open and shown.
 * @param onClose The function triggered when the Full-screen Dialog is closed.
 * @param subjectID The ID of the Subject (not to be confused with Subject code).
 */
const SubjectClassesDialog: StylableFC<{
  open?: boolean;
  subject: Pick<Subject, "id" | "code" | "name" | "short_name">;
  onClose: () => void;
}> = ({ open, subject, onClose }) => {
  const locale = useLocale();
  const { t } = useTranslation("home/subjectClassesDialog");

  const { setSnackbar } = useContext(SnackbarContext);
  const refreshProps = useRefreshProps();

  const supabase = useSupabaseClient();

  // Data Table states
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 4,
  });
  const [sorting, setSorting] = useState<SortingState>([
    { id: "class", desc: false },
  ]);
  const [loading, toggleLoading] = useToggle();

  const [data, setData] = useState<ClassroomSubject[] | null>(null);
  useEffect(() => {
    if (!open || data) return;
    withLoading(
      async () => {
        const { data, error } = await getClassroomSubjectsOfSubject(
          supabase,
          subject.id,
        );
        if (error) {
          setSnackbar(<Snackbar>{t("common:snackbar.failure")}</Snackbar>);
          return false;
        }
        setData(data);
        return true;
      },
      toggleLoading,
      { hasEndToggle: true },
    );
  }, [open, data]);

  const columns = useMemo<DataTableColumnDef<ClassroomSubject>[]>(
    () => [
      {
        id: "class",
        accessorFn: (row) =>
          t("common:class", { number: row.classroom.number }),
        header: t("thead.class"),
        thAttr: { className: "w-1/12" },
      },
      {
        id: "classCode",
        accessorFn: (row) => row.ggc_code,
        header: t("thead.classCode"),
        thAttr: { className: "w-1/12" },
        tdAttr: { className: "!font-mono" },
      },
      {
        id: "teachers",
        accessorFn: (row) =>
          row.teachers.map((teacher) => getLocaleName(locale, teacher)),
        header: t("thead.teachers"),
        thAttr: { className: "w-3/12" },
        render: (row) => (
          <ul className="list-disc pl-4">
            {row.teachers.map((teacher) => (
              <li key={teacher.id}>{getLocaleName(locale, teacher)}</li>
            ))}
          </ul>
        ),
      },
      {
        id: "coTeachers",
        accessorFn: (row) =>
          row.co_teachers?.map((teacher) => getLocaleName(locale, teacher)),
        header: t("thead.coTeachers"),
        thAttr: { className: "w-3/12" },
        render: (row) =>
          row.co_teachers ? (
            <ul className="list-disc pl-6">
              {row.co_teachers.map((teacher) => (
                <li key={teacher.id}>{getLocaleName(locale, teacher)}</li>
              ))}
            </ul>
          ) : null,
      },
      {
        id: "classLink",
        accessorFn: (row) => row.ggc_link,
        header: t("thead.classLink"),
        thAttr: { className: "w-2/12" },
        tdAttr: { className: "[&>*]:!py-2" },
        render: (row) => (
          <>
            <Button
              appearance="text"
              icon={
                <MaterialIcon
                  icon="link"
                  className={row.ggc_link ? "!text-primary" : undefined}
                />
              }
              href={row.ggc_link ?? undefined}
              disabled={!row.ggc_link}
            />
            {row.ggc_link && <span>{row.ggc_link.slice(0, 20)}…</span>}
          </>
        ),
      },
      {
        id: "meetLink",
        accessorFn: (row) => row.gg_meet_link,
        header: t("thead.meetLink"),
        thAttr: { className: "w-2/12" },
        tdAttr: { className: "[&>*]:!py-2" },
        render: (row) => (
          <>
            <Button
              appearance="text"
              icon={
                <MaterialIcon
                  icon="link"
                  className={row.gg_meet_link ? "!text-primary" : undefined}
                />
              }
              href={row.gg_meet_link ?? undefined}
              disabled={!row.gg_meet_link}
            />
            {row.gg_meet_link && <span>{row.gg_meet_link.slice(0, 23)}…</span>}
          </>
        ),
      },
    ],
    [],
  );

  // Tanstack Table setup
  const { getHeaderGroups, getRowModel, setPageIndex } = useReactTable({
    data: data || [],
    columns,
    state: { globalFilter, sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // Dialog control
  const [addOpen, setAddOpen] = useState<boolean>(false);
  const [editRow, setEditRow] = useState<ClassroomSubject | null>(null);
  const [deleteID, setDeleteID] = useState<string | null>(null);

  return (
    <>
      <FullscreenDialog
        open={open}
        title={getLocaleString(subject.name, locale)}
        width={640}
        onClose={onClose}
        className="relative [&>:last-child]:sm:!h-[39rem]"
      >
        <Progress
          appearance="linear"
          alt={t("loading")}
          visible={loading}
          className="absolute inset-0 bottom-auto top-16"
        />

        <Columns columns={2}>
          <div>
            <Text type="title-medium">{t("summary.subject")}</Text>
            <MultilangText
              text={{
                th: subject.name.th,
                "en-US": subject.name["en-US"],
              }}
            />
          </div>
          <div>
            <Text type="title-medium">{t("summary.subjectCode")}</Text>
            <MultilangText text={subject.code} />
          </div>
        </Columns>

        <Actions>
          <Button
            appearance="filled"
            icon={<MaterialIcon icon="add" />}
            onClick={() => setAddOpen(true)}
          >
            {t("action.addClass")}
          </Button>
        </Actions>

        <AnimatePresence>
          {data?.length && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={transition(DURATION.short4, EASING.standard)}
            >
              <DataTable
                layout
                className="[&_.skc-data-table-content]:md:!overflow-x-auto"
              >
                <DataTableSearch
                  value={globalFilter}
                  locale={locale}
                  onChange={setGlobalFilter}
                />
                <DataTableContent contentWidth={1080}>
                  <DataTableHead
                    headerGroups={getHeaderGroups()}
                    locale={locale}
                  />
                  <DataTableBody
                    rowModel={getRowModel()}
                    rowActions={(row) => (
                      <ClassRowActions
                        row={row}
                        onEditOpen={() => setEditRow(row)}
                        onDeleteOpen={() => setDeleteID(row.id)}
                      />
                    )}
                  />
                </DataTableContent>
                <DataTablePagination
                  rowsPerPage={pagination.pageSize}
                  totalRows={data.length}
                  locale={locale}
                  onChange={(page) => setPageIndex(page - 1)}
                />
              </DataTable>
            </motion.div>
          )}
        </AnimatePresence>
      </FullscreenDialog>

      {/* Dialogs */}
      <ClassroomSubjectDialog
        open={addOpen}
        subjectID={subject.id}
        onClose={() => setAddOpen(false)}
        onSubmit={() => {
          setAddOpen(false);
          setData(null);
          refreshProps();
        }}
      />
      <ClassroomSubjectDialog
        open={editRow !== null}
        data={editRow || undefined}
        subjectID={subject.id}
        onClose={() => setEditRow(null)}
        onSubmit={() => {
          setEditRow(null);
          setData(null);
          refreshProps();
        }}
      />
      <ConfirmDeleteDialog
        open={deleteID !== null}
        onClose={() => setDeleteID(null)}
        onSubmit={async () => {
          await deleteClassroomSubject(supabase, deleteID!);
          setDeleteID(null);
          setData(null);
          refreshProps();
        }}
      />
    </>
  );
};

export default SubjectClassesDialog;
