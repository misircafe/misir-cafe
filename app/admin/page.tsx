"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Calendar,
  Clock,
  Coffee,
  Music,
  ChefHat,
  Tags,
  Upload,
  Link,
  Image as ImageIcon,
  HardDrive,
  Database,
  AlertCircle,
} from "lucide-react";
import Image from "next/image";
import { z } from "zod";

// Zod Schemas
const specialMenuSchema = z.object({
  name: z.string().min(1, "Ürün adı gereklidir").max(100, "Ürün adı çok uzun"),
  price: z
    .string()
    .min(1, "Fiyat gereklidir")
    .regex(/^\d+₺?$/, "Geçerli bir fiyat girin (örn: 25₺)"),
  description: z
    .string()
    .min(1, "Açıklama gereklidir")
    .max(200, "Açıklama çok uzun"),
  image: z
    .string()
    .url("Geçerli bir URL girin")
    .or(z.string().min(1, "Resim gereklidir")),
});

const menuItemSchema = z.object({
  name: z.string().min(1, "Ürün adı gereklidir").max(100, "Ürün adı çok uzun"),
  price: z
    .string()
    .min(1, "Fiyat gereklidir")
    .regex(/^\d+₺?$/, "Geçerli bir fiyat girin (örn: 25₺)"),
  category: z
    .string()
    .min(1, "Kategori gereklidir")
    .max(50, "Kategori adı çok uzun"),
  description: z
    .string()
    .min(1, "Açıklama gereklidir")
    .max(200, "Açıklama çok uzun"),
});

const categorySchema = z.object({
  name: z
    .string()
    .min(1, "Kategori adı gereklidir")
    .max(50, "Kategori adı çok uzun"),
});

const eventSchema = z.object({
  artist: z
    .string()
    .min(1, "Sanatçı/Grup adı gereklidir")
    .max(100, "Sanatçı adı çok uzun"),
  date: z
    .string()
    .min(1, "Tarih gereklidir")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Geçerli bir tarih girin"),
  time: z
    .string()
    .min(1, "Saat gereklidir")
    .regex(/^\d{2}:\d{2}$/, "Geçerli bir saat girin (örn: 20:00)"),
  image: z
    .string()
    .url("Geçerli bir URL girin")
    .or(z.string().min(1, "Resim gereklidir")),
});

type SpecialMenu = z.infer<typeof specialMenuSchema> & { id: number };
type MenuItem = z.infer<typeof menuItemSchema> & { id: number };
type Category = z.infer<typeof categorySchema> & {
  id: number;
  itemCount?: number;
};
type Event = z.infer<typeof eventSchema> & { id: number };

// Supabase Storage Functions
const uploadImageToSupabase = async (file: File): Promise<string> => {
  try {
    // Mock implementation - gerçek uygulamada Supabase storage kullanılacak
    return `https://mock-storage.supabase.co/images/${Date.now()}-${file.name}`;
  } catch (error) {
    console.error("Image upload error:", error);
    throw new Error("Resim yüklenirken hata oluştu");
  }
};

