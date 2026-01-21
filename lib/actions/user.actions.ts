export async function signOutUser() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("access_token");
    window.location.href = "/sign-in";
  }
}
