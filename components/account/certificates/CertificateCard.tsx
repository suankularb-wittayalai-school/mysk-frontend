import CertificateTypeIcon from "@/components/account/certificates/CertificateTypeIcon";
import cn from "@/utils/helpers/cn";
import { StudentCertificate } from "@/utils/types/certificate";
import { StylableFC } from "@/utils/types/common";
import { Card, MaterialIcon, Text } from "@suankularb-components/react";
import { useTranslation } from "next-i18next";
import { camel } from "radash";

/**
 * A Card that displays a Student Certificate.
 *
 * @param certificate The Student Certificate to display.
 */
const CertificateCard: StylableFC<{
  certificate: StudentCertificate;
}> = ({ certificate, style, className }) => {
  const { t: tx } = useTranslation("common");

  return (
    <Card
      appearance="filled"
      style={style}
      className={cn(
        `relative isolate !grid grid-cols-[3.375rem,1fr] !gap-4 overflow-hidden
        !rounded-xl p-4`,
        className,
      )}
    >
      {/* Icon */}
      <div className="relative aspect-square">
        <MaterialIcon icon="developer_guide" size={48} />
        <div
          className={cn(`absolute bottom-0 right-0 z-10 aspect-square w-fit
            rounded-full bg-secondary p-1 text-on-secondary`)}
        >
          <CertificateTypeIcon type={certificate.certificate_type} />
        </div>
      </div>

      {/* Text */}
      <div className="sm:col-span-2 md:col-span-1">
        <Text type="headline-small" element="h3">
          {tx(`certificate.${camel(certificate.certificate_type)}`)}
        </Text>
        <Text type="title-medium" element="p" className="empty:hidden">
          {certificate.certificate_detail}
        </Text>
      </div>
    </Card>
  );
};

export default CertificateCard;
