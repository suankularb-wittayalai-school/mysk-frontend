// Modules
import Image from "next/image";
import { useRouter } from "next/router";

// SK Components
import { Card, CardHeader, MaterialIcon } from "@suankularb-components/react";

interface TeacherCardProps {
  className?: string;
}

const TeacherCard = ({ className }: TeacherCardProps) => {
  const locale = useRouter().locale == "th" ? "th" : "en-US";

  return (
    <Card type="horizontal" className={className}>
      {/* FIXME: When Card Media is added to React SK Components, change this */}
      <div className="card__media p-[2px]">
        <div className="relative h-full w-full">
          <Image src="/images/dummybase/thanakorn.png" layout="fill" alt="" />
        </div>
      </div>

      <CardHeader
        title={
          <h4 className="font-display text-lg font-medium">ธนกร อรรจนาวัฒน์</h4>
        }
        label={
          <div className="!flex flex-row items-center divide-x divide-outline">
            <div className="flex w-fit flex-row gap-1 pr-1">
              <MaterialIcon icon="mail" className="text-primary" />
            </div>
            <span className="pl-1">ชีววิทยา</span>
          </div>
        }
      />
    </Card>
  );
};

export default TeacherCard;
