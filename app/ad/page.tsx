"use client"

import { getCurrentUser, loginUser } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import React, { useEffect, useState } from 'react'
import { LoginForm } from '@/components/login-form';

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
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-playfair text-primary mb-6">Yönetici Paneli</h1>
          <p className="text-muted-foreground">Hoş geldiniz, {user.email}</p>
          {/* TODO: Add admin panel content here */}
        </div>
      </div>
    );
}

export default Admin