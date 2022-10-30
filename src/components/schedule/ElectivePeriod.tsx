// External libraries
import { useTranslation } from "next-i18next";

// SK Components
import { MaterialIcon } from "@suankularb-components/react";

const ElectivePeriod = ({ isInSession }: { isInSession: boolean }) => {
  const { t } = useTranslation("schedule");

  return (
    <button
      className={[
        `group relative h-[3.75rem] w-full rounded-lg
        text-left font-display text-xl font-medium leading-none
        before:absolute before:inset-0 before:rounded-xl
        before:transition-[background-color]
        hover:before:bg-on-primary-translucent-08 hover:before:transition-none`,
        isInSession
          ? "bg-tertiary-translucent-12 text-on-tertiary-container shadow"
          : "bg-surface-2 text-on-surface-variant",
      ].join(" ")}
    >
      <div className="px-4 py-2 transition-[opacity]">
        <span>{t("schedule.elective")}</span>
      </div>
      <div
        className="pointer-events-none absolute top-0 z-30 h-full w-full
          rounded-lg border-2 border-primary bg-secondary-translucent-12
          opacity-0 transition-[opacity] group-hover:opacity-100
          group-focus:opacity-100"
      >
        <div
          className="primary pointer-events-auto absolute top-0 left-1/2
            -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-surface
            p-1 text-xl shadow transition-[opacity] hover:transition-none
            focus:opacity-95 focus:transition-none"
        >
          <MaterialIcon icon="open_in_full" allowCustomSize />
        </div>
      </div>
    </button>
  );
};

export default ElectivePeriod;
