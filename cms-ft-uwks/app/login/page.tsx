import type { Metadata } from "next";
import { LoginForm } from "./_components/login-form";

export const metadata: Metadata = {
  title: "Login — Dashboard FT UWKS",
  description: "Login ke dashboard admin Fakultas Teknik UWKS",
};

export default function LoginPage() {
  return <LoginForm />;
}
