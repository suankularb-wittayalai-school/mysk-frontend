import PersonCard from "@/components/person/PersonCard";
import cn from "@/utils/helpers/cn";
import { Classroom } from "@/utils/types/classroom";
import { StylableFC } from "@/utils/types/common";
import { UserRole } from "@/utils/types/person";
import { Text } from "@suankularb-components/react";
import { useTranslation } from "next-i18next";

/**
 * A Grid of Person Cards for Advisors inside Class Details Card.
 *
 * @param advisors The Advisors to display.
 */
const ClassAdvisorGrid: StylableFC<{
  advisors: Classroom["class_advisors"];
}> = ({ advisors, style, className }) => {
  const { t } = useTranslation("classes", { keyPrefix: "detail.advisors" });

  return (
    <div
      style={style}
      className={cn(`grid gap-x-2 gap-y-1 md:grid-cols-2`, className)}
    >
      <Text
        type="title-medium"
        element="h3"
        className="mb-1 rounded-md bg-surface px-3 py-2 md:col-span-2"
      >
        {t("title")}
      </Text>

      {advisors.map((advisor) => (
        <PersonCard
          key={advisor.id}
          person={{ ...advisor, role: UserRole.teacher }}
          options={{ hideSeeClass: true }}
          className={cn(`!border-0 hover:m-[-1px] hover:!border-1 focus:m-[-1px]
            focus:!border-1`)}
        />
      ))}
    </div>
  );
};

export default ClassAdvisorGrid;
