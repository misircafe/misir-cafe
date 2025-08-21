"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Music } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { cn } from "@/lib/utils";
import Image from "next/image";

const heroImages = [
  "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop",
];

const musicEvents = [
  {
    id: 1,
    date: "2024-01-15",
    day: "Pazartesi",
    time: "20:00",
    artist: "Elif Çağlar",
    image:
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=300&fit=crop",
  },
  {
    id: 2,
    date: "2024-01-17",
    day: "Çarşamba",
    time: "21:00",
    artist: "Jazz Trio İstanbul",
    image:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
  },
  {
    id: 3,
    date: "2024-01-19",
    day: "Cuma",
    time: "20:30",
    artist: "Mert Demir",
    image:
      "https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=400&h=300&fit=crop",
  },
];

export default function LiveMusicPage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const eventsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const scrollToEvents = () => {
    eventsRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
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
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 font-serif"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Canlı Müzik Geceleri
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg sm:text-xl mb-8 leading-relaxed"
          >
            Her hafta farklı sanatçılarımızla unutulmaz müzik deneyimi yaşayın
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              size="lg"
              onClick={scrollToEvents}
              className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Bu Haftanın Programı
            </Button>
          </motion.div>
        </motion.div>
      </section>

      <div ref={eventsRef} className="max-w-6xl mx-auto px-4 py-12">
        {/* Events Grid */}
        <motion.div
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {musicEvents.map((event, index) => {
            const isLastOddItem =
              musicEvents.length % 2 === 1 && index === musicEvents.length - 1;

            return (
              <motion.div
                key={event.id}
                className={cn(
                  isLastOddItem &&
                    "md:col-span-2 md:justify-self-center md:w-[calc((100%-1.5rem)/2)] lg:col-span-1 lg:w-auto"
                )}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <Card className="bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden p-0">
                  <div className="relative h-48 w-full">
                    <Image
                      src={event.image}
                      alt={event.artist}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-amber-800 mb-1">
                      {event.artist}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="pb-6">
                    <div className="space-y-3">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span className="text-sm">
                          {formatDate(event.date)} - {event.day}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        <span className="text-sm">{event.time}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom Info */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Card className="bg-white/90 backdrop-blur-sm max-w-2xl mx-auto border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <motion.div
                className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mb-6 mx-auto"
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                <Music className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className="text-2xl font-semibold text-amber-800 mb-4 font-serif">
                Sanatçı Olmak İster misiniz?
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Mısır Cafe'de performans sergilemek istiyorsanız, demo
                kayıtlarınızı bizimle paylaşın. Yetenekli sanatçıları keşfetmek
                ve desteklemek bizim tutkumuz.
              </p>
              <Button
                variant="outline"
                className="border-amber-600 text-amber-600 hover:bg-amber-50 bg-transparent px-6 py-3 transition-all duration-300 hover:scale-105"
              >
                Başvuru Yap: info@misircafe.com
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
