import { createClient } from "@supabase/supabase-js";

const email = process.argv[2]?.trim().toLowerCase();
if (!email) {
  throw new Error("Informe o e-mail do usuário: npm run admin:promote -- seu@email.com");
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secret = process.env.SUPABASE_SECRET_KEY;
if (!url || !secret) throw new Error("Variáveis do Supabase ausentes em .env.local.");

const supabase = createClient(url, secret, {
  auth: { persistSession: false, autoRefreshToken: false },
});

let page = 1;
let user;

while (!user) {
  const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 100 });
  if (error) throw error;

  user = data.users.find((item) => item.email?.toLowerCase() === email);
  if (user || data.users.length < 100) break;
  page += 1;
}

if (!user) throw new Error(`Usuário não encontrado no Supabase Auth: ${email}`);

const { error: membershipError } = await supabase
  .from("admin_users")
  .upsert({ user_id: user.id }, { onConflict: "user_id" });

if (membershipError) throw membershipError;

console.log(`Administrador liberado com sucesso: ${email}`);
