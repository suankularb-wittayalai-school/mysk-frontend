// Imports
import getLocaleString from "@/utils/helpers/getLocaleString";
import useLocale from "@/utils/helpers/useLocale";
import { StylableFC } from "@/utils/types/common";
import { Subject } from "@/utils/types/subject";
import { Text } from "@suankularb-components/react";

const SubjectInChardCard: StylableFC<{
  subject: Pick<Subject, "code" | "id" | "name" | "short_name">;
}> = ({ subject }) => {
  const locale = useLocale();

  return (
    <li
      title={getLocaleString(subject.name, locale)}
      className="min-w-[10rem] max-w-[15rem] rounded-md bg-surface px-3 py-2"
    >
      <Text type="title-medium" element="h4" className="truncate">
        {getLocaleString(subject.name, locale)}
      </Text>
      <Text type="body-medium">{getLocaleString(subject.code, locale)}</Text>
    </li>
  );
};

export default SubjectInChardCard;
