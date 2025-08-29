"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Calendar, Clock, Users } from "lucide-react";
import z from "zod";
import { useForm } from "react-hook-form";
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
import { Textarea } from "../ui/textarea";
import Image from "next/image";
import { Checkbox } from "../ui/checkbox";
import { EventDate, Event } from "@/types/event.type";
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
  day: z
    .number()
    .int()
    .min(0, { message: "Gün 1 ile 7 arasında olmalıdır." })
    .max(6, { message: "Gün 1 ile 7 arasında olmalıdır." }),
  clock: z.string().regex(/^([0-1]\d|2[0-3]):([0-5]\d)$/, {
    message: "Saat HH:MM formatında olmalıdır",
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

const daysOfWeek = [
  { value: 0, label: "Pazartesi" },
  { value: 1, label: "Salı" },
  { value: 2, label: "Çarşamba" },
  { value: 3, label: "Perşembe" },
  { value: 4, label: "Cuma" },
  { value: 5, label: "Cumartesi" },
  { value: 6, label: "Pazar" },
];

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
      date: [],
    },
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const data = await getEvents();
      setEvents(data || []);
    } catch (error) {
      const errMsg =
        "Eventler listelenirken bir hata oluştu: " +
        ((error as PostgrestError)?.message ??
          (error as Error)?.message ??
          "Bilinmeyen hata");
      toast.error(errMsg);
    }
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const toastId = toast.loading(
      editingEvent ? "Event güncelleniyor..." : "Event ekleniyor..."
    );

    try {
      let imageUrl = data.image_url;
      if (file) {
        imageUrl = await uploadImage(file, "event");
      }

      if (!imageUrl) {
        toast.error("Resim yüklenemedi", { id: toastId });
        throw new Error("Resim yüklenemedi.");
      }

      data.image_url = imageUrl;

      if (editingEvent) {
        await updateEvent(editingEvent.id, data);
      } else {
        await addEvent(data);
      }

      const updatedEvents = await getEvents();

      setEvents(updatedEvents);
      toast.success(editingEvent ? "Event güncellendi" : "Event eklendi", {
        id: toastId,
      });
      form.reset();
      setPreview(null);
      setFile(null);
      setIsOpen(false);
    } catch (error) {
      const errMsg =
        "Event eklenirken bir hata oluştu: " +
        ((error as PostgrestError)?.message ??
          (error as Error)?.message ??
          "Bilinmeyen hata");
      toast.error(errMsg, { id: toastId });
    }
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setPreview(event.image_url || null);
    setFile(null);

    form.reset({
      ...event,
    });

    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    const toastId = toast.loading("Etkinlik siliniyor...");
    try {
      await deleteEvent(id);
      const deletedImage = events?.find((event) => event.id === id)?.image_url;
      if (!deletedImage) {
        toast.error("Etkinlik silinirken bir hata oluştu", { id: toastId });
        throw new Error("Etkinlik silinirken bir hata oluştu.");
      }
      await deleteImage(deletedImage);
      const updatedEvents = await getEvents();
      setEvents(updatedEvents);
      toast.success("Etkinlik silindi", { id: toastId });
    } catch (error) {
      const errMsg =
        "Etkinlik silinirken bir hata oluştu: " +
        ((error as PostgrestError)?.message ??
          (error as Error)?.message ??
          "Bilinmeyen hata");
      toast.error(errMsg, { id: toastId });
    }
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
              <DialogTitle>Yeni Etklinlik Ekle</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="artist_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sanatçı Adı</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Sanatçı adı giriniz" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Açıklama</FormLabel>
                      <FormControl>
                        <div className="flex flex-col">
                          <TipTapEditor
                            content={field.value || ""}
                            onChange={field.onChange}
                          />
                          <div className="mt-4 border rounded-lg p-4 min-h-[150px] bg-gray-50 overflow-auto">
                            <div
                              className="prose"
                              dangerouslySetInnerHTML={{
                                __html: field.value || "",
                              }}
                            />
                          </div>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
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
                <FormField
                  control={form.control}
                  name="date"
                  render={() => (
                    <FormItem>
                      <FormLabel>Haftanın günleri</FormLabel>
                      <div className="space-y-2">
                        {daysOfWeek.map((day) => {
                          const isChecked = form
                            .watch("date")
                            ?.some((d: EventDate) => d.day === day.value);
                          return (
                            <div
                              key={day.value}
                              className="flex items-center gap-3"
                            >
                              <Checkbox
                                checked={isChecked}
                                onCheckedChange={(checked) => {
                                  const currentDates =
                                    form.getValues("date") || [];
                                  if (checked) {
                                    form.setValue("date", [
                                      ...currentDates,
                                      { day: day.value, clock: "" },
                                    ]);
                                  } else {
                                    form.setValue(
                                      "date",
                                      currentDates.filter(
                                        (d: EventDate) => d.day !== day.value
                                      )
                                    );
                                  }
                                }}
                              />
                              <span>{day.label}</span>
                              {isChecked && (
                                <Input
                                  type="time"
                                  step={1800}
                                  value={
                                    form
                                      .getValues("date")
                                      ?.find(
                                        (d: EventDate) => d.day === day.value
                                      )?.clock || ""
                                  }
                                  onChange={(e) => {
                                    const currentDates =
                                      form.getValues("date") || [];
                                    form.setValue(
                                      "date",
                                      currentDates.map((d: EventDate) =>
                                        d.day === day.value
                                          ? { ...d, clock: e.target.value }
                                          : d
                                      )
                                    );
                                  }}
                                />
                              )}
                            </div>
                          );
                        })}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="image_url"
                  render={({ field }) => (
                    <FormItem className="h-fit">
                      <FormLabel>Resim</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const selectedFile = e.target.files?.[0];
                              if (selectedFile) {
                                setFile(selectedFile);
                                field.onChange(""); // URL temizle
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
                            {...field} // <-- burası field.value ve field.onChange sağlar
                            onChange={(e) => {
                              field.onChange(e); // react-hook-form’a bildir
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
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events?.length === 0 ? (
          <div className="col-span-full text-center  text-gray-500">
            Henüz bir özel menü yok.
          </div>
        ) : (
          events?.map((event) => (
            <div
              className="relative col-span-1 w-full rounded-xl overflow-hidden shadow-xl bg-white border border-amber-200"
              key={event.id}
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
                <div className="flex">
                  <p className="font-bold">{event.artist_name}</p>
                </div>
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
                {event.date.map((date) => (
                  <div key={date.day} className="flex justify-between">
                    <div className="text-gray-400 font-semibold text-sm flex">
                      <Calendar className="w-5 h-5 mr-2" />
                      <p>{daysOfWeek[date.day].label}</p>
                    </div>
                    <div className="text-gray-400 font-semibold text-sm flex">
                      <Clock className="w-5 h-5 mr-2" />
                      <p>{date.clock}</p>
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
