import { useState, useEffect } from "react";
import { useRouter } from "next/router";

// Types
import { Session } from "@supabase/supabase-js";
import { supabase } from "@utils/supabaseClient";
import { Student, Teacher } from "@utils/types/person";
import { StudentDB, TeacherDB } from "@utils/types/database/person";
import { db2student, db2teacher } from "@utils/backend/database";

export function useSession() {
  const [session, setSession] = useState<null | Session>(null);
  const router = useRouter();

  useEffect(() => {
    if (!supabase.auth.session()) {
      router.push("/");
    }

    setSession(supabase.auth.session());

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);
  return session;
}

export function useStudentAccount() {
  const session = useSession();
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

            db2student(res.data).then((student) => {
              setUser(student);
            });
          });
      } else if (session.user?.user_metadata.role == "teacher") {
        router.push("/t/home");
      }
    }
  }, [session]);
  return user;
}

export function useTeacherAccount() {
  const session = useSession();
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

            db2teacher(res.data).then((teacher) => {
              setUser(teacher);
            });
          });
      } else if (session.user?.user_metadata.role == "student") {
        router.push("/s/home");
      }
    }
  }, [session]);
  return user;
}
