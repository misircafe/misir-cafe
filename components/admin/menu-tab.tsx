"use client"

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Trash2 } from 'lucide-react'

function MenuTab() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-amber-800">Menü Yönetimi</h2>
          <p className="text-gray-600">Menü öğelerini ekleyin, düzenleyin ve yönetin</p>
        </div>
        <Button className="bg-amber-600 hover:bg-amber-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Yeni Ürün Ekle
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="border-amber-200 hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-amber-800">Türk Kahvesi</CardTitle>
                <CardDescription>Geleneksel Türk kahvesi</CardDescription>
              </div>
              <Badge className="bg-green-100 text-green-800">Aktif</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Kategori:</span>
                <span className="text-sm font-medium">Sıcak İçecekler</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Fiyat:</span>
                <span className="text-sm font-medium text-amber-600">₺25</span>
              </div>
              <div className="flex justify-end space-x-2 pt-2">
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
        
        <Card className="border-amber-200 hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-amber-800">Cappuccino</CardTitle>
                <CardDescription>İtalyan usulü cappuccino</CardDescription>
              </div>
              <Badge className="bg-green-100 text-green-800">Aktif</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Kategori:</span>
                <span className="text-sm font-medium">Sıcak İçecekler</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Fiyat:</span>
                <span className="text-sm font-medium text-amber-600">₺35</span>
              </div>
              <div className="flex justify-end space-x-2 pt-2">
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
        
        <Card className="border-amber-200 hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-amber-800">Cheesecake</CardTitle>
                <CardDescription>Ev yapımı cheesecake</CardDescription>
              </div>
              <Badge className="bg-yellow-100 text-yellow-800">Stokta Az</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Kategori:</span>
                <span className="text-sm font-medium">Tatlılar</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Fiyat:</span>
                <span className="text-sm font-medium text-amber-600">₺45</span>
              </div>
              <div className="flex justify-end space-x-2 pt-2">
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

export default MenuTab