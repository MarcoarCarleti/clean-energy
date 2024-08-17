"use client";

import { signIn, useSession } from "next-auth/react";
import { Button } from "../ui/button";
import Link from "next/link";
import Image from "next/image";

export const Header = () => {
  const { status } = useSession();
  return (
    <div className="flex h-20  z-10 bg-foreground text-background border-b fixed w-screen border-b-zinc-300 justify-between items-center px-8">
      <Link href={"/"} className="flex items-center gap-2">
        <div className="relative w-10 h-10 flex">
          <Image
            src={"/logo.png"}
            alt="logo"
            fill
            style={{
              objectFit: "cover",
            }}
          />
        </div>
        <span className="font-semibold text-3xl">Clean Energy</span>
      </Link>

      <Link href={"/login"}>
        <Button variant={"outline"} className="text-white">
          {status === "authenticated" ? "Painel Admin" : "Login"}
        </Button>
      </Link>
    </div>
  );
};
