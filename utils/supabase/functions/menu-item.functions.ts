import { addMenuItemType } from "@/types/menu-item.type";
import { supabase } from "../client";

export const addMenuItem = async (values: addMenuItemType) => {
  const { data, error } = await supabase
    .from("menu_items")
    .insert([values])
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const getMenuItems = async () => {
  const { data, error } = await supabase.from("menu_items").select("*");
  if (error) throw error;
  return data;
};

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
