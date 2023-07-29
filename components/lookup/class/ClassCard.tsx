// External libraries
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { FC, useEffect, useState } from "react";

// Internal components
import HoverList from "@/components/person/HoverList";

// Types
import { ClassLookupListItem } from "@/utils/types/class";

// SK Components
import {
  Actions,
  Button,
  Card,
  CardContent,
  CardHeader,
  MaterialIcon,
  transition,
  useAnimationConfig,
} from "@suankularb-components/react";

// Helpers
import { getLocaleName } from "@/utils/helpers/string";

// Hooks
import { useLocale } from "@/utils/hooks/i18n";

/**
 * A Card representing a class in the list of classes in the Lookup Classes
 * page.
 *
 * @param classItem An instance of `ClassLookupListItem`, an item from the array fetched from the `getLookupClasses` backend function.
 *
 * @returns A Card.
 */
const ClassCard: FC<{ classItem: ClassLookupListItem }> = ({ classItem }) => {
  const locale = useLocale();
  const { t } = useTranslation("common");

  const { duration, easing } = useAnimationConfig();

  // Modal control
  const [detailsOpen, setDetailsOpen] = useState<boolean>(false);

  return (
    <div className="group relative">
      <motion.div
        layoutId={`class-${classItem.id}`}
        transition={transition(duration.medium1, easing.standard)}
        className="h-[4.375rem] w-full overflow-hidden"
        style={{ borderRadius: 12 }}
      >
        <Card
          appearance="filled"
          direction="row"
          stateLayerEffect
          onClick={() => setDetailsOpen(true)}
          className="h-full w-full"
          buttonAttr={{
            "aria-label": t("class", { number: classItem.number }),
          }}
        >
          <CardHeader
            title={t("class", { number: classItem.number })}
            subtitle={
              <HoverList
                people={classItem.classAdvisors}
                options={{
                  nameJoinerOptions: {
                    prefix: locale === "th" ? "teacher" : false,
                    lastName: false,
                  },
                  maxVisibleLength: 2,
                }}
                className="whitespace-nowrap"
              />
            }
            className="!items-start text-left [&_*]:!font-body"
          />
        </Card>
      </motion.div>

      <ClassPeekModal
        classItem={classItem}
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
      />
    </div>
  );
};

const ClassPeekModal: FC<{
  classItem: ClassLookupListItem;
  open?: boolean;
  onClose: () => void;
}> = ({ classItem, open, onClose }) => {
  const locale = useLocale();
  const { t } = useTranslation(["lookup", "common"]);

  const { duration, easing } = useAnimationConfig();

  const baseURL = `/lookup/class/${classItem.number}`;

  // Close the Peek Modal with the escape key
  useEffect(() => {
    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keyup", handleKeyUp);
    return () => window.removeEventListener("keyup", handleKeyUp);
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Scrim */}
          <motion.div
            className="skc-scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            transition={transition(duration.medium4, easing.standard)}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            layoutId={`class-${classItem.id}`}
            transition={transition(duration.medium3, easing.standard)}
            className="absolute -inset-2 bottom-auto z-[90] min-w-[18rem]
              group-even:left-auto sm:-inset-4 sm:bottom-auto
              sm:group-even:-left-4 sm:group-[&:nth-child(4n)]:left-auto
              md:group-[&:nth-child(4n)]:-left-4
              md:group-[&:nth-child(6n)]:!left-auto"
            style={{ borderRadius: 12 }}
          >
            <Card appearance="filled">
              <CardHeader
                title={
                  <Link href={baseURL} className="link">
                    {t("class", { ns: "common", number: classItem.number })}
                  </Link>
                }
                subtitle={classItem.classAdvisors
                  .map((teacher) =>
                    getLocaleName(locale, teacher.name, undefined, {
                      prefix: "teacher",
                    })
                  )
                  .join(", ")}
                className="!px-4 [&_span]:!font-body"
              />
              <CardContent>
                <p className="skc-body-medium text-on-surface-variant">
                  {t("classes.list.numStudents", {
                    count: classItem.studentCount,
                  })}
                </p>
                <Actions align="full">
                  <Button
                    appearance="outlined"
                    icon={<MaterialIcon icon="dashboard" />}
                    href={`${baseURL}/schedule`}
                    element={Link}
                  >
                    {t("classes.list.action.schedule")}
                  </Button>
                </Actions>
                <Actions align="full" className="!mt-0">
                  <Button
                    appearance="outlined"
                    icon={<MaterialIcon icon="groups" />}
                    href={`${baseURL}/student`}
                    element={Link}
                  >
                    {t("classes.list.action.students")}
                  </Button>
                  <Button
                    appearance="outlined"
                    icon={<MaterialIcon icon="group" />}
                    href={`${baseURL}/teacher`}
                    element={Link}
                  >
                    {t("classes.list.action.teachers")}
                  </Button>
                </Actions>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ClassCard;
