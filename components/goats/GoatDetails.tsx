'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GoatCategories, GoatCategory, generateMockGoatCategory } from "@/lib/mockGoatsData";
import { useState, useEffect } from "react";
import { SubgroupsTable } from "./SubgroupsTable";
import { Goat, GoatCategoryData } from "@/lib/types/goat";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface GoatDetailsProps {
  initialGoat?: Goat;
}

export function GoatDetails({ initialGoat }: GoatDetailsProps) {
  const [selectedGoatCategory, setSelectedGoatCategory] = useState<GoatCategory>('technology');
  const [selectedGoat, setSelectedGoat] = useState<Goat | null>(null);
  const [categoryData, setCategoryData] = useState<GoatCategoryData | null>(null);

  useEffect(() => {
    // Load initial category data
    const data = generateMockGoatCategory(selectedGoatCategory);
    setCategoryData(data);
    // Set initial goat (either provided or first in category)
    setSelectedGoat(initialGoat || data.goats[0]);
  }, [initialGoat]);

  const handleCategoryChange = (category: GoatCategory) => {
    setSelectedGoatCategory(category);
    const newCategoryData = generateMockGoatCategory(category);
    setCategoryData(newCategoryData);
    setSelectedGoat(newCategoryData.goats[0]);
  };

  const handleGoatChange = (goatUsername: string) => {
    const goat = categoryData?.goats.find(g => g.username === goatUsername);
    if (goat) {
      setSelectedGoat(goat);
    }
  };

  if (!selectedGoat || !categoryData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="w-full max-w-md">
          <label className="text-sm font-medium mb-2 block text-gray-700">
            Goat Category
          </label>
          <Select
            value={selectedGoatCategory}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(GoatCategories).map((category) => (
                <SelectItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full max-w-md">
          <label className="text-sm font-medium mb-2 block text-gray-700">
            Select Goat
          </label>
          <Select
            value={selectedGoat.username}
            onValueChange={handleGoatChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Goat" />
            </SelectTrigger>
            <SelectContent>
              {categoryData.goats.map((goat) => (
                <SelectItem key={goat.username} value={goat.username}>
                  {goat.metadata_with_translations.name.english}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Goat Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={selectedGoat.img_url} />
              <AvatarFallback>{selectedGoat.username[0]}</AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">
                {selectedGoat.metadata_with_translations.name.english}
              </h3>
              <p className="text-sm text-gray-500">
                {selectedGoat.metadata_with_translations.bio.english}
              </p>
              <div className="flex gap-2">
                {selectedGoat.verified && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    Verified
                  </span>
                )}
                <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                  {selectedGoatCategory}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <SubgroupsTable
        goatId={selectedGoat.username}
        ownerUsername={selectedGoat.username}
        selectedCategory={selectedGoatCategory}
      />
    </div>
  );
} 