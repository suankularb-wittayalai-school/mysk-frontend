// Imports
import getUserByEmail from "@/utils/backend/account/getUserByEmail";
import { getStudentByID } from "@/utils/backend/person/getStudentByID";
import { getTeacherByID } from "@/utils/backend/person/getTeacherByID";
import logError from "@/utils/helpers/logError";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";
import { Student, Teacher, UserRole } from "@/utils/types/person";
import { GetServerSidePropsContext } from "next";
import { NextAuthOptions, getServerSession } from "next-auth";

export async function getStudentFromUserID(
  supabase: DatabaseClient,
  userID: string,
  options?: { includeContacts: boolean; detailed?: boolean },
): Promise<BackendReturn<Student>> {
  let { data: studentData, error: studentDataError } = await supabase
    .from("students")
    .select("*")
    .eq("user_id", userID)
    .single();

  if (studentDataError) {
    logError("getStudentFromUserID", studentDataError);
    return { data: null, error: studentDataError };
  }

  return (await getStudentByID(
    supabase,
    studentData!.id,
    options,
  )) as BackendReturn<Student>;
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

  return (await getTeacherByID(
    supabase,
    teacherData!.id,
    options,
  )) as BackendReturn<Teacher>;
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
