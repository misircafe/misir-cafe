"use client"

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Trash2, Star } from 'lucide-react'

function SpecialMenuTab() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-amber-800">Özel Menü</h2>
          <p className="text-gray-600">Günün özel menülerini ve kampanyalarını yönetin</p>
        </div>
        <Button className="bg-amber-600 hover:bg-amber-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Yeni Özel Menü
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-amber-200 hover:shadow-lg transition-shadow bg-gradient-to-br from-amber-50 to-orange-50">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-amber-500" />
                <div>
                  <CardTitle className="text-amber-800">Günün Özel Menüsü</CardTitle>
                  <CardDescription>Bugünün özel lezzeti</CardDescription>
                </div>
              </div>
              <Badge className="bg-amber-100 text-amber-800">Aktif</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg border border-amber-100">
                <h4 className="font-semibold text-amber-800 mb-2">Kahvaltı Seti</h4>
                <p className="text-sm text-gray-600 mb-2">Türk kahvesi + simit + reçel + tereyağı</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-amber-600">₺55</span>
                  <span className="text-sm text-gray-500 line-through">₺75</span>
                </div>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>Geçerlilik: Bugün</span>
                <span>12 sipariş</span>
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
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-orange-500" />
                <div>
                  <CardTitle className="text-amber-800">Hafta Sonu Özel</CardTitle>
                  <CardDescription>Cumartesi-Pazar özel fırsatı</CardDescription>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800">Aktif</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg border border-orange-100">
                <h4 className="font-semibold text-amber-800 mb-2">Brunch Menüsü</h4>
                <p className="text-sm text-gray-600 mb-2">Avokado toast + smoothie + mini tatlı</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-amber-600">₺85</span>
                  <span className="text-sm text-gray-500 line-through">₺110</span>
                </div>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>Geçerlilik: Hafta sonu</span>
                <span>8 sipariş</span>
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
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-gray-400" />
                <div>
                  <CardTitle className="text-gray-600">Akşam Menüsü</CardTitle>
                  <CardDescription>18:00-22:00 arası özel</CardDescription>
                </div>
              </div>
              <Badge className="bg-gray-100 text-gray-600">Pasif</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <h4 className="font-semibold text-gray-600 mb-2">Akşam Seti</h4>
                <p className="text-sm text-gray-500 mb-2">Espresso + tiramisu + kurabiye</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-500">₺65</span>
                  <span className="text-sm text-gray-400 line-through">₺85</span>
                </div>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-400">
                <span>Geçerlilik: Akşam saatleri</span>
                <span>0 sipariş</span>
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
      </div>
    </div>
  )
}

export default SpecialMenuTab