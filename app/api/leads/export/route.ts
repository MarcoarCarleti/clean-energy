import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { prismaClient } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { formatCurrency, SUPPLY_TYPES } from "@/lib/utils";

interface Table {
  Nome: string;
  Email: string;
  Telefone: string;
  CPF: string;
  Cidade: string;
  Estado: string;
  "Valor da conta de energia": string;
  "Tipo de Fornecimento": string | undefined;
  "Data de envio": Date;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session)
      return NextResponse.json({ message: "Unauthorized", status: 401 });

    const leads = await prismaClient.lead.findMany({
      where: { isExcluded: false },
    });

    let formattedData: Table[] = [];

    leads.map((lead) => {
      const formattedLead: Table = {
        Nome: lead.name,
        Email: lead.email,
        Telefone: lead.phone,
        CPF: lead.cpf,
        Cidade: lead.city,
        Estado: lead.state,
        "Valor da conta de energia": formatCurrency(lead.energyBill),
        "Tipo de Fornecimento": SUPPLY_TYPES.find(
          (type) => type.value === lead.supplyType
        )?.label,
        "Data de envio": lead.createdAt,
      };

      formattedData.push(formattedLead);
    });

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "buffer",
    });

    return new NextResponse(excelBuffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="leads.xlsx"',
      },
    });
  } catch (error) {
    console.error("Erro ao exportar leads:", error);
    return new NextResponse(
      JSON.stringify({ error: "Erro ao exportar leads" }),
      { status: 500 }
    );
  }
}
