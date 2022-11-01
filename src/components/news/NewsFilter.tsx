// External libraries
import { useTranslation } from "next-i18next";

// SK Components
import { ChipFilterList } from "@suankularb-components/react";

// Types
import { NewsItemType } from "@utils/types/news";

const NewsFilter = ({
  setNewsFilter,
}: {
  setNewsFilter: (newFilter: NewsItemType[]) => void;
}): JSX.Element => {
  const { t } = useTranslation("news");
  return (
    <ChipFilterList
      choices={[
        { id: "info", name: t("filter.info") },
        { id: "form", name: t("filter.forms") },
        { id: "payment", name: t("filter.payments") },
        [
          { id: "not-done", name: t("filter.amountDone.notDone") },
          { id: "done", name: t("filter.amountDone.done") },
        ],
      ]}
      onChange={(newFilter: NewsItemType[]) => setNewsFilter(newFilter)}
      scrollable={true}
    />
  );
};

export default NewsFilter;
