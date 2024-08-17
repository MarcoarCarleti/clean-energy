import { getServerSession } from "next-auth";
import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { Metadata } from "next/types";
import { headers } from "next/headers";
import { authOptions } from "@/lib/auth";
import { AdminHeader } from "@/components/header/admin-header";

interface PriateLayoutProps {
  children: ReactNode;
}

export const metadata: Metadata = {
  title: "Clean Energy - Painel Admin",
};

export default async function PrivateLayout({ children }: PriateLayoutProps) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <>
      <AdminHeader />
      <div className="py-16 w-screen h-screen px-4 lg:px-0 md:max-h-[100vh] md:overflow-scroll mt-0 lg:max-w-[1200px] lg:mx-auto">
        {children}
      </div>
    </>
  );
}
