import { useState, useEffect } from "react";
import { useRouter } from "next/router";

// Types
import { Session } from "@supabase/supabase-js";
import { supabase } from "@utils/supabaseClient";
import { Student, Teacher } from "@utils/types/person";
import { StudentDB, TeacherDB } from "@utils/types/database/person";
import { db2Student, db2Teacher } from "@utils/backend/database";

interface UseSessionOption {
  loginRequired?: boolean;
  adminOnly?: boolean;
}

export function useSession(option?: UseSessionOption) {
  const [session, setSession] = useState<null | Session>(null);
  const router = useRouter();

  useEffect(() => {
    if (!supabase.auth.session()) {
      setSession(null);
    }

    setSession(supabase.auth.session());

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, [router]);

  useEffect(() => {
    if (session) {
      if (option?.loginRequired && !session.user) {
        router.push("/");
      }
      if (
        session.user &&
        option?.adminOnly &&
        !session.user.user_metadata.isAdmin
      ) {
        router.push("/");
      }
    }
  }, [session, option, router]);

  return session;
}

export function useStudentAccount(
  option?: UseSessionOption
): [Student | null, Session | null] {
  const session = useSession(option);
  const router = useRouter();
  const [user, setUser] = useState<Student | null>(null);

  useEffect(() => {
    if (session) {
      if (session.user?.user_metadata.role == "student") {
        supabase
          .from<StudentDB>("student")
          .select("id, std_id, people:person(*)")
          .eq("id", session.user?.user_metadata.student)
          .single()
          .then((res) => {
            if (res.error || !res.data) {
              console.log(res.error);
              return;
            }

            db2Student(res.data).then((student) => {
              setUser(student);
            });
          });
      } else if (session.user?.user_metadata.role == "teacher") {
        router.push("/t/home");
      } else {
        router.push("/");
      }
    }
  }, [session]);
  return [user, session];
}

export function useTeacherAccount(
  option?: UseSessionOption
): [Teacher | null, Session | null] {
  const session = useSession(option);
  const router = useRouter();
  const [user, setUser] = useState<Teacher | null>(null);

  useEffect(() => {
    if (session) {
      if (session.user?.user_metadata.role == "teacher") {
        supabase
          .from<TeacherDB>("teacher")
          .select(
            "id, teacher_id, people:person(*), SubjectGroup:subject_group(*)"
          )
          .eq("id", session.user?.user_metadata.teacher)
          .single()
          .then((res) => {
            if (res.error || !res.data) {
              console.log(res.error);
              return;
            }

            db2Teacher(res.data).then((teacher) => {
              setUser(teacher);
            });
          });
      } else if (session.user?.user_metadata.role == "student") {
        router.push("/s/home");
      } else {
        router.push("/");
      }
    }
  }, [session]);
  return [user, session];
}
