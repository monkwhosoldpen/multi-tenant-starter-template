'use client';

import { cn } from "@/lib/utils";
import useSuperAdmin from "@/lib/usesuperamin";
import { useEffect, useState } from "react";

interface Category {
  id: string;
  name: string;
}

interface TypesGridProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  ownerUsername: string;
}

interface SubgroupStatus {
  [key: string]: {
    exists: boolean;
    is_published: boolean;
  };
}

export function TypesGrid({ categories, selectedCategory, onSelectCategory, ownerUsername }: TypesGridProps) {
  const [subgroupStatuses, setSubgroupStatuses] = useState<SubgroupStatus>({});
  const { fetchSubgroups, createSubgroup, updateSubgroup } = useSuperAdmin();

  useEffect(() => {
    const loadSubgroups = async () => {
      const { data: subgroups } = await fetchSubgroups(ownerUsername);
      const statuses: SubgroupStatus = {};
      
      // Initialize all categories as non-existent
      categories.forEach(category => {
        statuses[category.id] = { exists: false, is_published: false };
      });

      // Update with existing subgroups
      subgroups?.forEach(subgroup => {
        statuses[subgroup.type] = {
          exists: true,
          is_published: subgroup.is_published
        };
        
        // Automatically select if published
        if (subgroup.is_published) {
          onSelectCategory(subgroup.type);
        }
      });

      setSubgroupStatuses(statuses);
    };

    if (ownerUsername) {
      loadSubgroups();
    }
  }, [ownerUsername, categories, fetchSubgroups, onSelectCategory]);

  const handleCardClick = async (categoryId: string) => {
    const isCurrentlySelected = selectedCategory === categoryId;
    
    if (isCurrentlySelected) {
      // Unselecting - set is_published to false
      onSelectCategory(''); // Clear selection
      if (subgroupStatuses[categoryId]?.exists) {
        const newStatus = false; // Set published to false
        setSubgroupStatuses(prev => ({
          ...prev,
          [categoryId]: { ...prev[categoryId], is_published: newStatus }
        }));
        
        // Update subgroup in database
        await updateSubgroup(ownerUsername, categoryId, { is_published: false });
      }
    } else {
      // Selecting - set is_published to true
      onSelectCategory(categoryId);
      if (subgroupStatuses[categoryId]?.exists) {
        const newStatus = true; // Set published to true
        setSubgroupStatuses(prev => ({
          ...prev,
          [categoryId]: { ...prev[categoryId], is_published: newStatus }
        }));
        
        // Update subgroup in database
        await updateSubgroup(ownerUsername, categoryId, { is_published: true });
      }
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {categories.map((category) => {
        const status = subgroupStatuses[category.id];
        const exists = status?.exists;
        const isPublished = status?.is_published;

        return (
          <div
            key={category.id}
            className={cn(
              "cursor-pointer rounded-lg border p-4 transition-all",
              "flex flex-col items-center justify-center text-center space-y-2",
              selectedCategory === category.id 
                ? "border-blue-500 bg-blue-50 text-blue-700" 
                : exists
                  ? isPublished
                    ? "border-green-200 bg-green-50 hover:border-green-500"
                    : "border-gray-200 hover:border-blue-500"
                  : "border-gray-200 hover:border-blue-500"
            )}
            onClick={() => handleCardClick(category.id)}
          >
            <div className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center",
              exists
                ? isPublished
                  ? "bg-gradient-to-br from-green-100 to-green-200"
                  : "bg-gradient-to-br from-gray-100 to-gray-200"
                : "bg-gradient-to-br from-gray-100 to-gray-200"
            )}>
              <span className={cn(
                "text-2xl font-semibold",
                exists
                  ? isPublished
                    ? "text-green-700"
                    : "text-gray-700"
                  : "text-gray-700"
              )}>
                {category.name.charAt(0)}
              </span>
            </div>
            <h3 className="font-medium">{category.name}</h3>
            <p className="text-sm text-gray-500">
              {exists 
                ? isPublished 
                  ? "Published Subgroup"
                  : "Unpublished Subgroup"
                : "Create Subgroup"}
            </p>
          </div>
        );
      })}
    </div>
  );
} 