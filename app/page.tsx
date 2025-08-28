"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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
import { motion } from "framer-motion";
import Image from "next/image";
import Footer from "@/components/footer";
import { SpecialMenu } from "@/types/special-menu.type";
import { getSpecialMenus } from "@/utils/supabase/functions/ui.functions";
import { toast } from "sonner";

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
  const [specialMenu, setSpecialMenu] = useState<SpecialMenu[]>([]);

  useEffect(() => {
    const getSpecialMenu = async () => {
      try {
        const result = await getSpecialMenus();
        if (!result) {
          toast.error("Menü alınamadı");
          return;
        }
        setSpecialMenu(result);
      } catch (error) {
        toast.error("Menü alınamadı");
      }
    };
    getSpecialMenu();
  }, []);

  return (
    <div className="min-h-screen bg-white/50">
      <Header />

      <section className="relative min-h-[100vh] flex items-center justify-center px-4 overflow-hidden bg-gray-900">
        <div className="absolute inset-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/bgvideo1.webm" type="video/webm" />
          </video>
          <div className="absolute inset-0 bg-black/60"></div>
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
                  href="https://www.instagram.com/misircafe/?igsh=eTl5NjFwZ2xnMzIw"
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

          <div className="relative overflow-hidden">
            <motion.div
              className="flex gap-8"
              animate={{ x: ["0%", "-100%"] }}
              transition={{
                duration: 30, // hızını ayarlayabilirsin
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {[...specialMenu, ...specialMenu, ...specialMenu].map(
                (item, index) => (
                  <motion.div
                    key={`${item.id}-${index}`}
                    whileHover={{ y: -10, scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="flex-shrink-0 border-amber-200 border-2 rounded-2xl"
                  >
                    <div className="bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 border-0 shadow-lg rounded-t-2xl overflow-hidden w-64 h-64">
                      <Image
                        alt={item.name}
                        src={item.image_url}
                        width={256}
                        height={256}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4 w-fit max-w-[256px] flex justify-between">
                      <p className="text-amber-900 font-semibold max-w-8/12 leading-snug">
                        {item.name}
                      </p>
                      <span className="text-amber-700 font-bold text-lg shrink-0">
                        {item.price}₺
                      </span>
                    </div>
                  </motion.div>
                )
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
            className="text-center mb-2 sm:mb-4 lg:mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold font-serif">
              Bize Ulaşın
            </h2>
          </motion.div>

          {/* Harita Bölümü */}
          <motion.div
            className="w-full h-96 rounded-2xl overflow-hidden shadow-2xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d765.024779456248!2d32.85413657590099!3d39.91679802222887!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14d34faa24408aa7%3A0xe6db11dd6d3b6fc5!2zTcSxc8SxciBDYWZl!5e0!3m2!1str!2str!4v1755368607626!5m2!1str!2str"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mısır Cafe Konum"
            />
          </motion.div>

          {/* İletişim Bilgileri - Harita Altında Tek Satırda */}
          <motion.div
            className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-4 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="flex flex-col md:flex-row items-center justify-center gap-2">
              <MapPin className="min-w-5 min-h-5" />
              <span className="text-amber-100">
                Meşrutiyet, Karanfil Sk. No:34/A, 06420 Çankaya/Ankara
              </span>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-center gap-2">
              <Phone className="w-5 h-5" />
              <span className="text-amber-100">+90 216 555 0123</span>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-center gap-2">
              <Mail className="w-5 h-5" />
              <span className="text-amber-100">info@misircafe.com</span>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-center gap-2">
              <Clock className="w-5 h-5" />
              <span className="text-amber-100">08:00 - 24:00</span>
            </div>
          </motion.div>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
}
