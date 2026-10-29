"use client";

import { useEffect, useState } from "react";
import {
  CalendarClock,
  Check,
  Copy,
  Pencil,
  Percent,
  Plus,
  Tag,
  Trash2,
  TicketPercent,
} from "lucide-react";
import CouponFormModal from "@/components/CouponFormModal";
import type { Coupon } from "@/types/coupon";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

interface UserData {
  id: string;
  name: string;
  email: string;
  role?: string;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

function getCouponStatus(coupon: Coupon) {
  const now = Date.now();

  if (!coupon.active) {
    return { label: "Inativo", className: "bg-gray-100 text-gray-600" };
  }

  if (coupon.expires_at && new Date(coupon.expires_at).getTime() <= now) {
    return { label: "Expirado", className: "bg-red-50 text-red-600" };
  }

  if (new Date(coupon.starts_at).getTime() > now) {
    return { label: "Em breve", className: "bg-amber-50 text-amber-700" };
  }

  if (coupon.usage_limit !== null && coupon.used_count >= coupon.usage_limit) {
    return { label: "Esgotado", className: "bg-red-50 text-red-600" };
  }

  return { label: "Ativo", className: "bg-emerald-50 text-emerald-700" };
}

async function fetchCouponsData() {
  const meResponse = await fetch("/api/auth/me");
  const meData = meResponse.ok ? await meResponse.json() : { user: null };
  const currentUser: UserData | null = meData.user ?? null;

  const response = await fetch(
    currentUser?.role === "admin" ? "/api/coupons?all=1" : "/api/coupons"
  );
  const data = response.ok ? await response.json() : { coupons: [] };

  return {
    user: currentUser,
    coupons: (data.coupons || []) as Coupon[],
  };
}

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [statuses, setStatuses] = useState<
    Record<string, { label: string; className: string }>
  >({});

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    let active = true;

    fetchCouponsData()
      .then((data) => {
        if (!active) return;
        setUser(data.user);
        setCoupons(data.coupons);
        setStatuses(
          Object.fromEntries(
            data.coupons.map((coupon) => [
              coupon.id,
              getCouponStatus(coupon),
            ])
          )
        );
      })
      .catch((error) => console.error(error))
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const loadCoupons = async () => {
    try {
      const data = await fetchCouponsData();
      setUser(data.user);
      setCoupons(data.coupons);
      setStatuses(
        Object.fromEntries(
          data.coupons.map((coupon) => [coupon.id, getCouponStatus(coupon)])
        )
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingCoupon(null);
    setModalOpen(true);
  };

  const openEditModal = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingCoupon(null);
  };

  const handleSaved = () => {
    setFeedback({ type: "success", text: "Cupom salvo com sucesso!" });
    setLoading(true);
    loadCoupons();
  };

  const handleDelete = async (coupon: Coupon) => {
    if (!confirm(`Excluir o cupom "${coupon.code}"?`)) return;

    try {
      const response = await fetch(`/api/coupons/${coupon.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setCoupons((previous) =>
          previous.filter((item) => item.id !== coupon.id)
        );
        setStatuses((previous) => {
          const next = { ...previous };
          delete next[coupon.id];
          return next;
        });
        setFeedback({ type: "success", text: "Cupom excluído com sucesso!" });
      } else {
        const data = await response.json();
        setFeedback({
          type: "error",
          text: data.error || "Erro ao excluir cupom.",
        });
      }
    } catch (error) {
      console.error(error);
      setFeedback({ type: "error", text: "Erro ao excluir cupom." });
    }
  };

  const handleCopy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="flex-1 bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Cupons de desconto
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Use um dos cupons abaixo na finalização da sua compra.
            </p>
          </div>

          {isAdmin && (
            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex items-center gap-1.5 self-start rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 sm:self-auto"
            >
              <Plus className="h-4 w-4" />
              Novo cupom
            </button>
          )}
        </div>

        {feedback && (
          <div
            className={`mt-4 rounded-lg border p-3.5 text-sm ${
              feedback.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {feedback.text}
          </div>
        )}

        {loading ? (
          <p className="py-16 text-center text-sm text-gray-400">
            Carregando cupons...
          </p>
        ) : coupons.length === 0 ? (
          <div className="mt-6 flex flex-col items-center rounded-2xl border border-gray-200 bg-white px-4 py-16 text-center">
            <TicketPercent
              className="h-12 w-12 text-gray-300"
              aria-hidden="true"
            />
            <h2 className="mt-4 text-lg font-bold text-gray-900">
              Nenhum cupom disponível
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Volte em breve para conferir novas promoções.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {coupons.map((coupon) => {
              const status = statuses[coupon.id] ?? {
                label: coupon.active ? "Ativo" : "Inativo",
                className: coupon.active
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-gray-100 text-gray-600",
              };
              const isExpired = status.label === "Expirado";

              return (
                <article
                  key={coupon.id}
                  className="relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white"
                >
                  <div className="flex items-start justify-between gap-3 border-b border-dashed border-gray-200 bg-gradient-to-br from-blue-50 to-white p-4">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
                        <Tag className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-lg font-extrabold tracking-wide text-gray-900">
                          {coupon.code}
                        </p>
                        <span
                          className={`mt-0.5 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${status.className}`}
                        >
                          {status.label}
                        </span>
                      </div>
                    </div>

                    {isAdmin && (
                      <div className="flex shrink-0 items-center gap-1">
                        <button
                          type="button"
                          onClick={() => openEditModal(coupon)}
                          aria-label={`Editar ${coupon.code}`}
                          className="rounded p-1.5 text-gray-400 transition hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(coupon)}
                          aria-label={`Excluir ${coupon.code}`}
                          className="rounded p-1.5 text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-4">
                    <p className="flex items-center gap-1.5 text-xl font-extrabold text-blue-600">
                      <Percent className="h-4 w-4" aria-hidden="true" />
                      {coupon.discount_type === "percentage"
                        ? `${coupon.discount_value}% OFF`
                        : `${currencyFormatter.format(
                            coupon.discount_value
                          )} OFF`}
                    </p>

                    {coupon.description && (
                      <p className="mt-1.5 text-sm text-gray-600">
                        {coupon.description}
                      </p>
                    )}

                    <ul className="mt-3 space-y-1 text-xs text-gray-500">
                      <li>
                        {coupon.min_purchase > 0
                          ? `Compra mínima de ${currencyFormatter.format(
                              coupon.min_purchase
                            )}`
                          : "Sem valor mínimo de compra"}
                      </li>
                      {coupon.max_discount !== null &&
                        coupon.max_discount > 0 && (
                          <li>
                            Desconto máximo de{" "}
                            {currencyFormatter.format(coupon.max_discount)}
                          </li>
                        )}
                      {coupon.expires_at && (
                        <li className="flex items-center gap-1">
                          <CalendarClock
                            className="h-3.5 w-3.5"
                            aria-hidden="true"
                          />
                          {isExpired ? "Expirou em" : "Válido até"}{" "}
                          {formatDate(coupon.expires_at)}
                        </li>
                      )}
                      {coupon.usage_limit !== null && (
                        <li>
                          {coupon.used_count} de {coupon.usage_limit} usos
                        </li>
                      )}
                    </ul>

                    <button
                      type="button"
                      onClick={() => handleCopy(coupon.code)}
                      className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
                    >
                      {copiedCode === coupon.code ? (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          Código copiado!
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          Copiar código
                        </>
                      )}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {modalOpen && (
        <CouponFormModal
          coupon={editingCoupon}
          onClose={closeModal}
          onSaved={handleSaved}
        />
      )}
    </main>
  );
}
