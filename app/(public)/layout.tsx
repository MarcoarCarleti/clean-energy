import { getServerSession } from "next-auth";
import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { Metadata } from "next/types";
import { headers } from "next/headers";
import { Header } from "@/components/header/header";

interface PriateLayoutProps {
  children: ReactNode;
}

export default async function PrivateLayout({ children }: PriateLayoutProps) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
