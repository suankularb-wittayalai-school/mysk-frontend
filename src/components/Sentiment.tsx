// SK Components
import { MaterialIcon } from "@suankularb-components/react";

const Sentiment = ({
  level,
  className,
}: {
  level: number;
  className?: string;
}): JSX.Element => (
  <div className={`flex flex-row items-center gap-2 ${className || ""}`}>
    {level == 1 ? (
      <>
        <MaterialIcon
          icon="sentiment_very_dissatisfied"
          className="text-tertiary"
        />
        <span>1</span>
      </>
    ) : level == 2 ? (
      <>
        <MaterialIcon icon="sentiment_dissatisfied" className="text-tertiary" />
        <span>2</span>
      </>
    ) : level == 3 ? (
      <>
        <MaterialIcon icon="sentiment_neutral" className="text-secondary" />
        <span>3</span>
      </>
    ) : level == 4 ? (
      <>
        <MaterialIcon icon="sentiment_satisfied" className="text-primary" />
        <span>4</span>
      </>
    ) : level == 5 ? (
      <>
        <MaterialIcon
          icon="sentiment_very_satisfied"
          className="text-primary"
        />
        <span>5</span>
      </>
    ) : undefined}
  </div>
);

export default Sentiment;
