"use client"

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Trash2, Calendar, Clock, Users } from 'lucide-react'

function EventsTab() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-amber-800">Etkinlik Yönetimi</h2>
          <p className="text-gray-600">Canlı müzik ve özel etkinlikleri yönetin</p>
        </div>
        <Button className="bg-amber-600 hover:bg-amber-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Yeni Etkinlik
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-amber-200 hover:shadow-lg transition-shadow bg-gradient-to-br from-amber-50 to-orange-50">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-amber-800 flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Cuma Akşamı Jazz
                </CardTitle>
                <CardDescription>Canlı jazz performansı</CardDescription>
              </div>
              <Badge className="bg-green-100 text-green-800">Aktif</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Her Cuma</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>20:00-23:00</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Users className="w-4 h-4 mr-2" />
                  <span>Max 50 kişi</span>
                </div>
                <div className="flex items-center text-amber-600 font-semibold">
                  <span>₺15 giriş</span>
                </div>
              </div>
              
              <div className="bg-white p-3 rounded-lg border border-amber-100">
                <p className="text-sm text-gray-600">
                  Profesyonel jazz müzisyenleri eşliğinde keyifli bir akşam geçirin.
                </p>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Bu hafta: 32 rezervasyon</span>
                <span className="text-green-600 font-medium">18 kişi kaldı</span>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" size="sm">
                  <Edit className="w-3 h-3 mr-1" />
                  Düzenle
                </Button>
                <Button variant="destructive" size="sm">
                  <Trash2 className="w-3 h-3 mr-1" />
                  Sil
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-amber-200 hover:shadow-lg transition-shadow bg-gradient-to-br from-orange-50 to-yellow-50">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-amber-800 flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Akustik Gece
                </CardTitle>
                <CardDescription>Solo akustik performans</CardDescription>
              </div>
              <Badge className="bg-blue-100 text-blue-800">Yaklaşan</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>15 Aralık</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>19:30-22:00</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Users className="w-4 h-4 mr-2" />
                  <span>Max 30 kişi</span>
                </div>
                <div className="flex items-center text-amber-600 font-semibold">
                  <span>₺20 giriş</span>
                </div>
              </div>
              
              <div className="bg-white p-3 rounded-lg border border-orange-100">
                <p className="text-sm text-gray-600">
                  Yerel sanatçı Ahmet Kaya'nın akustik gitar performansı.
                </p>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Rezervasyon: 18/30</span>
                <span className="text-orange-600 font-medium">12 kişi kaldı</span>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" size="sm">
                  <Edit className="w-3 h-3 mr-1" />
                  Düzenle
                </Button>
                <Button variant="destructive" size="sm">
                  <Trash2 className="w-3 h-3 mr-1" />
                  Sil
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-gray-200 hover:shadow-lg transition-shadow opacity-60">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-gray-600 flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Şiir Gecesi
                </CardTitle>
                <CardDescription>Aylık şiir okuma etkinliği</CardDescription>
              </div>
              <Badge className="bg-gray-100 text-gray-600">Tamamlandı</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center text-gray-500">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>28 Kasım</span>
                </div>
                <div className="flex items-center text-gray-500">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>20:00-22:30</span>
                </div>
                <div className="flex items-center text-gray-500">
                  <Users className="w-4 h-4 mr-2" />
                  <span>25 katılımcı</span>
                </div>
                <div className="flex items-center text-gray-500">
                  <span>Ücretsiz</span>
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <p className="text-sm text-gray-500">
                  Şiir severler için düzenlenen aylık buluşma etkinliği.
                </p>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Etkinlik tamamlandı</span>
                <span className="text-gray-400">25/25 katılım</span>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" size="sm" disabled>
                  <Edit className="w-3 h-3 mr-1" />
                  Düzenle
                </Button>
                <Button variant="destructive" size="sm">
                  <Trash2 className="w-3 h-3 mr-1" />
                  Sil
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default EventsTab