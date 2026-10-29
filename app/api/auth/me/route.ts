import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("fanfar_session")?.value;

    if (!sessionToken) {
      return NextResponse.json({ user: null });
    }

    const rows = await query(
      `SELECT u.id, u.name, u.email, u.role
       FROM public.sessions s
       JOIN public.users u ON s.user_id = u.id
       WHERE s.token = $1 AND s.expires_at > NOW()
       LIMIT 1`,
      [sessionToken]
    );

    if (rows.length === 0) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({ user: rows[0] });
  } catch (error: any) {
    console.error("Erro ao verificar sessão do usuário:", error);
    return NextResponse.json({ user: null });
  }
}
