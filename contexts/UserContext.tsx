import { Student, Teacher, User } from "@/utils/types/person";
import { createContext } from "react";

const UserContext = createContext<{
  user: User | null;
  setUser: (user: User | null) => void;
  person: Student | Teacher | null;
  setPerson: (person: Student | Teacher | null) => void;
}>({ user: null, setUser: () => {}, person: null, setPerson: () => {} });

export default UserContext;
