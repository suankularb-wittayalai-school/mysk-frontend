import CertificateTypeIcon from "@/components/account/certificates/CertificateTypeIcon";
import MultiSchemeImage from "@/components/common/MultiSchemeImage";
import BlobsLeftDark from "@/public/images/graphics/blobs/left-dark.svg";
import BlobsLeftLight from "@/public/images/graphics/blobs/left-light.svg";
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
      appearance="outlined"
      style={style}
      className={cn(
        `relative isolate !grid grid-cols-[3.375rem,1fr,3rem] !gap-4 overflow-hidden
        !rounded-lg p-4`,
        className,
      )}
    >
      <MultiSchemeImage
        srcLight={BlobsLeftLight}
        srcDark={BlobsLeftDark}
        alt=""
        priority
        className="absolute inset-0 -z-10 [&_img]:h-full [&_img]:object-cover"
      />

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

      {/* Receiving order */}
      {certificate.receiving_order_number && (
        <Text
          type="button"
          element="div"
          className={cn(`w-12 self-start rounded-sm bg-tertiary-container py-1.5
            text-center text-on-tertiary-container sm:col-start-3 sm:w-full`)}
        >
          {certificate.receiving_order_number}
        </Text>
      )}
    </Card>
  );
};

export default CertificateCard;
