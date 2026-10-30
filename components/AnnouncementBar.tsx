"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Truck } from "lucide-react";
import { useFreeShippingPromotion } from "@/hooks/useFreeShippingPromotion";

export default function AnnouncementBar() {
  const freeShippingPromotions = useFreeShippingPromotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const freeShippingMinimum = freeShippingPromotions.length
    ? Math.min(...freeShippingPromotions.map((promotion) => promotion.min_purchase))
    : null;
  const announcements = [
    ...(freeShippingMinimum !== null
      ? [{
          message: `Frete grátis nas compras a partir de ${new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(freeShippingMinimum)}`,
          href: "/",
          label: "Ver produtos",
        }]
      : []),
    {
      message: "Fique por dentro da Black Week da Fanfar",
      href: "/black-week",
      label: "Confira as ofertas",
    },
  ];

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % announcements.length);
    }, 6000);

    return () => window.clearInterval(interval);
  }, [announcements.length]);

  useEffect(() => {
    if (activeIndex >= announcements.length) setActiveIndex(0);
  }, [activeIndex, announcements.length]);

  const announcement = announcements[activeIndex];
  return (
    <div className="bg-[#1f7a2b] text-white">
      <div className="mx-auto flex min-h-10 max-w-7xl items-center justify-center px-3 text-center text-xs font-medium sm:px-6 sm:text-sm">
        <Link
          key={activeIndex}
          href={announcement.href}
          aria-live="polite"
          className="flex min-w-0 animate-[announcement-fade-in_350ms_ease-out] items-center justify-center gap-2 py-2 hover:underline"
        >
          {announcement.href === "/" && (
            <Truck className="h-4 w-4 shrink-0" aria-hidden="true" />
          )}
          <span>{announcement.message}</span>
          <span className="hidden underline-offset-2 sm:inline">
            {announcement.label}
          </span>
        </Link>
      </div>
    </div>
  );
}
