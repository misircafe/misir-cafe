import { CategoryForMenu } from "@/types/category.type";
import { supabase } from "../client";
import { MenuItem } from "@/types/menu-item.type";
import { MenuCategory } from "@/types/ui.types";

export const getMenu = async () => {
  const { data, error } = await supabase
    .from("categories")
    .select(
      "id,title,description,image_url, items:menu_items(id,name,description,price,is_popular,is_active)"
    )
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data;
};

export const getCategoriesWithItems = async (): Promise<MenuCategory[]> => {
  const { data: categories, error } = await supabase
    .from("categories")
    .select("*") // description, image_url, title, id, sort_order gibi tüm alanlar
    .order("sort_order", { ascending: true });

  if (error) throw error;

  const categoriesWithItems = await Promise.all(
    categories.map(async (cat) => {
      const { data: items } = await supabase
        .from("menu_items")
        .select("*")
        .eq("category_id", cat.id)
        .order("sort_order", { ascending: true });

      return { ...cat, items: items || [] } as MenuCategory;
    })
  );

  return categoriesWithItems;
};

export const getSpecialMenus = async () => {
  const { data, error } = await supabase
    .from("special_menus")
    .select("id,name,description,price,image_url,is_active");
  if (error) throw error;
  return data;
};

export const getEvents = async () => {
  const { data, error } = await supabase.from("events").select("*");
  if (error) throw error;
  return data;
};
