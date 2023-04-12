// External libraries
import { FC } from "react";

// SK Component
import { Card, CardHeader } from "@suankularb-components/react";

// Internal components
import DynamicAvatar from "@/components/common/DynamicAvatar";

// Helpers
import { nameJoiner } from "@/utils/helpers/name";

// Hooks
import { useLocale } from "@/utils/hooks/i18n";

// Types
import { PersonLookupItemGeneric } from "@/utils/types/person";

const ClassTeacherCard: FC<{
  teacher: PersonLookupItemGeneric<null>;
  selectedID?: number;
  setSelectedID?: (id: number) => void;
}> = ({ teacher, selectedID, setSelectedID }) => {
  const locale = useLocale();

  return (
    <Card
      key={teacher.id}
      appearance="outlined"
      stateLayerEffect
      onClick={() => setSelectedID && setSelectedID(teacher.id)}
      className={
        selectedID === teacher.id
          ? "!bg-primary-container !text-on-primary-container"
          : undefined
      }
    >
      <CardHeader
        avatar={
          <DynamicAvatar
            name={teacher.name}
            className={
              selectedID === teacher.id
                ? "!bg-primary !text-on-primary"
                : undefined
            }
          />
        }
        title={nameJoiner(locale, teacher.name)}
        className="!text-left"
      />
    </Card>
  );
};

export default ClassTeacherCard;
