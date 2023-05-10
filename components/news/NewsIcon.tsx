// External libraries
import type { FC } from "react";

// SK Components
import { MaterialIcon } from "@suankularb-components/react";

// Types
import { NewsItemType } from "@/utils/types/news";

const NewsIcon: FC<{
  type: NewsItemType;
  className?: string;
}> = ({ type, className }) => {
  if (type == "stats")
    return <MaterialIcon icon="monitoring" className={className} />;
  else if (type == "form")
    return <MaterialIcon icon="edit" className={className} />;
  else if (type == "payment")
    return <MaterialIcon icon="account_balance" className={className} />;
  else return <MaterialIcon icon="information" className={className} />;
};

export default NewsIcon;
