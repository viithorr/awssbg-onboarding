import "server-only";
import { redirect } from "next/navigation";
import { createAdminClient } from "./supabase/admin";
import { createUserClient } from "./supabase/server";

export async function requireAdmin() {
  const userClient = await createUserClient();
  const { data: { user } } = await userClient.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data } = await createAdminClient().from("admin_users").select("user_id").eq("user_id", user.id).maybeSingle();
  if (!data) {
    await userClient.auth.signOut();
    redirect("/admin/login?error=unauthorized");
  }
  return user;
}
