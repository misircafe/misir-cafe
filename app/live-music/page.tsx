"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Music } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Image from "next/image";
import { toast } from "sonner";
import { getEvents } from "@/utils/supabase/functions/ui.functions";

// Tarihleri karşılaştırıp en yakın 3 tarihi seç
const getSortedDates = (dates: { start: string; end: string }[]) => {
  const now = new Date();
  return dates
    .map((d) => ({
      ...d,
      startDate: new Date(d.start),
      endDate: new Date(d.end),
    }))
    .filter((d) => d.endDate >= now) // Bitiş zamanı geçmemiş etkinlikler
    .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
    .slice(0, 3);
};

// Şu anda canlı mı kontrolü
const isLiveNow = (dates: { start: string; end: string }[]) => {
  const now = new Date();
  return dates.some((d) => {
    const start = new Date(d.start);
    const end = new Date(d.end);
    return start <= now && now <= end;
  });
};

// Tarih formatlama
const formatDateRange = (start: Date, end: Date) => {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(start.getDate())}.${pad(
    start.getMonth() + 1
  )}.${start.getFullYear()} ${pad(start.getHours())}:${pad(
    start.getMinutes()
  )}/${pad(end.getHours())}:${pad(end.getMinutes())}`;
};

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
            .map((event) => {
              const upcomingDates = getSortedDates(event.date);
              if (upcomingDates.length === 0) return null;

              const firstDate = upcomingDates[0];
              const otherDates = upcomingDates.slice(1);
              const liveNow = isLiveNow(event.date);

              return (
                <motion.div
                  key={event.id}
                  className="flex justify-center"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  <Card className="relative pt-0 bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden flex flex-col w-full h-full max-w-md">
                    {/* LIVE Badge */}
                    {liveNow && (
                      <div className="absolute top-2 right-2 px-2 py-1 rounded-md bg-red-600 text-white font-bold text-xs flex items-center gap-1 animate-pulse z-10">
                        <Music className="w-3 h-3 text-white animate-pulse" />
                        LIVE
                      </div>
                    )}

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
                      <div className="space-y-2">
                        {/* En yakın tarih öne çıkmış */}
                        <div className="flex items-center gap-2 px-3 py-1 rounded-md font-semibold bg-amber-600 text-white">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {formatDateRange(
                              new Date(firstDate.start),
                              new Date(firstDate.end)
                            )}
                          </span>
                        </div>

                        {/* Diğer 2 tarih */}
                        {otherDates.map((d, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 px-3 py-1 rounded-md font-medium text-gray-600 bg-white/0"
                          >
                            <Calendar className="w-4 h-4" />
                            <span>
                              {formatDateRange(
                                new Date(d.start),
                                new Date(d.end)
                              )}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
