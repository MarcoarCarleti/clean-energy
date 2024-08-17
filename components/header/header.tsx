"use client";

import { signIn, useSession } from "next-auth/react";
import { Button } from "../ui/button";
import Link from "next/link";

export const Header = () => {
  const { status } = useSession();
  return (
    <div className="flex h-20  z-10 bg-foreground text-background border-b fixed w-screen border-b-zinc-300 justify-between items-center px-8">
      <Link href={"/"}>
        <span className="font-semibold text-3xl">Clean Energy</span>
      </Link>
      {status === "authenticated" && (
        <Button
          variant={"outline"}
          className="text-white"
          onClick={() => signIn()}
        >
          Painel Admin
        </Button>
      )}
    </div>
  );
};
