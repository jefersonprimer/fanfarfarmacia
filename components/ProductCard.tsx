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
}

export default function ProductCard({ product }: ProductCardProps) {
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
  const badgeText =
    product.promotional_badge ??
    promotion?.badge_label ??
    (requiresQuantity
      ? `Leve ${minQuantity}+`
      : promoAppliesAtOne
        ? "Oferta"
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
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white p-3 transition-shadow hover:shadow-lg">
      <div className="relative">
        <Link
          href={`/produto/${product.slug}`}
          className="flex aspect-square items-center justify-center overflow-hidden rounded-xl"
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
            <span className="absolute left-2 top-2 rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
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
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white shadow-md transition hover:bg-blue-700 active:scale-95"
            >
              <Plus className="h-4 w-4" />
            </button>
          ) : (
            <div className="flex shrink-0 items-center gap-0.5 rounded-full border border-blue-200 bg-blue-50 p-0.5 shadow-md">
              <button
                type="button"
                onClick={decreaseQuantity}
                aria-label="Diminuir quantidade"
                className="flex h-7 w-7 items-center justify-center rounded-full text-blue-700 transition hover:bg-white"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span
                aria-live="polite"
                className="min-w-5 text-center text-sm font-bold text-blue-700"
              >
                {quantity}
              </span>
              <button
                type="button"
                onClick={increaseQuantity}
                aria-label="Aumentar quantidade"
                className="flex h-7 w-7 items-center justify-center rounded-full text-blue-700 transition hover:bg-white"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col pt-3">
        {product.brand && (
          <span className="truncate text-[11px] font-semibold uppercase tracking-wide text-gray-400">
            {product.brand}
          </span>
        )}

        <Link
          href={`/produto/${product.slug}`}
          className="mt-1 line-clamp-2 min-h-10 text-sm font-semibold leading-snug text-gray-800 transition-colors hover:text-blue-600"
        >
          {product.name}
        </Link>

        <div className="mt-auto pt-3">
          {comparePrice !== null && (
            <span className="block text-xs text-gray-400 line-through">
              {currencyFormatter.format(comparePrice)}
            </span>
          )}

          <p className="text-lg font-bold leading-tight text-gray-900">
            {currencyFormatter.format(displayPrice)}
          </p>

          {requiresQuantity ? (
            <p className="text-xs font-semibold text-red-600">
              Promoção a partir de {minQuantity} un.
            </p>
          ) : hasInstallment && installmentPrice !== null ? (
            <p className="text-xs text-gray-500">
              ou{" "}
              <span className="font-semibold text-gray-700">
                {installments}x de {currencyFormatter.format(installmentPrice)}
              </span>
            </p>
          ) : (
            <p className="text-xs text-gray-500">à vista</p>
          )}
        </div>
      </div>
    </article>
  );
}
