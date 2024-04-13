import MultilangText from "@/components/common/MultilingualText";
import InformationCard from "@/components/lookup/people/InformationCard";
import PeopleChipSet from "@/components/person/PeopleChipSet";
import RoomChip from "@/components/room/RoomChip";
import cn from "@/utils/helpers/cn";
import getLocaleString from "@/utils/helpers/getLocaleString";
import useLocale from "@/utils/helpers/useLocale";
import { StylableFC } from "@/utils/types/common";
import { ElectiveSubject } from "@/utils/types/elective";
import { UserRole } from "@/utils/types/person";
import { ChipSet, Text } from "@suankularb-components/react";

/**
 * A card similar to a Lookup Details Card that displays details of an Elective
 * Subject.
 *
 * @todo Should accept `electiveSubject` prop.
 */
const ElectiveDetailsCard: StylableFC = ({ style, className }) => {
  const locale = useLocale();

  // Mock data
  const electiveSubject = {
    id: 1,
    name: { th: "การสร้างเว็บเพจ 1", "en-US": "Webpage 1" },
    code: { th: "ว20281", "en-US": "SC20281" },
    description: {
      th: "คอร์สที่ออกแบบมาเพื่อสอนการสร้างและออกแบบเว็บไซต์อย่างมีประสิทธิภาพ",
      "en-US":
        "A course designed to teach you how to create and design effective \
        websites.",
    },
    room: "6306",
    credit: 1.0,
    teachers: [
      {
        id: "d84bd1a6-4659-496e-bde3-afdaeb1221c9",
        first_name: { th: "วิยดา", "en-US": "Wiyada" },
        last_name: { th: "ไตรยวงศ์", "en-US": "Triyawong" },
        role: UserRole.teacher,
      },
    ],
    class_size: 17,
    cap_size: 25,
  } as unknown as ElectiveSubject;

  return (
    <section style={style} className={cn(`flex flex-col`, className)}>
      <Text
        type="headline-small"
        element="h2"
        className="px-6 pb-3 pt-[1.125rem]"
      >
        {getLocaleString(electiveSubject.name, locale)}
      </Text>

      <section
        className={cn(`h-0 grow overflow-auto rounded-xl
          bg-surface-container`)}
      >
        <div className="grid grid-cols-2 gap-2 p-4 md:grid-cols-4">
          {/* Subject name */}
          <InformationCard title="Subject name" className="col-span-2">
            <MultilangText text={electiveSubject.name} />
          </InformationCard>

          {/* Description */}
          {electiveSubject.description && (
            <InformationCard title="Description" className="col-span-2">
              {getLocaleString(electiveSubject.description, locale)}
            </InformationCard>
          )}

          {/* Subject code */}
          <InformationCard title="Code">
            <MultilangText text={electiveSubject.code} />
          </InformationCard>

          {/* Teachers */}
          <InformationCard title="Teachers">
            <PeopleChipSet
              people={electiveSubject.teachers}
              scrollable
              className="fade-out-to-r -mx-3 *:pl-3 *:pr-8"
            />
          </InformationCard>

          {/* Room */}
          <InformationCard title="Room">
            <ChipSet scrollable className="fade-out-to-r -mx-3 *:pl-3 *:pr-8">
              <RoomChip room={electiveSubject.room} />
            </ChipSet>
          </InformationCard>

          {/* Credit */}
          <InformationCard title="Credit">
            {electiveSubject.credit.toFixed(1)}
          </InformationCard>
        </div>
      </section>
    </section>
  );
};

export default ElectiveDetailsCard;
