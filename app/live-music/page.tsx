"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Music } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { toast } from "sonner";
import { getEvents } from "@/utils/supabase/functions/ui.functions";

const daysOfWeek = [
  { value: 0, label: "Pazartesi" },
  { value: 1, label: "Salı" },
  { value: 2, label: "Çarşamba" },
  { value: 3, label: "Perşembe" },
  { value: 4, label: "Cuma" },
  { value: 5, label: "Cumartesi" },
  { value: 6, label: "Pazar" },
];

export default function LiveMusicPage() {
  const eventsRef = useRef<HTMLDivElement>(null);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents();
        setEvents(data);
      } catch (error) {
        toast.error("Eventler alınırken bir hata oluştu");
      }
    };
    fetchEvents();
  }, []);

  const scrollToEvents = () => {
    eventsRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[100vh] flex items-center justify-center px-4 overflow-hidden bg-gray-900">
        <div className="absolute inset-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/bgvideo2.webm" type="video/webm" />
          </video>
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        <motion.div
          className="relative z-10 text-center text-white max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 font-serif">
            Canlı Müzik Geceleri
          </motion.h1>
          <motion.p className="text-lg sm:text-xl mb-8 leading-relaxed">
            Her hafta farklı sanatçılarımızla unutulmaz müzik deneyimi yaşayın
          </motion.p>
          <motion.div className="flex flex-col sm:flex-row gap-4 justify-center">
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

      {/* Events */}
      <div ref={eventsRef} className="w-11/12 mx-auto px-4 py-12">
        <motion.div
          className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {events
            .filter((item) => item.is_active)
            .map((event, index) => {
              const activeEvents = events.filter((e) => e.is_active);
              const isLastOddItem =
                activeEvents.length % 2 === 1 &&
                index === activeEvents.length - 1;

              return (
                <motion.div
                  key={event.id}
                  className={cn(
                    "flex justify-center",
                    isLastOddItem &&
                      "md:col-span-2 md:flex md:justify-center lg:col-span-1"
                  )}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  <Card className="pt-0 bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden flex flex-col w-full h-full max-w-md">
                    <div className="relative w-full aspect-[4/3]">
                      <Image
                        src={event.image_url}
                        alt={event.artist_name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-amber-800 mb-1">
                        {event.artist_name}
                      </CardTitle>
                      <div
                        className="text-sm text-gray-500 prose max-w-none"
                        dangerouslySetInnerHTML={{ __html: event.description }}
                      />
                    </CardHeader>

                    <CardContent className="pb-6">
                      <div className="space-y-3">
                        {event.date.map((d: any, i: number) => {
                          const dayLabel =
                            daysOfWeek.find((day) => day.value === d.day)
                              ?.label || "";
                          return (
                            <div
                              key={i}
                              className="flex items-center text-gray-600"
                            >
                              <Calendar className="w-4 h-4 mr-2" />
                              <span className="text-sm">
                                Her {dayLabel} - saat {d.clock}
                              </span>
                            </div>
                          );
                        })}
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
