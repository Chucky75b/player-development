"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

async function getOwnPlayerId() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: player } = await supabase
    .from("players")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!player) throw new Error("No linked player profile");
  return { supabase, playerId: player.id };
}

export async function saveFeedback(values: { id?: string; content: string }) {
  const { supabase, playerId } = await getOwnPlayerId();

  const query = values.id
    ? supabase
        .from("feedback")
        .update({ content: values.content, updated_at: new Date().toISOString() })
        .eq("id", values.id)
    : supabase.from("feedback").insert({
        player_id: playerId,
        content: values.content,
      });

  const { data, error } = await query
    .select("id, content, created_at")
    .single();

  revalidatePath("/dashboard");
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteFeedback(id: string) {
  const { supabase } = await getOwnPlayerId();
  await supabase.from("feedback").delete().eq("id", id);
  revalidatePath("/dashboard");
}
