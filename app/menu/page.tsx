"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Star, ChevronLeft, ChevronRight } from "lucide-react";
import Header from "@/components/header";
import { motion } from "framer-motion";
import Image from "next/image";
import Footer from "@/components/footer";

const heroImages = [
  "/special-menu.png",
  "/special-menu2.png",
  "/special-menu3.png",
  "/special-menu4.png",
  "/special-menu5.png",
];

const menuData = [
  {
    id: "kahveler",
    name: "ESPRESSO BAR",
    subtitle: "Özenle hazırlanmış kahve çeşitlerimiz",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image.png-lNnlRVFhR8qrmY94MdMYNFN4OxAHYD.jpeg",
    items: [
      { name: "Espresso", price: 16, description: "Klasik İtalyan espresso" },
      {
        name: "Macchiato",
        price: 18,
        description: "Espresso üzerine süt köpüğü",
      },
      {
        name: "Americano",
        price: 18,
        description: "Sıcak su ile seyreltilmiş espresso",
      },
      {
        name: "Cappuccino",
        price: 20,
        description: "Espresso, süt köpüğü ve sıcak süt",
      },
      {
        name: "Cafe Latte",
        price: 22,
        description: "Karamel, fındık, çikolata seçenekleri",
      },
      { name: "Mocha", price: 24, description: "Çikolata, beyaz çikolata" },
      {
        name: "Filtre Kahve",
        price: 20,
        description:
          "Vanilya, fındık, çikolata, kolombiya, brezilya, kenya, etiyopya, irish cream",
      },
    ],
  },
  {
    id: "soguk-kahveler",
    name: "SOĞUK KAHVELER",
    subtitle: "Serinletici soğuk kahve çeşitleri",
    image: "/iced-cold-brew.png",
    items: [
      { name: "Ice Americano", price: 22, description: "Buzlu americano" },
      { name: "Ice Latte", price: 24, description: "Buzlu latte" },
      { name: "Ice Mocha", price: 26, description: "Buzlu mocha" },
      {
        name: "Ice Mocha Caramelatte",
        price: 28,
        description: "Karamelli buzlu mocha",
      },
      {
        name: "White Ice Mocha",
        price: 26,
        description: "Beyaz çikolatalı buzlu mocha",
      },
      { name: "Cold Brew", price: 25, description: "Soğuk demleme kahve" },
    ],
  },
  {
    id: "tatli-menu",
    name: "TATLI MENÜ",
    subtitle: "Ev yapımı tatlı lezzetlerimiz",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image.png-TsizblsUNFIeHRsYHGbJEWTH31laut.jpeg",
    items: [
      {
        name: "Waffle",
        price: 35,
        description: "Muz, kivi, çilek, dondurma ve soslar ile sunulur",
      },
      { name: "Cheesecake", price: 32, description: "Frambuazlı ve Limonlu" },
      {
        name: "Tiramisu",
        price: 32,
        description: "Geleneksel İtalyan tatlısı",
      },
      { name: "Profiterol", price: 28, description: "Çikolata soslu" },
      { name: "Yaş Pasta", price: 35, description: "Frambuazlı ve Çikolatalı" },
      { name: "Kızarmış Dondurma", price: 38, description: "Özel sunumlu" },
      { name: "Kuruyemiş Tabağı", price: 45, description: "Karışık kuruyemiş" },
      { name: "Meyve Tabağı", price: 42, description: "Mevsim meyveleri" },
      {
        name: "Serpme Meyve Tabağı",
        price: 55,
        description: "Mevsim meyveleri - büyük tabak",
      },
    ],
  },
  {
    id: "nargile",
    name: "NARGİLE MENÜSÜ",
    subtitle: "Kaliteli nargile çeşitlerimiz",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image.png-JWzKaQFWcNDsaSRckFRI5sExaxkMW7.jpeg",
    items: [
      {
        name: "Classic Nargile",
        price: null,
        description: "Geleneksel nargile",
      },
      {
        name: "Tatlı Kız - Sweet girl",
        price: null,
        description: "Tatlı aromalı",
      },
      {
        name: "Ankara Akşamı - Ankara Evening",
        price: null,
        description: "Özel karışım",
      },
      { name: "Jibiar", price: null, description: "Premium marka" },
      { name: "Dejavu", price: 40, description: "Özel karışım" },
      { name: "Marilyn Monroe", price: null, description: "Özel aroma" },
      { name: "Elma - Apple", price: null, description: "Elma aromalı" },
      {
        name: "Çift Elma - Two Apple",
        price: null,
        description: "Çift elma aromalı",
      },
      { name: "Kavun - Melon", price: null, description: "Kavun aromalı" },
      { name: "Cappuccino", price: null, description: "Kahve aromalı" },
      { name: "Çilek - Strawberry", price: null, description: "Çilek aromalı" },
      { name: "Şeftali - Peach", price: null, description: "Şeftali aromalı" },
      { name: "Portakal - Orange", price: 40, description: "Portakal aromalı" },
    ],
  },
];

