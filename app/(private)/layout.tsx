import { getServerSession } from "next-auth";
import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { Metadata } from "next/types";
import { headers } from "next/headers";
import { authOptions } from "@/lib/auth";

interface PriateLayoutProps {
  children: ReactNode;
}

export default async function PrivateLayout({ children }: PriateLayoutProps) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="w-screen h-screen">
      {children}
    </div>
  );
}