// Improved Image Input Component
const ImageInput = ({
  value,
  onChange,
  placeholder = "Resim",
  error,
}: {
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  error?: string;
}) => {
  const [inputType, setInputType] = useState<"url" | "file">("url");
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(value || "");

  // Update preview when value changes from parent
  useEffect(() => {
    setPreviewUrl(value || "");
  }, [value]);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Dosya boyutu kontrolü (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Dosya boyutu 5MB'dan küçük olmalıdır.");
      return;
    }

    // Dosya tipi kontrolü
    if (!file.type.startsWith("image/")) {
      alert("Lütfen geçerli bir resim dosyası seçin.");
      return;
    }

    setIsUploading(true);
    try {
      // Preview için local URL oluştur
      const localPreview = URL.createObjectURL(file);
      setPreviewUrl(localPreview);

      // Supabase'e yükle
      const uploadedUrl = await uploadImageToSupabase(file);
      onChange(uploadedUrl);
      setPreviewUrl(uploadedUrl);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Resim yüklenirken hata oluştu.");
      // Preview'ı temizleme, hata durumunda local preview'ı koru
    } finally {
      setIsUploading(false);
    }
  };

  const handleUrlChange = (url: string) => {
    onChange(url);
    setPreviewUrl(url);
  };

  const clearImage = () => {
    onChange("");
    setPreviewUrl("");
  };

  return (
    <div className="space-y-3">
      {/* Input Type Selector */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant={inputType === "url" ? "default" : "outline"}
          size="sm"
          onClick={() => setInputType("url")}
          className="flex-1"
        >
          <Link className="w-4 h-4 mr-1" />
          URL
        </Button>
        <Button
          type="button"
          variant={inputType === "file" ? "default" : "outline"}
          size="sm"
          onClick={() => setInputType("file")}
          className="flex-1"
        >
          <Upload className="w-4 h-4 mr-1" />
          Dosya Seç
        </Button>
      </div>

      {/* Input Field */}
      {inputType === "url" ? (
        <div>
          <Input
            value={value || ""}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder={`${placeholder} URL'si`}
            type="url"
            className={error ? "border-red-500" : ""}
          />
          {error && (
            <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className={`block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 file:cursor-pointer cursor-pointer ${
              error ? "border border-red-500 rounded-lg" : ""
            }`}
            disabled={isUploading}
          />
          {isUploading && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-600"></div>
              Yükleniyor...
            </div>
          )}
          {error && (
            <div className="flex items-center gap-1 text-sm text-red-600">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}
        </div>
      )}

      {/* Preview - Always show if there's a URL */}
      {previewUrl && (
        <div className="relative">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-32 object-cover rounded-lg border border-gray-200"
            onError={() => {
              // Sadece URL hatası durumunda preview'ı temizle
              if (inputType === "url") {
                setPreviewUrl("");
              }
            }}
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={clearImage}
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      )}
    </div>
  );
};

// Dialog Component
const Dialog = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
            <Button onClick={onClose} variant="ghost" size="sm">
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="p-6">{children}</div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Mock data
const initialSpecialMenus = [
  {
    id: 1,
    name: "Özel Kahve Karışımı",
    price: "45₺",
    description: "Ev yapımı özel karışım",
    image: "/special-menu.png",
  },
  {
    id: 2,
    name: "Antik Nargile",
    price: "35₺",
    description: "Geleneksel lezzet",
    image: "/special-menu2.png",
  },
];

const initialMenuItems = [
  {
    id: 1,
    name: "Türk Kahvesi",
    price: "25₺",
    category: "Sıcak İçecekler",
    description: "Geleneksel Türk kahvesi",
  },
  {
    id: 2,
    name: "Cappuccino",
    price: "30₺",
    category: "Sıcak İçecekler",
    description: "İtalyan usulü cappuccino",
  },
  {
    id: 3,
    name: "Baklava",
    price: "20₺",
    category: "Tatlılar",
    description: "Ev yapımı baklava",
  },
];

const initialCategories = [
  { id: 1, name: "Sıcak İçecekler", itemCount: 8 },
  { id: 2, name: "Soğuk İçecekler", itemCount: 6 },
  { id: 3, name: "Tatlılar", itemCount: 5 },
  { id: 4, name: "Nargile", itemCount: 4 },
];

const initialEvents = [
  {
    id: 1,
    artist: "Elif Çağlar",
    date: "2024-01-15",
    time: "20:00",
    image:
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=300&fit=crop",
  },
  {
    id: 2,
    artist: "Jazz Trio İstanbul",
    date: "2024-01-17",
    time: "21:00",
    image:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
  },
];

// Storage Usage Component
const StorageUsage = () => {
  // Mock data - gerçek uygulamada Supabase'den alınacak
  const storageData = {
    used: 2.3, // GB
    total: 10, // GB
    breakdown: {
      images: 1.8,
      documents: 0.3,
      other: 0.2,
    },
  };

  const usagePercentage = (storageData.used / storageData.total) * 100;
  const getUsageColor = (percentage) => {
    if (percentage < 50) return "from-green-500 to-emerald-500";
    if (percentage < 80) return "from-yellow-500 to-orange-500";
    return "from-red-500 to-pink-500";
  };

  return (
    <Card className="mb-6 bg-white/80 backdrop-blur-sm border border-amber-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-amber-600" />
            <h3 className="font-semibold text-amber-800">
              Supabase Storage Kullanımı
            </h3>
          </div>
          <div className="text-sm text-gray-600">
            {storageData.used} GB / {storageData.total} GB
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <motion.div
            className={`h-3 rounded-full bg-gradient-to-r ${getUsageColor(
              usagePercentage
            )}`}
            initial={{ width: 0 }}
            animate={{ width: `${usagePercentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>

        {/* Storage Breakdown */}
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mx-auto mb-1"></div>
            <div className="text-gray-600">Resimler</div>
            <div className="font-medium">{storageData.breakdown.images} GB</div>
          </div>
          <div className="text-center">
            <div className="w-3 h-3 bg-purple-500 rounded-full mx-auto mb-1"></div>
            <div className="text-gray-600">Dökümanlar</div>
            <div className="font-medium">
              {storageData.breakdown.documents} GB
            </div>
          </div>
          <div className="text-center">
            <div className="w-3 h-3 bg-gray-500 rounded-full mx-auto mb-1"></div>
            <div className="text-gray-600">Diğer</div>
            <div className="font-medium">{storageData.breakdown.other} GB</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("special-menu");
  const [specialMenus, setSpecialMenus] =
    useState<SpecialMenu[]>(initialSpecialMenus);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const tabs = [
    {
      id: "special-menu",
      name: "Özel Menü",
      icon: ChefHat,
      color: "from-amber-500 to-orange-500",
    },
    {
      id: "menu-items",
      name: "Menü İçeriği",
      icon: Coffee,
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "categories",
      name: "Kategoriler",
      icon: Tags,
      color: "from-green-500 to-emerald-500",
    },
    {
      id: "events",
      name: "Etkinlikler",
      icon: Music,
      color: "from-purple-500 to-pink-500",
    },
  ];

  const validateForm = (data: any, schema: z.ZodSchema) => {
    try {
      schema.parse(data);
      setFormErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path.length > 0) {
            errors[err.path[0] as string] = err.message;
          }
        });
        setFormErrors(errors);
      }
      return false;
    }
  };

  const getValidationSchema = () => {
    switch (activeTab) {
      case "special-menu":
        return specialMenuSchema;
      case "menu-items":
        return menuItemSchema;
      case "categories":
        return categorySchema;
      case "events":
        return eventSchema;
      default:
        return z.object({});
    }
  };

  const openAddDialog = () => {
    setDialogMode("add");
    setFormData({});
    setFormErrors({});
    setIsDialogOpen(true);
  };

  const openEditDialog = (item: any) => {
    setDialogMode("edit");
    setEditingItem(item);
    setFormData({ ...item });
    setFormErrors({});
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingItem(null);
    setFormData({});
    setFormErrors({});
  };

  const handleSave = () => {
    const schema = getValidationSchema();

    if (!validateForm(formData, schema)) {
      return;
    }

    if (dialogMode === "edit" && editingItem) {
      const updatedItem = { ...formData };
      switch (activeTab) {
        case "special-menu":
          setSpecialMenus((prev) =>
            prev.map((item) =>
              item.id === editingItem.id ? (updatedItem as SpecialMenu) : item
            )
          );
          break;
        case "menu-items":
          setMenuItems((prev) =>
            prev.map((item) =>
              item.id === editingItem.id ? (updatedItem as MenuItem) : item
            )
          );
          break;
        case "categories":
          setCategories((prev) =>
            prev.map((item) =>
              item.id === editingItem.id ? (updatedItem as Category) : item
            )
          );
          break;
        case "events":
          setEvents((prev) =>
            prev.map((item) =>
              item.id === editingItem.id ? (updatedItem as Event) : item
            )
          );
          break;
      }
    } else if (dialogMode === "add" && Object.keys(formData).length > 0) {
      const id = Date.now();
      const newItem = { ...formData, id };

      switch (activeTab) {
        case "special-menu":
          setSpecialMenus((prev) => [...prev, newItem as SpecialMenu]);
          break;
        case "menu-items":
          setMenuItems((prev) => [...prev, newItem as MenuItem]);
          break;
        case "categories":
          setCategories((prev) => [
            ...prev,
            { ...newItem, itemCount: 0 } as Category,
          ]);
          break;
        case "events":
          setEvents((prev) => [...prev, newItem as Event]);
          break;
      }
    }
    closeDialog();
  };

  const handleDelete = (id, type) => {
    switch (type) {
      case "special-menu":
        setSpecialMenus((prev) => prev.filter((item) => item.id !== id));
        break;
      case "menu-items":
        setMenuItems((prev) => prev.filter((item) => item.id !== id));
        break;
      case "categories":
        setCategories((prev) => prev.filter((item) => item.id !== id));
        break;
      case "events":
        setEvents((prev) => prev.filter((item) => item.id !== id));
        break;
    }
  };

  const renderDialogContent = () => {
    switch (activeTab) {
      case "special-menu":
        return (
          <div className="space-y-4">
            <Input
              value={formData.name || ""}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Ürün Adı"
            />
            <Input
              value={formData.price || ""}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              placeholder="Fiyat"
            />
            <Input
              value={formData.description || ""}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Açıklama"
            />
            <ImageInput
              value={formData.image || ""}
              onChange={(url) => setFormData({ ...formData, image: url })}
              placeholder="Ürün Resmi"
            />
            <div className="flex gap-2 pt-4">
              <Button onClick={handleSave} className="flex-1">
                <Save className="w-4 h-4 mr-2" />
                {dialogMode === "edit" ? "Güncelle" : "Ekle"}
              </Button>
              <Button
                onClick={closeDialog}
                variant="outline"
                className="flex-1"
              >
                <X className="w-4 h-4 mr-2" /> İptal
              </Button>
            </div>
          </div>
        );

      case "menu-items":
        return (
          <div className="space-y-4">
            <Input
              value={formData.name || ""}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Ürün Adı"
            />
            <Input
              value={formData.price || ""}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              placeholder="Fiyat"
            />
            <Input
              value={formData.category || ""}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              placeholder="Kategori"
            />
            <Input
              value={formData.description || ""}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Açıklama"
            />
            <div className="flex gap-2 pt-4">
              <Button onClick={handleSave} className="flex-1">
                <Save className="w-4 h-4 mr-2" />
                {dialogMode === "edit" ? "Güncelle" : "Ekle"}
              </Button>
              <Button
                onClick={closeDialog}
                variant="outline"
                className="flex-1"
              >
                <X className="w-4 h-4 mr-2" /> İptal
              </Button>
            </div>
          </div>
        );

      case "categories":
        return (
          <div className="space-y-4">
            <Input
              value={formData.name || ""}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Kategori Adı"
            />
            <div className="flex gap-2 pt-4">
              <Button onClick={handleSave} className="flex-1">
                <Save className="w-4 h-4 mr-2" />
                {dialogMode === "edit" ? "Güncelle" : "Ekle"}
              </Button>
              <Button
                onClick={closeDialog}
                variant="outline"
                className="flex-1"
              >
                <X className="w-4 h-4 mr-2" /> İptal
              </Button>
            </div>
          </div>
        );

      case "events":
        return (
          <div className="space-y-4">
            <Input
              value={formData.artist || ""}
              onChange={(e) =>
                setFormData({ ...formData, artist: e.target.value })
              }
              placeholder="Sanatçı/Grup Adı"
            />
            <Input
              type="date"
              value={formData.date || ""}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              placeholder="Tarih"
            />
            <Input
              type="time"
              value={formData.time || ""}
              onChange={(e) =>
                setFormData({ ...formData, time: e.target.value })
              }
              placeholder="Saat"
            />
            <ImageInput
              value={formData.image || ""}
              onChange={(url) => setFormData({ ...formData, image: url })}
              placeholder="Etkinlik Resmi"
            />
            <div className="flex gap-2 pt-4">
              <Button onClick={handleSave} className="flex-1">
                <Save className="w-4 h-4 mr-2" />
                {dialogMode === "edit" ? "Güncelle" : "Ekle"}
              </Button>
              <Button
                onClick={closeDialog}
                variant="outline"
                className="flex-1"
              >
                <X className="w-4 h-4 mr-2" /> İptal
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getDialogTitle = () => {
    const tabName = tabs.find((tab) => tab.id === activeTab)?.name || "";
    return dialogMode === "edit"
      ? `${tabName} Düzenle`
      : `Yeni ${tabName} Ekle`;
  };

  const renderContent = () => {
    switch (activeTab) {
      case "special-menu":
        return (
          <div className="space-y-4">
            {specialMenus.map((item) => (
              <Card key={item.id} className="p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div>
                      <h3 className="font-semibold text-amber-800">
                        {item.name}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {item.description}
                      </p>
                      <Badge variant="secondary">{item.price}</Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => openEditDialog(item)}
                      size="sm"
                      variant="outline"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(item.id, "special-menu")}
                      size="sm"
                      variant="destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        );

      case "menu-items":
        return (
          <div className="space-y-4">
            {menuItems.map((item) => (
              <Card key={item.id} className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-amber-800">
                      {item.name}
                    </h3>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="secondary">{item.price}</Badge>
                      <Badge variant="outline">{item.category}</Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => openEditDialog(item)}
                      size="sm"
                      variant="outline"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(item.id, "menu-items")}
                      size="sm"
                      variant="destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        );

      case "categories":
        return (
          <div className="space-y-4">
            {categories.map((item) => (
              <Card key={item.id} className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-amber-800">
                      {item.name}
                    </h3>
                    <Badge variant="secondary">{item.itemCount} ürün</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => openEditDialog(item)}
                      size="sm"
                      variant="outline"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(item.id, "categories")}
                      size="sm"
                      variant="destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        );

      case "events":
        return (
          <div className="space-y-4">
            {events.map((item) => (
              <Card key={item.id} className="p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.artist}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div>
                      <h3 className="font-semibold text-amber-800">
                        {item.artist}
                      </h3>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="secondary">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(item.date).toLocaleDateString("tr-TR")}
                        </Badge>
                        <Badge variant="outline">
                          <Clock className="w-3 h-3 mr-1" />
                          {item.time}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => openEditDialog(item)}
                      size="sm"
                      variant="outline"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(item.id, "events")}
                      size="sm"
                      variant="destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <div className="container mx-auto px-4 py-8 mt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-amber-800 mb-2">
              Admin Paneli
            </h1>
            <p className="text-gray-600">Menü ve etkinlik yönetimi</p>
          </div>

          {/* Storage Usage Chart */}
          <StorageUsage />

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                    activeTab === tab.id
                      ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                      : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="w-5 h-5" />
                  {tab.name}
                </motion.button>
              );
            })}
          </div>

          {/* Add Button */}
          <div className="mb-6">
            <Button
              onClick={openAddDialog}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Yeni Ekle
            </Button>
          </div>

          {/* Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            {renderContent()}
          </motion.div>
        </motion.div>
      </div>

      {/* Dialog */}
      <Dialog
        isOpen={isDialogOpen}
        onClose={closeDialog}
        title={getDialogTitle()}
      >
        {renderDialogContent()}
      </Dialog>
    </div>
  );
}
