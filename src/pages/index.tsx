// Modules
import { LinkButton, MaterialIcon } from "@suankularb-components/react";
import type { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";

// Types
import { LandingFeedItem as LandingFeedItemType } from "src/utils/types/landing";

const LandingHeader = (): JSX.Element => (
  <header
    className="flex flex-col items-center gap-16 sm:items-start p-16 font-display h-screen sm:min-h-[calc(100vh-12rem)] sm:h-fit
    bg-[url('/images/landing.png')] bg-bottom bg-cover snap-start"
  >
    <div className="flex flex-col items-center sm:flex-row sm:gap-8 text-center sm:text-left">
      <div className="relative w-40 h-40">
        <Image
          src={"/images/branding/logo-white.png"}
          layout="fill"
          priority={true}
        />
      </div>
      <div className="text-light-white font-display">
        <h1 className="text-9xl font-bold">
          My<span className="text-light-secondary-container">SK</span>
        </h1>
        <p className="text-4xl font-light">โรงเรียนสวนกุหลาบวิทยาลัย</p>
      </div>
    </div>
    <div className="flex flex-row flex-wrap justify-center gap-4">
      <LinkButton
        name="เข้าสู่ระบบ"
        type="filled"
        icon={<MaterialIcon icon="login" />}
        url="/account/login"
        LinkElement={Link}
        className="!text-light-on-tertiary-container !bg-light-tertiary-container focus:shadow-lg"
      />
      <LinkButton
        name="ช่วยเหลือ"
        type="outlined"
        url="/help"
        LinkElement={Link}
        className="!text-light-tertiary-container !bg-transparent !border-light-tertiary-container
          hover:!bg-light-tertiary-translucent-08 focus:!bg-light-tertiary-translucent-12
          focus-visible:!bg-light-tertiary"
      />
    </div>
  </header>
);

const LandingFeedItem = ({ feedItem }: { feedItem: LandingFeedItemType }) => (
  <li key={feedItem.id}>
    <Link href={feedItem.url}>
      <a className="flex flex-col gap-3 rounded-8xl group">
        <div
          className="relative grid place-items-center text-center font-display w-full aspect-[3/2] rounded-8xl
            transition-shadow group-hover:shadow group-focus:shadow-md
            bg-light-surface-variant bg-center bg-cover"
          style={{ backgroundImage: `url('${feedItem.image}')` }}
        >
          {!feedItem.image && feedItem.name}
        </div>
        <div>
          <h3 className="text-4xl font-bold font-display">{feedItem.name}</h3>
          <p className="text-xl font-display max-lines-2">{feedItem.desc}</p>
        </div>
      </a>
    </Link>
  </li>
);

const LandingFeed = ({
  feed,
}: {
  feed: Array<LandingFeedItemType>;
}): JSX.Element => {
  return (
    <section className="min-h-screen pb-20 snap-start">
      <ul className="grid grid-cols-[repeat(auto-fill,minmax(22.5rem,1fr))] gap-8 p-8">
        {feed.map((feedItem) => (
          <LandingFeedItem feedItem={feedItem} />
        ))}
      </ul>
    </section>
  );
};

const Landing: NextPage = () => {
  return (
    <div className="flex flex-col snap-y">
      <LandingHeader />
      <LandingFeed
        feed={[
          {
            id: 0,
            name: "ประกาศเกียรติคุณ",
            desc: "ประกาศเกียรติคุณโรงเรียนสวนกุหลาบวิทยาลัย ประจำปีการศึกษา 2563",
            url: "/certificate?year=2563",
          },
          {
            id: 1,
            name: "การบริหารจัดการชั้นเรียน",
            desc: "เรื่องที่พวกเราจะเล่านั้น เป็นเพียงประเด็นเล็กๆ ที่ใช้บริหารจัดการชั้นเรียนได้อยู่หมัด มันดึงความสนใจของเด็กน้อยจากมือถือได้ \
              แถมมีเสียงหัวเราะเกิดขึ้นในชั้นเรียน นักเรียนได้ค้นคว้าได้ทดลอง ได้ฝึกปฏิบัติ กิจกรรมเหล่านี้ส่งเสริมให้นักเรียนเกิดทักษะการคิดและ แลกเปลี่ยนเรียนรู้ร่วมกัน \
              ทำให้นักเรียนมีความสุขสนุกสนานในการเรียนและเกิดทักษะการรวบรวมข้อมูล คิดอย่างเป็นระบบสร้างเป็นองค์ความรู้ที่ยั่งยืนได้อย่างแท้จริง",
            url: "/online/teacher-videos",
          },
        ]}
      />
    </div>
  );
};

export default Landing;
