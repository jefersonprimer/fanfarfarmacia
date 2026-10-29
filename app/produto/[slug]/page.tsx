"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  Minus,
  Package,
  Pencil,
  Plus,
  ShieldCheck,
  Trash2,
  Truck,
} from "lucide-react";
import ProductCarousel from "@/components/ProductCarousel";
import ProductFormModal from "@/components/ProductFormModal";
import { useCart } from "@/hooks/useCart";
import { getPromotedUnitPrice } from "@/lib/promotions";
import type { Product } from "@/types/product";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const SPECIFICATION_LABELS: Record<string, string> = {
  ean: "EAN",
  sku: "SKU",
  categoria_produtos: "Categoria",
  genero: "Gênero",
  tipo_produto: "Tipo de produto",
  tipo_embalagem: "Embalagem",
  fabricante: "Fabricante",
  composicao: "Composição",
  indicacoes_uso: "Indicações de uso",
  linha: "Linha",
  modo_uso: "Modo de uso",
};

function ProductSkeleton() {
  return (
    <main className="flex-1 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center gap-1.5">
          <div className="h-3 w-16 animate-pulse rounded bg-gray-200" />
          <div className="h-3 w-3 animate-pulse rounded bg-gray-200" />
          <div className="h-3 w-24 animate-pulse rounded bg-gray-200" />
          <div className="h-3 w-3 animate-pulse rounded bg-gray-200" />
          <div className="h-3 w-40 animate-pulse rounded bg-gray-200" />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div>
            <div className="w-full max-w-md">
              <div className="aspect-square animate-pulse rounded-2xl bg-gray-200" />
              <div className="mt-3 flex gap-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-16 w-16 shrink-0 animate-pulse rounded-lg bg-gray-200"
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 lg:mt-0">
            <div className="h-7 w-4/5 animate-pulse rounded bg-gray-200" />
            <div className="mt-3 h-4 w-32 animate-pulse rounded bg-gray-200" />

            <div className="mt-6 space-y-2">
              <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
              <div className="h-3 w-full animate-pulse rounded bg-gray-200" />
              <div className="h-3 w-full animate-pulse rounded bg-gray-200" />
              <div className="h-3 w-2/3 animate-pulse rounded bg-gray-200" />
            </div>

            <div className="mt-6 space-y-2">
              <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
              <div className="flex flex-wrap gap-2">
                <div className="h-8 w-24 animate-pulse rounded-lg bg-gray-200" />
                <div className="h-8 w-28 animate-pulse rounded-lg bg-gray-200" />
                <div className="h-8 w-20 animate-pulse rounded-lg bg-gray-200" />
              </div>
            </div>
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-5">
              <div className="h-3 w-20 animate-pulse rounded bg-gray-200" />
              <div className="mt-2 h-9 w-40 animate-pulse rounded bg-gray-200" />
              <div className="mt-2 h-4 w-32 animate-pulse rounded bg-gray-200" />
              <div className="mt-3 h-6 w-24 animate-pulse rounded-full bg-gray-200" />
              <div className="mt-5 h-12 w-full animate-pulse rounded-xl bg-gray-200" />
              <div className="mt-4 border-t border-gray-100 pt-4">
                <div className="h-4 w-40 animate-pulse rounded bg-gray-200" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
          <div className="h-5 w-32 animate-pulse rounded bg-gray-200" />
          <div className="mt-4 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="space-y-1.5">
                <div className="h-3 w-16 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

function ProductDetail() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const slug = params.slug;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<{
    department: string;
    products: Product[];
  } | null>(null);

  const { items, addToCart, setCartQuantity } = useCart();

  useEffect(() => {
    if (!slug) return;

    let active = true;

    async function loadProduct() {
      setLoading(true);
      setNotFound(false);

      try {
        const response = await fetch(
          `/api/products/${encodeURIComponent(slug)}`
        );
        const data = await response.json();

        if (!active) return;

        if (response.ok && data.product) {
          setProduct(data.product);
          setActiveImage(0);
        } else {
          setNotFound(true);
        }
      } catch {
        if (active) setNotFound(true);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProduct();

    return () => {
      active = false;
    };
  }, [slug]);

  useEffect(() => {
    if (!product?.name) return;

    document.title = `${product.name} | Fanfar Farmácia`;
  }, [product?.name]);

  useEffect(() => {
    let active = true;

    async function loadUser() {
      try {
        const response = await fetch("/api/auth/me");
        const data = await response.json();

        if (active && response.ok) {
          setIsAdmin(data.user?.role === "admin");
        }
      } catch (error) {
        console.error("Erro ao verificar usuário:", error);
      }
    }

    loadUser();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const department = product?.department;
    const productId = product?.id;

    if (!department || !productId) return;

    let active = true;

    async function loadRelatedProducts(dept: string, currentId: string) {
      try {
        const response = await fetch(
          `/api/products?department=${encodeURIComponent(dept)}`
        );
        const data = await response.json();

        if (active && response.ok && Array.isArray(data.products)) {
          const products = (data.products as Product[])
            .filter((item) => item.id !== currentId)
            .slice(0, 12);

          setRelatedProducts({ department: dept, products });
        }
      } catch (error) {
        console.error("Erro ao carregar produtos relacionados:", error);
      }
    }

    loadRelatedProducts(department, productId);

    return () => {
      active = false;
    };
  }, [product?.department, product?.id]);

  const handleProductSaved = (updatedProduct: Product) => {
    setProduct(updatedProduct);
    setEditModalOpen(false);
  };

  const handleDelete = async () => {
    if (!product) return;

    if (!confirm(`Excluir o produto "${product.name}"?`)) return;

    setDeleting(true);

    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/");
        router.refresh();
      } else {
        alert("Erro ao excluir produto.");
      }
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
      alert("Erro ao excluir produto.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <ProductSkeleton />;
  }

  if (notFound || !product) {
    return (
      <main className="flex-1 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-20 text-center sm:px-6 lg:px-8">
          <Package className="h-12 w-12 text-gray-300" aria-hidden="true" />
          <h1 className="mt-4 text-xl font-bold text-gray-900">
            Produto não encontrado
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            O produto que você procura pode ter sido removido ou não existe.
          </p>
          <Link
            href="/"
            className="mt-6 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Voltar para a home
          </Link>
        </div>
      </main>
    );
  }

  const images = (product.images ?? []).filter(Boolean);
  const mainImage = images[activeImage];
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
  const promoBadge =
    product.promotional_badge ?? promotion?.badge_label ?? null;
  const requiresQuantity = promotion !== null && minQuantity > 1;
  const installmentPrice = product.installment_price ?? null;
  const installments = product.installments ?? 3;
  const hasInstallment =
    installmentPrice !== null && installments > 1 && !promoAppliesAtOne;
  const inStock = product.stock > 0;
  const quantity =
    items.find((item) => item.product.id === product.id)?.quantity ?? 0;

  const related =
    relatedProducts && relatedProducts.department === product.department
      ? relatedProducts.products
      : [];

  const specifications = Object.entries(product.specifications ?? {}).filter(
    ([, value]) => value !== null && value !== undefined && String(value).trim() !== ""
  );

  const increaseQuantity = () =>
    setCartQuantity(product, quantity + 1);
  const decreaseQuantity = () => setCartQuantity(product, quantity - 1);

  return (
    <main className="flex-1 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <nav className="mb-6 flex items-center gap-1.5 text-xs text-gray-500">
          <Link href="/" className="flex items-center gap-1 hover:text-blue-600">
            <ArrowLeft className="h-3.5 w-3.5" />
            Home
          </Link>
          {product.department && (
            <>
              <ChevronRight className="h-3.5 w-3.5 text-gray-300" />
              <span className="truncate">{product.department}</span>
            </>
          )}
          <ChevronRight className="h-3.5 w-3.5 text-gray-300" />
          <span className="truncate text-gray-700">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div>
            <div className="w-full max-w-md">
            <div className="flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-white p-6">
              {mainImage ? (
                <img
                  src={mainImage}
                  alt={product.name}
                  className="h-full w-full object-contain"
                />
              ) : (
                <Package className="h-16 w-16 text-gray-300" aria-hidden="true" />
              )}
            </div>

            {images.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                {images.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    className={`flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-white p-1.5 transition ${
                      index === activeImage
                        ? "border-blue-500 ring-1 ring-blue-500"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    aria-label={`Ver imagem ${index + 1}`}
                  >
                    <img
                      src={image}
                      alt=""
                      className="h-full w-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
            </div>
          </div>

          <div className="mt-6 lg:mt-0">
            <div className="flex items-start justify-between gap-3">
              <h1 className="text-xl font-bold leading-tight text-gray-900 sm:text-2xl">
                {product.name}
              </h1>

              {isAdmin && (
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setEditModalOpen(true)}
                    className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:border-blue-300 hover:text-blue-600"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={deleting}
                    className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    {deleting ? "Apagando..." : "Apagar"}
                  </button>
                </div>
              )}
            </div>

            {product.brand && (
              <p className="mt-2 text-sm text-gray-500">
                Marca:{" "}
                <span className="font-semibold text-gray-700">
                  {product.brand}
                </span>
              </p>
            )}

            {product.description && (
              <div className="mt-6">
                <h2 className="text-sm font-bold text-gray-900">Descrição</h2>
                <p
                  className={`mt-2 whitespace-pre-line text-sm leading-relaxed text-gray-600 ${
                    descriptionExpanded ? "" : "line-clamp-4"
                  }`}
                >
                  {product.description}
                </p>
                {product.description.length > 180 && (
                  <button
                    type="button"
                    onClick={() => setDescriptionExpanded((current) => !current)}
                    aria-expanded={descriptionExpanded}
                    className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700 hover:underline"
                  >
                    {descriptionExpanded ? "Ver menos" : "Ver mais"}
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        descriptionExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                )}
              </div>
            )}

            {(product.options ?? []).length > 0 && (
              <div className="mt-6">
                <h2 className="text-sm font-bold text-gray-900">
                  Opções disponíveis
                </h2>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(product.options ?? []).map((option) => (
                    <span
                      key={option.id ?? option.nome}
                      className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700"
                    >
                      {option.nome}
                      {option.preco
                        ? ` — ${currencyFormatter.format(option.preco)}`
                        : ""}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-5">
              {promoBadge && (
                <span className="mb-2 inline-flex rounded-full bg-red-500 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white">
                  {promoBadge}
                </span>
              )}

              {comparePrice !== null && (
                <span className="block text-sm text-gray-400 line-through">
                  {currencyFormatter.format(comparePrice)}
                </span>
              )}

              <p className="text-3xl font-bold text-gray-900">
                {currencyFormatter.format(displayPrice)}
              </p>

              {requiresQuantity && (
                <p className="mt-1 text-sm font-semibold text-red-600">
                  Promoção válida a partir de {minQuantity} unidades.
                </p>
              )}

              {hasInstallment && installmentPrice !== null ? (
                <p className="mt-1 text-sm text-gray-500">
                  ou{" "}
                  <span className="font-semibold text-gray-700">
                    {installments}x de{" "}
                    {currencyFormatter.format(installmentPrice)}
                  </span>{" "}
                  sem juros
                </p>
              ) : (
                <p className="mt-1 text-sm text-gray-500">à vista</p>
              )}

              <p
                className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                  inStock
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-red-50 text-red-600"
                }`}
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                {inStock ? "Em estoque" : "Indisponível"}
              </p>

              <div className="mt-5">
                {quantity === 0 ? (
                  <button
                    type="button"
                    onClick={() => addToCart(product, 1)}
                    disabled={!inStock}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
                  >
                    <Plus className="h-4 w-4" />
                    Adicionar ao carrinho
                  </button>
                ) : (
                  <div className="flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50 p-1.5">
                    <button
                      type="button"
                      onClick={decreaseQuantity}
                      aria-label="Diminuir quantidade"
                      className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-blue-700 shadow-sm transition hover:bg-blue-100"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span
                      aria-live="polite"
                      className="text-sm font-bold text-blue-700"
                    >
                      {quantity} no carrinho
                    </span>
                    <button
                      type="button"
                      onClick={increaseQuantity}
                      disabled={quantity >= product.stock}
                      aria-label="Aumentar quantidade"
                      className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-blue-700 shadow-sm transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:text-gray-300"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-4 text-xs text-gray-500">
                <Truck className="h-4 w-4 text-blue-600" />
                Entrega para todo o Brasil
              </div>
            </div>
          </div>
        </div>

        {specifications.length > 0 && (
          <section className="mt-10 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
            <h2 className="text-base font-bold text-gray-900">
              Especificações
            </h2>
            <dl className="mt-4 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
              {specifications.map(([key, value]) => (
                <div key={key} className="flex flex-col">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    {SPECIFICATION_LABELS[key] ?? key}
                  </dt>
                  <dd className="mt-0.5 text-sm text-gray-700">
                    {String(value)}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        )}
      </div>

      {related.length > 0 && product.department && (
        <ProductCarousel
          products={related}
          title="Similares que você pode se interessar"
        />
      )}

      {editModalOpen && (
        <ProductFormModal
          product={product}
          onClose={() => setEditModalOpen(false)}
          onSaved={handleProductSaved}
        />
      )}
    </main>
  );
}

export default function ProductPage() {
  return (
    <Suspense fallback={<ProductSkeleton />}>
      <ProductDetail />
    </Suspense>
  );
}
