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
    const session = await getServerSession(authOptions);

    if (!session)
      return NextResponse.json({ message: "Unauthorized", status: 401 });

    const body = await req.json();

    const validatedData = leadSchema.parse(body);

    console.log(validatedData);

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
      return NextResponse.json({ message: "Unauthorized", status: 401 });

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
      return NextResponse.json({ message: "Unauthorized", status: 401 });

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
