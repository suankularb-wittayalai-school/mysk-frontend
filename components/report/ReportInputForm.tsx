import ReportUploadImageCard from "@/components/report/ReportUploadImageCard";
import getClassroomByNumber from "@/utils/backend/classroom/getClassroomByNumber";
import useMySKClient from "@/utils/backend/mysk/useMySKClient";
import getLocaleString from "@/utils/helpers/getLocaleString";
import useLocale from "@/utils/helpers/useLocale";
import { supabase } from "@/utils/supabase-client";
import { Teacher } from "@/utils/types/person";
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
import { FC, useState } from "react";
import { Report } from "@/utils/types/report";

const ReportInputForm: FC<{
  teacher: Teacher;
  report: Report[];
}> = ({ teacher, report }) => {
  console.log(report, "the rerpot");
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
      : "Live Course",
  );

  const [otherTeachingMethod, setOtherTeachingMethod] = useState<any>(
    teachingMethod == "other" && report[0].teaching_methods[0],
  );
  const locale = useLocale();
  const mysk = useMySKClient();
  console.log(date, "where is it");

  async function handleCreate() {
    let { data: classroomId } = await getClassroomByNumber(
      supabase,
      parseInt(classrooms[0]),
    );

    const { data: report, error } = await mysk.fetch(
      "/v1/subjects/attendance",
      {
        method: "POST",
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

  async function handleEdit() {
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

  return (
    <div className="flex flex-col gap-6">
      <section>
        <Columns columns={2} className="flex-start self-strech flex">
          <Select
            appearance="outlined"
            label={"วิชา"}
            value={subjectId}
            onChange={setSubjectId}
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
            label={"วันที่"}
            value={date}
            onChange={(date) => setDate(date)}
            inputAttr={{ type: "date", placeholder: "YYYY-MM-DD" }}
          />
        </Columns>
      </section>
      <section>
        <Columns columns={2} className="flex-start self-strech flex">
          <Select
            appearance="outlined"
            label="เริ่มคาบที่"
            value={startPeriod}
            onChange={setStartPeriod}
            className="[&>*]:!bg-surface-container"
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
                Period {option.period}
              </MenuItem>
            ))}
          </Select>
          <Select
            appearance="outlined"
            label="จบคาบที่"
            value={startPeriod - 1 + duration}
            onChange={(endPeriod) => setDuration(endPeriod - startPeriod + 1)}
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
                Period {option.period}
              </MenuItem>
            ))}
          </Select>
        </Columns>
      </section>
      <section>
        <Columns columns={2} className="flex-start self-strech flex">
          <ChipField
            label={"ห้องเรียน"}
            onChange={setClassroom}
            value={classroom}
            onNewEntry={(classroom) =>
              setClassrooms([...classrooms, classroom])
            }
            onDeleteLast={() => setClassrooms(classrooms.slice(0, -1))}
            className="[&>*]:!bg-surface-container"
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
            label={"เลขที่ นักเรียนขาด"}
            value={absentStudents}
            onChange={(text) => setAbsentStudents(text)}
            className="[&>*]:!bg-surface-container"
          />
        </Columns>
      </section>
      <section>
        <div className="flex flex-col gap-3">
          <span className="py-2 font-display text-base font-medium">
            ข้อมูลการสอน
          </span>
          <Columns columns={2} className="flex-start self-strech flex">
            <TextField
              appearance="outlined"
              label={"เนื้อหาการเรียนการสอน"}
              value={teachingTopic}
              onChange={(topic) => setTeachingTopic(topic)}
              className="w-full [&>*]:!bg-surface-container"
            />
            <TextField
              appearance="outlined"
              label={"ปัญหา และ ข้อแนะนำ"}
              value={suggestions}
              onChange={(text) => setSuggestions(text)}
              className="w-full [&>*]:!bg-surface-container"
            />
          </Columns>
        </div>
      </section>
      <section>
        <div className="flex flex-col gap-3">
          <span className="py-2 font-display text-base font-medium">
            รูปแบบการสอน
          </span>
          <Columns columns={2} className="flex-start self-strech flex">
            <Select
              appearance="outlined"
              label="รูปแบบการสอน"
              className="!w-full [&>*]:!bg-surface-container"
              value={teachingMethod}
              onChange={setTeachingMethod}
            >
              {[
                {
                  title: "สอนสด",
                  value: "live",
                },
                {
                  title: "วิดีโอ",
                  value: "video",
                },
                {
                  title: "สั่งงานในคาบ",
                  value: "assignment",
                },
                {
                  title: "อื่นๆ",
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
              />
            )}
          </Columns>
        </div>
      </section>
      <section>
        <ReportUploadImageCard />
      </section>
      <div className="self-strech flex flex-col items-end gap-2.5">
        {report.length == 0 ? (
          <Button
            appearance="filled"
            onClick={() => handleCreate()}
            icon={<MaterialIcon icon="save" />}
          >
            บันทึก
          </Button>
        ) : (
          <Button
            appearance="filled"
            onClick={() => handleCreate()}
            icon={<MaterialIcon icon="save" />}
          >
            แก้ไข
          </Button>
        )}
      </div>
    </div>
  );
};

export default ReportInputForm;
