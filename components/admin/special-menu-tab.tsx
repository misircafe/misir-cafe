import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import { DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import Image from "next/image";
import { toast } from "sonner";
import {
  deleteImage,
  uploadImage,
} from "@/utils/supabase/functions/images.functions";
import {
  addSpecialMenu,
  deleteSpecialMenu,
  getSpecialMenus,
  updateSpecialMenu,
} from "@/utils/supabase/functions/special-menu.functions";
import { SpecialMenu } from "@/types/special-menu.type";
import { PostgrestError } from "@supabase/supabase-js";

const formSchema = z.object({
  name: z.string().min(1, "Lütfen bir isim girin"),
  price: z.string().min(1, "Lütfen bir fiyat girin"),
  image_url: z.string().optional(),
  is_active: z.boolean(),
});

function SpecialMenuTab() {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [editingSpecialMenu, setEditingSpecialMenu] =
    useState<SpecialMenu | null>(null);
  const [specialMenus, setSpecialMenus] = useState<SpecialMenu[] | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [specialMenuToDelete, setSpecialMenuToDelete] =
    useState<SpecialMenu | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      price: "",
      image_url: "",
      is_active: true,
    },
  });

  useEffect(() => {
    fetchSpecialMenus();
  }, []);

  const fetchSpecialMenus = async () => {
    try {
      const data = await getSpecialMenus();
      setSpecialMenus(data || []);
    } catch (error) {
      const errMsg =
        "Özel menüler listelenirken bir hata oluştu: " +
        ((error as PostgrestError)?.message ??
          (error as Error)?.message ??
          "Bilinmeyen hata");
      toast.error(errMsg);
    }
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const toastId = toast.loading(
      editingSpecialMenu
        ? "Özel menü güncelleniyor..."
        : "Özel menü ekleniyor..."
    );

    try {
      let imageUrl = data.image_url;
      if (file) {
        imageUrl = await uploadImage(file, "special_menu");
      }

      if (!imageUrl) {
        toast.error("Resim yüklenemedi", { id: toastId });
        throw new Error("Resim yüklenemedi.");
      }

      data.image_url = imageUrl;

      if (editingSpecialMenu) {
        await updateSpecialMenu(editingSpecialMenu.id, data);
      } else {
        await addSpecialMenu(data);
      }

      const updatedSpecialMenu = await getSpecialMenus();

      setSpecialMenus(updatedSpecialMenu);
      toast.success(
        editingSpecialMenu ? "Özel menü güncellendi" : "Özel menü eklendi",
        { id: toastId }
      );
      form.reset();
      setPreview(null);
      setFile(null);
      setIsOpen(false);
    } catch (error) {
      const errMsg =
        "Özel menü eklenirken bir hata oluştu: " +
        ((error as PostgrestError)?.message ??
          (error as Error)?.message ??
          "Bilinmeyen hata");
      toast.error(errMsg, { id: toastId });
    }
  };

  const handleEdit = (specialMenu: SpecialMenu) => {
    setEditingSpecialMenu(specialMenu);
    setPreview(specialMenu.image_url);
    setFile(null);

    form.reset({
      name: specialMenu.name,
      price: specialMenu.price,
      is_active: specialMenu.is_active,
      image_url: specialMenu.image_url,
    });

    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    const toastId = toast.loading("Özel menü siliniyor...");
    try {
      await deleteSpecialMenu(id);
      const deletedImage = specialMenus?.find(
        (specialMenu) => specialMenu.id === id
      )?.image_url;
      if (!deletedImage) {
        toast.error("Özel menü silinirken bir hata oluştu", { id: toastId });
        throw new Error("Özel menü silinirken bir hata oluştu.");
      }
      await deleteImage(deletedImage);
      toast.success("Özel menü silindi", { id: toastId });
      fetchSpecialMenus();
    } catch (error) {
      const errMsg =
        "Özel menü silinirken bir hata oluştu: " +
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
          <h2 className="text-2xl font-bold text-amber-800">Özel Menüler</h2>
          <p className="text-gray-600">Özel menüleri yönetin</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-amber-600 hover:bg-amber-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Yeni Özel Menü
            </Button>
          </DialogTrigger>
          <DialogContent aria-describedby={undefined}>
            <DialogHeader>
              <DialogTitle>Yeni Özel Menü Ekle</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Özel Menü Adı</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Özel menü adını girin" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Özel Menü Fiyatı</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          placeholder="Özel menü fiyatını girin"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center gap-2">
                      <FormLabel>Özel Menü Aktif mi?</FormLabel>
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
                  name="image_url"
                  render={({ field }) => (
                    <FormItem>
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
                            placeholder="Veya resim URL'i giriniz"
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
        {specialMenus?.length === 0 ? (
          <div className="col-span-full text-center  text-gray-500">
            Henüz bir özel menü yok.
          </div>
        ) : (
          specialMenus?.map((specialMenu) => (
            <div
              className="col-span-1 w-full relative rounded-xl overflow-hidden shadow-xl bg-white border border-amber-200"
              key={specialMenu.id}
            >
              <div className="relative w-full h-48 sm:h-64 overflow-hidden rounded-t-lg">
                <Image
                  src={specialMenu.image_url}
                  alt={specialMenu.name}
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
              </div>
              <div className="p-4 sm:p-5 bg-white border-t border-amber-200">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-amber-900 font-semibold leading-snug">
                    {specialMenu.name}
                  </p>
                  <span className="text-amber-700 font-bold text-lg shrink-0">
                    {specialMenu.price}₺
                  </span>
                </div>
              </div>
              <div className="w-full flex justify-end space-x-2 pb-4 pr-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(specialMenu)}
                >
                  Düzenle
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    setSpecialMenuToDelete(specialMenu);
                    setDeleteDialogOpen(true);
                  }}
                >
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
              Bu özel menüyü silmek istediğinize emin misiniz?
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
                if (!specialMenuToDelete) return;
                await handleDelete(specialMenuToDelete.id);
                setDeleteDialogOpen(false);
                setSpecialMenuToDelete(null);
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

export default SpecialMenuTab;
