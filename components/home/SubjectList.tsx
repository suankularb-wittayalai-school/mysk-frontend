// Imports
import BrandIcon from "@/components/icons/BrandIcon";
import HoverList from "@/components/person/HoverList";
import getLocaleName from "@/utils/helpers/getLocaleName";
import getLocaleString from "@/utils/helpers/getLocaleString";
import useLocale from "@/utils/helpers/useLocale";
import { ClassroomSubject } from "@/utils/types/subject";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Columns,
  Text,
  transition,
  useAnimationConfig,
} from "@suankularb-components/react";
import { LayoutGroup, motion } from "framer-motion";
import { useTranslation } from "next-i18next";
import { FC } from "react";

const SubjectList: FC<{
  subjectList: ClassroomSubject[];
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
                getLocaleString(listItem.subject.name, locale).includes(
                  query,
                ) ||
                getLocaleString(listItem.subject.code, locale).includes(
                  query,
                ) ||
                listItem.teachers.filter((teacher) =>
                  getLocaleName(locale, teacher).includes(query),
                ).length,
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
                title={getLocaleString(listItem.subject.name, locale)}
                subtitle={getLocaleString(listItem.subject.code, locale)}
                element={(props) => (
                  <div
                    {...props}
                    title={getLocaleString(listItem.subject.name, locale)}
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
                  href={listItem.gg_meet_link ?? ""}
                  disabled={!listItem.gg_meet_link}
                  element={(props) => (
                    <a {...props} target="_blank" rel="noreferrer" />
                  )}
                />
                <Button
                  appearance="text"
                  icon={<BrandIcon icon="gg-classroom" />}
                  href={listItem.ggc_link ?? ""}
                  disabled={!listItem.ggc_link}
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
                  <Text type="title-medium" element="h4">
                    {t("subjectList.card.teachers")}
                  </Text>
                  <Text type="body-medium" className="break-all">
                    <HoverList
                      people={listItem.teachers}
                      options={{ nameJoinerOptions: { lastName: true } }}
                    />
                  </Text>
                </div>
                {/* Class code */}
                {listItem.ggc_code && (
                  <div>
                    <Text type="title-medium" element="h4">
                      Class code
                    </Text>
                    <Text type="body-medium" className="!font-mono">
                      {listItem.ggc_code}
                    </Text>
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
