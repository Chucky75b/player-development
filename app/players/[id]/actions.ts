"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

async function assertStaff() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "coach" && profile?.role !== "admin") {
    throw new Error("Not authorized");
  }
  return supabase;
}

export async function saveAnchor(
  playerId: string,
  values: { id?: string; title: string; description: string }
) {
  const supabase = await assertStaff();

  const query = values.id
    ? supabase
        .from("anchors")
        .update({
          title: values.title,
          description: values.description,
          updated_at: new Date().toISOString(),
        })
        .eq("id", values.id)
    : supabase.from("anchors").insert({
        player_id: playerId,
        title: values.title,
        description: values.description,
      });

  const { data, error } = await query
    .select("id, title, description")
    .single();

  revalidatePath(`/players/${playerId}`);
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteAnchor(playerId: string, id: string) {
  const supabase = await assertStaff();
  await supabase.from("anchors").delete().eq("id", id);
  revalidatePath(`/players/${playerId}`);
}

export async function saveGrowthArea(
  playerId: string,
  values: {
    id?: string;
    title: string;
    description: string;
    category: string | null;
    status: string;
  }
) {
  const supabase = await assertStaff();

  const query = values.id
    ? supabase
        .from("growth_areas")
        .update({
          title: values.title,
          description: values.description,
          category: values.category,
          status: values.status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", values.id)
    : supabase.from("growth_areas").insert({
        player_id: playerId,
        title: values.title,
        description: values.description,
        category: values.category,
        status: values.status,
      });

  const { data, error } = await query
    .select("id, title, description, category, status")
    .single();

  revalidatePath(`/players/${playerId}`);
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteGrowthArea(playerId: string, id: string) {
  const supabase = await assertStaff();
  await supabase.from("growth_areas").delete().eq("id", id);
  revalidatePath(`/players/${playerId}`);
}

export async function savePriority(
  playerId: string,
  values: { id?: string; title: string; description: string; status: string }
) {
  const supabase = await assertStaff();

  const query = values.id
    ? supabase
        .from("priorities")
        .update({
          title: values.title,
          description: values.description,
          status: values.status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", values.id)
    : supabase.from("priorities").insert({
        player_id: playerId,
        title: values.title,
        description: values.description,
        status: values.status,
      });

  const { data, error } = await query
    .select("id, title, description, status")
    .single();

  revalidatePath(`/players/${playerId}`);
  if (error) throw new Error(error.message);
  return data;
}

export async function deletePriority(playerId: string, id: string) {
  const supabase = await assertStaff();
  await supabase.from("priorities").delete().eq("id", id);
  revalidatePath(`/players/${playerId}`);
}

export async function saveDrill(
  playerId: string,
  values: { id?: string; title: string; description: string; status: string }
) {
  const supabase = await assertStaff();

  const query = values.id
    ? supabase
        .from("drills")
        .update({
          title: values.title,
          description: values.description,
          status: values.status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", values.id)
    : supabase.from("drills").insert({
        player_id: playerId,
        title: values.title,
        description: values.description,
        status: values.status,
      });

  const { data, error } = await query
    .select("id, title, description, status")
    .single();

  revalidatePath(`/players/${playerId}`);
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteDrill(playerId: string, id: string) {
  const supabase = await assertStaff();
  await supabase.from("drills").delete().eq("id", id);
  revalidatePath(`/players/${playerId}`);
}
