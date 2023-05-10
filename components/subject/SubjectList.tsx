// External libraries
import { useTranslation } from "next-i18next";
import { FC } from "react";

// SK Components
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Columns,
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

  return (
    <Columns columns={3}>
      {(query
        ? subjectList.filter(
            (listItem) =>
              (
                getLocaleObj(listItem.subject.name, locale) as SubjectName
              ).name.includes(query) ||
              getLocaleString(listItem.subject.code, locale).includes(query) ||
              listItem.teachers.filter((teacher) =>
                nameJoiner(locale, teacher.name).includes(query)
              ).length
          )
        : subjectList
      ).map((listItem) => (
        <Card key={listItem.id} appearance="outlined">
          <div className="flex flex-row">
            <CardHeader
              title={
                (getLocaleObj(listItem.subject.name, locale) as SubjectName)
                  .name
              }
              subtitle={getLocaleString(listItem.subject.code, locale)}
              className="grow truncate break-all"
            />
            <div className="flex flex-row items-center px-4">
              <Button
                appearance="text"
                icon={<BrandIcon icon="gg-meet" />}
                href={listItem.ggMeetLink}
                disabled={!listItem.ggMeetLink}
              />
              <Button
                appearance="text"
                icon={<BrandIcon icon="gg-classroom" />}
                href={listItem.ggcLink}
                disabled={!listItem.ggcLink}
              />
            </div>
          </div>
          <CardContent>
            <Columns columns={2}>
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
    </Columns>
  );
};

export default SubjectList;
