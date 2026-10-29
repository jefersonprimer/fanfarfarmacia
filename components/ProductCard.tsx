"use client";

import Link from "next/link";
import { Minus, Package, Plus } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { getPromotedUnitPrice } from "@/lib/promotions";
import type { Product } from "@/types/product";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

interface ProductCardProps {
  product: Product;
  theme?: "light" | "dark";
}

export default function ProductCard({ product, theme = "light" }: ProductCardProps) {
  const { items, addToCart, setCartQuantity } = useCart();
  const quantity =
    items.find((item) => item.product.id === product.id)?.quantity ?? 0;

  const image = product.images?.[0];
  const unitPrice = Number(product.price);
  const promotion = product.promotion ?? null;
  const minQuantity = promotion?.min_quantity ?? 1;
  const promotedUnitPrice = promotion
    ? getPromotedUnitPrice(promotion, unitPrice)
    : unitPrice;
  const promoAppliesAtOne =
    promotion !== null && minQuantity <= 1 && promotedUnitPrice < unitPrice;
  const displayPrice = promoAppliesAtOne ? promotedUnitPrice : unitPrice;
  const originalPrice = product.original_price ?? null;
  const comparePrice = promoAppliesAtOne
    ? unitPrice
    : originalPrice !== null && originalPrice > unitPrice
      ? originalPrice
      : null;
  const installmentPrice = product.installment_price ?? null;
  const installments = product.installments ?? 3;
  const hasInstallment =
    installmentPrice !== null && installments > 1 && !promoAppliesAtOne;
  const requiresQuantity = promotion !== null && minQuantity > 1;
  const fallbackBadge = theme === "dark" ? "20% OFF" : "Oferta";
  const badgeText =
    product.promotional_badge ??
    promotion?.badge_label ??
    (requiresQuantity
      ? `Leve ${minQuantity}+`
      : promoAppliesAtOne
        ? fallbackBadge
        : null);

  const increaseQuantity = () => {
    if (quantity === 0) {
      addToCart(product, 1);
      return;
    }

    setCartQuantity(product, quantity + 1);
  };

  const decreaseQuantity = () => setCartQuantity(product, quantity - 1);

  return (
    <article className={theme === "dark"
      ? "group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 p-3 transition-all hover:border-yellow-400/30 hover:shadow-[0_0_24px_rgba(251,191,36,0.08)]"
      : "group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white p-3 transition-shadow hover:shadow-lg"}>
      <div className="relative">
        <Link
          href={`/produto/${product.slug}`}
          className={`flex aspect-square items-center justify-center overflow-hidden rounded-xl ${theme === "dark" ? "bg-white" : ""}`}
        >
          {image ? (
            <img
              src={image}
              alt={product.name}
              loading="lazy"
              className="h-full w-full object-contain p-3 transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <Package className="h-10 w-10 text-gray-300" aria-hidden="true" />
          )}

          {badgeText && (
            <span className={theme === "dark"
              ? "absolute left-2 top-2 rounded-full bg-yellow-400 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-black shadow-sm"
              : "absolute left-2 top-2 rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm"}>
              {badgeText}
            </span>
          )}
        </Link>

        <div className="absolute bottom-2 right-2 z-10">
          {quantity === 0 ? (
            <button
              type="button"
              onClick={increaseQuantity}
              aria-label={`Adicionar ${product.name} ao carrinho`}
              className={theme === "dark"
                ? "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-yellow-400 text-black shadow-md transition hover:bg-yellow-300 active:scale-95"
                : "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#279236] text-white shadow-md transition hover:bg-[#1f7a2b] active:scale-95"}
            >
              <Plus className="h-4 w-4" />
            </button>
          ) : (
            <div className={theme === "dark"
              ? "flex shrink-0 items-center gap-0.5 rounded-full border border-yellow-400/40 bg-zinc-800 p-0.5 shadow-md"
              : "flex shrink-0 items-center gap-0.5 rounded-full border border-[#279236]/25 bg-white p-0.5 shadow-md"}>
              <button
                type="button"
                onClick={decreaseQuantity}
                aria-label="Diminuir quantidade"
                className={theme === "dark"
                  ? "flex h-7 w-7 items-center justify-center rounded-full text-yellow-400 transition hover:bg-white/10"
                  : "flex h-7 w-7 items-center justify-center rounded-full text-[#279236] transition hover:bg-white"}
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span
                aria-live="polite"
                className={`min-w-5 text-center text-sm font-bold ${theme === "dark" ? "text-yellow-400" : "text-[#279236]"}`}
              >
                {quantity}
              </span>
              <button
                type="button"
                onClick={increaseQuantity}
                aria-label="Aumentar quantidade"
                className={theme === "dark"
                  ? "flex h-7 w-7 items-center justify-center rounded-full text-yellow-400 transition hover:bg-white/10"
                  : "flex h-7 w-7 items-center justify-center rounded-full text-[#279236] transition hover:bg-white"}
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col pt-3">
        {product.brand && (
          <span className={`truncate text-[11px] font-semibold uppercase tracking-wide ${theme === "dark" ? "text-white/30" : "text-gray-400"}`}>
            {product.brand}
          </span>
        )}

        <Link
          href={`/produto/${product.slug}`}
          className={`mt-1 line-clamp-2 min-h-10 text-sm font-semibold leading-snug transition-colors ${theme === "dark" ? "text-white/80 hover:text-yellow-400" : "text-gray-800 hover:text-blue-600"}`}
        >
          {product.name}
        </Link>

        <div className="mt-auto pt-3">
          {comparePrice !== null && (
            <span className={`block text-xs line-through ${theme === "dark" ? "text-white/30" : "text-gray-400"}`}>
              {currencyFormatter.format(comparePrice)}
            </span>
          )}

          <p className={`text-lg leading-tight ${theme === "dark" ? "font-black text-white" : "font-bold text-gray-900"}`}>
            {currencyFormatter.format(displayPrice)}
          </p>

          {requiresQuantity ? (
            <p className={`text-xs font-semibold ${theme === "dark" ? "text-yellow-400/80" : "text-red-600"}`}>
              Promoção a partir de {minQuantity} un.
            </p>
          ) : hasInstallment && installmentPrice !== null ? (
            <p className={`text-xs ${theme === "dark" ? "text-white/30" : "text-gray-500"}`}>
              ou{" "}
              <span className={`font-semibold ${theme === "dark" ? "text-white/50" : "text-gray-700"}`}>
                {installments}x de {currencyFormatter.format(installmentPrice)}
              </span>
            </p>
          ) : (
            <p className={`text-xs ${theme === "dark" ? "text-white/30" : "text-gray-500"}`}>à vista</p>
          )}
        </div>
      </div>
    </article>
  );
}
