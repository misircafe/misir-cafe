"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { GripVertical, Plus, Save, Trash2, Clock } from "lucide-react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { toast } from "sonner";
import {
  deleteImage,
  uploadImage,
} from "@/utils/supabase/functions/images.functions";
import {
  addCategory,
  deleteCategory,
  getCategories,
  updateCategory,
  updateCategoryOrder,
} from "@/utils/supabase/functions/categories.functions";
import { Category } from "@/types/category.type";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const formSchema = z.object({
  title: z
    .string()
    .min(2, { message: "Kategori ismi en az 2 karakter olmalıdır" }),
  description: z
    .string()
    .min(2, { message: "Kategori açıklaması en az 2 karakter olmalıdır" }),
  image_url: z.string().optional(),
});

function SortableItem({
  category,
  onEdit,
  onDelete,
}: {
  category: Category;
  onEdit: (cat: Category) => void;
  onDelete: (cat: Category) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between p-4 bg-white border rounded-lg shadow-sm mb-2"
    >
      <div className="flex items-center gap-3">
        <GripVertical
          className="w-5 h-5 text-gray-400 cursor-grab"
          {...attributes}
          {...listeners}
        />
        <div>
          <p className="font-medium text-gray-900">{category.title}</p>
          <p className="text-sm text-gray-500">{category.description}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <img
          src={category.image_url}
          alt={category.title}
          className="w-12 h-12 object-cover rounded"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(category)}
          className="text-blue-600"
        >
          <Clock className="w-4 h-4 mr-1" />
          Düzenle
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(category)}
        >
          <Trash2 className="w-4 h-4 mr-1" />
          Sil
        </Button>
      </div>
    </div>
  );
}

function CategoriesTab() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [changed, setChanged] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null
  );

  const sensors = useSensors(useSensor(PointerSensor));

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "", description: "", image_url: "" },
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data || []);
    } catch (error) {
      toast.error("Kategori listelenemedi");
    }
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = categories.findIndex((c) => c.id === active.id);
      const newIndex = categories.findIndex((c) => c.id === over.id);
      const newItems = arrayMove(categories, oldIndex, newIndex);
      setCategories(newItems);
      setChanged(true);
    }
  };

  const handleSaveOrder = async () => {
    try {
      await updateCategoryOrder(categories);
      toast.success("Kategori sırası güncellendi");
      setChanged(false);
    } catch {
      toast.error("Sıralama kaydedilemedi");
    }
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const toastId = toast.loading(
      editingCategory ? "Kategori güncelleniyor..." : "Kategori ekleniyor..."
    );

    try {
      let imageUrl = data.image_url;
      if (file) imageUrl = await uploadImage(file, "category");
      if (!imageUrl) throw new Error("Resim yüklenemedi.");

      if (editingCategory) {
        await updateCategory(
          editingCategory.id,
          data.title,
          data.description,
          imageUrl
        );
      } else {
        await addCategory(data.title, data.description, imageUrl);
      }

      fetchCategories();
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
      toast.error("Kategori kaydedilemedi", { id: toastId });
    }
  };

  const handleDelete = async (category: Category) => {
    const toastId = toast.loading("Kategori siliniyor...");
    try {
      await deleteCategory(category.id);
      if (category.image_url) await deleteImage(category.image_url);
      fetchCategories();
      toast.success("Kategori silindi", { id: toastId });
      setCategoryToDelete(null);
    } catch {
      toast.error("Kategori silinemedi", { id: toastId });
    }
  };

  return (
    <div className="space-y-6">
      {/* Başlık + Yeni Kategori Butonu */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-amber-800">Kategoriler</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-amber-600 hover:bg-amber-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Yeni Kategori
            </Button>
          </DialogTrigger>
          <DialogContent aria-describedby={undefined}>
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? "Kategori Düzenle" : "Yeni Kategori"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kategori Adı</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Kategori adı" />
                      </FormControl>
                      <FormMessage />
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
                        <Input {...field} placeholder="Kategori açıklaması" />
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
                      {preview && (
                        <div className="mt-2 relative w-full h-48 rounded-lg overflow-hidden border">
                          <Image
                            src={preview}
                            alt="preview"
                            fill
                            sizes="100vw"
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full bg-amber-600 text-white"
                >
                  Kaydet
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Drag & Drop Liste */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={categories.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          {categories.map((cat) => (
            <SortableItem
              key={cat.id}
              category={cat}
              onEdit={(c) => {
                setEditingCategory(c);
                setPreview(c.image_url || null);
                setFile(null);
                form.reset({
                  title: c.title,
                  description: c.description,
                  image_url: c.image_url,
                });
                setIsOpen(true);
              }}
              onDelete={(c) => setCategoryToDelete(c)}
            />
          ))}
        </SortableContext>
      </DndContext>

      {changed && (
        <Button
          onClick={handleSaveOrder}
          className="bg-amber-600 hover:bg-amber-700 text-white"
        >
          <Save className="w-4 h-4 mr-2" />
          Kaydet Sıralama
        </Button>
      )}

      {/* Silme Dialog */}
      <Dialog
        open={!!categoryToDelete}
        onOpenChange={() => setCategoryToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Kategoriyi silmek istediğine emin misin?</DialogTitle>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setCategoryToDelete(null)}>
              İptal
            </Button>
            <Button
              variant="destructive"
              onClick={() => categoryToDelete && handleDelete(categoryToDelete)}
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
