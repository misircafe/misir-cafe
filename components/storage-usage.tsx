import React from 'react'
import { Card, CardContent } from './ui/card';
import { motion } from 'framer-motion';
import { Database } from 'lucide-react';

function StorageUsage() {

    const storageData = {
    used: 2.3, // GB
    total: 10, // GB
    breakdown: {
      images: 1.8,
      documents: 0.3,
      other: 0.2,
    },
  };

  const usagePercentage = (storageData.used / storageData.total) * 100;
  const getUsageColor = (percentage) => {
    if (percentage < 50) return "from-green-500 to-emerald-500";
    if (percentage < 80) return "from-yellow-500 to-orange-500";
    return "from-red-500 to-pink-500";
  };

  return (
    <Card className="mb-6 bg-white/80 backdrop-blur-sm border border-amber-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-amber-600" />
            <h3 className="font-semibold text-amber-800">
              Supabase Storage Kullanımı
            </h3>
          </div>
          <div className="text-sm text-gray-600">
            {storageData.used} GB / {storageData.total} GB
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <motion.div
            className={`h-3 rounded-full bg-gradient-to-r ${getUsageColor(
              usagePercentage
            )}`}
            initial={{ width: 0 }}
            animate={{ width: `${usagePercentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>

        {/* Storage Breakdown */}
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mx-auto mb-1"></div>
            <div className="text-gray-600">Resimler</div>
            <div className="font-medium">{storageData.breakdown.images} GB</div>
          </div>
          <div className="text-center">
            <div className="w-3 h-3 bg-purple-500 rounded-full mx-auto mb-1"></div>
            <div className="text-gray-600">Dökümanlar</div>
            <div className="font-medium">
              {storageData.breakdown.documents} GB
            </div>
          </div>
          <div className="text-center">
            <div className="w-3 h-3 bg-gray-500 rounded-full mx-auto mb-1"></div>
            <div className="text-gray-600">Diğer</div>
            <div className="font-medium">{storageData.breakdown.other} GB</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default StorageUsage