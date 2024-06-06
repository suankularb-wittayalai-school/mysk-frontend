import ArtDialog from "@/components/common/ArtDialog";
import BlobsBlurringGroup from "@/components/common/BlobsBlurringGroup";
import DecorativeBlob from "@/components/common/DecorativeBlob";
import PersonAvatar from "@/components/common/PersonAvatar";
import SnackbarContext from "@/contexts/SnackbarContext";
import cn from "@/utils/helpers/cn";
import getLocaleName from "@/utils/helpers/getLocaleName";
import { StylableFC } from "@/utils/types/common";
import { Student } from "@/utils/types/person";
import { Interactive, Snackbar, Text } from "@suankularb-components/react";
import useTranslation from "next-translate/useTranslation";
import { useContext } from "react";
import Barcode from "react-barcode";
import QRCode from "react-qr-code";

/**
 * A MySK recreation of the school-issue ID card.
 *
 * @param open Whether the Dialog is open and shown.
 * @param person The Student to display the information of.
 * @param onClose Triggers when the Dialog is closed.
 */
const IDCardDialog: StylableFC<{
  open?: boolean;
  person: Student;
  onClose: () => void;
}> = ({ open, person, onClose, style, className }) => {
  const { t } = useTranslation("account/about/idCardDialog");

  const { setSnackbar } = useContext(SnackbarContext);

  /**
   * Value for the barcode and QR code. It is the student ID with the school
   * code as a prefix.
   */
  const codeValue = "00100101" + person.student_id;

  /**
   * Copy the student ID to the clipboard.
   */
  function copyIDToClipboard() {
    navigator.clipboard.writeText(person.student_id);
    setSnackbar(<Snackbar>{t("common:snackbar.copiedToClipboard")}</Snackbar>);
  }

  return (
    <ArtDialog
      open={open}
      width={270}
      onClose={onClose}
      style={style}
      className={cn(
        `overflow-hidden !rounded-lg !bg-surface p-5 *:block
        *:text-on-surface-variant`,
        className,
      )}
    >
      {/* Background */}
      <BlobsBlurringGroup className="inset-0 -z-10">
        <DecorativeBlob
          variant="primary-2"
          style={{ width: 532, height: 244, top: -109, left: 72 }}
        />
        <DecorativeBlob
          variant="secondary-1"
          style={{ width: 428, height: 430, top: -133, left: -231 }}
        />
      </BlobsBlurringGroup>

      {/* Identification */}
      <PersonAvatar {...person} size={128} />
      <Text type="headline-small" className="mt-4 !text-on-surface">
        {getLocaleName("th", person)}
      </Text>
      <Text type="title-medium" className="-mt-0.5">
        {getLocaleName("en-US", person)}
      </Text>
      {person.classroom && (
        <>
          <Text type="body-medium" className="mt-4">
            {t("desc.0", { grade: Math.floor(person.classroom.number / 100) })}
          </Text>
          <Text type="body-medium" className="mt-1">
            {t("desc.1", {
              classroom: person.classroom.number,
              classNo: person.class_no,
            })}
          </Text>
        </>
      )}
      <Text type="body-medium" className="mt-4">
        {t("desc.2", { studentID: person.student_id })}
      </Text>

      {/* Codes */}
      <div
        title={codeValue}
        className={cn(`light -m-1 mt-7 !flex flex-row gap-1 *:rounded-xs
          *:bg-surface *:p-1`)}
      >
        <Interactive onClick={copyIDToClipboard} className="grow">
          <Barcode
            value={codeValue}
            width={1.48}
            height={36}
            displayValue={false}
            background="transparent"
            margin={0}
          />
        </Interactive>
        <Interactive onClick={copyIDToClipboard}>
          <QRCode value={codeValue} size={36} bgColor="transparent" />
        </Interactive>
      </div>
    </ArtDialog>
  );
};

export default IDCardDialog;
