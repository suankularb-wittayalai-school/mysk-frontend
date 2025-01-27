import useLocale from "@/utils/helpers/useLocale";
import { Teacher } from "@/utils/types/person";
import {
  TextField,
  Columns,
  Select,
  MenuItem,
  ChipField,
  ChipSet,
  InputChip,
  FormGroup,
  FormItem,
  Radio,
  Button,
  MaterialIcon,
} from "@suankularb-components/react";
import { FC, useState } from "react";
import getLocaleString from "@/utils/helpers/getLocaleString";
import useMySKClient from "@/utils/backend/mysk/useMySKClient";
import getClassroomByNumber from "@/utils/backend/classroom/getClassroomByNumber";
import { supabase } from "@/utils/supabase-client";
import { Report } from "@/utils/types/report";

const ReportInputForm: FC<{
  teacher: Teacher;
  report: Report[];
}> = ({ teacher, report }) => {
  console.log(report.length, "the rerpot");
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
    report.length > 0 ? report[0].teaching_methods[0] : "Live Course",
  );
  const locale = useLocale();
  const mysk = useMySKClient();
  console.log(date, "where is it");

  async function handleCreate() {
    let { data: classroomId } = await getClassroomByNumber(
      supabase,
      parseInt(classrooms[0]),
    );
    console.log(absentStudents);
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
            teaching_methods: [teachingMethod],
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
            label={"Subject"}
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
            label={"Date"}
            value={date}
            onChange={(date) => setDate(date)}
            inputAttr={{ type: "date", placeholder: "YYYY-MM-DD" }}
          />
        </Columns>
      </section>
      <section>
        <Columns columns={3} className="flex-start self-strech flex">
          <Select
            appearance="outlined"
            label="start"
            value={startPeriod}
            onChange={setStartPeriod}
          >
            {[
              { period: 1, startTime: "8.30" },
              { period: 2, startTime: "9.20" },
              { period: 3, startTime: "10.10" },
              { period: 4, startTime: "11.00" },
              { period: 5, startTime: "11.50" },
              { period: 6, startTime: "12.40" },
              { period: 7, startTime: "13.30" },
              { period: 8, startTime: "14.20" },
              { period: 9, startTime: "15.10" },
              { period: 10, startTime: "16.00" },
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
          <Select
            appearance="outlined"
            label="end"
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
          <ChipField
            label={"Classroom"}
            onChange={setClassroom}
            value={classroom}
            onNewEntry={(classroom) => setClassrooms([classroom])}
            // onDeleteLast={() => setClassrooms(classrooms.slice(0, -1))}
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
        </Columns>
      </section>
      <section>
        <TextField
          appearance="outlined"
          label={"Absent Students"}
          value={absentStudents}
          onChange={(text) => setAbsentStudents(text)}
        />
      </section>
      <section>
        <Columns columns={2} className="flex-start self-strech flex">
          <div className="flex flex-col gap-6">
            <span className="text-title-medium">Teaching Information</span>
            <TextField
              appearance="outlined"
              label={"Teaching Content"}
              value={teachingTopic}
              onChange={(topic) => setTeachingTopic(topic)}
            />
            <TextField
              appearance="outlined"
              label={"Problems and Recommendations"}
              value={suggestions}
              onChange={(text) => setSuggestions(text)}
            />
          </div>
          <div>
            <FormGroup label={"Teaching Method"} className="text-title-medium">
              <FormItem label={"Live Course"}>
                <Radio
                  value={teachingMethod == "Live Course"}
                  onChange={() => setTeachingMethod("Live Course")}
                />
              </FormItem>
              <FormItem label={"Video"}>
                <Radio
                  value={teachingMethod == "Video"}
                  onChange={() => setTeachingMethod("Video")}
                />
              </FormItem>
              <FormItem label={"In Class Work"}>
                <Radio
                  value={teachingMethod == "In Class Work"}
                  onChange={() => setTeachingMethod("In Class Work")}
                />
              </FormItem>
              <FormItem label={"Combination of the Above"}>
                <Radio
                  value={teachingMethod == "Combination of the Above"}
                  onChange={() => setTeachingMethod("Combination of the Above")}
                />
              </FormItem>
            </FormGroup>
          </div>
        </Columns>
      </section>
      <div className="self-strech flex flex-col items-end gap-2.5">
        {report.length == 0 ? (
          <Button
            appearance="filled"
            onClick={() => handleCreate()}
            icon={<MaterialIcon icon="save" />}
          >
            Save
          </Button>
        ) : null}
      </div>
    </div>
  );
};

export default ReportInputForm;
