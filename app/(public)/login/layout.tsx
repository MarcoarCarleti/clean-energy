import { getServerSession } from "next-auth";
import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { Metadata } from "next/types";
import { headers } from "next/headers";
import { authOptions } from "../../../lib/auth";

interface PriateLayoutProps {
  children: ReactNode;
}

export const metadata: Metadata = {
  title: "Clean Energy - Login",
};

export default async function PrivateLayout({ children }: PriateLayoutProps) {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/admin");
  }

  return <>{children}</>;
}