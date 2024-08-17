import { NextRequest, NextResponse } from "next/server";
import { Prisma, PrismaClient } from "@prisma/client";
import { leadSchema } from "@/app/(public)/(form)/schema";
import { z } from "zod";
import { prismaClient } from "@/lib/prisma";
import { getSession } from "next-auth/react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validatedData = leadSchema.parse(body);

    const checkIfLeadExists = await prismaClient.lead.findFirst({
      where: {
        OR: [
          { cpf: validatedData.cpf },
          { email: validatedData.email },
          { phone: validatedData.phone },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (checkIfLeadExists) {
      const diffInMilliseconds =
        new Date().getTime() - checkIfLeadExists.createdAt.getTime();
      const diffInMinutes = Math.floor(diffInMilliseconds / 1000 / 60);
      const diffInSeconds = Math.floor((diffInMilliseconds / 1000) % 60);

      if (diffInMinutes < 2) {
        const timeRemaining = 2 * 60 - (diffInMinutes * 60 + diffInSeconds);
        const minutesRemaining = Math.floor(timeRemaining / 60);
        const secondsRemaining = timeRemaining % 60;

        return NextResponse.json(
          {
            error: "Please wait to submit this form again.",
            time: `Aguarde ${minutesRemaining}:${
              secondsRemaining < 10 ? "0" : ""
            }${secondsRemaining} segundos para você enviar o formulário novamente.`,
          },
          { status: 400 }
        );
      }
    }

    const lead = await prismaClient.lead.create({
      data: validatedData,
    });
    return NextResponse.json(lead, { status: 200 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json({ error: error.message }, { status: 405 });
      }

      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const leads = await prismaClient.lead.findMany({
      where: {
        isExcluded: false,
      },
    });

    const sortedLeads = leads.sort(
      (a, b) => b.createdAt.getDate() - a.createdAt.getDate()
    );

    return NextResponse.json(sortedLeads, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { leadId } = await req.json();

    if (!leadId)
      return NextResponse.json({ message: "Arguments missing", status: 400 });

    await prismaClient.lead.update({
      where: {
        id: leadId,
      },
      data: {
        isExcluded: true,
      },
    });

    return NextResponse.json({
      message: "Lead deleted successfully!",
      status: 200,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
