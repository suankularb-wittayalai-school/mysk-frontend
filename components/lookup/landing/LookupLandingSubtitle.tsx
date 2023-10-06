// Imports
import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import { Text } from "@suankularb-components/react";
import { Trans, useTranslation } from "next-i18next";

const LookupLandingSubtitle: StylableFC = ({ style, className }) => {
  const { t } = useTranslation("lookup");
  return (
    <Text type="headline-large" style={style} className={className}>
      <Trans
        i18nKey="subtitle"
        ns="lookup"
        components={[
          <strong
            key={0}
            className={cn(`bg-gradient-to-r from-primary to-secondary
              bg-clip-text [-webkit-text-fill-color:transparent]`)}
          />,
        ]}
      />
    </Text>
  );
};

export default LookupLandingSubtitle;
