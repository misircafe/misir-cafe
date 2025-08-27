import { addEventType } from "@/types/event.type";
import { supabase } from "../client";

export const addEvent = async (values: addEventType) => {
  const { data, error } = await supabase
    .from("events")
    .insert([values])
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const getEvents = async () => {
  const { data, error } = await supabase.from("events").select();
  if (error) throw error;
  return data;
};

export const updateEvent = async (id: string, values: addEventType) => {
  const { data, error } = await supabase
    .from("events")
    .update(values)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteEvent = async (id: string) => {
  try {
    // 1️⃣ Event bilgilerini al, özellikle image_url
    const { data: event, error: fetchError } = await supabase
      .from("events")
      .select("id, image_url")
      .eq("id", id)
      .single();

    if (fetchError) throw fetchError;
    if (!event) throw new Error("Event bulunamadı");

    // 2️⃣ Eğer image_url varsa Storage’dan sil
    if (event.image_url) {
      try {
        const url = new URL(event.image_url);
        // pathname: /storage/v1/object/public/event/event/1756307258668.png
        // bucket ismi: "event", dosya path: "event/1756307258668.png"
        const parts = url.pathname.split("/");
        const bucketIndex = parts.findIndex((p) => p === "event");
        if (bucketIndex === -1) throw new Error("Bucket bulunamadı URL'den");

        const filePath = parts.slice(bucketIndex).join("/"); // event/1756307258668.png

        const { error: deleteError } = await supabase.storage
          .from("event")
          .remove([filePath]);

        if (deleteError) console.error("Storage silme hatası:", deleteError);
      } catch (err) {
        console.error("Resim silme sırasında hata:", err);
      }
    }

    // 3️⃣ Event tablosundan sil
    const { data, error } = await supabase
      .from("events")
      .delete()
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    throw err;
  }
};
