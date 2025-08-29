"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
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
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { toast } from "sonner";

import { getCategories } from "@/utils/supabase/functions/categories.functions";
import {
  addMenuItem,
  deleteMenuItems,
  getMenuItems,
  updateMenuItems,
} from "@/utils/supabase/functions/menu-item.functions";
import { CategoryForMenu } from "@/types/category.type";
import { MenuItem } from "@/types/menu-item.type";
import { Badge } from "../ui/badge";

const formSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.string().min(1),
  is_popular: z.boolean(),
  category_id: z.string().min(1),
  is_active: z.boolean(),
});

function MenuTab() {
  const [isOpen, setIsOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categories, setCategories] = useState<CategoryForMenu[] | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[] | null>(null);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<MenuItem | null>(null);

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
                        <Input
                          {...field}
                          type="number"
                          placeholder="Ürün fiyatını giriniz"
                        />
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

      {/* Menü öğeleri listesi */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {menuItems?.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            Henüz bir ürün yok.{<br />}
            {categories?.length === 0 &&
              "Ürün oluşturmak için önce kategori oluşturmanız gerekiyor."}
          </div>
        ) : (
          menuItems?.map((item) => (
            <Card
              key={item.id}
              className="border-amber-200 hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-amber-800">
                      {item.name}
                    </CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </div>
                  <Badge
                    className={`${
                      item.is_active
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {item.is_active ? "Aktif" : "Pasif"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-500">Fiyat:</span>
                  <span className="text-sm font-medium text-amber-600">
                    ₺{item.price}
                  </span>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(item)}
                  >
                    <Edit className="w-3 h-3 mr-1" /> Düzenle
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(item)}
                  >
                    <Trash2 className="w-3 h-3 mr-1" /> Sil
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Silme onay dialog */}
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

export default MenuTab;
