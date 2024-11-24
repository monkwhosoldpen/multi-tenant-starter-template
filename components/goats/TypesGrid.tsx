'use client';

import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
}

interface TypesGridProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export function TypesGrid({ categories, selectedCategory, onSelectCategory }: TypesGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {categories.map((category) => (
        <div
          key={category.id}
          className={cn(
            "cursor-pointer rounded-lg border p-4 hover:border-blue-500 transition-colors",
            "flex flex-col items-center justify-center text-center space-y-2",
            selectedCategory === category.id 
              ? "border-blue-500 bg-blue-50 text-blue-700" 
              : "border-gray-200 hover:bg-gray-50"
          )}
          onClick={() => onSelectCategory(category.id)}
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <span className="text-2xl font-semibold text-gray-700">
              {category.name.charAt(0)}
            </span>
          </div>
          <h3 className="font-medium">{category.name}</h3>
          <p className="text-sm text-gray-500">
            {`${category.name} Subgroup`}
          </p>
        </div>
      ))}
    </div>
  );
} 