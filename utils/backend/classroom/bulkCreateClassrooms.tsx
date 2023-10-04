// Imports
import getCurrentAcademicYear from "@/utils/helpers/getCurrentAcademicYear";
import logError from "@/utils/helpers/logError";
import { DatabaseClient } from "@/utils/types/backend";
import { Classroom } from "@/utils/types/classroom";
import { list } from "radash";

export default async function bulkCreateClassrooms(
  supabase: DatabaseClient,
  noOfClassesPerGrade: number[],
) {
  const { error } = await supabase.from("classrooms").upsert(
    noOfClassesPerGrade
      .map((numClasses, index) => {
        const classesForGrade: Pick<Classroom, "number" | "year">[] = list(
          numClasses,
        ).map((classNumber) => ({
          number: (index + 1) * 100 + (classNumber + 1),
          year: getCurrentAcademicYear(),
        }));
        return classesForGrade;
      })
      .flat(),
  );

  if (error) logError("bulkCreateClassrooms", error);

  return { data: null, error };
}
