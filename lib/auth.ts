import { prismaClient } from "./prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import { Adapter } from "next-auth/adapters";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from 'bcrypt'

export const authOptions: NextAuthOptions = {
    session: {
      strategy: "jwt",
    },
    adapter: PrismaAdapter(prismaClient) as Adapter,
    providers: [
      CredentialsProvider({
        type: "credentials",
        credentials: {},
        async authorize(credentials, req) {
          const { email, password } = credentials as {
            email: string;
            password: string;
          };
  
          const user = await prismaClient.user.findFirst({
            where: {
              email,
            },
          });

          const isValidPassword = user && await bcrypt.compare(password, user.password)
  
          if (email !== user?.email || !isValidPassword) {
            throw new Error("invalid credentials");
          }
  
          return user as any;
        },
      }),
    ],
    events: {},
    pages: {
      signIn: "/login",
      signOut: "/login",
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === "development",
  };