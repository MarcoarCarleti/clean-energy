import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number) {
  if (value === undefined || value < 0) return formatCurrency(0);

  return Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export const SUPPLY_TYPES = [
  {
    label: "Monofásico",
    value: "monofasico",
  },
  {
    label: "Bifásico",
    value: "bifasico",
  },
  {
    label: "Trifásico",
    value: "trifasico",
  },
];

export function paginate(arr: Array<any>, size: number) {
  return arr.reduce((acc, val, i) => {
    let idx = Math.floor(i / size);
    let page = acc[idx] || (acc[idx] = []);
    page.push(val);

    return acc;
  }, []);
}