export default function MenuPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Temizlik
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (isPaused) return;

    // Progress bar'ı sıfırla
    setProgress(0);

    // Progress bar animasyonu
    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 2; // Her 100ms'de %2.5 artır (4 saniye = 40 adım)
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 100);

    // 4 saniye sonra resim değiştir
    timeoutRef.current = setTimeout(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentImageIndex, isPaused]);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? heroImages.length - 1 : prevIndex - 1
    );
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  const filteredCategories =
    selectedCategory === "all"
      ? menuData
      : menuData.filter((category) => category.id === selectedCategory);

  const searchInCategories = (categories) => {
    if (!searchTerm) return categories;

    return categories
      .map((category) => ({
        ...category,
        items: category.items.filter(
          (item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase())
        ),
      }))
      .filter((category) => category.items.length > 0);
  };

  const displayCategories = searchInCategories(filteredCategories);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 mt-16">
        <motion.div
          className="relative w-full aspect-square md:w-[600px] md:h-[600px] md:aspect-auto rounded-2xl overflow-hidden mb-8 sm:mb-12 mx-auto group"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {heroImages.map((image, index) => (
            <div
              key={index}
              className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
              style={{
                opacity: index === currentImageIndex ? 1 : 0,
              }}
            >
              <Image
                src={image || "/placeholder.svg"}
                alt={`Menu ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 600px"
                priority={index === 0}
              />
            </div>
          ))}
          <div className="absolute inset-0 bg-black/20" />

          {/* Navigation Arrows */}
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentImageIndex
                    ? "bg-white scale-110"
                    : "bg-white/50 hover:bg-white/70"
                }`}
              />
            ))}
          </div>

          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 z-10">
            <div className="w-full bg-white/30 h-1">
              <div
                className="h-full bg-white transition-all duration-100 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="text-center mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-amber-800 mb-3 sm:mb-4 font-serif">
            Menümüz
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Özenle hazırlanmış lezzetlerimizi keşfedin
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          className="mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Menüde ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/90 backdrop-blur-sm border-amber-200 focus:border-amber-400 h-12"
            />
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          className="flex flex-wrap justify-center gap-2 mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              onClick={() => setSelectedCategory("all")}
              className={`text-sm ${
                selectedCategory === "all"
                  ? "bg-amber-600 hover:bg-amber-700"
                  : "border-amber-200 hover:border-amber-400"
              }`}
            >
              Tümü
            </Button>
          </motion.div>
          {menuData.map((category, index) => (
            <motion.div
              key={category.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
            >
              <Button
                variant={
                  selectedCategory === category.id ? "default" : "outline"
                }
                onClick={() => setSelectedCategory(category.id)}
                className={`text-sm ${
                  selectedCategory === category.id
                    ? "bg-amber-600 hover:bg-amber-700"
                    : "border-amber-200 hover:border-amber-400"
                }`}
              >
                {category.name}
              </Button>
            </motion.div>
          ))}
        </motion.div>

        {/* Menu Categories */}
        <div className="space-y-12">
          {displayCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.id}
              className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="relative h-48 sm:h-64 overflow-hidden">
                <motion.img
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.6 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <motion.div
                  className="absolute bottom-6 left-6 text-white"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                    {category.name}
                  </h2>
                  <p className="text-sm sm:text-base opacity-90">
                    {category.subtitle}
                  </p>
                </motion.div>
              </div>

              <div className="p-6 sm:p-8">
                <div className="grid gap-3 sm:gap-4">
                  {category.items.map((item, index) => (
                    <motion.div
                      key={index}
                      className="flex justify-between items-start py-3 border-b border-amber-100 last:border-b-0"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      viewport={{ once: true }}
                      whileHover={{
                        x: 5,
                        backgroundColor: "rgba(251, 191, 36, 0.05)",
                      }}
                    >
                      <div className="flex-1 pr-4">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-amber-800 text-base sm:text-lg">
                            {item.name}
                          </h3>
                          {Math.random() > 0.7 && (
                            <motion.div
                              initial={{ scale: 0 }}
                              whileInView={{ scale: 1 }}
                              transition={{
                                type: "spring",
                                stiffness: 300,
                                delay: 0.2,
                              }}
                              viewport={{ once: true }}
                            >
                              <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 text-xs">
                                <Star className="w-3 h-3 mr-1 fill-current" />
                                Popüler
                              </Badge>
                            </motion.div>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                      <div className="text-right">
                        {item.price && (
                          <motion.span
                            className="text-lg sm:text-xl font-bold text-amber-600"
                            whileHover={{ scale: 1.1 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            {item.price} ₺
                          </motion.span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {displayCategories.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="text-6xl mb-4"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              🔍
            </motion.div>
            <p className="text-gray-500 text-lg mb-2">
              Aradığınız kriterlere uygun ürün bulunamadı.
            </p>
            <p className="text-gray-400 text-sm">
              Farklı anahtar kelimeler deneyin veya kategori filtrelerini
              değiştirin.
            </p>
          </motion.div>
        )}
      </div>
      <Footer />
    </div>
  );
}
