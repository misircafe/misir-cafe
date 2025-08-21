"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigation = [
    { name: "Ana Sayfa", href: "/" },
    { name: "Menü", href: "/menu" },
    { name: "Canlı Müzik", href: "/live-music" },
  ];

  return (
    <div className="w-full flex justify-center">
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={cn(
          "fixed top-8 z-50 w-11/12 md:w-9/12 mx-auto transition-all duration-500 ease-out bg-white/50 backdrop-blur-lg rounded-4xl border border-black/50",
          pathname === "/menu" && "bg-gradient-to-b from-amber-50 to-orange-50"
        )}
      >
        <div className="max-w-full lg:max-w-11/12 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-32">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <motion.h1
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                className={`text-2xl font-bold font-serif text-amber-800`}
              >
                <Image
                  alt="Mısır Cafe Logo"
                  src="/logo.png"
                  width={200}
                  height={150}
                />
              </motion.h1>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1 w-full justify-center">
              {navigation.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className={cn(
                    "hover:scale-110 transition-all duration-300",
                    item.href === pathname && "scale-110"
                  )}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "relative px-4 py-2 text-md font-medium transition-all duration-300 ease-out group",
                      "after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:bg-gradient-to-r after:from-amber-500 after:to-orange-500 after:transition-all",
                      "after:duration-300 after:ease-out",
                      "hover:after:w-full hover:after:left-0 hover:text-amber-700 hover:after:scale-110",
                      "text-black",
                      item.href === pathname
                        ? "after:w-full after:left-0 text-amber-700"
                        : "after:w-0"
                    )}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Mobile menu button */}
            <motion.div
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="md:hidden"
            >
              <Button
                variant="ghost"
                size="sm"
                className="rounded-xl cursor-pointer text-amber-800 hover:bg-amber-50"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <motion.div
                  animate={{ rotate: isMenuOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isMenuOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </motion.div>
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/10 backdrop-blur-3xl"
              onClick={() => setIsMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Menu Content */}
            <div className="relative flex flex-col justify-center items-center h-full">
              <motion.nav
                className="space-y-6"
                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 50 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                {navigation.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        "relative block px-8 py-4 text-2xl font-medium text-center transition-all duration-300 ease-out",
                        "text-black",
                        pathname === item.href
                          ? "bg-gradient-to-r from-amber-400/20 to-orange-500/20 border border-amber-400 text-black shadow-lg shadow-amber-500/25 rounded-2xl"
                          : "border border-transparent rounded-2xl"
                      )}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
              </motion.nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
