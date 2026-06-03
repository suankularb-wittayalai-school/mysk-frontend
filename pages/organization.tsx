import useMySKClient from "@/utils/backend/mysk/useMySKClient";
import { useRouter } from "next/router";
import { useEffect } from "react";

const OrganizationPage = () => {
  const mysk = useMySKClient();
  const router = useRouter();
  useEffect(() => {
    if (mysk.user?.email == "kornor@sk.ac.th") router.push("/club");
  }, []);
};

export default OrganizationPage;
