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
} from "@suankularb-components/react";
import { FC, useState } from "react";
import getLocaleString from "@/utils/helpers/getLocaleString";

const ReportInputForm: FC<{ teacher: Teacher }> = ({ teacher }) => {
  const [subjectId, setSubjectId] = useState<any>();
  const [date, setDate] = useState<any>();
  const [startPeriod, setStartPeriod] = useState<number>(1);
  const [duration, setDuration] = useState<number>(1);
  const [classroom, setClassroom] = useState<string>();
  const [classrooms, setClassrooms] = useState<string[]>([]);
  const [absentStudents, setAbsentStudents] = useState<any>();
  const [teachingTopic, setTeachingTopic] = useState<any>();
  const [suggestions, setSuggestions] = useState<any>();
  const [teachingMethod, setTeachingMethod] = useState<string[]>([]);
  const locale = useLocale();
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
            onNewEntry={(classroom) =>
              setClassrooms([...classrooms, classroom])
            }
            onDeleteLast={() => setClassrooms(classrooms.slice(0, -1))}
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
                  value={teachingMethod.includes("Live Course")}
                  onChange={() => {
                    teachingMethod.includes("Live Course")
                      ? setTeachingMethod(
                          teachingMethod.filter(
                            (method) => method !== "Live Course",
                          ),
                        )
                      : setTeachingMethod([...teachingMethod, "Live Course"]);
                  }}
                />
              </FormItem>
              <FormItem label={"Video"}>
                <Radio
                  value={teachingMethod.includes("Video")}
                  onChange={() => {
                    teachingMethod.includes("Video")
                      ? setTeachingMethod(
                          teachingMethod.filter((method) => method !== "Video"),
                        )
                      : setTeachingMethod([...teachingMethod, "Video"]);
                  }}
                />
              </FormItem>
              <FormItem label={"In Class Work"}>
                <Radio
                  value={teachingMethod.includes("In Class Work")}
                  onChange={() => {
                    teachingMethod.includes("In Class Work")
                      ? setTeachingMethod(
                          teachingMethod.filter(
                            (method) => method !== "In Class Work",
                          ),
                        )
                      : setTeachingMethod([...teachingMethod, "In Class Work"]);
                  }}
                />
              </FormItem>
              <FormItem label={"Live Course"}>
                <Radio
                  value={teachingMethod.includes("Combination of the Above")}
                  onChange={() => {
                    teachingMethod.includes("Combination of the Above")
                      ? setTeachingMethod(
                          teachingMethod.filter(
                            (method) => method !== "Combination of the Above",
                          ),
                        )
                      : setTeachingMethod([
                          ...teachingMethod,
                          "Combination of the Above",
                        ]);
                  }}
                />
              </FormItem>
            </FormGroup>
          </div>
        </Columns>
      </section>
      <Button
        appearance="tonal"
        onClick={() =>
          console.log(
            subjectId,
            date,

            startPeriod,
            duration,
            classrooms,
            absentStudents,
            teachingTopic,
            suggestions,
            teachingMethod,
          )
        }
      >
        Saveeee
      </Button>
    </div>
  );
};

export default ReportInputForm;
