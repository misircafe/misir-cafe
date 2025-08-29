import { Category, CategoryForMenu } from "@/types/category.type";
import { supabase } from "../client";

//Kategori listele
export const getCategories = async <T extends boolean = false>({
  forMenu,
}: { forMenu?: T } = {}): Promise<
  T extends true ? CategoryForMenu[] : Category[]
> => {
  const query = forMenu
    ? supabase.from("categories").select("id,title")
    : supabase.from("categories").select("*");

  const { data, error } = await query;
  if (error) throw error;
  return data as any; // TS burayı doğru şekilde infer edecek
};

// Yeni kategori ekle
export const addCategory = async (
  title: string,
  description: string,
  image_url: string | null
) => {
  const { data, error } = await supabase
    .from("categories")
    .insert([{ title, description, image_url }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Kategori güncelle
export const updateCategory = async (
  id: string,
  title: string,
  description: string,
  image_url: string | null
) => {
  const { data, error } = await supabase
    .from("categories")
    .update({ title, description, image_url })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Kategori sil
export const deleteCategory = async (id: string) => {
  const { data, error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id);

  if (error) throw error;
  return data;
};

export const getCategoryItemCount = async (id: string): Promise<number> => {
  const { count, error } = await supabase
    .from("menu_items")
    .select("*", { count: "exact", head: true })
    .eq("category_id", id);
  if (error) {
    return 0;
  }
  return count || 0;
};

export const updateCategoryOrder = async (categories: Category[]) => {
  for (let index = 0; index < categories.length; index++) {
    const cat = categories[index];
    const { error } = await supabase
      .from("categories")
      .update({ sort_order: index + 1 }) // sadece güncelleme
      .eq("id", cat.id); // hangi id güncellenecek

    if (error) throw error;
  }
};
