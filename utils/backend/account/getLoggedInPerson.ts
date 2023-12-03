// Imports
import getUserByEmail from "@/utils/backend/account/getUserByEmail";
import { getPersonByID } from "@/utils/backend/person/getPersonByID";
import getCurrentAcademicYear from "@/utils/helpers/getCurrentAcademicYear";
import logError from "@/utils/helpers/logError";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";
import { Student, Teacher, UserRole } from "@/utils/types/person";
import { Subject } from "@/utils/types/subject";
import { GetServerSidePropsContext } from "next";
import { NextAuthOptions, getServerSession } from "next-auth";

export async function getStudentFromUserID(
  supabase: DatabaseClient,
  userID: string,
  options?: { includeContacts: boolean; detailed?: boolean },
): Promise<BackendReturn<Student>> {
  let { data: studentData, error } = await supabase
    .from("students")
    .select("*")
    .eq("user_id", userID)
    .single();

  if (error) {
    logError("getStudentFromUserID (student)", error);
    return { data: null, error };
  }

  let { data: personData, error: personError } = await getPersonByID(
    supabase,
    studentData!.person_id ?? "",
    options,
  );

  if (personError) {
    logError("getStudentFromUserID (person)", personError);
    return { data: null, error: personError };
  }

  let { data: classroomStudentData, error: classroomStudentError } =
    await supabase
      .from("classroom_students")
      .select("*")
      .eq("student_id", studentData!.id);
  // .eq("year", getCurrentAcademicYear())
  // .single();

  if (classroomStudentError) {
    logError(
      "getStudentFromUserID (classroom_students)",
      classroomStudentError,
    );
    return { data: null, error: classroomStudentError };
  }

  let { data: classroomData, error: classroomError } = await supabase
    .from("classrooms")
    .select("*")
    .in("id", [classroomStudentData!.map((cs) => cs.classroom_id)])
    .eq("year", getCurrentAcademicYear())
    .single();

  if (classroomError) {
    logError("getStudentFromUserID (classrooms)", classroomError);
    return { data: null, error: classroomError };
  }

  return {
    data: {
      ...personData!,
      id: studentData!.id,
      student_id: studentData!.student_id,
      class_no: classroomStudentData!.find(
        (cs) => cs.classroom_id === classroomData!.id,
      )!.class_no,
      classroom: {
        id: classroomData!.id,
        number: classroomData!.number,
      },
      role: UserRole.student,
    },
    error: null,
  };
}

