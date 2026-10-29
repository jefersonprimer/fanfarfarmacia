"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  User as UserIcon,
  ShoppingBag,
  Search,
  LogOut,
  Shield,
  ChevronDown,
  Package,
  PackageCheck,
  Plus,
  Tag,
} from "lucide-react";
import { useCallback, useEffect, useState, useRef } from "react";
import type { Product } from "@/types/product";
import { useCart } from "@/hooks/useCart";
import CartSidebar from "@/components/CartSidebar";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

interface HeaderProps {
  onSearch?: (query: string) => void;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  role?: string;
}

export default function Header({ onSearch }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { itemCount: cartItemCount } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<UserData | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const closeCart = useCallback(() => setCartOpen(false), []);

  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user || null);
        }
      } catch (err) {
        console.error("Erro ao verificar autenticação:", err);
      }
    };

    fetchUser();
  }, [pathname]);

  // Busca produtos no header com debounce
  useEffect(() => {
    const term = searchQuery.trim();
    if (term.length < 2) return;

    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      setSearching(true);

      try {
        const response = await fetch(
          `/api/products?search=${encodeURIComponent(term)}`,
          { signal: controller.signal }
        );
        const data = await response.json();

        if (controller.signal.aborted) return;

        setSearchResults(response.ok ? data.products ?? [] : []);
        setSearchOpen(true);
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("Erro ao buscar produtos:", error);
          setSearchResults([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setSearching(false);
        }
      }
    }, 300);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [searchQuery]);

  // Fecha o dropdown de busca ao clicar fora ou pressionar Escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setSearchOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSearchOpen(false);
      }
    }

    if (searchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [searchOpen]);

  // Fecha o dropdown se clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      setDropdownOpen(false);
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Erro ao deslogar:", err);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);

    if (value.trim().length < 2) {
      setSearchResults([]);
      setSearchOpen(false);
      setSearching(false);
    }
  };

  const displayName = user
    ? user.name?.trim() || user.email?.split("@")[0] || "Usuário"
    : null;

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4 sm:gap-6">
          {/* Logo à esquerda */}
          <Link href="/" className="shrink-0 flex items-center">
            <Image
              src="/logo-name.png"
              alt="Fanfar Farmácia"
              width={160}
              height={50}
              priority
              className="h-10 sm:h-12 w-auto object-contain"
            />
          </Link>

          {/* Campo de busca no meio */}
          <div className="flex-1 max-w-xl mx-2 sm:mx-4" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <Search
                className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                onFocus={() => {
                  if (searchQuery.trim().length >= 2) {
                    setSearchOpen(true);
                  }
                }}
                placeholder="O que você procura hoje?"
                autoComplete="off"
                className="w-full pl-11 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-full text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition duration-200"
              />

              {searchOpen && (
                <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">
                  {searching ? (
                    <p className="px-4 py-3 text-sm text-gray-500">
                      Buscando produtos...
                    </p>
                  ) : searchResults.length === 0 ? (
                    <p className="px-4 py-3 text-sm text-gray-500">
                      Nenhum produto encontrado.
                    </p>
                  ) : (
                    <ul className="max-h-96 overflow-y-auto py-1">
                      {searchResults.map((product) => {
                        const image = product.images?.[0];
                        const installmentPrice =
                          product.installment_price ?? null;
                        const installments = product.installments ?? 3;

                        return (
                          <li key={product.id}>
                            <Link
                              href={`/produto/${product.slug}`}
                              onClick={() => setSearchOpen(false)}
                              className="flex items-center gap-3 px-3 py-2.5 transition-colors hover:bg-gray-50"
                            >
                              <span className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg">
                                {image ? (
                                  <img
                                    src={image}
                                    alt={product.name}
                                    loading="lazy"
                                    className="h-full w-full object-contain p-1"
                                  />
                                ) : (
                                  <Package
                                    className="h-5 w-5 text-gray-300"
                                    aria-hidden="true"
                                  />
                                )}
                              </span>

                              <span className="min-w-0 flex-1">
                                <span className="block truncate text-sm font-semibold text-gray-800">
                                  {product.name}
                                </span>
                                <span className="mt-0.5 flex flex-wrap items-baseline gap-x-2">
                                  <span className="text-sm font-bold text-gray-900">
                                    {currencyFormatter.format(product.price)}
                                  </span>
                                  {installmentPrice !== null &&
                                    installments > 1 && (
                                      <span className="text-[11px] text-gray-500">
                                        {installments}x de{" "}
                                        {currencyFormatter.format(
                                          installmentPrice
                                        )}
                                      </span>
                                    )}
                                </span>
                              </span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              )}
            </form>
          </div>

          {/* Área à direita: Usuário e Sacola de compras */}
          <div className="flex items-center gap-3 sm:gap-6 shrink-0">
            {/* Botão exclusivo para Admin: Criar */}
            {user?.role === "admin" && (
              <Link
                href="/admin"
                className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 shadow-sm transition-all hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 sm:text-sm"
              >
                <Plus className="h-4 w-4 text-gray-400" />
                <span>Criar</span>
              </Link>
            )}

            {/* Usuário */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2.5 text-gray-700 hover:text-gray-900 transition-colors focus:outline-none group text-left"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center font-bold text-sm border border-gray-200">
                    {displayName ? displayName.charAt(0).toUpperCase() : <UserIcon className="h-5 w-5" />}
                  </div>
                  <div className="hidden sm:flex flex-col text-left max-w-[140px]">
                    <span className="text-xs text-gray-500 font-medium leading-none mb-1">
                      Bem vindo
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="text-xs sm:text-sm font-semibold text-gray-900 group-hover:text-gray-900 truncate leading-tight">
                        {displayName}
                      </span>
                      <ChevronDown className="h-3.5 w-3.5 text-gray-400 group-hover:text-gray-600 shrink-0" />
                    </div>
                  </div>
                </button>

                {/* Dropdown Menu do Usuário */}
                {dropdownOpen && (
                  <div className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl animate-in fade-in zoom-in-95 duration-100">
                    <div className="flex items-center gap-3 border-b border-gray-100 bg-gray-50/70 px-4 py-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-sm font-bold text-gray-700 shadow-sm">
                        {displayName ? (
                          displayName.charAt(0).toUpperCase()
                        ) : (
                          <UserIcon className="h-5 w-5 text-gray-500" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-gray-900">
                          {user.name || user.email}
                        </p>
                        <p className="truncate text-xs text-gray-500">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <div className="p-2">
                      {user.role === "admin" && (
                        <Link
                          href="/admin"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
                        >
                          <Shield className="h-4 w-4 text-gray-500" />
                          <span>Painel do Admin</span>
                          <span className="ml-auto rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                            Admin
                          </span>
                        </Link>
                      )}

                      <Link
                        href="/pedidos"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
                      >
                        <PackageCheck className="h-4 w-4 text-gray-500" />
                        <span>Meus Pedidos</span>
                      </Link>

                      <Link
                        href="/cupons"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
                      >
                        <Tag className="h-4 w-4 text-gray-500" />
                        <span>Cupons de desconto</span>
                      </Link>

                      <div className="my-1 border-t border-gray-100" />

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="group flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-gray-600 transition-colors hover:bg-red-50 hover:text-red-600"
                      >
                        <LogOut className="h-4 w-4 text-gray-400 transition-colors group-hover:text-red-500" />
                        <span>Sair da conta</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Usuário Desconectado */
              <Link
                href="/login"
                className="flex items-center gap-2.5 group text-gray-700 hover:text-gray-900 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                  <UserIcon className="h-5 w-5 text-gray-500 group-hover:text-gray-700 transition-colors" />
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs text-gray-500 font-medium leading-none mb-1">
                    Bem vindo
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-gray-800 group-hover:text-gray-900 leading-tight">
                    Entre ou Cadastre-se
                  </span>
                </div>
              </Link>
            )}

            {/* Ícone de Bag à direita */}
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              aria-label="Abrir sacola de compras"
              aria-expanded={cartOpen}
              className="relative p-2.5 rounded-full text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
            >
              <ShoppingBag className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute bottom-0 right-0 flex items-center justify-center min-w-5 h-5 px-1 text-xs font-bold text-white bg-red-500 rounded-full shadow-sm">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <CartSidebar open={cartOpen} onClose={closeCart} />
    </header>
  );
}
