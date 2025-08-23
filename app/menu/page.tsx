"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Star } from "lucide-react";
import Header from "@/components/header";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Footer from "@/components/footer";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const heroImages = [
  "/special-menu.png",
  "/special-menu2.png",
  "/special-menu3.png",
  "/special-menu4.png",
  "/special-menu5.png",
];

// Dummy data (senin menuData burada)
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

// Easing fonksiyonumuz (yavaş-hızlı-yavaş scroll için)
const easeInOutCubic = (t: number) => 0.5 * (1 - Math.cos(Math.PI * t));

// Görsel + açıklama + fiyat için veriler
const advantageMenus = [
  { image: "/special-menu.png", description: "Kola + Hamburger Menü", price: 120 },
  { image: "/special-menu2.png", description: "Çay + Simit Menü", price: 45 },
  { image: "/special-menu3.png", description: "Latte + Cheesecake Menü", price: 150 },
  { image: "/special-menu4.png", description: "Waffle + Meşrubat Menü", price: 160 },
  { image: "/special-menu5.png", description: "Cold Brew + Kurabiye Menü", price: 80 },
];

export default function MenuPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all"); // "all" varsayılan olarak tüm menüyü göster
  const [activeTab, setActiveTab] = useState("menu");

  // Custom scroll animasyonu
  const scrollToSection = (sectionId: string, duration = 2000) => {
    const element = document.getElementById(sectionId);
    if (!element) return;

    const headerEl = document.getElementById("site-header");
    const headerOffset = headerEl?.getBoundingClientRect().height ?? 205;

    const startY = window.scrollY;
    const elementTop = element.getBoundingClientRect().top + window.scrollY;
    const targetY = elementTop - headerOffset;

    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeInOutCubic(progress);

      window.scrollTo(0, startY + (targetY - startY) * eased);

      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
    // URL hash kullanmıyoruz
    // window.history.pushState(null, "", `#${sectionId}`);
  };

  // URL hash yakala
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash) {
        setSelectedCategory(hash); // sadece buton vurgusu için
        scrollToSection(hash, 900); // içeriği filtrelemeden, oraya scroll et
      }
    };
    if (window.location.hash) handleHashChange();

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Scroll tabanlı kategori belirleme kaldırıldı - artık manuel filtreleme yapıyoruz

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

  // Kategori filtreleme fonksiyonu
  const filterByCategory = (categories: typeof menuData) => {
    if (selectedCategory === "all") return categories;
    return categories.filter((category) => category.id === selectedCategory);
  };

  const displayCategories = filterByCategory(searchInCategories(menuData));

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 mt-40">
        {/* Başlık */}
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

        {/* Arama */}
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

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mx-auto w-10/12 md:w-5/12 bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-200 shadow-lg">
            <div className="grid grid-cols-2 w-full gap-2 bg-transparent">
              <TabsTrigger
                value="menu"
                className="w-full justify-center cursor-pointer data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white hover:bg-amber-200 transition-all duration-300 font-semibold"
              >
                Menü
              </TabsTrigger>
              <TabsTrigger
                value="advantage-menu"
                className="w-full justify-center cursor-pointer data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white hover:bg-amber-200 transition-all duration-300 font-semibold"
              >
                Avantajlı Menüler
              </TabsTrigger>
            </div>
          </TabsList>

          {/* AnimatePresence ile içerik */}
          <div className="relative min-h-[400px] mt-6">
            <AnimatePresence mode="wait">
              {activeTab === "menu" && (
                <motion.div
                  key="menu"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Category Buttons */}
                  <div className="px-2 py-5 max-w-11/12 md:max-w-[1200px] mx-auto flex flex-wrap items-center justify-center gap-2">
                    {/* Tüm Menü Butonu */}
                    <Button
                      variant="outline"
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedCategory("all");
                      }}
                      className={`cursor-pointer transition-colors bg-gradient-to-r border ${
                        selectedCategory === "all"
                          ? "from-amber-500 to-orange-500 text-white border-transparent hover:from-amber-600 hover:to-orange-600"
                          : "from-amber-100 to-orange-100 border-amber-200 hover:border-amber-400"
                      }`}
                    >
                      TÜM MENÜ
                    </Button>
                    
                    {/* Kategori Butonları */}
                    {menuData.map((cat) => (
                      <Button
                        variant="outline"
                        key={cat.id}
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedCategory(cat.id);
                        }}
                        className={`cursor-pointer transition-colors bg-gradient-to-r border ${
                          selectedCategory === cat.id
                            ? "from-amber-500 to-orange-500 text-white border-transparent hover:from-amber-600 hover:to-orange-600"
                            : "from-amber-100 to-orange-100 border-amber-200 hover:border-amber-400"
                        }`}
                      >
                        {cat.name}
                      </Button>
                    ))}
                  </div>

                  {/* Category Sections */}
                  <div className="p-2 max-w-[1200px] mx-auto">
                    {displayCategories.map((category, categoryIndex) => (
                      <motion.section
                        id={category.id}
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
                        {/* Category Header */}
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

                        {/* Items */}
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
                                    {(index === 0 || index === 2 || index === 4) && (
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
                      </motion.section>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === "advantage-menu" && (
                <motion.div
                  key="advantage"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                  className="w-full grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 p-4"
                >
                  {advantageMenus.map((menu, index) => (
                    <motion.div
                      className="col-span-1 w-full relative rounded-xl overflow-hidden shadow-xl bg-white border border-amber-200"
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
                      {/* Üstte ürün görseli */}
                      <motion.div
                        whileHover={{ scale: 1.03 }}
                        transition={{ duration: 0.25 }}
                        className="relative overflow-hidden rounded-t-xl"
                      >
                        <Image
                          src={menu.image || "/placeholder.svg"}
                          alt={menu.description}
                          width={600}
                          height={800}
                          className="w-full h-56 sm:h-64 object-cover"
                          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
                          priority={index === 0}
                        />
                      </motion.div>

                      {/* Altta açıklama ve sağda fiyat */}
                      <div className="p-4 sm:p-5 bg-white border-t border-amber-200">
                        <div className="flex items-start justify-between gap-3">
                          <p className="text-amber-900 font-semibold leading-snug">
                            {menu.description}
                          </p>
                          <span className="text-amber-700 font-bold text-lg shrink-0">
                            {menu.price}₺
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
}
