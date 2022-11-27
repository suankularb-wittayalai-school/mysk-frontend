// External libraries
import { AnimatePresence, motion } from "framer-motion";

import {
  GetServerSideProps,
  NextApiRequest,
  NextApiResponse,
  NextPage,
} from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";

import { Trans, useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import {
  MutableRefObject,
  ReactNode,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";

import {
  createServerSupabaseClient,
  User,
} from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";

// SK Components
import {
  RegularLayout,
  Title,
  MaterialIcon,
  Section,
  LayoutGridCols,
  Card,
  CardHeader,
  CardSupportingText,
  Header,
  Actions,
  Button,
  KeyboardInput,
  CardActions,
  NativeInput,
  Dropdown,
} from "@suankularb-components/react";

// Components
import LogOutDialog from "@components/dialogs/LogOut";

// Animations
import { animationSpeed, animationTransition } from "@utils/animations/config";

// Backend
import {
  getPersonFromUser,
  getPersonIDFromUser,
  setupPerson,
} from "@utils/backend/person/person";
import { getSubjectGroups } from "@utils/backend/subject/subjectGroup";
import {
  addVaccineRecord,
  deleteVaccineRecord,
  getVaccineRecordbyPersonId,
  updateVaccineRecords,
} from "@utils/backend/vaccine";
import { getUserMetadata } from "@utils/backend/account";

// Helpers
import { getLocalePath, getLocaleString } from "@utils/helpers/i18n";
import { createTitleStr } from "@utils/helpers/title";
import { validateCitizenID, validatePassport } from "@utils/helpers/validators";
import { withLoading } from "@utils/helpers/loading";

// Hooks
import { useToggle } from "@utils/hooks/toggle";

// Types
import { LangCode } from "@utils/types/common";
import { DefaultTHPrefix, Role, Student, Teacher } from "@utils/types/person";
import { SubjectGroup } from "@utils/types/subject";
import { VaccineRecord } from "@utils/types/vaccine";

// Miscellaneous
import { prefixMap } from "@utils/maps";
import { classPattern, studentIDRegex } from "@utils/patterns";

// Sections
const HeroSection = ({
  role,
  incrementStep,
  toggleShowLogOut,
  disabled,
}: {
  role: Role;
  incrementStep: () => void;
  toggleShowLogOut: () => void;
  disabled?: boolean;
}): JSX.Element => {
  const { t } = useTranslation("landing");

  return (
    <LayoutGridCols cols={3}>
      <Section className="sm:!gap-4 md:col-span-2">
        <div>
          <Image
            src="/images/welcome.svg"
            alt={t("welcome.hero.graphicAlt")}
            width={142}
            height={96}
          />
        </div>
        <div className="gap-2 font-display">
          <h2 className="text-7xl leading-tight">{t("welcome.hero.title")}</h2>
          <p className="text-3xl">{t(`welcome.hero.subtitle.${role}`)}</p>
        </div>
        <p>{t("welcome.hero.notice")}</p>
        <Actions className="mt-2">
          <Button
            label={t("welcome.hero.action.logOut")}
            type="outlined"
            icon={<MaterialIcon icon="logout" />}
            onClick={toggleShowLogOut}
            disabled={disabled}
            isDangerous
          />
          <Button
            label={t("welcome.hero.action.continue")}
            type="filled"
            icon={<MaterialIcon icon="arrow_downward" />}
            onClick={incrementStep}
            disabled={disabled}
          />
        </Actions>
      </Section>
      <Section className="!hidden sm:!flex">
        <Header
          icon={<MaterialIcon icon="checklist" allowCustomSize />}
          text={t("welcome.nextSteps.title")}
        />
        {[
          {
            icon: <MaterialIcon icon="badge" />,
            title: t("welcome.nextSteps.dataCheck.title"),
            desc: t("welcome.nextSteps.dataCheck.desc"),
          },
          {
            icon: <MaterialIcon icon="vaccines" />,
            title: t("welcome.nextSteps.vaccine.title"),
            desc: t("welcome.nextSteps.vaccine.desc"),
          },
          {
            icon: <MaterialIcon icon="password" />,
            title: t("welcome.nextSteps.newPassword.title"),
            desc: t("welcome.nextSteps.newPassword.desc"),
          },
          {
            icon: <MaterialIcon icon="login" />,
            title: t("welcome.nextSteps.done.title"),
            desc: t("welcome.nextSteps.done.desc"),
          },
        ].map(
          (step) =>
            step && (
              <Card key={step.title} type="stacked" appearance="tonal">
                <CardHeader icon={step.icon} title={<h3>{step.title}</h3>} />
                <CardSupportingText>{step.desc}</CardSupportingText>
              </Card>
            )
        )}
      </Section>
    </LayoutGridCols>
  );
};

const DataCheckSection = ({
  user,
  subjectGroups,
  incrementStep,
  setRef,
  canSetRef,
  disabled,
}: {
  user: Student | Teacher;
  subjectGroups: SubjectGroup[];
  incrementStep: () => void;
  setRef: (ref: MutableRefObject<any>) => void;
  canSetRef?: boolean;
  disabled?: boolean;
}): JSX.Element => {
  const { t } = useTranslation(["landing", "account"]);
  const supabase = useSupabaseClient();
  const email = useUser()?.email;
  const locale = useRouter().locale as LangCode;

  const sectionRef = useRef<any>();
  useEffect(() => {
    if (canSetRef) setTimeout(() => setRef(sectionRef), animationSpeed);
  }, [canSetRef]);

  const [loading, toggleLoading] = useToggle();

  // Form control
  const [form, setForm] = useState({
    thPrefix: user.prefix.th,
    thFirstName: user.name.th.firstName,
    thMiddleName: user.name.th.middleName || "",
    thLastName: user.name.th.lastName,
    enPrefix: user.prefix["en-US"] || "",
    enFirstName: user.name["en-US"]?.firstName || "",
    enMiddleName: user.name["en-US"]?.middleName || "",
    enLastName: user.name["en-US"]?.lastName || "",
    studentID: user.role == "student" ? user.studentID : "",
    citizenID: user.citizenID,
    birthDate: user.birthdate,
    email: email || "",
    subjectGroup: user.role == "teacher" ? user.subjectGroup.id : 0,
    classAdvisorAt:
      user.role == "teacher" && user.classAdvisorAt
        ? user.classAdvisorAt.number
        : 0,
  });

  // Form validation
  function validate(): boolean {
    // Thai name is required
    if (!form.thPrefix) return false;
    if (!form.thFirstName) return false;
    if (!form.thLastName) return false;

    // If the prefix is not custom, the English translation must match the
    // Thai prefix
    if (
      Object.keys(prefixMap).includes(form.thPrefix) &&
      form.enPrefix &&
      prefixMap[form.thPrefix as DefaultTHPrefix] != form.enPrefix
    )
      return false;

    // If Thai middle name is present, a transliteration must be provided
    if (form.thMiddleName && !form.enMiddleName) return false;

    // If the user chooses to input English name, it must be complete
    if (
      (form.enFirstName || form.enLastName) &&
      (!form.enFirstName || !form.enLastName)
    )
      return false;

    // General information are required
    if (!form.birthDate) return false;
    if (!form.email) return false;

    // Student ID validation
    if (
      user.role == "student" &&
      (!form.studentID || !studentIDRegex.test(form.studentID))
    )
      return false;

    // Citizen ID validation
    if (!validateCitizenID(form.citizenID) && !validatePassport(form.citizenID))
      return false;

    return true;
  }

  return (
    <motion.div
      initial={{ scale: 0.8, y: -280, opacity: 0 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      exit={{ scale: 0.8, y: -280, opacity: 0 }}
      transition={animationTransition}
      ref={sectionRef}
    >
      <Section
        // Bottom Navigation blocks some of the Subject Group options on mobile.
        // 144px just about show every option.
        style={{ paddingBottom: user.role == "teacher" && !disabled ? 144 : 0 }}
      >
        <Header
          icon={<MaterialIcon icon="badge" allowCustomSize />}
          text={t("welcome.dataCheck.title")}
        />

        <p>{t("welcome.dataCheck.desc")}</p>

        {/* Local name (Thai) */}
        <section>
          <h3 className="mb-1 font-display text-xl font-bold">
            {t("profile.name.title", { ns: "account" })}
          </h3>
          <div className="layout-grid-cols-4 !gap-y-0">
            <KeyboardInput
              name="th-prefix"
              type="text"
              label={t("profile.name.prefix", { ns: "account" })}
              helperMsg={t("profile.name.prefix_helper", { ns: "account" })}
              onChange={(e) => setForm({ ...form, thPrefix: e })}
              defaultValue={user.prefix.th}
              attr={{ disabled }}
            />
            <KeyboardInput
              name="th-first-name"
              type="text"
              label={t("profile.name.firstName", { ns: "account" })}
              onChange={(e) => setForm({ ...form, thFirstName: e })}
              defaultValue={user.name.th.firstName}
              attr={{ disabled }}
            />
            <KeyboardInput
              name="th-middle-name"
              type="text"
              label={t("profile.name.middleName", { ns: "account" })}
              onChange={(e) => setForm({ ...form, thMiddleName: e })}
              defaultValue={user.name.th.middleName}
              attr={{ disabled }}
            />
            <KeyboardInput
              name="th-last-name"
              type="text"
              label={t("profile.name.lastName", { ns: "account" })}
              onChange={(e) => setForm({ ...form, thLastName: e })}
              defaultValue={user.name.th.lastName}
              attr={{ disabled }}
            />
          </div>
        </section>

        {/* English name */}
        <section>
          <h3 className="mb-1 font-display text-xl font-bold">
            {t("profile.enName.title", { ns: "account" })}
          </h3>
          <div className="layout-grid-cols-4 !gap-y-0">
            <KeyboardInput
              name="en-prefix"
              type="text"
              label={t("profile.enName.prefix", { ns: "account" })}
              helperMsg={t("profile.enName.prefix_helper", { ns: "account" })}
              onChange={(e) => setForm({ ...form, enPrefix: e })}
              defaultValue={user.prefix["en-US"]}
              attr={{ disabled }}
            />
            <KeyboardInput
              name="en-first-name"
              type="text"
              label={t("profile.enName.firstName", { ns: "account" })}
              onChange={(e) => setForm({ ...form, enFirstName: e })}
              defaultValue={user.name["en-US"]?.firstName}
              attr={{ disabled }}
            />
            <KeyboardInput
              name="en-middle-name"
              type="text"
              label={t("profile.enName.middleName", { ns: "account" })}
              onChange={(e) => setForm({ ...form, enMiddleName: e })}
              defaultValue={user.name["en-US"]?.middleName}
              attr={{ disabled }}
            />
            <KeyboardInput
              name="en-last-name"
              type="text"
              label={t("profile.enName.lastName", { ns: "account" })}
              onChange={(e) => setForm({ ...form, enLastName: e })}
              defaultValue={user.name["en-US"]?.lastName}
              attr={{ disabled }}
            />
          </div>
        </section>

        {/* General info */}
        <section>
          <h3 className="mb-1 font-display text-xl font-bold">
            {t("profile.general.title", { ns: "account" })}
          </h3>
          <div className="layout-grid-cols-4 !gap-y-0">
            <KeyboardInput
              name="citizen-id"
              type="text"
              label={t("profile.general.citizenID", { ns: "account" })}
              errorMsg={
                !validateCitizenID(form.citizenID) &&
                !validatePassport(form.citizenID)
                  ? t("profile.general.citizenID_error", { ns: "account" })
                  : undefined
              }
              onChange={(e) => setForm({ ...form, citizenID: e })}
              defaultValue={user.citizenID}
              attr={{ disabled }}
            />
            <NativeInput
              name="birth-date"
              type="date"
              label={t("profile.general.birthDate", { ns: "account" })}
              onChange={(e) => setForm({ ...form, birthDate: e })}
              defaultValue={user.birthdate}
              attr={{ disabled }}
            />
            <KeyboardInput
              name="email"
              type="text"
              label={t("profile.general.email", { ns: "account" })}
              onChange={(e) => setForm({ ...form, email: e })}
              defaultValue={email}
              attr={{ disabled }}
            />
          </div>
        </section>

        {/* Role */}
        <section>
          <h3 className="mb-1 font-display text-xl font-bold">
            {t("profile.role.title", { ns: "account" })}
          </h3>
          <div className="layout-grid-cols-4 !gap-y-0">
            {user.role == "teacher" ? (
              <>
                <Dropdown
                  name="subject-group"
                  label={t("profile.role.subjectGroup", { ns: "account" })}
                  options={subjectGroups.map((subjectGroup) => ({
                    value: subjectGroup.id,
                    label: getLocaleString(subjectGroup.name, locale),
                  }))}
                  helperMsg={t("profile.role.subjectGroup_helper", {
                    ns: "account",
                  })}
                  onChange={(e: number) =>
                    setForm({ ...form, subjectGroup: e })
                  }
                  defaultValue={user.subjectGroup.id}
                />
                <KeyboardInput
                  name="class-advisor-at"
                  type="text"
                  label={t("profile.role.classAdvisorAt", { ns: "account" })}
                  helperMsg={t("profile.role.classAdvisorAt_helper", {
                    ns: "account",
                  })}
                  errorMsg={t("profile.role.classAdvisorAt_error", {
                    ns: "account",
                  })}
                  useAutoMsg
                  onChange={(e) =>
                    setForm({ ...form, classAdvisorAt: parseInt(e) })
                  }
                  defaultValue={user.classAdvisorAt?.number || ""}
                  attr={{ pattern: classPattern, disabled }}
                />
              </>
            ) : (
              <KeyboardInput
                name="student-id"
                type="number"
                label={t("profile.role.studentID", { ns: "account" })}
                onChange={(e) => setForm({ ...form, studentID: e })}
                defaultValue={user.studentID}
                attr={{ min: 10000, max: 99999, disabled }}
              />
            )}
          </div>
        </section>

        <Actions>
          <Button
            label={t("welcome.dataCheck.action.continue")}
            type="filled"
            icon={<MaterialIcon icon="arrow_downward" />}
            onClick={async () => {
              toggleLoading();
              const { error } = await setupPerson(supabase, form, user);
              toggleLoading();

              if (error) return;
              incrementStep();
            }}
            disabled={disabled || !validate() || loading}
          />
        </Actions>
      </Section>
    </motion.div>
  );
};

const VaccineDataSection = ({
  vaccineRecords,
  incrementStep,
  setRef,
  canSetRef,
  disabled,
}: {
  incrementStep: () => void;
  setRef: (ref: MutableRefObject<any>) => void;
  canSetRef?: boolean;
  disabled?: boolean;
  vaccineRecords: VaccineRecord[];
}) => {
  const supabase = useSupabaseClient();
  const { t } = useTranslation(["landing", "covid"]);
  const user = useUser()!;

  const sectionRef = useRef<any>();
  useEffect(() => {
    if (canSetRef) setTimeout(() => setRef(sectionRef), animationSpeed);
  }, [canSetRef]);

  const [loading, toggleLoading] = useToggle();

  const [form, setForm] = useState({ date: "", provider: "comirnaty" });

  const [vaccineData, setVaccineData] =
    useState<VaccineRecord[]>(vaccineRecords);

  // Information from https://covid19.trackvaccines.org/country/thailand/
  const providerOption = [
    { value: "comirnaty", label: "Comirnaty (Pfizer)" },
    { value: "coronavac", label: "CoronaVac (Sinovac)" },
    { value: "vaxzevria", label: "Vaxzevria (AstraZeneca)" },
    { value: "spikevax", label: "Spikevax (Moderna)" },
    { value: "jcovden", label: "Jcovden (J&J)" },
    { value: "covilo", label: "Covilo (Sinopharm)" },
    {
      value: "covovax",
      label: "COVOVAX (Novavax formulation)",
    },
  ];

  const validate = () => {
    if (vaccineData.length == 0) return false;
    return vaccineData.every((vaccine) => {
      return vaccine.vaccineDate && vaccine.vaccineName;
    });
  };

  const validateForm = () => {
    if (!form.date || !form.provider) return false;
    return true;
  };

  return (
    <motion.div
      initial={{ scale: 0.8, y: -280, opacity: 0 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      exit={{ scale: 0.8, y: -280, opacity: 0 }}
      transition={animationTransition}
      ref={sectionRef}
    >
      <Section>
        <Header
          icon={<MaterialIcon icon="vaccines" allowCustomSize />}
          text={t("welcome.vaccineData.title")}
        />
        <LayoutGridCols cols={2}>
          <div>
            <Card
              type="stacked"
              appearance="outlined"
              className="!overflow-visible"
            >
              <CardHeader
                icon="add_circle"
                title={t("welcome.vaccineData.header.addCard")}
              />
              <CardSupportingText>
                <p>{t("welcome.vaccineData.instruction")}</p>
                <p>{t("welcome.vaccineData.notice")}</p>
              </CardSupportingText>
              <section className="flex flex-col justify-center p-4">
                <div className="layout-grid-cols-2 !gap-y-0">
                  <NativeInput
                    name="vaccine-date"
                    type="date"
                    label={t("vaccine.date.label", { ns: "covid" })}
                    onChange={(e) => setForm({ ...form, date: e })}
                    attr={{ disabled }}
                  />
                  <Dropdown
                    name="vaccine-provider"
                    label={t("vaccine.provider.label", { ns: "covid" })}
                    options={providerOption}
                    onChange={(e) => setForm({ ...form, provider: e })}
                  />
                </div>
              </section>
              <CardActions>
                <Button
                  label={t("welcome.vaccineData.action.add")}
                  type="filled"
                  onClick={async () => {
                    const { data: personID } = await getPersonIDFromUser(
                      supabase,
                      user
                    );
                    withLoading(
                      async () => {
                        await addVaccineRecord(
                          supabase,
                          {
                            id: 0,
                            doseNo: 0,
                            lotNo: "",
                            vaccineDate: form.date,
                            administeredBy: "",
                            vaccineName: form.provider,
                          },
                          personID!
                        );
                        const { data: newVaccineRecords } =
                          await getVaccineRecordbyPersonId(supabase, personID!);

                        setVaccineData(newVaccineRecords);
                        return true;
                      },
                      toggleLoading,
                      { hasEndToggle: true }
                    );
                  }}
                  disabled={disabled || !validateForm() || loading}
                />
              </CardActions>
            </Card>
          </div>
          <AnimatePresence>
            {vaccineData.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={animationTransition}
                className="flex flex-col gap-4"
              >
                {vaccineData.map((vaccine) => (
                  <Card
                    key={vaccine.id}
                    type="stacked"
                    appearance="tonal"
                    className="!overflow-visible"
                  >
                    <CardHeader
                      title={t("welcome.vaccineData.header.vaccineCard", {
                        doseNo: vaccine.doseNo,
                      })}
                      end={
                        <Button
                          icon={<MaterialIcon icon="delete" />}
                          iconOnly
                          isDangerous
                          onClick={async () => {
                            toggleLoading();
                            const { data: personid } =
                              await getPersonIDFromUser(supabase, user!);

                            await deleteVaccineRecord(supabase, vaccine.id);
                            const { data: newVaccineRecords } =
                              await getVaccineRecordbyPersonId(
                                supabase,
                                personid!
                              );
                            setVaccineData(newVaccineRecords);
                            toggleLoading();
                          }}
                          disabled={disabled || loading}
                          type="text"
                        />
                      }
                    />
                    <section className="flex flex-col justify-center p-4">
                      <div className="layout-grid-cols-2 !gap-y-0">
                        <NativeInput
                          name="vaccine-date"
                          type="date"
                          label={t("vaccine.date.label", { ns: "covid" })}
                          onChange={(e) => {
                            // edit vaccine data state by editting the vaccineData array
                            const newVaccineData = vaccineData.map((v) => {
                              if (v.id === vaccine.id) {
                                return {
                                  ...v,
                                  vaccineDate: e,
                                };
                              }
                              return v;
                            });
                            setVaccineData(newVaccineData);
                          }}
                          attr={{ disabled }}
                          defaultValue={vaccine.vaccineDate}
                        />
                        <Dropdown
                          name="vaccine-provider"
                          label={t("vaccine.provider.label", { ns: "covid" })}
                          // info from https://covid19.trackvaccines.org/country/thailand/
                          options={providerOption}
                          onChange={(e: string) => {
                            // edit vaccine data state by editting the vaccineData array
                            const newVaccineData = vaccineData.map((v) => {
                              if (v.id === vaccine.id) {
                                return {
                                  ...v,
                                  vaccineName: e,
                                };
                              }
                              return v;
                            });
                            setVaccineData(newVaccineData);
                          }}
                          defaultValue={vaccine.vaccineName}
                        />
                      </div>
                    </section>
                  </Card>
                ))}
              </motion.div>
            )}
            {!loading && vaccineData.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={animationTransition}
              >
                <Card type="stacked" appearance="tonal" className="mb-4">
                  <CardHeader
                    icon={"badge"}
                    title={t("welcome.vaccineData.header.noVaccineCard")}
                  />
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
          {/* <div className=" col-span-3 md:col-start-5">
            
          </div> */}
        </LayoutGridCols>
        <Actions>
          <Button
            label={t("welcome.dataCheck.action.continue")}
            type="filled"
            icon={<MaterialIcon icon="arrow_downward" />}
            onClick={async () => {
              toggleLoading();

              const { data: personid } = await getPersonIDFromUser(
                supabase,
                user!
              );

              const { error } = await updateVaccineRecords(
                supabase,
                vaccineData,
                personid!
              );
              toggleLoading();
              if (error) {
                return;
              }

              incrementStep();
            }}
            disabled={disabled || !validate() || loading}
          />
        </Actions>
      </Section>
    </motion.div>
  );
};

const NewPasswordSection = ({
  incrementStep,
  setRef,
  canSetRef,
  disabled,
}: {
  incrementStep: () => void;
  setRef: (ref: MutableRefObject<any>) => void;
  canSetRef?: boolean;
  disabled?: boolean;
}): JSX.Element => {
  const supabase = useSupabaseClient();
  const user = useUser();
  const { t } = useTranslation(["landing", "account"]);

  const sectionRef = useRef<any>();
  useEffect(() => {
    if (canSetRef) setTimeout(() => setRef(sectionRef), animationSpeed);
  }, [canSetRef]);

  const [loading, toggleLoading] = useToggle();

  // Form control
  const [form, setForm] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });

  // Form validation
  function validate(): boolean {
    if (form.newPassword.length < 8) return false;
    if (form.confirmNewPassword.length < 8) return false;
    if (form.newPassword != form.confirmNewPassword) return false;

    return true;
  }

  return (
    <motion.div
      initial={{ scale: 0.8, y: -280, opacity: 0 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      exit={{ scale: 0.8, y: -280, opacity: 0 }}
      transition={animationTransition}
      ref={sectionRef}
    >
      <Section>
        <Header
          icon={<MaterialIcon icon="password" allowCustomSize />}
          text={t("welcome.newPassword.title")}
        />

        <p>{t("welcome.newPassword.desc")}</p>

        <LayoutGridCols cols={6}>
          <div className="col-span-4 md:col-start-2">
            <KeyboardInput
              name="new-password"
              type="password"
              label={t("dialog.changePassword.newPwd", { ns: "account" })}
              errorMsg={t("dialog.changePassword.newPwd_error", {
                ns: "account",
              })}
              useAutoMsg
              onChange={(e) => setForm({ ...form, newPassword: e })}
              attr={{ minLength: 8, disabled }}
            />
            <KeyboardInput
              name="confirm-new-password"
              type="password"
              label={t("dialog.changePassword.confirmNewPwd", {
                ns: "account",
              })}
              errorMsg={
                form.confirmNewPassword &&
                form.newPassword != form.confirmNewPassword
                  ? t("dialog.changePassword.confirmNewPwd_error", {
                      ns: "account",
                    })
                  : undefined
              }
              onChange={(e) => setForm({ ...form, confirmNewPassword: e })}
              attr={{ minLength: 8, disabled }}
            />
          </div>
        </LayoutGridCols>

        <Actions>
          <Button
            label={t("welcome.newPassword.action.continue")}
            type="filled"
            icon={
              <MaterialIcon
                icon="arrow_downward"
                className="rotate-0 transition-[transform] sm:-rotate-90"
              />
            }
            onClick={async () => {
              toggleLoading();
              const { error: pwdError } = await supabase.auth.updateUser({
                password: form.newPassword,
              });
              if (pwdError) return;

              const { error: sbUserError } = await supabase.auth.updateUser({
                data: { onboarded: true },
              });
              if (sbUserError) return;

              const { error: userError } = await supabase
                .from("users")
                .update({ onboarded: true })
                .match({ id: user!.id });
              if (userError) return;

              toggleLoading();

              incrementStep();
            }}
            disabled={disabled || !validate() || loading}
          />
        </Actions>
      </Section>
    </motion.div>
  );
};

const DoneSection = ({
  role,
  setRef,
  canSetRef,
}: {
  role: Role;
  setRef: (ref: MutableRefObject<any>) => void;
  canSetRef?: boolean;
}): JSX.Element => {
  const supabase = useSupabaseClient();
  const user = useUser();
  const router = useRouter();
  const { t } = useTranslation("landing");

  const [loading, toggleLoading] = useToggle();

  const sectionRef = useRef<any>();
  useEffect(() => {
    if (canSetRef) setTimeout(() => setRef(sectionRef), animationSpeed);
  }, [canSetRef]);

  return (
    <motion.div
      initial={{ scale: 0.4, y: 0, opacity: 0 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      exit={{ scale: 0.4, y: 0, opacity: 0 }}
      transition={animationTransition}
      ref={sectionRef}
    >
      <Section>
        <Header
          icon={<MaterialIcon icon="login" allowCustomSize />}
          text={t("welcome.done.title")}
        />

        <LayoutGridCols cols={6}>
          <Card
            type="stacked"
            appearance="tonal"
            className="col-span-4 md:col-start-2"
          >
            {/* FIXME: When Card Media is added to React SK Components, change this */}
            <div className="card__media relative h-60">
              <Image
                src="/images/graphics/login.webp"
                layout="fill"
                objectFit="cover"
                alt={t("logIn.graphicAlt", { ns: "account" })}
              />
            </div>
            <CardSupportingText>
              <p>
                <Trans i18nKey="welcome.done.desc" ns="landing">
                  Everything is ready for you to start using MySK. If you have
                  any questions or concerns, visit the{" "}
                  <a href="/help" target="mysk-help" className="link">
                    help page
                  </a>
                  .
                </Trans>
              </p>
            </CardSupportingText>
            <CardActions>
              <Button
                label={t("welcome.done.action.finish")}
                type="filled"
                className="w-full !text-center"
                onClick={() =>
                  withLoading(async () => {
                    // Verify that the user is onboarded before continuing
                    const { data, error } = await supabase
                      .from("users")
                      .select("onboarded")
                      .match({ id: user!.id })
                      .limit(1)
                      .single();
                    console.log({ data, error });
                    if (error) return false;
                    if (!data!.onboarded) return false;

                    // Redirect
                    if (role == "teacher") router.push("/teach");
                    else router.push("/learn");
                    return true;
                  }, toggleLoading)
                }
                disabled={loading}
              />
            </CardActions>
          </Card>
        </LayoutGridCols>
      </Section>
    </motion.div>
  );
};

// Page
const Welcome: NextPage<{
  person: Student | Teacher;
  subjectGroups: SubjectGroup[];
  vaccineRecords: VaccineRecord[];
}> & {
  getLayout?: (page: NextPage) => ReactNode;
} = ({ person: user, subjectGroups, vaccineRecords }) => {
  const { t } = useTranslation(["landing", "common"]);

  const [currStep, incrementStep] = useReducer((value) => value + 1, 0);
  const [currStepRef, setCurrStepRef] = useState<MutableRefObject<any>>();
  useEffect(() => {
    if (currStepRef) currStepRef.current.scrollIntoView();
  }, [currStepRef]);

  // Dialog control
  const [showLogOut, toggleShowLogOut] = useToggle();

  return (
    <>
      <Head>
        <title>{createTitleStr(t("welcome.title"), t)}</title>
      </Head>

      <RegularLayout
        Title={
          <Title
            name={{ title: t("welcome.title") }}
            pageIcon={<MaterialIcon icon="waving_hand" />}
            backGoesTo={toggleShowLogOut}
          />
        }
      >
        <AnimatePresence>
          <HeroSection
            key="hero-section"
            role={user.role}
            incrementStep={incrementStep}
            toggleShowLogOut={toggleShowLogOut}
            disabled={currStep >= 1}
          />
          {currStep >= 1 && (
            <DataCheckSection
              key="data-check-section"
              user={user}
              subjectGroups={subjectGroups}
              incrementStep={incrementStep}
              setRef={setCurrStepRef}
              canSetRef={currStep >= 1}
              disabled={currStep >= 2}
            />
          )}
          {currStep >= 2 && (
            <VaccineDataSection
              key={"vaccine-data-section"}
              incrementStep={incrementStep}
              setRef={setCurrStepRef}
              canSetRef={currStep >= 2}
              disabled={currStep >= 3}
              vaccineRecords={vaccineRecords}
            />
          )}
          {currStep >= 3 && (
            <div className="layout-grid-cols-2 !gap-y-[inherit]">
              <NewPasswordSection
                key="new-password-section"
                incrementStep={incrementStep}
                setRef={setCurrStepRef}
                canSetRef={currStep >= 3}
                disabled={currStep >= 4}
              />
              {currStep >= 4 && (
                <DoneSection
                  key="done-section"
                  role={user.role}
                  setRef={setCurrStepRef}
                  canSetRef={currStep >= 3}
                />
              )}
            </div>
          )}
        </AnimatePresence>
      </RegularLayout>

      {/* Dialogs */}
      <LogOutDialog show={showLogOut} onClose={toggleShowLogOut} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  req,
  res,
}) => {
  const supabase = createServerSupabaseClient({
    req: req as NextApiRequest,
    res: res as NextApiResponse,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { data: metadata, error: metadataError } = await getUserMetadata(
    supabase,
    session!.user.id
  );
  if (metadataError) console.error(metadataError);
  if (metadata?.onboarded)
    return {
      redirect: {
        destination: getLocalePath(
          metadata!.role == "teacher" ? "/teach" : "/learn",
          locale as LangCode
        ),
        permanent: false,
      },
    };

  const { data: person } = await getPersonFromUser(
    supabase,
    session!.user as User
  );

  const { data: subjectGroups } = await getSubjectGroups();

  const { data: personId } = await getPersonIDFromUser(
    supabase,
    session!.user as User
  );

  const { data: vaccineRecords } = await getVaccineRecordbyPersonId(
    supabase,
    personId!
  );

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "account",
        "landing",
        "covid",
      ])),
      person,
      subjectGroups,
      vaccineRecords,
    },
  };
};

export default Welcome;

