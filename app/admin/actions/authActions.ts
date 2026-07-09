"use server";

import { signOut } from "@/lib/auth";

export async function adminLogout() {
  await signOut({ redirectTo: "/admin/login" });
}
