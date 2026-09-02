import fs from "node:fs/promises";
import { createClient } from "@supabase/supabase-js";

const csvPath = process.argv[2];
if (!csvPath) throw new Error("Informe o caminho do CSV.");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secret = process.env.SUPABASE_SECRET_KEY;
if (!url || !secret) throw new Error("Variáveis do Supabase ausentes.");

function parseCsvLine(line) {
  const fields = [];
  let value = "";
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (char === '"' && quoted && line[index + 1] === '"') {
      value += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      fields.push(value.trim());
      value = "";
    } else {
      value += char;
    }
  }
  fields.push(value.trim());
  return fields;
}

const text = (await fs.readFile(csvPath, "utf8")).replace(/^\uFEFF/, "");
const lines = text.split(/\r?\n/).filter(Boolean);
const headerIndex = lines.findIndex((line) => {
  const cells = parseCsvLine(line).map((cell) => cell.toLocaleLowerCase("pt-BR"));
  return cells.includes("nome completo") && cells.some((cell) => cell === "e-mail" || cell === "email");
});
if (headerIndex < 0) throw new Error("Cabeçalhos Nome completo e E-mail não encontrados.");

const headers = parseCsvLine(lines[headerIndex]).map((header) => header.toLocaleLowerCase("pt-BR"));
const nameIndex = headers.indexOf("nome completo");
const emailIndex = headers.findIndex((header) => header === "e-mail" || header === "email");
const candidates = lines.slice(headerIndex + 1).map(parseCsvLine).map((row) => ({
  name: row[nameIndex]?.replace(/\s+/g, " ").trim(),
  email: row[emailIndex]?.trim().toLocaleLowerCase("pt-BR"),
  active: true,
})).filter(({ name, email }) => name && email);

const supabase = createClient(url, secret, { auth: { persistSession: false, autoRefreshToken: false } });
const { data: existing, error: readError } = await supabase.from("candidates").select("id,email");
if (readError) throw readError;

const existingEmails = new Set((existing ?? []).map(({ email }) => email));
const newCandidates = candidates.filter(({ email }) => !existingEmails.has(email));
if (newCandidates.length) {
  const { error: insertError } = await supabase.from("candidates").insert(newCandidates);
  if (insertError) throw insertError;
}

console.log(JSON.stringify({ sourceRows: candidates.length, inserted: newCandidates.length, alreadyExisted: candidates.length - newCandidates.length }));
