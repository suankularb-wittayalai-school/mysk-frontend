import { StudentCertificateType } from "@/utils/types/certificate";
import { MaterialIcon } from "@suankularb-components/react";
import { FC } from "react";

/**
 * An icon representing a Student Certificate Type.
 * 
 * @param type The type of the Certificate.
 */
const CertificateTypeIcon: FC<{ type: StudentCertificateType }> = ({ type }) =>
  ({
    student_of_the_year: <MaterialIcon icon="award_star" />,
    excellent_student: <MaterialIcon icon="star" />,
    academic: <MaterialIcon icon="school" />,
    morale: <MaterialIcon icon="folded_hands" />,
    sports: <MaterialIcon icon="sports_football" />,
    activity: <MaterialIcon icon="category" />,
  })[type];

export default CertificateTypeIcon;
