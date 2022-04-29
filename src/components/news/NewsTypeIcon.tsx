// Types
import { MaterialIcon } from "@suankularb-components/react";
import { NewsItemType } from "@utils/types/news";

const NewsTypeIcon = ({
  type,
  className,
}: {
  type: NewsItemType;
  className?: string;
}) => {
  return type == "form" ? (
    <MaterialIcon icon="edit" className={className} />
  ) : type == "payment" ? (
    <MaterialIcon icon="account_balance" className={className} />
  ) : (
    <MaterialIcon icon="information" className={className} />
  );
};

export default NewsTypeIcon;
