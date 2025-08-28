import { supabase } from "../client";

export const getMenu = async () => {
  const { data, error } = await supabase
    .from("categories")
    .select(
      "id,title,description,image_url, items:menu_items(id,name,description,price,is_popular,is_active)"
    );

  if (error) throw error;
  return data;
};

export const getSpecialMenus = async () => {
  const { data, error } = await supabase
    .from("special_menus")
    .select("id,name,price,image_url,is_active");
  if (error) throw error;
  return data;
};

export const getEvents = async () => {
  const { data, error } = await supabase.from("events").select("*");
  if (error) throw error;
  return data;
};
