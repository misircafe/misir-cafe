"use client"

// React ve gerekli UI component'leri import ediyoruz
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { z } from 'zod'; // Form validasyonu için Zod kütüphanesi
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'; // İkonlar için Lucide React
import { loginUser } from '@/utils/supabase/client'; // Supabase authentication fonksiyonu

/**
 * Zod validation schema - Form verilerinin doğrulanması için kullanılır
 * Email: Geçerli email formatı kontrolü
 * Password: Minimum 6 karakter kontrolü
 * 
 * Gelecekteki geliştirmeler için:
 * - Şifre karmaşıklığı kuralları eklenebilir (büyük harf, sayı, özel karakter)
 * - Email domain kısıtlamaları eklenebilir
 * - Captcha doğrulaması eklenebilir
 */
const loginSchema = z.object({
  email: z.string().email('Geçerli bir e-posta adresi giriniz'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır')
});

// Zod schema'dan TypeScript tipini çıkarıyoruz
type LoginFormData = z.infer<typeof loginSchema>;

/**
 * LoginForm component'inin props interface'i
 * onLogin: Opsiyonel login callback fonksiyonu
 * 
 * Gelecekteki geliştirmeler için eklenebilecek props:
 * - theme?: 'light' | 'dark' - Tema seçimi
 * - redirectUrl?: string - Başarılı girişten sonra yönlendirilecek URL
 * - allowSignup?: boolean - Kayıt ol linkini göster/gizle
 * - socialLogin?: boolean - Sosyal medya giriş seçenekleri
 * - forgotPasswordUrl?: string - Şifremi unuttum linki
 */
interface LoginFormProps {
  onLogin?: (data: LoginFormData) => Promise<void>;
}

/**
 * LoginForm Component - Kullanıcı giriş formu
 * 
 * Bu component şu özellikleri sağlar:
 * - Zod ile form validasyonu
 * - Responsive tasarım
 * - Şifre göster/gizle özelliği
 * - Loading durumu yönetimi
 * - Gerçek zamanlı hata mesajları
 * 
 * Gelecekteki geliştirmeler için:
 * - Remember me checkbox eklenebilir
 * - Biometric authentication (Touch ID, Face ID) desteği
 * - Multi-factor authentication (MFA) entegrasyonu
 * - Rate limiting ve brute force koruması
 * - Session timeout yönetimi
 */
export function LoginForm({ onLogin }: LoginFormProps) {
  // Form verilerini tutan state - email ve password alanları
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });
  
  // Validasyon hatalarını tutan state - field adı -> hata mesajı mapping
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Form submit edilirken loading durumunu kontrol eden state
  const [isLoading, setIsLoading] = useState(false);
  
  // Şifre alanının görünürlüğünü kontrol eden state
  const [showPassword, setShowPassword] = useState(false);

  /**
   * Input değişikliklerini handle eden fonksiyon
   * @param field - Değişen form alanının adı (email veya password)
   * @param value - Yeni değer
   * 
   * Gelecekteki geliştirmeler için:
   * - Debounced validation eklenebilir (kullanıcı yazmayı bıraktıktan sonra validate et)
   * - Auto-complete önerileri eklenebilir
   * - Input masking (telefon, kredi kartı formatları) eklenebilir
   */
  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    // Form state'ini güncelle
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Kullanıcı yazmaya başladığında ilgili alanın hatasını temizle
    // Bu, gerçek zamanlı kullanıcı deneyimi sağlar
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  /**
   * Form submit işlemini handle eden async fonksiyon
   * @param e - React form event
   * 
   * İşlem adımları:
   * 1. Default form submit davranışını engelle
   * 2. Loading durumunu aktif et
   * 3. Mevcut hataları temizle
   * 4. Zod ile form verilerini validate et
   * 5. Başarılıysa onLogin callback'ini çağır
   * 6. Hata varsa kullanıcıya göster
   * 7. Loading durumunu kapat
   * 
   * Gelecekteki geliştirmeler için:
   * - Retry mekanizması eklenebilir
   * - Analytics tracking eklenebilir (login attempt, success/failure)
   * - Progressive enhancement (offline support)
   * - Security headers ve CSRF protection
   * - Login attempt rate limiting
   */
  const handleSubmit = async (e: React.FormEvent) => {
    // Sayfanın yeniden yüklenmesini engelle
    e.preventDefault();
    
    // Loading durumunu başlat
    setIsLoading(true);
    
    try {
      // Zod schema ile form verilerini validate et
      // Bu adım client-side validation sağlar
      loginSchema.parse(formData);
      
      // Validation başarılıysa hataları temizle
      setErrors({});
      
      // Parent component'ten gelen onLogin callback'ini çağır
      // Bu genellikle Supabase auth veya başka bir auth service ile giriş yapar
      if (onLogin) {
        await onLogin(formData);
      } else {
        // Supabase ile gerçek authentication işlemi
        await loginUser(formData.email, formData.password);
        
        // Başarılı girişten sonra sayfayı yeniden yükle
        // Bu sayede session kontrolü tekrar yapılacak ve admin paneli açılacak
        window.location.reload();
      }
      
    } catch (error) {
      // Zod validation hatalarını yakala ve kullanıcı dostu mesajlara çevir
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<LoginFormData> = {};
        error.issues.forEach((err: z.ZodIssue) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof LoginFormData] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
      // Diğer hatalar (network, auth errors) için
      // Parent component'te handle edilmeli
    } finally {
      // Her durumda loading durumunu kapat
      setIsLoading(false);
    }
  };

  return (
    // Ana container - Full screen, centered layout, gradient background
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 p-4">
      {/* Login Card - Glassmorphism effect ile modern görünüm */}
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/95 backdrop-blur-sm">
        {/* Card Header - Başlık ve açıklama */}
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold text-amber-800">
            Mısır Cafe
          </CardTitle>
          <CardDescription className="text-amber-600">
            Yönetici Paneli Girişi
          </CardDescription>
        </CardHeader>
        
        {/* Card Content - Form alanları */}
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input Field */}
            <div className="space-y-2">
              <div className="relative">
                {/* Email ikonu - Sol tarafta konumlandırılmış */}
                <Mail className="absolute left-3 top-3 h-4 w-4 text-amber-500" />
                <Input
                  type="email"
                  placeholder="E-posta adresiniz"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`pl-10 border-amber-200 focus:border-amber-400 focus:ring-amber-400 ${
                    errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                  }`}
                  disabled={isLoading}
                />
              </div>
              {/* Email validation error message */}
              {errors.email && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Input Field */}
            <div className="space-y-2">
              <div className="relative">
                {/* Lock ikonu - Sol tarafta konumlandırılmış */}
                <Lock className="absolute left-3 top-3 h-4 w-4 text-amber-500" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Şifreniz"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`pl-10 pr-10 border-amber-200 focus:border-amber-400 focus:ring-amber-400 ${
                    errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                  }`}
                  disabled={isLoading}
                />
                {/* Password visibility toggle button - Sağ tarafta konumlandırılmış */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-amber-500 hover:text-amber-600 transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {/* Password validation error message */}
              {errors.password && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Submit Button - Loading state ile birlikte */}
            <Button
              type="submit"
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? (
                // Loading durumu - Spinner ve metin
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Giriş yapılıyor...
                </div>
              ) : (
                // Normal durum - Sadece metin
                'Giriş Yap'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// Default export - Bu component'i import ederken kullanılacak
// Gelecekteki geliştirmeler için:
// - Named export'lar eklenebilir (LoginFormProps, loginSchema)
// - Component'in farklı varyantları export edilebilir
export default LoginForm;