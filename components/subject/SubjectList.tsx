// External libraries
import { LayoutGroup, motion } from "framer-motion";
import { useTranslation } from "next-i18next";
import { FC } from "react";

// SK Components
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Columns,
  transition,
  useAnimationConfig,
} from "@suankularb-components/react";

// Internal components
import BrandIcon from "@/components/icons/BrandIcon";
import HoverList from "@/components/person/HoverList";

// Types
import { SubjectListItem, SubjectName } from "@/utils/types/subject";

// Helpers
import { getLocaleObj, getLocaleString } from "@/utils/helpers/i18n";
import { nameJoiner } from "@/utils/helpers/name";

// Hooks
import { useLocale } from "@/utils/hooks/i18n";

const SubjectList: FC<{
  subjectList: SubjectListItem[];
  query: string;
}> = ({ subjectList, query }) => {
  // Translation
  const { t } = useTranslation("schedule");
  const locale = useLocale();

  const { duration, easing } = useAnimationConfig();

  return (
    <Columns columns={3} element="ul">
      <LayoutGroup>
        {(query
          ? subjectList.filter(
              (listItem) =>
                (
                  getLocaleObj(listItem.subject.name, locale) as SubjectName
                ).name.includes(query) ||
                getLocaleString(listItem.subject.code, locale).includes(
                  query
                ) ||
                listItem.teachers.filter((teacher) =>
                  nameJoiner(locale, teacher.name).includes(query)
                ).length
            )
          : subjectList
        ).map((listItem) => (
          <Card
            key={listItem.id}
            appearance="outlined"
            element={(props) => (
              <motion.li
                {...props}
                layoutId={`subject-${listItem.id}`}
                transition={transition(duration.medium4, easing.standard)}
              />
            )}
          >
            <div className="flex flex-row">
              {/* Subject name and code */}
              <CardHeader
                title={
                  (getLocaleObj(listItem.subject.name, locale) as SubjectName)
                    .name
                }
                subtitle={getLocaleString(listItem.subject.code, locale)}
                element={(props) => (
                  <div
                    {...props}
                    title={
                      (
                        getLocaleObj(
                          listItem.subject.name,
                          locale
                        ) as SubjectName
                      ).name
                    }
                  />
                )}
                // I have no idea why this works, but it does, and I’m not gonna
                // touch it
                className="grow truncate break-all [&>*>*]:truncate [&>*]:w-full"
              />
              {/* Google services shortcuts */}
              <div className="flex flex-row items-center px-4">
                <Button
                  appearance="text"
                  icon={<BrandIcon icon="gg-meet" />}
                  href={listItem.ggMeetLink}
                  disabled={!listItem.ggMeetLink}
                  element={(props) => (
                    <a {...props} target="_blank" rel="noreferrer" />
                  )}
                />
                <Button
                  appearance="text"
                  icon={<BrandIcon icon="gg-classroom" />}
                  href={listItem.ggcLink}
                  disabled={!listItem.ggcLink}
                  element={(props) => (
                    <a {...props} target="_blank" rel="noreferrer" />
                  )}
                />
              </div>
            </div>
            <CardContent>
              <Columns columns={2}>
                {/* Teachers */}
                <div
                  className={
                    listItem.teachers.length === 1 ? "truncate" : undefined
                  }
                >
                  <h4 className="skc-title-medium">
                    {t("subjectList.card.teachers")}
                  </h4>
                  <span className="skc-body-medium break-all">
                    <HoverList
                      people={listItem.teachers}
                      options={{ nameJoinerOptions: { lastName: true } }}
                    />
                  </span>
                </div>
                {/* Class code */}
                {listItem.ggcCode && (
                  <div>
                    <h4 className="skc-title-medium">Class code</h4>
                    <span className="skc-body-medium !font-mono">
                      {listItem.ggcCode}
                    </span>
                  </div>
                )}
              </Columns>
            </CardContent>
          </Card>
        ))}
      </LayoutGroup>
    </Columns>
  );
};

export default SubjectList;
