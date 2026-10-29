"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ProductFormModal from "@/components/ProductFormModal";
import type { Product } from "@/types/product";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/products");
      const data = await response.json();

      if (response.ok) {
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      try {
        const response = await fetch("/api/products");
        const data = await response.json();

        if (active && response.ok) {
          setProducts(data.products || []);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      active = false;
    };
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingProduct(null);
  };

  const handleSaved = () => {
    setFeedback({ type: "success", text: "Produto salvo com sucesso!" });
    closeModal();
    fetchProducts();
  };

  const handleDelete = async (id: string, productName: string) => {
    if (!confirm(`Excluir o produto "${productName}"?`)) return;

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setProducts((previous) =>
          previous.filter((product) => product.id !== id)
        );
        setFeedback({ type: "success", text: "Produto excluído com sucesso!" });
      } else {
        setFeedback({ type: "error", text: "Erro ao excluir produto." });
      }
    } catch (error) {
      console.error(error);
      setFeedback({ type: "error", text: "Erro ao excluir produto." });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex flex-col gap-4 border-b border-gray-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Gestão de Produtos
            </h1>
            <p className="mt-0.5 text-sm text-gray-500">
              Cadastre, edite e remova os produtos da farmácia.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Link
              href="/promocoes"
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Gerenciar promoções
            </Link>
            <Link
              href="/cupons"
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Gerenciar cupons
            </Link>
            <button
              type="button"
              onClick={fetchProducts}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              {loading ? "Carregando..." : "Atualizar lista"}
            </button>
            <button
              type="button"
              onClick={openCreateModal}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Novo produto
            </button>
          </div>
        </div>

        {feedback && (
          <div
            className={`rounded-lg border p-3.5 text-sm ${
              feedback.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {feedback.text}
          </div>
        )}

        <div className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
          <h2 className="border-b border-gray-100 pb-3 text-base font-bold text-gray-900">
            Produtos cadastrados ({products.length})
          </h2>

          {loading ? (
            <p className="py-10 text-center text-sm text-gray-400">
              Carregando...
            </p>
          ) : products.length === 0 ? (
            <p className="py-10 text-center text-sm text-gray-500">
              Nenhum produto cadastrado ainda.
            </p>
          ) : (
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              {products.map((product) => {
                const firstImage =
                  Array.isArray(product.images) && product.images.length > 0
                    ? product.images[0]
                    : null;

                return (
                  <article
                    key={product.id}
                    className="flex items-center gap-3 rounded-xl border border-gray-200 p-3"
                  >
                    {firstImage ? (
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-50">
                        <Image
                          src={firstImage}
                          alt={product.name}
                          fill
                          sizes="64px"
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-[10px] text-gray-400">
                        Sem foto
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-semibold text-gray-900">
                        {product.name}
                      </h3>
                      <p className="truncate text-xs text-gray-500">
                        {product.brand ? `${product.brand} • ` : ""}
                        {product.department || product.category}
                      </p>
                      <div className="mt-1 flex items-baseline gap-2">
                        <span className="text-sm font-bold text-gray-900">
                          R${" "}
                          {Number(product.price)
                            .toFixed(2)
                            .replace(".", ",")}
                        </span>
                        <span className="text-[11px] text-gray-400">
                          Estoque: {product.stock}
                        </span>
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-col gap-1">
                      <button
                        type="button"
                        onClick={() => openEditModal(product)}
                        className="rounded px-2 py-1 text-xs font-semibold text-blue-600 transition hover:bg-blue-50"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(product.id, product.name)}
                        className="rounded px-2 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                      >
                        Excluir
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {modalOpen && (
        <ProductFormModal
          product={editingProduct}
          onClose={closeModal}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}
