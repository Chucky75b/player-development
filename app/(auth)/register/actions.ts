"use server";

import { createClient } from "@/lib/supabase/server";

export type RegisterState = {
  status: "idle" | "check-email" | "error";
  error?: string;
};

export async function register(
  _prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const role = String(formData.get("role") ?? "player");

  if (!firstName || !lastName || !email || !password) {
    return { status: "error", error: "Please fill in every field." };
  }
  if (role !== "player" && role !== "coach") {
    return { status: "error", error: "Invalid role." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { first_name: firstName, last_name: lastName, role },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/pending`,
    },
  });

  if (error) {
    return { status: "error", error: "Could not create the account." };
  }

  return { status: "check-email" };
}
