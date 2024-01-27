import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import { MaterialIcon, Text } from "@suankularb-components/react";
import { useTranslation } from "next-i18next";

/**
 * Graphic representation of a seat in the Suankularb Ramluek hall.
 *
 * @param row Row of the seat. Should be a single Latin letter.
 * @param column Column of the seat. Should be an integer.
 */
const SeatGraphic: StylableFC<{
  row: string;
  column: number;
}> = ({ row, column, style, className }) => {
  const { t } = useTranslation("account", {
    keyPrefix: "certificates.dialog.seat.graphic",
  });

  const scaledX = (x: number) => (x / 360) * 100 + "%";
  const scaledY = (y: number) => (y / 160) * 100 + "%";

  return (
    <div style={style} className={cn(`relative`, className)}>
      <svg viewBox="0 0 360 160" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Other seats represented as circles. */}
        {[32, 52, 84, 104, 124, 184, 216, 236].map((x) => (
          <circle key={x} cx={x} cy={69} r={8} fill="var(--outline-variant)" />
        ))}

        {/* User’s seat represented as big primary circle. */}
        <circle cx={154} cy={69} r={18} fill="var(--primary)" />

        {/* Line with circles on each end represent number of seats from the
            left. */}
        <path d="M32 98L154 98" stroke="var(--on-surface-variant)" />
        <circle cx={32} cy={98} r={2.75} fill="var(--on-surface-variant)" />
        <circle cx={154} cy={98} r={2.75} fill="var(--on-surface-variant)" />
      </svg>

      {/* Seat icon for the user’s seat */}
      <div
        style={{ top: scaledY(51), left: scaledX(136), height: scaledY(36) }}
        className="absolute grid aspect-square place-content-center"
      >
        <MaterialIcon icon="event_seat" className="text-on-primary" />
      </div>

      {/* Row */}
      <div
        style={{ top: scaledY(53), left: scaledX(268), height: scaledY(28) }}
        className="absolute grid items-center"
      >
        <Text
          type="title-large"
          className="absolute whitespace-nowrap text-on-surface-variant"
        >
          {t("row", { row })}
        </Text>
      </div>

      {/* Column */}
      <Text
        type="title-medium"
        className="absolute text-center text-on-surface-variant"
        style={{ top: scaledY(104), left: scaledX(32), width: scaledX(122) }}
      >
        {t("column", { count: column })}
      </Text>
    </div>
  );
};

export default SeatGraphic;
