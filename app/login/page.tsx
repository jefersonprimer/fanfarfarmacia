"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2 } from "lucide-react";
import PasswordInput from "@/components/PasswordInput";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Falha ao entrar na conta.");
      }

      const next = new URLSearchParams(window.location.search).get("next");
      router.push(next?.startsWith("/") && !next.startsWith("//") ? next : "/");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Acesse sua conta
          </h2>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5"
            >
              E-mail
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seuemail@exemplo.com"
              className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#279236] focus:border-transparent transition"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-gray-700 uppercase tracking-wider"
              >
                Senha
              </label>
              <Link
                href="/recuperar-senha"
                className="text-xs font-medium text-[#279236] hover:text-[#1f7a2b] transition-colors"
              >
                Esqueceu a senha?
              </Link>
            </div>
            <PasswordInput
              id="password"
              required
              value={password}
              onChange={setPassword}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-xl text-sm font-semibold text-white bg-[#279236] hover:bg-[#1f7a2b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#279236] transition disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
              </>
            ) : (
              <>
                <span>Entrar</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-sm text-gray-600">
            Ainda não tem conta?{" "}
            <Link
              href="/signup"
              className="font-semibold text-[#279236] hover:text-[#1f7a2b] transition-colors"
            >
              Cadastre-se agora
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
