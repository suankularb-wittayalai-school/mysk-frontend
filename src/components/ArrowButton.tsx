// Modules
import Link from "next/link";

// SK Components
import { MaterialIcon } from "@suankularb-components/react";

interface ArrowButtonProps {
  onClick?: Function;
  href?: string;
}

const ArrowButton = ({ onClick, href }: ArrowButtonProps) => {
  const className =
    "btn btn--filled container-secondary !grid aspect-square w-10 place-content-center !p-0";

  return onClick ? (
    <button onClick={() => onClick()} className={className}>
      <MaterialIcon icon="arrow_forward" />
    </button>
  ) : href ? (
    <Link href={href}>
      <a className={className}>
        <MaterialIcon icon="arrow_forward" />
      </a>
    </Link>
  ) : (
    <div className={className}>
      <MaterialIcon icon="arrow_forward" />
    </div>
  );
};
export default ArrowButton;
