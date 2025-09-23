"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, GripVertical, Save } from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { toast } from "sonner";

import { getCategories } from "@/utils/supabase/functions/categories.functions";
import {
  addMenuItem,
  deleteMenuItems,
  getMenuItems,
  updateMenuItemOrder,
  updateMenuItems,
} from "@/utils/supabase/functions/menu-item.functions";
import { CategoryForMenu } from "@/types/category.type";
import { MenuItem } from "@/types/menu-item.type";
import { useForm } from "react-hook-form";
import z from "zod";
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
import { Checkbox } from "../ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

function SortableMenuItem({
  item,
  onEdit,
  onDelete,
}: {
  item: MenuItem;
  onEdit: (item: MenuItem) => void;
  onDelete: (item: MenuItem) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between border-amber-200 hover:shadow-lg transition-shadow mb-2"
    >
      <div className="flex items-center gap-3 p-2 w-full">
        <GripVertical
          {...attributes}
          {...listeners}
          className="w-5 h-5 text-gray-400 cursor-grab"
        />
        <div className="flex-1">
          <CardTitle className="text-amber-800">{item.name}</CardTitle>
          <CardDescription>{item.description}</CardDescription>
          <div className="flex justify-between mt-1">
            <span className="text-sm text-gray-500">₺{item.price}</span>
            <span
              className={`px-2 py-0.5 rounded text-white ${
                item.is_active ? "bg-green-600" : "bg-red-600"
              }`}
            >
              {item.is_active ? "Aktif" : "Pasif"}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(item)}>
            <Edit className="w-3 h-3 mr-1" /> Düzenle
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(item)}
          >
            <Trash2 className="w-3 h-3 mr-1" /> Sil
          </Button>
        </div>
      </div>
    </Card>
  );
}

const formSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.string().min(1),
  is_popular: z.boolean(),
  category_id: z.string().min(1),
  is_active: z.boolean(),
});

export default function MenuTab() {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<CategoryForMenu[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [changed, setChanged] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [itemToDelete, setItemToDelete] = useState<MenuItem | null>(null);

  const sensors = useSensors(useSensor(PointerSensor));

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      is_popular: false,
      category_id: "",
      is_active: true,
    },
  });

  useEffect(() => {
    fetchMenuItems();
    fetchCategories();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const data = await getMenuItems();
      setMenuItems(data || []);
    } catch (error) {
      toast.error("Menü öğeleri listelenirken bir hata oluştu");
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data || []);
      setSelectedCategory(data?.[0]?.id || null);
    } catch (error) {
      toast.error("Kategori listelenirken bir hata oluştu");
    }
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    form.reset({
      name: item.name,
      description: item.description,
      price: item.price,
      is_popular: item.is_popular,
      category_id: item.category_id,
      is_active: item.is_active,
    });
    setIsOpen(true);
  };

  const handleDelete = (item: MenuItem) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    await deleteMenuItems(itemToDelete.id);
    setDeleteDialogOpen(false);
    setItemToDelete(null);
    fetchMenuItems();
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const toastId = toast.loading(
      editingItem ? "Ürün güncelleniyor..." : "Ürün ekleniyor..."
    );
    try {
      if (editingItem) {
        await updateMenuItems(editingItem.id, data); // await ekledik
      } else {
        await addMenuItem(data); // await ekledik
      }

      toast.success(editingItem ? "Ürün güncellendi" : "Ürün eklendi", {
        id: toastId,
      });

      setIsOpen(false);
      setEditingItem(null);
      form.reset();
      await fetchMenuItems(); // menü öğelerini tekrar çek
    } catch (error) {
      toast.error("İşlem sırasında bir hata oluştu", { id: toastId });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || !selectedCategory) return;
    if (active.id === over.id) return;

    const categoryItems = menuItems.filter(
      (i) => i.category_id === selectedCategory
    );
    const oldIndex = categoryItems.findIndex((i) => i.id === active.id);
    const newIndex = categoryItems.findIndex((i) => i.id === over.id);

    const newOrder = arrayMove(categoryItems, oldIndex, newIndex);
    const otherItems = menuItems.filter(
      (i) => i.category_id !== selectedCategory
    );
    setMenuItems([...otherItems, ...newOrder]);
    setChanged(true); // sıralama değişti
  };

  const handleSaveOrder = async () => {
    if (!selectedCategory) return;
    const categoryItems = menuItems.filter(
      (i) => i.category_id === selectedCategory
    );
    const success = await updateMenuItemOrder(categoryItems);
    if (success) {
      toast.success("Sıralama kaydedildi");
      setChanged(false);
    } else {
      toast.error("Sıralama kaydedilemedi");
    }
  };

  const filteredItems = menuItems.filter(
    (i) => i.category_id === selectedCategory
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-amber-800">Menü Ögeleri</h2>
          <p className="text-gray-600">Menü ögelerini yönetin</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              disabled={categories?.length === 0}
              className="bg-amber-600 hover:bg-amber-700 text-white"
              onClick={() => {
                setEditingItem(null);
                form.reset({
                  name: "",
                  description: "",
                  price: "",
                  is_popular: false,
                  category_id: "",
                  is_active: true,
                });
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Yeni Ürün Ekle
            </Button>
          </DialogTrigger>
          <DialogContent aria-describedby={undefined}>
            <DialogHeader>
              <DialogTitle>
                {editingItem ? "Ürün Düzenle" : "Yeni Ürün Ekle"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {/* name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ürün Adı</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Ürün adını giriniz" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ürün Açıklaması</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Ürün açıklamasını giriniz"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* price */}
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ürün Fiyatı</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Ürün fiyatını giriniz" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* is_popular & is_active */}
                <div className="flex justify-center space-x-10">
                  <FormField
                    control={form.control}
                    name="is_popular"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center gap-2">
                        <FormLabel>Ürün Popüler mi?</FormLabel>
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
                    name="is_active"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center gap-2">
                        <FormLabel>Ürün Aktif mi?</FormLabel>
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
                </div>
                {/* category */}
                <FormField
                  control={form.control}
                  name="category_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kategori</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Kategori seçiniz" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories?.map((cat) => (
                              <SelectItem key={cat.id} value={cat.id}>
                                {cat.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
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

      {/* Kategori Seçimi */}
      <div className="flex gap-2 overflow-x-auto">
        {categories.map((cat) => (
          <Button
            key={cat.id}
            variant={selectedCategory === cat.id ? "default" : "outline"}
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.title}
          </Button>
        ))}
      </div>

      {/* Drag & Drop */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={filteredItems.map((i) => i.id)}
          strategy={verticalListSortingStrategy}
        >
          {filteredItems.map((item) => (
            <SortableMenuItem
              key={item.id}
              item={item}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </SortableContext>
      </DndContext>

      {/* Sıralamayı Kaydet */}
      {changed && (
        <Button
          onClick={handleSaveOrder}
          className="bg-amber-600 hover:bg-amber-700 text-white mt-4"
        >
          <Save className="w-4 h-4 mr-2" />
          Sıralamayı Kaydet
        </Button>
      )}

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>
              Bu ürünü silmek istediğinize emin misiniz?
            </DialogTitle>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              İptal
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Sil
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
