// Externa libraries
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
import { useTranslation } from "next-i18next";
import {
  FC,
  forwardRef,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

// SK Components
import {
  Actions,
  Button,
  Columns,
  DataTable,
  DataTableBody,
  DataTableColumnDef,
  DataTableContent,
  DataTableHead,
  DataTablePagination,
  DataTableSearch,
  FullscreenDialog,
  MaterialIcon,
  Progress,
  SegmentedButton,
  Snackbar,
  transition,
  useAnimationConfig,
} from "@suankularb-components/react";

// Internal components
import ConfirmDeleteDialog from "@/components/common/ConfirmDeleteDialog";
import MultilangText from "@/components/common/MultilingualText";
import BrandIcon from "@/components/icons/BrandIcon";
import RoomSubjectDialog from "@/components/subject/RoomSubjectDialog";

// Contexts
import SnackbarContext from "@/contexts/SnackbarContext";

// Backend
import {
  deleteRoomSubject,
  getTeachingSubjectClasses,
} from "@/utils/backend/subject/roomSubject";

// Helpers
import { getLocaleObj } from "@/utils/helpers/i18n";
import { withLoading } from "@/utils/helpers/loading";
import { getLocaleName } from "@/utils/helpers/string";

// Hooks
import { useLocale } from "@/utils/hooks/i18n";
import { useToggle } from "@/utils/hooks/toggle";
import { useRefreshProps } from "@/utils/hooks/routing";

// Types
import { DialogComponent } from "@/utils/types/common";
import { SubjectListItem, SubjectWNameAndCode } from "@/utils/types/subject";

/**
 * Row actions for a Class this subject is taught to.
 *
 * @param row The Subject List Item.
 *
 * @returns
 */
const ClassRowActions: FC<{
  row: SubjectListItem;
  onEditOpen: () => void;
  onDeleteOpen: () => void;
}> = ({ row, onEditOpen, onDeleteOpen }) => {
  const { t } = useTranslation("teach", {
    keyPrefix: "dialog.subjectClasses.rowAction",
  });

  return (
    <SegmentedButton alt="Row actions">
      {/* Edit */}
      {row.ggcLink && (
        <Button
          appearance="outlined"
          icon={<BrandIcon icon="gg-classroom" />}
          tooltip={t("classLink")}
          href={row.ggcLink}
          // eslint-disable-next-line react/display-name
          element={forwardRef((props, ref) => (
            <a {...props} ref={ref} target="_blank" rel="noreferrer" />
          ))}
          className="!text-secondary state-layer:!bg-secondary"
        />
      )}
      {row.ggMeetLink && (
        <Button
          appearance="outlined"
          icon={<BrandIcon icon="gg-meet" />}
          tooltip={t("meetLink")}
          href={row.ggMeetLink}
          // eslint-disable-next-line react/display-name
          element={forwardRef((props, ref) => (
            <a {...props} ref={ref} target="_blank" rel="noreferrer" />
          ))}
          className="!text-secondary state-layer:!bg-secondary"
        />
      )}

      {/* Edit */}
      <Button
        appearance="outlined"
        icon={<MaterialIcon icon="edit" />}
        tooltip={t("edit")}
        onClick={onEditOpen}
      />

      {/* Delete */}
      <Button
        appearance="outlined"
        icon={<MaterialIcon icon="delete" />}
        tooltip={t("delete")}
        dangerous
        onClick={onDeleteOpen}
      />
    </SegmentedButton>
  );
};

/**
 * Allows the Teacher to view and edit the Classes that they teach this Subject
 * to. Behind the scenes, this is a list of Room Subjects connected to this
 * Teacher and this Subject.
 *
 * @param open If the Full-screen Dialog is open and shown.
 * @param onClose The function triggered when the Full-screen Dialog is closed.
 * @param subjectID The ID of the Subject (not to be confused with Subject code).
 *
 * @returns A Full-screen Dialog.
 */
const SubjectClassesDialog: DialogComponent<{
  subject: SubjectWNameAndCode;
}> = ({ open, onClose, subject }) => {
  const locale = useLocale();
  const { t } = useTranslation("teach", { keyPrefix: "dialog.subjectClasses" });
  const { t: tx } = useTranslation("common");

  const { duration, easing } = useAnimationConfig();
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

  const [data, setData] = useState<SubjectListItem[] | null>(null);
  useEffect(() => {
    if (!open || data) return;
    withLoading(
      async () => {
        const { data, error } = await getTeachingSubjectClasses(
          supabase,
          subject.id
        );
        if (error) {
          setSnackbar(<Snackbar>{tx("snackbar.failure")}</Snackbar>);
          return false;
        }
        setData(data);
        return true;
      },
      toggleLoading,
      { hasEndToggle: true }
    );
  }, [open, data]);

  const columns = useMemo<DataTableColumnDef<SubjectListItem>[]>(
    () => [
      {
        id: "class",
        accessorFn: (row) => tx("class", { number: row.classroom.number }),
        header: t("thead.class"),
        thAttr: { className: "w-1/12" },
      },
      {
        id: "classCode",
        accessorFn: (row) => row.ggcCode,
        header: t("thead.classCode"),
        thAttr: { className: "w-1/12" },
        tdAttr: { className: "!font-mono" },
      },
      {
        id: "teachers",
        accessorFn: (row) =>
          row.teachers.map((teacher) => getLocaleName(locale, teacher.name)),
        header: t("thead.teachers"),
        thAttr: { className: "w-3/12" },
        render: (row) => (
          <ul className="list-disc pl-4">
            {row.teachers.map((teacher) => (
              <li key={teacher.id}>{getLocaleName(locale, teacher.name)}</li>
            ))}
          </ul>
        ),
      },
      {
        id: "coTeachers",
        accessorFn: (row) =>
          row.coTeachers?.map((teacher) => getLocaleName(locale, teacher.name)),
        header: t("thead.coTeachers"),
        thAttr: { className: "w-3/12" },
        render: (row) =>
          row.coTeachers ? (
            <ul className="list-disc pl-6">
              {row.coTeachers.map((teacher) => (
                <li key={teacher.id}>{getLocaleName(locale, teacher.name)}</li>
              ))}
            </ul>
          ) : null,
      },
      {
        id: "classLink",
        accessorFn: (row) => row.ggcLink,
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
                  className={row.ggcLink ? "!text-primary" : undefined}
                />
              }
              href={row.ggcLink}
              disabled={!row.ggcLink}
            />
            {row.ggcLink && <span>{row.ggcLink.slice(0, 20)}…</span>}
          </>
        ),
      },
      {
        id: "meetLink",
        accessorFn: (row) => row.ggMeetLink,
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
                  className={row.ggMeetLink ? "!text-primary" : undefined}
                />
              }
              href={row.ggMeetLink}
              disabled={!row.ggMeetLink}
            />
            {row.ggMeetLink && <span>{row.ggMeetLink.slice(0, 23)}…</span>}
          </>
        ),
      },
    ],
    []
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
  const [editRow, setEditRow] = useState<SubjectListItem | null>(null);
  const [deleteID, setDeleteID] = useState<number | null>(null);

  return (
    <>
      <FullscreenDialog
        open={open}
        title={getLocaleObj(subject.name, locale).name}
        // TODO: Remove this when `action` is optional.
        action={null as any}
        width={640}
        onClose={onClose}
        className="skc-body-medium relative
          [&_.skc-fullscreen-dialog\_\_content]:sm:!h-[39rem]"
      >
        <Progress
          appearance="linear"
          alt={t("loading")}
          visible={loading}
          className="absolute inset-0 bottom-auto top-16"
        />

        <Columns columns={2}>
          <div>
            <h3 className="skc-title-medium">{t("summary.subject")}</h3>
            <MultilangText
              text={{
                th: subject.name.th.name,
                "en-US": subject.name["en-US"]?.name,
              }}
            />
          </div>
          <div>
            <h3 className="skc-title-medium">{t("summary.subjectCode")}</h3>
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
              transition={transition(duration.short4, easing.standard)}
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
      <RoomSubjectDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={() => {
          setAddOpen(false);
          setData(null);
          refreshProps();
        }}
        subject={subject}
      />
      <RoomSubjectDialog
        open={editRow !== null}
        onClose={() => setEditRow(null)}
        onSubmit={() => {
          setEditRow(null);
          setData(null);
          refreshProps();
        }}
        data={editRow || undefined}
        subject={subject}
      />
      <ConfirmDeleteDialog
        open={deleteID !== null}
        onClose={() => setDeleteID(null)}
        onSubmit={async () => {
          await deleteRoomSubject(supabase, deleteID!);
          setDeleteID(null);
          setData(null);
          refreshProps();
        }}
      />
    </>
  );
};

export default SubjectClassesDialog;
