"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Minus, Package, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { calculateLineDiscount, getPromotedUnitPrice } from "@/lib/promotions";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

interface CartSidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function CartSidebar({ open, onClose }: CartSidebarProps) {
  const {
    items,
    itemCount,
    total,
    promotionsDiscount,
    finalTotal,
    setCartQuantity,
    removeFromCart,
  } = useCart();

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  return (
    <div
      className={`fixed inset-0 z-[80] ${open ? "" : "pointer-events-none"}`}
      aria-hidden={!open}
      inert={!open}
    >
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Sacola de compras"
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-gray-900">
              Minha sacola
              {itemCount > 0 && (
                <span className="ml-1.5 text-sm font-medium text-gray-500">
                  ({itemCount})
                </span>
              )}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar sacola"
            className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <ShoppingBag
              className="h-12 w-12 text-gray-300"
              aria-hidden="true"
            />
            <h3 className="mt-4 text-lg font-bold text-gray-900">
              Seu carrinho está vazio
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Adicione produtos para continuar.
            </p>
            <Link
              href="/"
              onClick={onClose}
              className="mt-6 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Ver produtos
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <ul className="space-y-4">
                {items.map(({ product, quantity }) => {
                  const image = product.images?.[0];
                  const unitPrice = Number(product.price);
                  const promotion = product.promotion ?? null;
                  const lineDiscount = calculateLineDiscount(
                    promotion,
                    unitPrice,
                    quantity,
                  );
                  const hasLinePromotion = lineDiscount > 0;
                  const promotedUnitPrice =
                    promotion && quantity >= promotion.min_quantity
                      ? getPromotedUnitPrice(promotion, unitPrice)
                      : unitPrice;
                  const lineTotal = unitPrice * quantity - lineDiscount;

                  return (
                    <li
                      key={product.id}
                      className="flex gap-3 rounded-2xl border border-gray-100 p-3"
                    >
                      <Link
                        href={`/produto/${product.slug}`}
                        onClick={onClose}
                        className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-50"
                      >
                        {image ? (
                          <img
                            src={image}
                            alt={product.name}
                            className="h-full w-full object-contain p-1.5"
                          />
                        ) : (
                          <Package
                            className="h-6 w-6 text-gray-300"
                            aria-hidden="true"
                          />
                        )}
                      </Link>

                      <div className="flex min-w-0 flex-1 flex-col justify-between">
                        <div className="min-w-0">
                          <Link
                            href={`/produto/${product.slug}`}
                            onClick={onClose}
                            className="line-clamp-2 text-sm font-semibold text-gray-800 transition-colors hover:text-blue-600"
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
                                  : unitPrice,
                              )}
                            </span>
                          </p>
                        </div>

                        <div className="mt-2 flex items-center justify-between gap-2">
                          <div className="flex items-center rounded-lg border border-gray-200">
                            <button
                              type="button"
                              onClick={() =>
                                setCartQuantity(product, quantity - 1)
                              }
                              aria-label="Diminuir quantidade"
                              className="flex h-7 w-7 items-center justify-center text-gray-600 transition hover:bg-gray-50"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="min-w-6 text-center text-xs font-semibold text-gray-900">
                              {quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                setCartQuantity(product, quantity + 1)
                              }
                              disabled={quantity >= product.stock}
                              aria-label="Aumentar quantidade"
                              className="flex h-7 w-7 items-center justify-center text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-300"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-gray-900">
                              {currencyFormatter.format(lineTotal)}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeFromCart(product.id)}
                              aria-label={`Remover ${product.name}`}
                              className="rounded p-1 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="border-t border-gray-100 bg-gray-50/60 px-5 py-4">
              <dl className="space-y-2 text-sm">
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
                <div className="flex items-center justify-between border-t border-gray-200 pt-2 text-base font-bold text-gray-900">
                  <dt>Total</dt>
                  <dd>{currencyFormatter.format(finalTotal)}</dd>
                </div>
              </dl>

              <Link
                href="/carrinho"
                onClick={onClose}
                className="mt-4 flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Ver carrinho e finalizar
              </Link>
              <button
                type="button"
                onClick={onClose}
                className="mt-2 w-full text-center text-xs font-semibold text-gray-500 transition-colors hover:text-gray-800"
              >
                Continuar comprando
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
