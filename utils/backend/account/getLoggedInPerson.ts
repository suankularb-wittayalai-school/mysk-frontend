import getUserByEmail from "@/utils/backend/account/getUserByEmail";
import { logError } from "@/utils/helpers/debug";
import { mergeDBLocales } from "@/utils/helpers/string";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";
import { Contact } from "@/utils/types/contact";
import { Student, Teacher } from "@/utils/types/person";
import { GetServerSidePropsContext } from "next";
import { NextAuthOptions, getServerSession } from "next-auth";

import { getPersonByID } from "@/utils/backend/person/getPersonByID";
import { getCurrentAcademicYear } from "@/utils/helpers/date";

async function getStudentFromUserID(
  supabase: DatabaseClient,
  userID: string,
  options?: { includeContacts: boolean, detailed?: boolean },
): Promise<BackendReturn<Student>> {
  let { data: studentData, error } = await supabase
    .from("students")
    .select("*")
    .eq("user_id", userID)
    .single();

  if (error) {
    logError("getStudentFromUserID (student)", error)
    return { data: null, error };
  }

  let { data: personData, error: personError } = await getPersonByID(supabase, studentData!.person_id ?? "", options);

  if (personError) {
    logError("getStudentFromUserID (person)", personError)
    return { data: null, error: personError };
  }

  let { data: classroomStudentData, error: classroomStudentError } = await supabase
    .from("classroom_students")
    .select("*")
    .eq("student_id", studentData!.id);
    // .eq("year", getCurrentAcademicYear())
    // .single();

    if (classroomStudentError) {
        logError("getStudentFromUserID (classroom_students)", classroomStudentError)
        return { data: null, error: classroomStudentError };
    }

    // console.log({studentData, classroomStudentData})

    let { data: classroomData, error: classroomError } = await supabase
    .from("classrooms")
    .select("*")
    .in("id", [classroomStudentData!.map((cs) => cs.classroom_id)])
    .eq("year", getCurrentAcademicYear())
    .single();

    if (classroomError) {
        logError("getStudentFromUserID (classrooms)", classroomError)
        return { data: null, error: classroomError };
    }

  return {
    data: {
      ...personData!,
      id: studentData!.id,
      student_id: studentData!.student_id,
      class_no: classroomStudentData!.find((cs) => cs.classroom_id === classroomData!.id)!.class_no,
      classroom: {
        id: classroomData!.id,
        number: classroomData!.number,
      },
      role: "student",
    },
    error: null,
  };
}

export default async function getLoggedInPerson(
  supabase: DatabaseClient,
  req: GetServerSidePropsContext["req"],
  res: GetServerSidePropsContext["res"],
  authOptions: NextAuthOptions,
  options?: { includeContacts: boolean, detailed?: boolean },
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

  if (!user) {
    logError("getLoggedInPerson", error);
    return { data: null, error };
  }

  let loggedInAccount: Student | Teacher | null = null;

  switch (user.role) {
    case "student":
      const {data, error} = await getStudentFromUserID(supabase, user.id, options)
      if (error) {
        logError("getLoggedInPerson", error);
        return { data: null, error };
      }
      loggedInAccount = data;
      break;
  }

  if (!loggedInAccount) {
    const error = { message: "no logged in user is found" };
    logError("getLoggedInPerson", error);
    return { data: null, error };
  }

  return { data: loggedInAccount, error: null };
}
