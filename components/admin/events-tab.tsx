"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Calendar } from "lucide-react";
import z from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import Image from "next/image";
import { Checkbox } from "../ui/checkbox";
import { Event } from "@/types/event.type";
import { toast } from "sonner";
import {
  deleteImage,
  uploadImage,
} from "@/utils/supabase/functions/images.functions";
import {
  addEvent,
  deleteEvent,
  getEvents,
  updateEvent,
} from "@/utils/supabase/functions/event.functions";
import { PostgrestError } from "@supabase/supabase-js";
import dynamic from "next/dynamic";

const TipTapEditor = dynamic(() => import("@/components/admin/tiptap-editor"), {
  ssr: false,
});

const eventDateSchema = z.object({
  start: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Geçerli bir başlangıç tarihi giriniz",
  }),
  end: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Geçerli bir bitiş tarihi giriniz",
  }),
});

const formSchema = z.object({
  artist_name: z.string().min(1, { message: "Sanatçı ismi zorunludur." }),
  description: z.string().optional(),
  image_url: z.string().optional(),
  is_active: z.boolean(),
  date: z
    .array(eventDateSchema)
    .min(1, { message: "En az bir tarih olmalıdır." }),
});

function EventsTab() {
  const [isOpen, setIsOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [events, setEvents] = useState<Event[] | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      artist_name: "",
      description: "",
      image_url: "",
      is_active: true,
      date: [{ start: "", end: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "date",
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const data = await getEvents();
      setEvents(data || []);
    } catch (error) {
      toast.error(
        "Eventler listelenirken bir hata oluştu: " +
          ((error as PostgrestError)?.message ??
            (error as Error)?.message ??
            "Bilinmeyen hata")
      );
    }
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const toastId = toast.loading(
      editingEvent ? "Event güncelleniyor..." : "Event ekleniyor..."
    );
    try {
      let imageUrl = data.image_url;
      if (file) imageUrl = await uploadImage(file, "event");
      if (!imageUrl) throw new Error("Resim yüklenemedi");
      data.image_url = imageUrl;

      // start/end değerlerini ISO string yapıyoruz
      const dateWithTimestamps = data.date.map((d) => ({
        start: new Date(d.start).toISOString(),
        end: new Date(d.end).toISOString(),
      }));
      const payload = { ...data, date: dateWithTimestamps };

      if (editingEvent) await updateEvent(editingEvent.id, payload);
      else await addEvent(payload);

      await fetchEvents();
      toast.success(editingEvent ? "Event güncellendi" : "Event eklendi", {
        id: toastId,
      });
      form.reset({
        artist_name: "",
        description: "",
        image_url: "",
        is_active: true,
        date: [{ start: "", end: "" }],
      });
      setPreview(null);
      setFile(null);
      setIsOpen(false);
      setEditingEvent(null);
    } catch (error) {
      toast.error(
        "Event eklenirken bir hata oluştu: " +
          ((error as PostgrestError)?.message ??
            (error as Error)?.message ??
            "Bilinmeyen hata"),
        { id: toastId }
      );
    }
  };

  const toDateTimeLocal = (isoString: string) => {
    if (!isoString) return "";
    const d = new Date(isoString);
    const pad = (n: number) => n.toString().padStart(2, "0");
    const yyyy = d.getFullYear();
    const mm = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const hh = pad(d.getHours());
    const min = pad(d.getMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setPreview(event.image_url || null);
    setFile(null);

    // ISO string => datetime-local formatına çevir
    const formattedDates = event.date.map((d) => ({
      start: toDateTimeLocal(d.start),
      end: toDateTimeLocal(d.end),
    }));

    form.reset({
      ...event,
      date: formattedDates,
    });
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    const toastId = toast.loading("Etkinlik siliniyor...");
    try {
      await deleteEvent(id);
      const deletedImage = events?.find((event) => event.id === id)?.image_url;
      if (deletedImage) await deleteImage(deletedImage);
      await fetchEvents();
      toast.success("Etkinlik silindi", { id: toastId });
    } catch (error) {
      toast.error(
        "Etkinlik silinirken bir hata oluştu: " +
          ((error as PostgrestError)?.message ??
            (error as Error)?.message ??
            "Bilinmeyen hata"),
        { id: toastId }
      );
    }
  };

  const formatDateRange = (startISO: string, endISO: string) => {
    const start = new Date(startISO);
    const end = new Date(endISO);
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${pad(start.getDate())}.${pad(
      start.getMonth() + 1
    )}.${start.getFullYear()} ${pad(start.getHours())}:${pad(
      start.getMinutes()
    )}/${pad(end.getHours())}:${pad(end.getMinutes())}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-amber-800">
            Etkinlik Yönetimi
          </h2>
          <p className="text-gray-600">
            Canlı müzik ve özel etkinlikleri yönetin
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-amber-600 hover:bg-amber-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Yeni Etkinlik
            </Button>
          </DialogTrigger>
          <DialogContent
            aria-describedby={undefined}
            className="w-11/12 md:w-4xl max-h-[90vh] overflow-y-auto"
          >
            <DialogHeader>
              <DialogTitle>
                {editingEvent ? "Etkinlik Düzenle" : "Yeni Etkinlik Ekle"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {/* Sanatçı Adı */}
                <FormField
                  control={form.control}
                  name="artist_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sanatçı Adı</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Sanatçı adı giriniz" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Açıklama */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Açıklama</FormLabel>

                      {/* TipTapEditor tek child */}
                      <FormControl>
                        <TipTapEditor
                          content={field.value || ""}
                          onChange={field.onChange}
                        />
                      </FormControl>

                      {/* Önizleme div’i FormControl dışında */}
                      <div className="mt-2 border rounded-lg p-4 min-h-[150px] bg-gray-50 overflow-auto">
                        <div
                          className="prose"
                          dangerouslySetInnerHTML={{
                            __html: field.value || "",
                          }}
                        />
                      </div>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Aktif Checkbox */}
                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center gap-2">
                      <FormLabel>Etkinlik Aktif mi?</FormLabel>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Tarihler */}
                <div>
                  <FormLabel className="mb-3">Tarih ve Saatler</FormLabel>
                  {fields.map((f, idx) => (
                    <div key={f.id} className="flex gap-2 items-center mb-2">
                      <Input
                        type="datetime-local"
                        {...form.register(`date.${idx}.start`)}
                        className="flex-1"
                      />
                      <Input
                        type="datetime-local"
                        {...form.register(`date.${idx}.end`)}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => remove(idx)}
                      >
                        Sil
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => append({ start: "", end: "" })}
                  >
                    + Tarih Ekle
                  </Button>
                  <FormMessage />
                </div>
                {/* Resim */}
                <FormField
                  control={form.control}
                  name="image_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Resim</FormLabel>
                      <FormControl>
                        <div>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const selectedFile = e.target.files?.[0];
                              if (selectedFile) {
                                setFile(selectedFile);
                                field.onChange("");
                                const reader = new FileReader();
                                reader.onloadend = () =>
                                  setPreview(reader.result as string);
                                reader.readAsDataURL(selectedFile);
                              }
                            }}
                          />
                          <Input
                            type="url"
                            placeholder="Veya resim URL'si giriniz"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              setFile(null);
                              setPreview(e.target.value);
                            }}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                      {preview && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600">Önizleme:</p>
                          <div className="relative w-full h-48 sm:h-64 overflow-hidden rounded-lg border">
                            <Image
                              src={preview}
                              alt="preview"
                              fill
                              sizes="100vw"
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                        </div>
                      )}
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                >
                  Kaydet
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Event Listesi */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events?.length === 0 ? (
          <div className="col-span-full text-center text-gray-500">
            Henüz bir etkinlik yok.
          </div>
        ) : (
          events?.map((event) => (
            <div
              key={event.id}
              className="relative col-span-1 w-full rounded-xl overflow-hidden shadow-xl bg-white border border-amber-200"
            >
              <div className="relative w-full h-48 sm:h-64 overflow-hidden rounded-t-lg">
                <Image
                  src={event.image_url}
                  alt={event.artist_name}
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
              </div>
              <div className="py-2 px-4 text-amber-800 flex justify-between">
                <p className="font-bold">{event.artist_name}</p>
                <Badge
                  className={
                    event.is_active
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }
                >
                  {event.is_active ? "Aktif" : "Pasif"}
                </Badge>
              </div>
              <div
                className="text-sm text-gray-500 prose max-w-none px-3"
                dangerouslySetInnerHTML={{ __html: event.description || "" }}
              />
              <div className="px-4 py-4 space-y-2">
                {event.date.map((d, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between text-gray-400 font-semibold text-sm"
                  >
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 mr-2" />
                      {formatDateRange(d.start, d.end)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="w-full flex justify-end space-x-2 pb-4 pr-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(event)}
                >
                  <Edit className="w-3 h-3 mr-1" />
                  Düzenle
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    setEventToDelete(event);
                    setDeleteDialogOpen(true);
                  }}
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Sil
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>
              Bu etkinliği silmek istediğinize emin misiniz?
            </DialogTitle>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              İptal
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                if (!eventToDelete) return;
                await handleDelete(eventToDelete.id);
                setDeleteDialogOpen(false);
                setEventToDelete(null);
              }}
            >
              Sil
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default EventsTab;
