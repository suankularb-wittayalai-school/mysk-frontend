// Modules
import { useTranslation } from "next-i18next";

const LogOut = (): JSX.Element => {
  const { t } = useTranslation("account");

  // I just realized that Dialog isn’t a thing yet, so
  // TODO: Make this when Dialog comes out
  return (
    <div></div>
  )
};

export default LogOut;
