// Modules
import { useRouter } from "next/router";

// Types
import { Teacher } from "@utils/types/person";

const TeacherTeachingList = ({
  teachers,
}: {
  teachers: { name: Teacher["name"] }[];
}) => {
  const locale = useRouter().locale == "th" ? "th" : "en-US";

  return (
    <span className="max-lines-1 text-base">
      {teachers.length > 0 &&
        // Show the first teacher’s first name in user locale
        (teachers[0].name[locale]?.firstName || teachers[0].name.th.firstName)}
      {
        // If there are more than one teacher, display +1 and show the remaining teachers on hover
        teachers.length > 1 && (
          <abbr
            className="text-secondary opacity-50"
            title={teachers
              .slice(1)
              .map(
                (teacher) =>
                  teacher.name[locale]?.firstName || teacher.name.th.firstName
              )
              .join(", ")}
          >
            +{teachers.length - 1}
          </abbr>
        )
      }
    </span>
  );
};

export default TeacherTeachingList;
