"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Loader2,
  Minus,
  Package,
  Plus,
  ShoppingBag,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import { useCart } from "@/hooks/useCart";
import {
  calculateLineDiscount,
  getPromotedUnitPrice,
} from "@/lib/promotions";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export default function CartPage() {
  const {
    items,
    itemCount,
    total,
    promotionsDiscount,
    subtotalAfterPromotions,
    couponsAllowed,
    coupon,
    couponEligible,
    discount,
    finalTotal,
    setCartQuantity,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponCode, setCouponCode] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);

  const handleApplyCoupon = async (event: React.FormEvent) => {
    event.preventDefault();
    const code = couponCode.trim();

    if (!code) {
      setCouponError("Informe o código do cupom.");
      return;
    }

    setCouponLoading(true);
    setCouponError(null);

    try {
      const response = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, subtotal: subtotalAfterPromotions }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Não foi possível aplicar o cupom.");
      }

      applyCoupon(data.coupon);
      setCouponCode("");
    } catch (error) {
      setCouponError(
        error instanceof Error
          ? error.message
          : "Não foi possível aplicar o cupom."
      );
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponError(null);
    setCouponCode("");
  };

  return (
    <main className="flex-1 bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-blue-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Continuar comprando
        </Link>

        <h1 className="mt-4 text-2xl font-bold text-gray-900">
          Meu carrinho
        </h1>

        {items.length === 0 ? (
          <div className="mt-6 flex flex-col items-center rounded-2xl border border-gray-200 bg-white px-4 py-16 text-center">
            <ShoppingBag className="h-12 w-12 text-gray-300" aria-hidden="true" />
            <h2 className="mt-4 text-lg font-bold text-gray-900">
              Seu carrinho está vazio
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Adicione produtos para continuar.
            </p>
            <Link
              href="/"
              className="mt-6 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Ver produtos
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_320px]">
            <div className="space-y-3">
              {items.map(({ product, quantity }) => {
                const image = product.images?.[0];
                const unitPrice = Number(product.price);
                const promotion = product.promotion ?? null;
                const lineDiscount = calculateLineDiscount(
                  promotion,
                  unitPrice,
                  quantity
                );
                const hasLinePromotion = lineDiscount > 0;
                const promotedUnitPrice =
                  promotion && quantity >= promotion.min_quantity
                    ? getPromotedUnitPrice(promotion, unitPrice)
                    : unitPrice;
                const lineTotal = unitPrice * quantity - lineDiscount;

                return (
                  <article
                    key={product.id}
                    className="flex gap-3 rounded-2xl border border-gray-200 bg-white p-3 sm:p-4"
                  >
                    <Link
                      href={`/produto/${product.slug}`}
                      className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-50 sm:h-24 sm:w-24"
                    >
                      {image ? (
                        <img
                          src={image}
                          alt={product.name}
                          className="h-full w-full object-contain p-2"
                        />
                      ) : (
                        <Package
                          className="h-7 w-7 text-gray-300"
                          aria-hidden="true"
                        />
                      )}
                    </Link>

                    <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 sm:flex-row sm:items-center">
                      <div className="min-w-0">
                        {product.brand && (
                          <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                            {product.brand}
                          </span>
                        )}
                        <Link
                          href={`/produto/${product.slug}`}
                          className="block truncate text-sm font-semibold text-gray-800 transition-colors hover:text-blue-600"
                        >
                          {product.name}
                        </Link>
                        <p className="mt-1 flex items-baseline gap-2 text-sm">
                          {hasLinePromotion && (
                            <span className="text-xs text-gray-400 line-through">
                              {currencyFormatter.format(unitPrice)}
                            </span>
                          )}
                          <span
                            className={`font-bold ${
                              hasLinePromotion
                                ? "text-red-600"
                                : "text-gray-900"
                            }`}
                          >
                            {currencyFormatter.format(
                              hasLinePromotion
                                ? promotedUnitPrice
                                : unitPrice
                            )}
                          </span>
                          {promotion?.badge_label && (
                            <span className="rounded-full bg-red-50 px-1.5 py-0.5 text-[10px] font-bold uppercase text-red-600">
                              {promotion.badge_label}
                            </span>
                          )}
                        </p>
                      </div>

                      <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:justify-center">
                        <div className="flex items-center rounded-lg border border-gray-200">
                          <button
                            type="button"
                            onClick={() =>
                              setCartQuantity(product, quantity - 1)
                            }
                            aria-label="Diminuir quantidade"
                            className="flex h-8 w-8 items-center justify-center text-gray-600 transition hover:bg-gray-50"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="min-w-7 text-center text-sm font-semibold text-gray-900">
                            {quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setCartQuantity(product, quantity + 1)
                            }
                            disabled={quantity >= product.stock}
                            aria-label="Aumentar quantidade"
                            className="flex h-8 w-8 items-center justify-center text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-300"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            {hasLinePromotion && (
                              <span className="block text-[11px] text-gray-400 line-through">
                                {currencyFormatter.format(
                                  unitPrice * quantity
                                )}
                              </span>
                            )}
                            <span className="text-sm font-bold text-gray-900">
                              {currencyFormatter.format(lineTotal)}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFromCart(product.id)}
                            aria-label={`Remover ${product.name}`}
                            className="rounded p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-xs font-semibold text-gray-500 transition-colors hover:text-red-600"
                >
                  Limpar carrinho
                </button>
              </div>
            </div>

            <aside className="rounded-2xl border border-gray-200 bg-white p-5 lg:sticky lg:top-24">
              <h2 className="text-base font-bold text-gray-900">
                Resumo do pedido
              </h2>

              <div className="mt-4 space-y-2 border-t border-gray-100 pt-4">
                {!couponsAllowed && (
                  <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs font-medium text-amber-800">
                    As promoções deste carrinho não acumulam com cupom de
                    desconto.
                  </p>
                )}
                {coupon ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5">
                      <div className="flex min-w-0 items-center gap-2">
                        <Tag
                          className="h-4 w-4 shrink-0 text-emerald-600"
                          aria-hidden="true"
                        />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-emerald-800">
                            {coupon.code}
                          </p>
                          <p className="text-[11px] text-emerald-700">
                            {couponEligible
                              ? "Cupom aplicado"
                              : `Valor mínimo de ${currencyFormatter.format(
                                  coupon.min_purchase
                                )}`}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        aria-label="Remover cupom"
                        className="rounded p-1 text-emerald-700 transition hover:bg-emerald-100"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ) : couponsAllowed ? (
                  <form onSubmit={handleApplyCoupon} className="space-y-2">
                    <label
                      htmlFor="coupon-code"
                      className="block text-xs font-semibold uppercase text-gray-700"
                    >
                      Cupom de desconto
                    </label>
                    <div className="flex gap-2">
                      <input
                        id="coupon-code"
                        type="text"
                        value={couponCode}
                        onChange={(event) =>
                          setCouponCode(event.target.value.toUpperCase())
                        }
                        placeholder="Digite o cupom"
                        autoComplete="off"
                        className="min-w-0 flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm uppercase text-gray-900 transition focus:border-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                      <button
                        type="submit"
                        disabled={couponLoading}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-gray-800 px-3 py-2 text-xs font-semibold text-white transition hover:bg-black disabled:opacity-70"
                      >
                        {couponLoading ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Check className="h-3.5 w-3.5" />
                        )}
                        Aplicar
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-xs font-medium text-red-600">
                        {couponError}
                      </p>
                    )}
                  </form>
                ) : null}
              </div>

              <dl className="mt-4 space-y-2 border-t border-gray-100 pt-4 text-sm">
                <div className="flex items-center justify-between text-gray-500">
                  <dt>Itens</dt>
                  <dd>{itemCount}</dd>
                </div>
                <div className="flex items-center justify-between text-gray-500">
                  <dt>Subtotal</dt>
                  <dd>{currencyFormatter.format(total)}</dd>
                </div>
                {promotionsDiscount > 0 && (
                  <div className="flex items-center justify-between font-medium text-emerald-600">
                    <dt>Promoções</dt>
                    <dd>-{currencyFormatter.format(promotionsDiscount)}</dd>
                  </div>
                )}
                {coupon && discount > 0 && (
                  <div className="flex items-center justify-between font-medium text-emerald-600">
                    <dt>Desconto ({coupon.code})</dt>
                    <dd>-{currencyFormatter.format(discount)}</dd>
                  </div>
                )}
                <div className="flex items-center justify-between text-gray-500">
                  <dt>Frete</dt>
                  <dd>Calculado na finalização</dd>
                </div>
                <div className="flex items-center justify-between border-t border-gray-100 pt-3 text-base font-bold text-gray-900">
                  <dt>Total</dt>
                  <dd>{currencyFormatter.format(finalTotal)}</dd>
                </div>
              </dl>

              <Link
                href="/"
                className="mt-5 flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Continuar comprando
              </Link>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
