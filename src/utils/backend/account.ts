export function logIn(formData: FormData) {
  // Temporary
  console.log(formData.get("user-id")?.toString().includes("skt"));
  if (formData.get("user-id")?.toString().includes("skt")) {
    return { role: "teacher" };
  }
  return { role: "student" };
}

export function logOut() {}

export function editProfile(formData: FormData) {}

export function changePassword(formData: FormData) {}
