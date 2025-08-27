"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { motion } from "framer-motion";
import { Database } from "lucide-react";
import { getImagesSize } from "@/utils/supabase/functions/images.functions";
import { Skeleton } from "@/components/ui/skeleton";

function StorageUsage() {
  const [bucketSize, setBucketSize] = useState<number | null>(null);
  const limit = 1024; // MB

  useEffect(() => {
    const fetchImagesSize = async () => {
      const sizeBytes = await getImagesSize();
      const sizeMB = Number(sizeBytes / (1024 * 1024)); // MB
      setBucketSize(sizeMB);
    };
    fetchImagesSize();
  }, []);

  const usagePercentage =
    bucketSize !== null ? Math.min((bucketSize / limit) * 100, 100) : 0;

  const getUsageColor = (percentage: number) => {
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
            {bucketSize !== null ? (
              <>
                {bucketSize.toFixed(2)} MB / {limit} MB
              </>
            ) : (
              <Skeleton className="h-4 w-20" />
            )}
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
        <div className="gap-4 text-sm flex items-center justify-center">
          <div className="text-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mx-auto mb-1"></div>
            <div className="text-gray-600">Resimler</div>
            <div className="font-medium">
              {bucketSize !== null ? (
                bucketSize.toFixed(2) + " MB"
              ) : (
                <Skeleton className="h-4 w-12" />
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default StorageUsage;
