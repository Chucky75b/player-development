"use server";

import { createClient } from "@/lib/supabase/server";

export type ForgotPasswordState = {
  status: "idle" | "sent" | "error";
};

export async function requestPasswordReset(
  _prevState: ForgotPasswordState,
  formData: FormData
): Promise<ForgotPasswordState> {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) {
    return { status: "error" };
  }

  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/update-password`,
  });

  // Risposta identica sia che l'email esista sia che non esista,
  // per non rivelare quali indirizzi hanno un account.
  return { status: "sent" };
}
