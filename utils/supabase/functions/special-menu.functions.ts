import { addSpecialMenuType } from "@/types/special-menu.type";
import { supabase } from "../client";

export const getSpecialMenus = async () => {
  const { data, error } = await supabase.from("special_menus").select();
  if (error) throw error;
  return data;
};

export const addSpecialMenu = async (values: addSpecialMenuType) => {
  const { data, error } = await supabase
    .from("special_menus")
    .insert([values])
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateSpecialMenu = async (
  id: string,
  values: addSpecialMenuType
) => {
  const { data, error } = await supabase
    .from("special_menus")
    .update(values)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteSpecialMenu = async (id: string) => {
  const { data, error } = await supabase
    .from("special_menus")
    .delete()
    .eq("id", id);
  if (error) throw error;
  return data;
};
