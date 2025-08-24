"use client"

import { getCurrentUser, loginUser } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import React, { useEffect, useState } from 'react'
import { LoginForm } from '@/components/login-form';
import { motion } from 'framer-motion';
import StorageUsage from '@/components/storage-usage';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import CategoriesTab from '@/components/admin/categories-tab';
import MenuTab from '@/components/admin/menu-tab';
import SpecialMenuTab from '@/components/admin/special-menu-tab';
import EventsTab from '@/components/admin/events-tab';

function Admin() {
    const [user,setUser]=useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
  getCurrentUser().then(user => {
    if(user){
      setUser(user)
    }
    setLoading(false);
  });
},[]);

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Yükleniyor...</p>
          </div>
        </div>
      );
    }

    // Show login form if user is not authenticated
     if (!user) {
       return <LoginForm onLogin={async (data) => {
         try {
           // Supabase ile giriş yap
           await loginUser(data.email, data.password);
           // Başarılı girişten sonra sayfayı yeniden yükle
           window.location.reload();
         } catch (error) {
           console.error('Login error:', error);
           // Hata durumunda LoginForm component'i kendi hata yönetimini yapacak
           throw error;
         }
       }} />;
     }

    // Show admin panel if user is authenticated
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <div className="container mx-auto px-4 py-8">
          <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-8">
            <h1 className='text-4xl font-bold text-amber-800 mb-2'>
              Admin Paneli
            </h1>
            <p className="text-gray-600">Menü ve etkinlik yönetimi</p>
          </div>

<StorageUsage />

        <Tabs defaultValue='categories' className='w-full mx-auto'>
          <TabsList className='grid w-full grid-cols-4 bg-amber-100 border border-amber-200'>
            <TabsTrigger 
              value='categories'
              className='data-[state=active]:bg-amber-600 data-[state=active]:text-white data-[state=active]:shadow-md text-amber-800 hover:bg-amber-200 transition-all duration-200'
            >
              Kategoriler
            </TabsTrigger>
            <TabsTrigger 
              value='menu'
              className='data-[state=active]:bg-amber-600 data-[state=active]:text-white data-[state=active]:shadow-md text-amber-800 hover:bg-amber-200 transition-all duration-200'
            >
              Menü
            </TabsTrigger>
            <TabsTrigger 
              value='special-menu'
              className='data-[state=active]:bg-amber-600 data-[state=active]:text-white data-[state=active]:shadow-md text-amber-800 hover:bg-amber-200 transition-all duration-200'
            >
              Özel Menü
            </TabsTrigger>
            <TabsTrigger 
              value='events'
              className='data-[state=active]:bg-amber-600 data-[state=active]:text-white data-[state=active]:shadow-md text-amber-800 hover:bg-amber-200 transition-all duration-200'
            >
              Etkinlikler
            </TabsTrigger>
          </TabsList>
          
          <div className='mt-6'>
            <TabsContent value='categories' className='mt-0'>
              <CategoriesTab />
            </TabsContent>
            <TabsContent value='menu' className='mt-0'>
              <MenuTab />
            </TabsContent>
            <TabsContent value='special-menu' className='mt-0'>
              <SpecialMenuTab />
            </TabsContent>
            <TabsContent value='events' className='mt-0'>
              <EventsTab />
            </TabsContent>
          </div>
        </Tabs>

        </motion.div>
        </div>
      </div>
    );
}

export default Admin