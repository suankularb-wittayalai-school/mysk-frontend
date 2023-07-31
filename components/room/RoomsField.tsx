import { useLocale } from "@/utils/hooks/i18n";
import { roomRegex } from "@/utils/patterns";
import { ChipField, ChipSet, InputChip } from "@suankularb-components/react";
import { last, replace } from "radash";
import { FC, useEffect, useState } from "react";

const RoomsField: FC<{
  rooms: string[];
  onChange: (value: string[]) => void;
}> = ({ rooms, onChange }) => {
  const locale = useLocale();

  const [field, setField] = useState("");

  useEffect(() => {
    if (field.length === 4) {
      if (rooms.includes(field)) return;
      if (!roomRegex.test(field)) return;
      onChange([...rooms, field]);
      setField("");
    } else if (/^\/\d$/.test(field)) {
      const joinedRoom = last(rooms)! + field;
      if (!roomRegex.test(joinedRoom)) return;
      onChange(
        replace(rooms, joinedRoom, (_, idx) => rooms.length - 1 === idx),
      );
      setField("");
    }
  }, [field]);

  return (
    <ChipField
      label="Rooms"
      placeholder="Enter 4-digit room code"
      value={field}
      onChange={setField}
      onDeleteLast={() => onChange(rooms.slice(0, -1))}
      onNewEntry={(value) => {
        if (rooms.includes(value)) return;
        if (value.length === 3) return;
        onChange([...rooms, field]);
      }}
      locale={locale}
    >
      <ChipSet>
        {rooms.map((room) => (
          <InputChip
            key={room}
            onDelete={() =>
              onChange(rooms.filter((mapRoom) => room !== mapRoom))
            }
          >
            {room}
          </InputChip>
        ))}
      </ChipSet>
    </ChipField>
  );
};

export default RoomsField;
