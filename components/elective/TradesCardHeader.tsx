import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import {
  Actions,
  Button,
  MaterialIcon,
  Text,
} from "@suankularb-components/react";
import { useTranslation } from "next-i18next";
import { useState } from "react";

/**
 * The header of Trades Card.
 */
const TradesCardHeader: StylableFC = ({ style, className }) => {
  const { t } = useTranslation("elective", { keyPrefix: "detail.trade" });

  const [createOpen, setCreateOpen] = useState(false);

  return (
    <header
      style={style}
      className={cn(`flex flex-row items-center gap-2`, className)}
    >
      <Text
        type="headline-small"
        element="h2"
        className="grow whitespace-nowrap"
      >
        {t("title")}
      </Text>
      <Actions>
        <Button
          appearance="tonal"
          icon={<MaterialIcon icon="add" />}
          onClick={() => setCreateOpen(true)}
          className="!whitespace-nowrap"
        >
          {t("action.create")}
        </Button>
      </Actions>
    </header>
  );
};

export default TradesCardHeader;
