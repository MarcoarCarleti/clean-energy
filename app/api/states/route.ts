import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
  try {
    const response = await axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados');
    const states = response.data;

    states.sort((a: any, b: any) => a.nome.localeCompare(b.nome));

    return NextResponse.json(states);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch states' }, { status: 500 });
  }
}
