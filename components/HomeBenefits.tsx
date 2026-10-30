"use client";

import type { LucideIcon } from "lucide-react";
import {
  BadgePercent,
  Star,
  Stethoscope,
  Store,
  Truck,
} from "lucide-react";

interface Benefit {
  icon: LucideIcon;
  title: string;
  description: string;
  iconClassName: string;
}

const BENEFITS: Benefit[] = [
  {
    icon: Truck,
    title: "Receba em até 1 hora",
    description: "com a entrega rápida!",
    iconClassName: "bg-gray-100 text-gray-700",
  },
  {
    icon: Star,
    title: "Ganhe pontos stix",
    description: "em suas compras.",
    iconClassName: "bg-gray-100 text-gray-700",
  },
  {
    icon: Store,
    title: "Retire na farmácia em até 30min",
    description: "grátis!",
    iconClassName: "bg-gray-100 text-gray-700",
  },
  {
    icon: BadgePercent,
    title: "Descontos e benefícios",
    description: "em medicamentos.",
    iconClassName: "bg-gray-100 text-gray-700",
  },
  {
    icon: Stethoscope,
    title: "Exames, testes, vacinas",
    description: "e muito mais.",
    iconClassName: "bg-gray-100 text-gray-700",
  },
];

export default function HomeBenefits() {
  return (
    <section
      aria-label="Benefícios da Fanfar"
      className="border-b border-gray-100 bg-white"
    >
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <ul
          className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 sm:snap-none lg:grid-cols-5"
        >
          {BENEFITS.map(({ icon: Icon, title, description, iconClassName }) => (
            <li
              key={title}
              className="flex w-full shrink-0 snap-center items-center gap-3 rounded-xl border border-gray-100 bg-white p-3 transition hover:border-blue-100 hover:shadow-sm sm:w-auto sm:shrink sm:snap-align-none"
            >
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${iconClassName}`}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold leading-snug text-gray-900">
                  {title}
                </p>
                <p className="text-xs leading-snug text-gray-500">
                  {description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
