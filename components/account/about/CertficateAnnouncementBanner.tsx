import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import { Card, Text } from "@suankularb-components/react";
import { useTranslation } from "next-i18next";

/**
 * A banner that appears on the About You page to inform the user about the
 * School Certificate eligibility announcement.
 */
const CertficateAnnouncementBanner: StylableFC = ({ style, className }) => {
  const { t } = useTranslation("account");

  return (
    <Card
      appearance="filled"
      style={style}
      className={cn(
        `gap-1 !bg-tertiary-container px-4 py-3 !text-on-tertiary-container`,
        className,
      )}
    >
      <Text type="title-medium">Check your school certificate eligibility</Text>
      <Text type="body-medium">
        Select the “Certificates” tab to learn more.
      </Text>
    </Card>
  );
};

export default CertficateAnnouncementBanner;
