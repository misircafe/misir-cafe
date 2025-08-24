"use client"

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

function CategoriesTab() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-amber-800">Kategoriler</h2>
          <p className="text-gray-600">Menü kategorilerini yönetin</p>
        </div>
        <Button className="bg-amber-600 hover:bg-amber-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Yeni Kategori
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="border-amber-200 hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-amber-800">Sıcak İçecekler</CardTitle>
            <CardDescription>Kahve, çay ve sıcak içecekler</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">12 ürün</span>
              <div className="space-x-2">
                <Button variant="outline" size="sm">Düzenle</Button>
                <Button variant="destructive" size="sm">Sil</Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-amber-200 hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-amber-800">Soğuk İçecekler</CardTitle>
            <CardDescription>Soğuk kahve, meyve suları ve smoothie'ler</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">8 ürün</span>
              <div className="space-x-2">
                <Button variant="outline" size="sm">Düzenle</Button>
                <Button variant="destructive" size="sm">Sil</Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-amber-200 hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-amber-800">Tatlılar</CardTitle>
            <CardDescription>Kekler, kurabiyeler ve tatlılar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">15 ürün</span>
              <div className="space-x-2">
                <Button variant="outline" size="sm">Düzenle</Button>
                <Button variant="destructive" size="sm">Sil</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default CategoriesTab