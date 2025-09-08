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
  getMenuItems,
  updateMenuItemOrder,
} from "@/utils/supabase/functions/menu-item.functions";
import { CategoryForMenu } from "@/types/category.type";
import { MenuItem } from "@/types/menu-item.type";

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

export default function MenuTab() {
  const [categories, setCategories] = useState<CategoryForMenu[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [changed, setChanged] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    async function fetchData() {
      const cats = await getCategories();
      setCategories(cats || []);
      const items = await getMenuItems();
      setMenuItems(items || []);
      if (cats && cats.length > 0) setSelectedCategory(cats[0].id);
    }
    fetchData();
  }, []);

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
              onEdit={() => {}}
              onDelete={() => {}}
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
    </div>
  );
}
