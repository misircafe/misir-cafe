"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Coffee,
  Cake,
  Leaf,
  Instagram,
} from "lucide-react";
import Link from "next/link";
import Header from "@/components/header";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const heroImages = ["/background.jpg", "/background2.jpg"];

const specialMenuItems = [
  {
    id: 1,
    name: "Özel Karışım Espresso",
    price: 35,
    category: "Kahveler",
    description: "Etiyopya ve Kolombiya çekirdekleri karışımı",
    image: "/special-menu.png",
    icon: Coffee,
    gradient: "from-amber-400 to-amber-600",
  },
  {
    id: 2,
    name: "Ev Yapımı Tiramisu",
    price: 40,
    category: "Tatlılar",
    description: "Geleneksel İtalyan tarifi ile hazırlanmış",
    image: "/special-menu2.png",
    icon: Cake,
    gradient: "from-pink-400 to-rose-500",
  },
  {
    id: 3,
    name: "Organik Avokado Toast",
    price: 45,
    category: "Atıştırmalıklar",
    description: "Taze avokado, cherry domates ve feta peyniri",
    image: "/special-menu3.png",
    icon: Leaf,
    gradient: "from-green-400 to-emerald-500",
  },
  {
    id: 4,
    name: "Buzlu Karamel Macchiato",
    price: 38,
    category: "Soğuk İçecekler",
    description: "Ev yapımı karamel sosu ile",
    image: "/special-menu4.png",
    icon: Coffee,
    gradient: "from-blue-400 to-cyan-500",
  },
  {
    id: 5,
    name: "Çikolatalı Brownie",
    price: 32,
    category: "Tatlılar",
    description: "Belçika çikolatası ile hazırlanmış",
    image: "/special-menu5.png",
    icon: Cake,
    gradient: "from-purple-400 to-indigo-500",
  },
];

export default function HomePage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white/50">
      <Header />

      <section className="relative min-h-[100vh] flex items-center justify-center px-4 overflow-hidden bg-gray-900">
        <div className="absolute inset-0">
          {heroImages.map((image, index) => (
            <motion.div
              key={index}
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url('${image}')`,
              }}
              initial={{ opacity: 0 }}
              animate={{
                opacity: currentImageIndex === index ? 1 : 0,
              }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            >
              <div className="absolute inset-0 bg-black/50"></div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="relative z-10 text-center text-white max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.h1
            className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6 font-serif leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Mısır Cafe
          </motion.h1>
          <motion.p
            className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 leading-relaxed px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Piramidin gölgesinde müzik ve nargilenin büyülü dansı, kahvenin
            sıcaklığında buluşan ruhlar
            {/*  Antik piramitlerin fısıltıları eşliğinde, nargile dumanının çizdiği hikayeler ve kahvenin sonsuz yolculuğu
             Zamansız piramitlerin enerjisiyle, müziğin ritmi ve nargilenin huzuru kahve aromasında birleşiyor
             Çöl rüzgarının getirdiği melodiler, piramitlerin sırları ve nargilenin mistik dumanında saklı lezzetler
             Piramidin sessizliğinde yankılanan müzik, nargilenin sıcak nefesi ve kahvenin kalbimizi ısıtan hikayesi
             Firavunların topraklarında yankılanan ezgiler, nargilenin kadim ritüeli ve kahvenin efsanevi aroması
             Nil'in sessiz akışı gibi akan müzik, nargilenin huzur veren dumanı ve kahvenin ruhsal yolculuğu
             Sfenksin bilmecelerinden müziğin cevaplarına, nargilenin yolculuğundan kahvenin keşfine uzanan macera
             Kralların saraylarından gelen melodiler, nargilenin asil dumanı ve kahvenin aristokrat lezzeti
             Piramitlerin altında kurulan dostluklar, nargilenin paylaşılan anları ve kahvenin birleştirici gücü */}
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                asChild
                size="lg"
                className="bg-amber-600 hover:bg-amber-700 text-white px-6 sm:px-8 py-3"
              >
                <Link href="/menu">Menümüzü İnceleyin</Link>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white px-6 sm:px-8 py-3 bg-transparent"
              >
                <Link href="/live-music">Canlı Müzik</Link>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 px-4 sm:px-6 py-3 bg-white/5 backdrop-blur-sm flex items-center gap-2 transition-all duration-300"
              >
                <Link
                  href="https://instagram.com/misircafe"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2"
                >
                  <Instagram className="w-4 h-4" />
                  Instagram
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      <section className="py-12 sm:py-16 lg:py-20 px-4 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-8 sm:mb-12 lg:mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-amber-800 mb-3 sm:mb-4 font-serif">
              Özel Menümüz
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Özenle seçilmiş kahve çekirdekleri ve ev yapımı lezzetlerimizle
              unutulmaz bir deneyim yaşayın
            </p>
          </motion.div>

          <div className="relative">
            <motion.div
              className="flex gap-8"
              animate={{ x: [0, -(280 * specialMenuItems.length)] }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
                repeatType: "loop",
              }}
              whileHover={{ animationPlayState: "paused" }}
            >
              {[...Array(4)].flatMap((_, setIndex) =>
                specialMenuItems.map((item, itemIndex) => {
                  return (
                    <motion.div
                      key={`${setIndex}-${item.id}`}
                      whileHover={{ y: -10, scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 border-0 shadow-lg flex-shrink-0 rounded-2xl overflow-hidden w-64 h-64">
                        <Image
                          alt={item.description}
                          src={item.image}
                          width={256}
                          height={256}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </motion.div>
                  );
                })
              )}
            </motion.div>
          </div>
        </div>
      </section>

      <motion.section
        id="contact"
        className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-amber-800 to-amber-900 text-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            className="text-center mb-8 sm:mb-12 lg:mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4 font-serif">
              Bize Ulaşın
            </h2>
            <p className="text-lg sm:text-xl text-amber-100 px-4">
              Sorularınız için bizimle iletişime geçin
            </p>
          </motion.div>

          <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: MapPin,
                title: "Adres",
                content: "Botanik Sokak No:15\nKadıköy, İstanbul",
              },
              { icon: Phone, title: "Telefon", content: "+90 216 555 0123" },
              { icon: Mail, title: "E-posta", content: "info@misircafe.com" },
              {
                icon: Clock,
                title: "Çalışma Saatleri",
                content: "Pazartesi - Pazar\n08:00 - 24:00",
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                className="text-center p-4"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <motion.div
                  className="w-16 h-16 bg-amber-700/50 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <item.icon className="w-8 h-8" />
                </motion.div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-amber-100 text-sm leading-relaxed whitespace-pre-line">
                  {item.content}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.footer
        className="bg-amber-950 text-amber-100 py-8 sm:py-12 border-t border-amber-800"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <motion.h3
              className="text-3xl sm:text-4xl font-bold text-white mb-4 font-serif"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Mısır Cafe
            </motion.h3>
            <p className="text-lg sm:text-xl text-amber-200 mb-6">
              Doğanın büyüsü ve kahvenin aromasının buluştuğu özel mekan
            </p>
            <div className="flex flex-col sm:flex-col items-center justify-center gap-4 text-sm">
              <div>
                <p>© 2024 Mısır Cafe. Tüm hakları saklıdır.</p>
              </div>
              <p>
                Designed by{" "}
                <motion.a
                  href="mailto:enesseval@outlook.com"
                  className="text-amber-300 hover:text-amber-200 transition-colors underline decoration-dotted"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  enesseval
                </motion.a>
              </p>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
