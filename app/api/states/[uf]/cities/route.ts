import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: Request, { params }: { params: { uf: string } }) {
  const { uf } = params;

  try {
    const response = await axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`);
    const cities = response.data

    cities.sort((a: any, b: any) => a.nome.localeCompare(b.nome));

    return NextResponse.json(cities);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch cities' }, { status: 500 });
  }
}
