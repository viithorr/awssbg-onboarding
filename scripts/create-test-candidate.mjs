import { createClient } from "@supabase/supabase-js";

const email = process.argv[2]?.trim().toLowerCase();
const name = process.argv.slice(3).join(" ").trim() || "Candidato de teste";
if (!email) throw new Error("Informe o e-mail que receberá o convite de teste.");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secret = process.env.SUPABASE_SECRET_KEY;
if (!url || !secret) throw new Error("Variáveis do Supabase ausentes.");

const supabase = createClient(url, secret, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const { data: existing, error: readError } = await supabase
  .from("candidates")
  .select("id,email")
  .eq("email", email)
  .maybeSingle();
if (readError) throw readError;

if (existing) {
  const { error } = await supabase.from("candidates").update({ name, active: true }).eq("id", existing.id);
  if (error) throw error;
} else {
  const { error } = await supabase.from("candidates").insert({ name, email, active: true });
  if (error) throw error;
}

console.log(`Candidato de teste pronto: ${name}`);
