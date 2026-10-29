import { Client } from "pg";
import bcrypt from "bcryptjs";

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres:%40Jki!P3RH%40AVP785@db.bdatamygfkgqbvogivgf.supabase.co:5432/postgres";

const adminEmail = process.env.ADMIN_EMAIL || "fanfarfarmacia@gmail.com";
const adminPassword = process.env.ADMIN_PASSWORD || "12345678";

async function createAdmin() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(adminPassword, salt);

  const res = await client.query(
    `INSERT INTO public.users (name, email, password_hash, role)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (email) 
     DO UPDATE SET password_hash = $3, role = 'admin', updated_at = NOW()
     RETURNING id, name, email, role;`,
    ["Administrador Fanfar", adminEmail.toLowerCase(), hash, "admin"]
  );

  console.log("Admin configurado com sucesso:", res.rows[0]);
  await client.end();
}

createAdmin().catch((err) => {
  console.error("Erro ao criar admin:", err);
  process.exit(1);
});
