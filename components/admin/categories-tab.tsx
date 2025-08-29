"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { GripVertical, Save } from "lucide-react";
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
import {
  getCategories,
  updateCategoryOrder,
} from "@/utils/supabase/functions/categories.functions";
import { Category } from "@/types/category.type";
import { toast } from "sonner";

function SortableItem({ category }: { category: Category }) {
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
        {/* Drag handle */}
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
      <img
        src={category.image_url}
        alt={category.title}
        className="w-12 h-12 object-cover rounded"
      />
    </div>
  );
}

function CategoriesSortTab() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [changed, setChanged] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const data = await getCategories();
    setCategories(data || []);
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
      await updateCategoryOrder(categories); // backend’e sırayı gönder
      toast.success("Kategori sırası güncellendi ✅");
      setChanged(false);
    } catch (err) {
      toast.error("Sıralama kaydedilemedi ❌");
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-amber-800">Kategori Sıralaması</h2>

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
            <SortableItem key={cat.id} category={cat} />
          ))}
        </SortableContext>
      </DndContext>

      {changed && (
        <Button
          onClick={handleSaveOrder}
          className="bg-amber-600 hover:bg-amber-700 text-white"
        >
          <Save className="w-4 h-4 mr-2" />
          Kaydet
        </Button>
      )}
    </div>
  );
}

export default CategoriesSortTab;
