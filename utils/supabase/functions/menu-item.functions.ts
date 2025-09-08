import { addMenuItemType, MenuItem } from "@/types/menu-item.type";
import { supabase } from "../client";

export const addMenuItem = async (values: addMenuItemType) => {
  const { data, error } = await supabase
    .from("menu_items")
    .insert([{ ...values, sort_order: values.sort_order ?? 999 }]) // nullsa son sıraya ekle
    .select()
    .single();
  if (error) throw error;
  return data;
};

export async function getMenuItems() {
  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("getMenuItems error:", error);
    throw error;
  }
  return data;
}

export const deleteMenuItems = async (id: string) => {
  const { data, error } = await supabase
    .from("menu_items")
    .delete()
    .eq("id", id);
  if (error) throw error;
  return data;
};

export const updateMenuItems = async (id: string, values: addMenuItemType) => {
  const { data, error } = await supabase
    .from("menu_items")
    .update(values)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

// Sıralama kaydetme
export async function updateMenuItemOrder(items: MenuItem[]) {
  try {
    for (let index = 0; index < items.length; index++) {
      const item = items[index];
      const { error } = await supabase
        .from("menu_items")
        .update({ sort_order: index })
        .eq("id", item.id);

      if (error) throw error;
    }
    return true;
  } catch (error) {
    console.error("updateMenuItemOrder error:", error);
    return false;
  }
}
