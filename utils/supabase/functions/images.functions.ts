import { supabase } from "../client";

// Resim yükleme
export const uploadImage = async (
  file: File,
  type: "event" | "category" | "special_menu"
): Promise<string | undefined> => {
  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${type}/${fileName}`; // misircafe/type/filename

    const { error } = await supabase.storage
      .from("misircafe")
      .upload(filePath, file);

    if (error) {
      console.log("Upload error", error);
      return undefined;
    }

    const { data } = supabase.storage.from("misircafe").getPublicUrl(filePath);
    return data.publicUrl;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

// Resim silme
export const deleteImage = async (url: string): Promise<boolean> => {
  try {
    // Sadece Supabase bucket içindeki resimleri sil
    const bucketBase = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/misircafe/`;

    if (!url.startsWith(bucketBase)) {
      // Dış URL → silmeye gerek yok
      console.log("External image, skipping delete:", url);
      return true;
    }

    // Supabase URL → filePath çıkar
    const filePath = url.replace(bucketBase, "");

    const { error } = await supabase.storage
      .from("misircafe")
      .remove([filePath]);

    if (error) {
      console.error("Delete error", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("DeleteImage exception", error);
    return false;
  }
};

export async function getImagesSize(): Promise<number> {
  const bucketName = "misircafe";
  async function traverse(path: string = ""): Promise<number> {
    let totalSize = 0;
    let offset = 0;
    const limit = 1000;

    while (true) {
      const { data, error } = await supabase.storage
        .from(bucketName)
        .list(path, { limit, offset });

      if (error) throw error;
      if (!data || data.length === 0) break;

      for (const item of data) {
        if (item.metadata?.size) {
          // dosya
          totalSize += item.metadata.size;
        } else {
          // klasör → içine gir
          totalSize += await traverse(`${path}${item.name}/`);
        }
      }

      if (data.length < limit) break;
      offset += limit;
    }

    return totalSize;
  }

  return traverse("");
}
