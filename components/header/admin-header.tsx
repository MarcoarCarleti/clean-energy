"use client";

import { signIn, signOut } from "next-auth/react";
import { Button } from "../ui/button";
import Link from "next/link";
import { useTransition } from "react";
import LoadingSpinner from "../loading-spinner";
import Image from "next/image";

export const AdminHeader = () => {
  const [pending, startTransition] = useTransition();
  return (
    <div className="flex h-20 bg-foreground z-10 text-background border-b fixed w-screen border-b-zinc-300 justify-between items-center px-8">
      <Link href={"/"} className="flex items-center gap-2">
        <div className="relative w-10 h-10">
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
      <Button
        variant={"outline"}
        className="text-white"
        disabled={pending}
        onClick={() => startTransition(() => signOut())}
      >
        {pending ? <LoadingSpinner /> : "Sair"}
      </Button>
    </div>
  );
};
