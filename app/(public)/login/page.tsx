"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  FormEvent,
  FormEventHandler,
  useEffect,
  useState,
  useTransition,
} from "react";
import { useRouter } from "next/navigation";
import { CommandIcon } from "lucide-react";
import { signIn } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import LoadingSpinner from "@/components/loading-spinner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<boolean>(false);
  const [pending, startTransition] = useTransition();

  const { toast } = useToast();
  const router = useRouter();

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await startTransition(async () => {
      setError(false);
      const login = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (login?.status !== 200) {
        setError(true);
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Email ou senha incorretos.",
        });
        return;
      }

      router.push("/admin");
    });
  };

  return (
    <div className="flex w-full h-screen">
      <div className="w-1/2 text-white lg:flex hidden  bg-zinc-900 dark:border-r gap-2" />

      <div className="flex lg:w-1/2 w-full flex-row-reverse relative">
        <div className="flex mx-auto content-center flex-wrap">
          <div className="mx-auto flex w-full flex-col lg:space-x-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center pb-8">
              <h1 className="text-2xl font-semibold tracking-tight">
                Fazer Login
              </h1>
              <p className="text-sm text-muted-foreground">
                Insira seu email e senha para fazer login
              </p>
            </div>
            <div className="grid gap-6">
              <form onSubmit={handleLogin}>
                <div className="grid gap-3">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      name="email"
                      placeholder="nome@exemplo.com"
                      value={email}
                      onChange={(e) => {
                        if (error) {
                          setError(false);
                        }

                        setEmail(e.target.value);
                      }}
                      className={cn("", error && "text-red-500")}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="password">Senha</Label>
                    <Input
                      type="password"
                      placeholder="****"
                      value={password}
                      onChange={(e) => {
                        if (error) {
                          setError(false);
                        }

                        setPassword(e.target.value);
                      }}
                      className={cn("", error && "text-red-500")}
                    />
                  </div>

                  <Button className="mt-4" type="submit" disabled={pending}>
                    {pending ? <LoadingSpinner /> : "Fazer Login"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
