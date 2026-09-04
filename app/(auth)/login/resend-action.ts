"use server";

import { createClient } from "@/lib/supabase/server";

export type ResendState = {
  status: "idle" | "sent" | "error";
};

export async function resendConfirmation(
  _prevState: ResendState,
  formData: FormData
): Promise<ResendState> {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) {
    return { status: "error" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/auth/confirm`,
    },
  });

  if (error) {
    return { status: "error" };
  }

  return { status: "sent" };
}
