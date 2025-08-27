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
    // URL'den bucket path'i ayırıyoruz
    const urlObj = new URL(url);
    const publicPrefix = "/storage/v1/object/public/misircafe/";
    const idx = urlObj.pathname.indexOf(publicPrefix);

    if (idx === -1) {
      console.error("URL misircafe bucket ile başlamıyor");
      return false;
    }

    const filePath = decodeURIComponent(
      urlObj.pathname.slice(idx + publicPrefix.length)
    );
    console.log("Deleting file path:", filePath); // örn: category/1756308429880.png

    const { error } = await supabase.storage
      .from("misircafe")
      .remove([filePath]);

    if (error) {
      console.log("Delete error", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error(error);
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
