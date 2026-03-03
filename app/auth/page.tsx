import { redirect } from "next/navigation";

export default function AuthenticationPage() {
  redirect("/auth/sign-in");
}
