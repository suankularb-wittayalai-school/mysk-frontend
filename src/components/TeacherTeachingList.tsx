// Modules
import { useRouter } from "next/router";

// Types
import { Teacher } from "@utils/types/person";
import { nameJoiner } from "@utils/helpers/name";

const TeacherTeachingList = ({
  teachers,
  truncate,
  useFullName,
}: {
  teachers: { name: Teacher["name"] }[];
  truncate?: boolean;
  useFullName?: boolean;
}) => {
  const locale = useRouter().locale == "th" ? "th" : "en-US";

  return (
    <span
      className={`text-base ${truncate ? "overflow-ellipse break-all" : ""}`}
    >
      {teachers.length > 0 &&
        // Show the first teacher’s name in user locale
        (useFullName
          ? nameJoiner(locale, teachers[0].name)
          : teachers[0].name[locale]?.firstName ||
            teachers[0].name.th.firstName)}
      {
        // If there are more than one teacher, display +1 and show the remaining teachers on hover
        teachers.length > 1 && (
          <abbr
            className="text-secondary opacity-50"
            title={teachers
              .slice(1)
              .map((teacher) =>
                useFullName
                  ? nameJoiner(locale, teacher.name)
                  : teacher.name[locale]?.firstName || teacher.name.th.firstName
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
