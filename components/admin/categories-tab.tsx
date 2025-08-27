"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Clock, Plus, Trash2 } from "lucide-react";
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
import Image from "next/image";
import { toast } from "sonner";
import { PostgrestError } from "@supabase/supabase-js";
import {
  deleteImage,
  uploadImage,
} from "@/utils/supabase/functions/images.functions";
import {
  addCategory,
  deleteCategory,
  getCategories,
  getCategoryItemCount,
  updateCategory,
} from "@/utils/supabase/functions/categories.functions";
import { Category } from "@/types/category.type";

const formSchema = z.object({
  title: z
    .string()
    .min(2, { message: "Kategori ismi en az 2 karakter olmalıdır" }),
  description: z
    .string()
    .min(2, { message: "Kategori açıklaması en az 2 karakter olmalıdır" }),
  image_url: z.string().optional(), // hem file hem url için opsiyonel
});

function CategoryItemCount({ categoryId }: { categoryId: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchItemCount = async () => {
      try {
        const res = await getCategoryItemCount(categoryId);
        setCount(res);
      } catch (error) {
        console.error("Kategori öğe sayısı alınamadı:", error);
        toast.error("Kategori öğe sayısı alınamadı");
      }
    };

    if (categoryId) {
      fetchItemCount();
    }
  }, [categoryId]);

  return <h1 className="text-xs text-gray-500">{count} ürün</h1>;
}

function CategoriesTab() {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      image_url: "",
    },
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data || []);
    } catch (error) {
      const errMsg =
        "Kategori listelenirken bir hata oluştu: " +
        ((error as PostgrestError)?.message ??
          (error as Error)?.message ??
          "Bilinmeyen hata");
      toast.error(errMsg);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setPreview(category.image_url || null);
    setFile(null);

    // Formu category verileri ile resetle
    form.reset({
      title: category.title,
      description: category.description,
      image_url: category.image_url,
    });

    setIsOpen(true);
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const toastId = toast.loading(
      editingCategory ? "Kategori güncelleniyor..." : "Kategori ekleniyor..."
    );

    try {
      let imageUrl = data.image_url;
      if (file) {
        imageUrl = await uploadImage(file, "category");
      }

      if (!imageUrl) {
        toast.error("Resim yüklenemedi", { id: toastId });
        throw new Error("Resim yüklenemedi.");
      }

      if (editingCategory) {
        await updateCategory(
          editingCategory.id,
          data.title,
          data.description,
          imageUrl
        );
      } else {
        await addCategory(data.title, data.description, imageUrl);
        form.reset();
      }

      const updatedCategories = await getCategories();

      setCategories(updatedCategories);
      toast.success(
        editingCategory ? "Kategori güncellendi" : "Kategori eklendi",
        { id: toastId }
      );
      form.reset();
      setPreview(null);
      setFile(null);
      setIsOpen(false);
      setEditingCategory(null);
    } catch (error) {
      const errMsg =
        ((error as PostgrestError)?.message ?? (error as Error)?.message) ||
        "Bilinmeyen hata";
      toast.error(errMsg, { id: toastId });
    }
  };

  const handleDelete = async (id: string) => {
    const toastId = toast.loading("Kategori siliniyor...");
    try {
      await deleteCategory(id);
      const deletedImage = categories?.find(
        (category) => category.id === id
      )?.image_url;
      if (!deletedImage) {
        toast.error("Kategori silinirken bir hata oluştu", { id: toastId });
        throw new Error("Kategori silinirken bir hata oluştu.");
      }
      await deleteImage(deletedImage);
      toast.success("Kategori silindi", { id: toastId });
      fetchCategories();
    } catch (error) {
      const errMsg =
        "Kategori silinirken bir hata oluştu: " +
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
          <h2 className="text-2xl font-bold text-amber-800">Kategoriler</h2>
          <p className="text-gray-600">Menü kategorilerini yönetin</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-amber-600 hover:bg-amber-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Yeni Kategori
            </Button>
          </DialogTrigger>
          <DialogContent aria-describedby={undefined}>
            <DialogHeader>
              <DialogTitle>Yeni Kategori Ekle</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {/* Kategori adı */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kategori Adı</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Kategori adını giriniz"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Kategori açıklaması */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kategori Açıklaması</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Kategori açıklamasını giriniz"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Resim (file + url) */}
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
        {categories?.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            Henüz bir kategori yok.
          </div>
        ) : (
          categories?.map((category) => (
            <div
              className="col-span-1 w-full relative rounded-xl overflow-hidden shadow-xl bg-white border border-amber-200"
              key={category.id}
            >
              <div className="relative w-full h-48 sm:h-64 overflow-hidden rounded-t-lg">
                <Image
                  src={category.image_url}
                  alt={category.title}
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
              </div>
              <div className="p-4 sm:p-5 bg-white border-t border-amber-200">
                <div className="flex flex-col items-start justify-between gap-3">
                  <p className="text-amber-900 font-semibold leading-snug">
                    {category.title}
                  </p>
                  <span className="text-sm text-gray-500">
                    {category.description}
                  </span>
                </div>
                <div className="flex justify-between mt-2">
                  <div className="flex items-center">
                    <CategoryItemCount categoryId={category.id} />
                  </div>
                  <div className="space-x-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(category)}
                    >
                      <Clock className="w-5 h-5 mr-2" />
                      Düzenle
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setCategoryToDelete(category);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Sil
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Bu kategoriyi silmek istediğinize emin misiniz?
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
                if (!categoryToDelete) return;
                await handleDelete(categoryToDelete.id);
                setDeleteDialogOpen(false);
                setCategoryToDelete(null);
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

export default CategoriesTab;
