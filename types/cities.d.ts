interface Cities {
  id: number;
  nome: string;
  microrregiao: Microrregiao;
  "regiao-imediata": RegiaoImediata;
}

interface Microrregiao {
  id: number;
  nome: string;
  mesorregiao: Mesorregiao;
}

interface Mesorregiao {
  id: number;
  nome: string;
  UF: Uf;
}

interface Uf {
  id: number;
  sigla: string;
  nome: string;
  regiao: Regiao;
}

interface Regiao {
  id: number;
  sigla: string;
  nome: string;
}

interface RegiaoImediata {
  id: number;
  nome: string;
  "regiao-intermediaria": RegiaoIntermediaria;
}

interface RegiaoIntermediaria {
  id: number;
  nome: string;
  UF: Uf2;
}

interface Uf2 {
  id: number;
  sigla: string;
  nome: string;
  regiao: Regiao2;
}

interface Regiao2 {
  id: number;
  sigla: string;
  nome: string;
}