export async function getTeacherFromUserID(
  supabase: DatabaseClient,
  userID: string,
  options?: { includeContacts: boolean; detailed?: boolean },
): Promise<BackendReturn<Teacher>> {
  let { data: teacherData, error } = await supabase
    .from("teachers")
    .select("*")
    .eq("user_id", userID)
    .single();

  if (error) {
    logError("getTeacherFromUserID (teacher)", error);
    return { data: null, error };
  }

  let { data: personData, error: personError } = await getPersonByID(
    supabase,
    teacherData!.person_id ?? "",
    options,
  );

  if (personError) {
    logError("getTeacherFromUserID (person)", personError);
    return { data: null, error: personError };
  }

  let { data: classroomTeacherData, error: classroomTeacherError } =
    await supabase
      .from("classroom_advisors")
      .select("*")
      .eq("teacher_id", teacherData!.id);

  if (classroomTeacherError) {
    logError(
      "getTeacherFromUserID (classroom_advisors)",
      classroomTeacherError,
    );
    return { data: null, error: classroomTeacherError };
  }

  let { data: classroomData, error: classroomError } = await supabase
    .from("classrooms")
    .select("*")
    .in("id", [classroomTeacherData!.map((cs) => cs.classroom_id)])
    .eq("year", getCurrentAcademicYear());

  let classroom = classroomData?.length
    ? {
        id: classroomData[0]!.id,
        number: classroomData[0]!.number,
      }
    : null;

  if (classroomError) {
    logError("getTeacherFromUserID (classrooms)", classroomError);
    return { data: null, error: classroomError };
  }

  let { data: subjectGroupData, error: subjectGroupError } = await supabase
    .from("subject_groups")
    .select("*")
    .eq("id", teacherData!.subject_group_id)
    .single();

  if (subjectGroupError) {
    logError("getTeacherFromUserID (subject_groups)", subjectGroupError);
    return { data: null, error: subjectGroupError };
  }

  let subjectsInCharge: Pick<Subject, "id" | "name" | "code" | "short_name">[] =
    [];

  if (options?.detailed) {
    let { data: subjectsInChargeData, error: subjectsInChargeError } =
      await supabase
        .from("subject_teachers")
        .select("*")
        .eq("teacher_id", teacherData!.id)
        .eq("year", getCurrentAcademicYear());

    if (subjectsInChargeError) {
      logError(
        "getTeacherFromUserID (subject_teachers)",
        subjectsInChargeError,
      );
      return { data: null, error: subjectsInChargeError };
    }

    let { data: subjectData, error: subjectError } = await supabase
      .from("subjects")
      .select("*")
      .in("id", [subjectsInChargeData!.map((cs) => cs.subject_id)]);

    if (subjectError) {
      logError("getTeacherFromUserID (subjects)", subjectError);
      return { data: null, error: subjectError };
    }

    subjectsInCharge = subjectData!.map((s) => ({
      id: s.id,
      name: {
        th: s.name_th,
        "en-US": s.name_en,
      },
      code: {
        th: s.code_th,
        "en-US": s.code_en,
      },
      short_name: {
        th: s.short_name_th ?? "",
        "en-US": s.short_name_en,
      },
    }));
  }

  return {
    data: {
      ...personData!,
      id: teacherData!.id,
      teacher_id: teacherData!.teacher_id,
      class_advisor_at: classroom,
      subject_group: {
        id: subjectGroupData!.id,
        name: {
          th: subjectGroupData!.name_th,
          "en-US": subjectGroupData!.name_en,
        },
      },
      subjects_in_charge: subjectsInCharge,
      role: UserRole.teacher,
    },
    error: null,
  };
}

export default async function getLoggedInPerson(
  supabase: DatabaseClient,
  authOptions: NextAuthOptions,
  req: GetServerSidePropsContext["req"],
  res: GetServerSidePropsContext["res"],
  options?: { includeContacts: boolean; detailed?: boolean },
): Promise<BackendReturn<Student | Teacher>> {
  const data = await getServerSession(req, res, authOptions);

  if (!data) {
    const error = { message: "no logged in user is found" };
    logError("getLoggedInPerson", error);
    return { data: null, error };
  }

  const { data: user, error } = await getUserByEmail(
    supabase,
    data.user!.email as string,
  );

  if (error) {
    logError("getLoggedInPerson", error);
    return { data: null, error };
  }

  let loggedInAccount: Student | Teacher | null = null;

  switch (user!.role) {
    case UserRole.student:
      const { data, error } = await getStudentFromUserID(
        supabase,
        user!.id,
        options,
      );
      if (error) {
        logError("getLoggedInPerson", error);
        return { data: null, error };
      }
      loggedInAccount = { ...data!, is_admin: user!.is_admin };
      break;

    case UserRole.teacher:
      const { data: teacherData, error: teacherError } =
        await getTeacherFromUserID(supabase, user!.id, options);
      if (teacherError) {
        logError("getLoggedInPerson", teacherError);
        return { data: null, error: teacherError };
      }
      loggedInAccount = { ...teacherData!, is_admin: user!.is_admin };
      break;
  }

  if (!loggedInAccount) {
    const error = { message: "no logged in user is found" };
    logError("getLoggedInPerson", error);
    return { data: null, error };
  }

  return { data: loggedInAccount, error: null };
}

