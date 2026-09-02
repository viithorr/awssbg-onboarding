"use server";

import { redirect } from "next/navigation";
import { createUserClient } from "@/lib/supabase/server";

export async function login(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const client = await createUserClient();
  const { error } = await client.auth.signInWithPassword({ email, password });
  if (error) redirect("/admin/login?error=credentials");
  redirect("/admin");
}
