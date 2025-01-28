import ReportUploadImageCard from "@/components/report/ReportUploadImageCard";
import getClassroomByNumber from "@/utils/backend/classroom/getClassroomByNumber";
import useMySKClient from "@/utils/backend/mysk/useMySKClient";
import getLocaleString from "@/utils/helpers/getLocaleString";
import useLocale from "@/utils/helpers/useLocale";
import { supabase } from "@/utils/supabase-client";
import { Teacher } from "@/utils/types/person";
import { Report } from "@/utils/types/report";
import {
  Button,
  ChipField,
  ChipSet,
  Columns,
  InputChip,
  MaterialIcon,
  MenuItem,
  Select,
  TextField,
} from "@suankularb-components/react";
import useTranslation from "next-translate/useTranslation";
import SnackbarContext from "@/contexts/SnackbarContext";
import { FC, useContext, useEffect, useState } from "react";
import logError from "@/utils/helpers/logError";
import { Snackbar } from "@suankularb-components/react";
import useRefreshProps from "@/utils/helpers/useRefreshProps";

const ReportInputForm: FC<{
  teacher: Teacher;
  report: Report[];
  newId: any;
}> = ({ teacher, report, newId }) => {
  const locale = useLocale();
  const mysk = useMySKClient();

  const refreshProps = useRefreshProps();
  const { setSnackbar } = useContext(SnackbarContext);

  const hasImage = report.length > 0 ? Boolean(report[0].has_image) : false;
  const [enableEditing, setEnableEditing] = useState<boolean>(
    report.length == 0,
  );
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const [subjectId, setSubjectId] = useState<any>(
    report.length > 0 ? report[0].subject.id : null,
  );
  const [date, setDate] = useState<any>(
    report.length > 0 ? report[0].date : null,
  );
  const [startPeriod, setStartPeriod] = useState<number>(
    report.length > 0 ? report[0].start_time : 1,
  );
  const [duration, setDuration] = useState<number>(
    report.length > 0 ? report[0].duration : 1,
  );
  const [classroom, setClassroom] = useState<string>();
  // report.length > 0 ? report[0].classroom.number.toString() : "",
  const [classrooms, setClassrooms] = useState<string[]>(
    report.length > 0 ? [report[0].classroom.number.toString()] : [],
  );
  const [absentStudents, setAbsentStudents] = useState<any>(
    report.length > 0 ? report[0].absent_student_no : null,
  );
  const [teachingTopic, setTeachingTopic] = useState<any>(
    report.length > 0 ? report[0].teaching_topic : null,
  );
  const [suggestions, setSuggestions] = useState<any>(
    report.length > 0 ? report[0].suggestions : null,
  );
  const [teachingMethod, setTeachingMethod] = useState<String>(
    report.length > 0
      ? report[0].teaching_methods[0] !== "live" && "video" && "assignment"
        ? "other"
        : report[0].teaching_methods[0]
      : "live",
  );

  const [imageData, setImageData] = useState<ArrayBuffer>();
  const [imageType, setImageType] = useState<string>();

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      const target = event.target as HTMLElement;

      if (target instanceof HTMLInputElement && target.type === "number") {
        event.preventDefault();
      }
    };
    document.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      document.removeEventListener("wheel", handleWheel);
    };
  }, []);

  function validateInputs() {
    if (
      date == null ||
      date.length === 0 ||
      classrooms.length == 0 ||
      teachingTopic == null ||
      !imageData
    ) {
      return false;
    } else {
      return true;
    }
  }

  const [otherTeachingMethod, setOtherTeachingMethod] = useState<any>(
    report.length > 0 &&
      teachingMethod == "other" &&
      report[0].teaching_methods[0],
  );

  async function handleCreate() {
    setIsSaving(true)

    let { data: classroomId } = await getClassroomByNumber(
      supabase,
      parseInt(classrooms[0]),
    );

    const { data, error } = await mysk.fetch<{ id: string }>(
      "/v1/subjects/attendance",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: {
            subject_id: subjectId,
            teacherId: teacher.id,
            date,
            start_time: startPeriod,
            duration: duration,
            absent_student_no: absentStudents,
            teaching_topic: teachingTopic,
            suggestions: suggestions,
            teaching_methods: [
              teachingMethod == "other" ? otherTeachingMethod : teachingMethod,
            ],
            classroom_id: classroomId?.id,
          },
        }),
      },
    );

    if (error) {
      setIsSaving(false)
      return logError("handleCreate (form)", error);
    }

    const { error: imageResponseError } = await mysk.fetch(
      `/v1/subjects/attendance/image/${data.id}?data[file_extension]=${imageType}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/octet-stream" },
        body: imageData,
      },
    );

    if (imageResponseError !== null) {
    setIsSaving(false)
      return logError("handleCreate (image)", imageResponseError);
    }

    setSnackbar(<Snackbar>{t("snackbar.success")}</Snackbar>);
    refreshProps();
    setIsSaving(false)
    newId("2")
  }

  async function handleEdit() {
    setIsSaving(true)

    let { data: classroomId } = await getClassroomByNumber(
      supabase,
      parseInt(classrooms[0]),
    );
    const { data, error } = await mysk.fetch(
      `/v1/subjects/attendance/${report[0].id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: {
            subject_id: subjectId,
            teacherId: teacher.id,
            date: date,
            start_time: startPeriod,
            duration: duration,
            absent_student_no: absentStudents,
            teaching_topic: teachingTopic,
            suggestions: suggestions,
            teaching_methods: [
              teachingMethod == "other" ? otherTeachingMethod : teachingMethod,
            ],
            classroom_id: classroomId?.id,
          },
        }),
      },
    );

    window.location.reload();
  }

  const { t } = useTranslation("report");

  return (
    <div className="flex flex-col gap-6">
      <section>
        <Columns columns={2} className="flex-start self-strech flex">
          <Select
            appearance="outlined"
            label={t("forms.classInfo.subject")}
            value={subjectId}
            onChange={setSubjectId}
            className={
              "[&>*]:!bg-surface-container" +
              (!enableEditing
                ? " pointer-events-none select-none !opacity-35"
                : "")
            }
          >
            {teacher.subjects_in_charge.map((subject) => {
              return (
                <MenuItem key={subject.id} value={subject.id}>
                  {getLocaleString(subject.name, locale)}
                </MenuItem>
              );
            })}
          </Select>
          <TextField
            appearance="outlined"
            label={t("forms.classInfo.date")}
            value={date}
            onChange={(date) => setDate(date)}
            inputAttr={{ type: "date", placeholder: "YYYY-MM-DD" }}
            className="[&>*]:!bg-surface-container"
            disabled={!enableEditing}
          />
        </Columns>
      </section>
      <section>
        <Columns columns={2} className="flex-start self-strech flex">
          <Select
            appearance="outlined"
            label={t("forms.classInfo.period.start")}
            value={startPeriod}
            onChange={setStartPeriod}
            className={
              "[&>*]:!bg-surface-container" +
              (!enableEditing
                ? " pointer-events-none select-none !opacity-35"
                : "")
            }
          >
            {[
              { period: 1, startTime: "08:30" },
              { period: 2, startTime: "09:20" },
              { period: 3, startTime: "10:10" },
              { period: 4, startTime: "11:00" },
              { period: 5, startTime: "11:50" },
              { period: 6, startTime: "12:40" },
              { period: 7, startTime: "13:30" },
              { period: 8, startTime: "14:20" },
              { period: 9, startTime: "15:10" },
              { period: 10, startTime: "16:00" },
            ].map((option) => (
              <MenuItem
                key={option.period}
                metadata={option.startTime}
                value={option.period}
                className="[&>.skc-menu-item\_\_metadata]:!font-mono"
              >
                {t("forms.classInfo.period.option", { count: option.period })}
              </MenuItem>
            ))}
          </Select>
          <Select
            appearance="outlined"
            label={t("forms.classInfo.period.end")}
            value={startPeriod - 1 + duration}
            onChange={(endPeriod) => setDuration(endPeriod - startPeriod + 1)}
            className={
              "[&>*]:!bg-surface-container" +
              (!enableEditing
                ? " pointer-events-none select-none !opacity-35"
                : "")
            }
          >
            {[
              { period: 1, startTime: "9.20" },
              { period: 2, startTime: "10.10" },
              { period: 3, startTime: "11.00" },
              { period: 4, startTime: "11.50" },
              { period: 5, startTime: "12.40" },
              { period: 6, startTime: "13.30" },
              { period: 7, startTime: "14.20" },
              { period: 8, startTime: "15.10" },
              { period: 9, startTime: "16.00" },
              { period: 10, startTime: "16.50" },
            ].map((option) => (
              <MenuItem
                key={option.period}
                metadata={option.startTime}
                value={option.period}
              >
                {t("forms.classInfo.period.option", { count: option.period })}
              </MenuItem>
            ))}
          </Select>
        </Columns>
      </section>
      <section>
        <Columns columns={2} className="flex-start self-strech flex">
          <ChipField
            label={t("forms.classInfo.classroom.title")}
            onChange={setClassroom}
            value={classroom}
            onNewEntry={(classroom) => setClassrooms([classroom])}
            onDeleteLast={() => setClassrooms(classrooms.slice(0, -1))}
            inputAttr={{ type: "number", id: "classroom" }}
            helperMsg={t("forms.classInfo.classroom.helper")}
            disabled={!enableEditing}
            className={
              "[&>*]:!bg-surface-container" +
              (!enableEditing
                ? " pointer-events-none select-none !opacity-35"
                : "")
            }
          >
            <ChipSet>
              {classrooms.map((classroom) => (
                <InputChip
                  key={classroom}
                  onDelete={() =>
                    setClassrooms(
                      classrooms.filter((item) => classroom !== item),
                    )
                  }
                >
                  {classroom}
                </InputChip>
              ))}
            </ChipSet>
          </ChipField>
          <TextField
            appearance="outlined"
            label={t("forms.classInfo.absent")}
            value={absentStudents}
            onChange={(text) => setAbsentStudents(text)}
            className="[&>*]:!bg-surface-container"
            disabled={!enableEditing}
          />
        </Columns>
      </section>
      <section>
        <div className="flex flex-col gap-3">
          <span className="py-2 font-display text-base font-medium">
            {t("forms.teachInfo.title")}
          </span>
          <Columns columns={2} className="flex-start self-strech flex">
            <TextField
              appearance="outlined"
              label={t("forms.teachInfo.content")}
              value={teachingTopic}
              onChange={(topic) => setTeachingTopic(topic)}
              className="w-full [&>*]:!bg-surface-container"
              disabled={!enableEditing}
            />
            <TextField
              appearance="outlined"
              label={t("forms.teachInfo.suggestions")}
              value={suggestions}
              onChange={(text) => setSuggestions(text)}
              className="w-full [&>*]:!bg-surface-container"
              disabled={!enableEditing}
            />
          </Columns>
        </div>
      </section>
      <section>
        <div className="flex flex-col gap-3">
          <span className="py-2 font-display text-base font-medium">
            {t("forms.method.title")}
          </span>
          <Columns columns={2} className="flex-start self-strech flex">
            <Select
              appearance="outlined"
              label={t("forms.method.options.title")}
              value={teachingMethod}
              onChange={setTeachingMethod}
              className={
                "!w-full [&>*]:!bg-surface-container" +
                (!enableEditing
                  ? " pointer-events-none select-none !opacity-35"
                  : "")
              }
            >
              {[
                {
                  title: t("forms.method.options.live"),
                  value: "live",
                },
                {
                  title: t("forms.method.options.video"),
                  value: "video",
                },
                {
                  title: t("forms.method.options.assignment"),
                  value: "assignment",
                },
                {
                  title: t("forms.method.options.other"),
                  value: "other",
                },
              ].map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.title}
                </MenuItem>
              ))}
            </Select>
            {teachingMethod == "other" && (
              <TextField
                appearance="outlined"
                label="ระบุ"
                className={"w-full [&>*]:!bg-surface-container"}
                value={otherTeachingMethod}
                onChange={setOtherTeachingMethod}
                disabled={!enableEditing}
              />
            )}
          </Columns>
        </div>
      </section>
      <section>
        <ReportUploadImageCard
          data={(result) => {
            if (result instanceof ArrayBuffer) {
              setImageData(result);
            }
          }}
          type={setImageType}
          alreadyHaveImage={hasImage}
          reportId={report.length > 0 ? report[0].id : undefined}
        />
      </section>
      <div className="self-strech flex flex-col items-end gap-2.5">
        {report.length == 0 ? (
          <Button
            appearance="filled"
            onClick={() => handleCreate()}
            icon={<MaterialIcon icon="save" />}
            disabled={!validateInputs()}
            loading={isSaving}
          >
            {t("action.submit")}
          </Button>
        ) : !enableEditing ? (
          <Button
            appearance="filled"
            onClick={() => setEnableEditing(true)}
            icon={<MaterialIcon icon="edit" />}
            loading={isSaving}
          >
            {t("action.edit")}
          </Button>
        ) : (
          <Button
            appearance="filled"
            onClick={() => handleEdit()}
            icon={<MaterialIcon icon="save" />}
            loading={isSaving}
          >
            {t("action.save")}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ReportInputForm;
