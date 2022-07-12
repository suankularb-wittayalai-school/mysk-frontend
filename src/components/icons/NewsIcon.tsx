import { MaterialIcon } from "@suankularb-components/react";
import { NewsItemType } from "@utils/types/news";

const NewsIcon = ({
  type,
  className,
}: {
  type: NewsItemType;
  className?: string;
}): JSX.Element => {
  if (type == "form") return <MaterialIcon icon="edit" className={className} />;
  else if (type == "payment")
    return <MaterialIcon icon="account_balance" className={className} />;
  else return <MaterialIcon icon="information" className={className} />;
};

export default NewsIcon;
