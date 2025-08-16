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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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
  const [isMobile, setIsMobile] = useState(false);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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

  const searchInCategories = (categories: typeof menuData) => {
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
      <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 mt-40">
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
        <Tabs defaultValue="menu">
          <TabsList className="mx-auto bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-200 shadow-lg">
            <div className="bg-transparent">
              <TabsTrigger 
                value="menu" 
                className="cursor-pointer data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white hover:bg-amber-200 transition-all duration-300 font-semibold"
              >
                Menü
              </TabsTrigger>
              <TabsTrigger 
                value="advantage-menu" 
                className="cursor-pointer data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white hover:bg-amber-200 transition-all duration-300 font-semibold"
              >
                Avantajlı menüler
              </TabsTrigger>
            </div>
          </TabsList>
          <TabsContent value="menu">
            {/* Category Filter - Responsive */}
            <motion.div
              className=""
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="p-2 max-w-[1200px] mx-auto">
                <Tabs
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                  className="w-full flex flex-col items-center"
                >
                  <TabsList className="max-w-[500px] my-10 bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-200 shadow-lg">
                    {isMobile ? (
                      <>
                        <Select
                          onValueChange={setSelectedCategory}
                          value={selectedCategory}
                        >
                          <SelectTrigger className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-300 hover:border-amber-400 focus:border-amber-500 text-amber-800 font-semibold shadow-md">
                            <SelectValue placeholder="Kategori seçiniz" />
                          </SelectTrigger>
                          <SelectContent className="bg-gradient-to-b from-amber-50 to-orange-50 border-amber-200 shadow-xl">
                            <SelectGroup>
                              <SelectItem 
                                value="all" 
                                className="hover:bg-amber-100 focus:bg-amber-200 text-amber-800 font-medium"
                              >
                                Tüm Yemekler
                              </SelectItem>
                              {menuData.map((category) => (
                                <SelectItem
                                  value={category.id}
                                  key={category.id}
                                  className="hover:bg-amber-100 focus:bg-amber-200 text-amber-800 font-medium"
                                >
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </>
                    ) : (
                      <div className="flex items-center justify-center">
                        <Carousel
                          className="max-w-[400px]"
                          opts={{ align: "center" }}
                        >
                          <CarouselContent>
                            <CarouselItem className="basis-auto">
                              <TabsTrigger 
                                value="all"
                                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white hover:bg-amber-200 transition-all duration-300 font-semibold text-amber-800 border border-amber-300 shadow-sm"
                              >
                                Tüm Yemekler
                              </TabsTrigger>
                            </CarouselItem>
                            {menuData.map((category) => (
                              <CarouselItem
                                key={category.id}
                                className="basis-auto"
                              >
                                <TabsTrigger 
                                  value={category.id}
                                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white hover:bg-amber-200 transition-all duration-300 font-semibold text-amber-800 border border-amber-300 shadow-sm"
                                >
                                  {category.name}
                                </TabsTrigger>
                              </CarouselItem>
                            ))}
                          </CarouselContent>
                          <CarouselNext className="bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 border-amber-400 shadow-lg" />
                          <CarouselPrevious className="bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 border-amber-400 shadow-lg" />
                        </Carousel>
                      </div>
                    )}
                  </TabsList>
                  <TabsContent className="w-full" value={selectedCategory}>
                    {displayCategories.map((category, categoryIndex) => (
                      <motion.div
                        key={category.id}
                        className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden mb-12"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.6,
                          delay: categoryIndex * 0.1,
                        }}
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
                                transition={{
                                  duration: 0.4,
                                  delay: index * 0.05,
                                }}
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
                                          stiffness: 500,
                                          delay: index * 0.1,
                                        }}
                                        viewport={{ once: true }}
                                      >
                                        <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs px-2 py-1">
                                          <Star className="w-3 h-3 mr-1" />
                                          Popüler
                                        </Badge>
                                      </motion.div>
                                    )}
                                  </div>
                                  <p className="text-gray-600 text-sm">
                                    {item.description}
                                  </p>
                                </div>
                                <motion.div
                                  className="text-right"
                                  whileHover={{ scale: 1.05 }}
                                >
                                  <span className="text-xl font-bold text-amber-700">
                                    {item.price
                                      ? `${item.price}₺`
                                      : "Fiyat için sorunuz"}
                                  </span>
                                </motion.div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    ))}

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
                          transition={{
                            duration: 2,
                            repeat: Number.POSITIVE_INFINITY,
                          }}
                        >
                          🔍
                        </motion.div>
                        <p className="text-gray-500 text-lg mb-2">
                          Aradığınız kriterlere uygun ürün bulunamadı.
                        </p>
                        <p className="text-gray-400 text-sm">
                          Farklı anahtar kelimeler deneyin veya kategori
                          filtrelerini değiştirin.
                        </p>
                      </motion.div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </motion.div>
          </TabsContent>
          <TabsContent value="advantage-menu">
            <motion.div
              className="w-full grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {heroImages.map((image, index) => (
                <motion.div
                  className="col-span-1 w-full relative rounded-xl overflow-hidden shadow-xl bg-gradient-to-br from-amber-100 to-orange-100 border border-amber-200"
                  key={index}
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 100,
                  }}
                  whileHover={{
                    y: -10,
                    scale: 1.02,
                    transition: { duration: 0.3 },
                    boxShadow: "0 25px 50px -12px rgba(251, 191, 36, 0.25)",
                  }}
                  viewport={{ once: true }}
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                    className="relative overflow-hidden rounded-xl"
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`Menu ${index + 1}`}
                      width={400}
                      height={600}
                      className="w-full h-auto object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
                      priority={index === 0}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-amber-900/20 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                  </motion.div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-amber-800/80 to-transparent p-3">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileHover={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-white text-center"
                    >
                      <p className="text-sm font-semibold">Özel Menü {index + 1}</p>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
}
