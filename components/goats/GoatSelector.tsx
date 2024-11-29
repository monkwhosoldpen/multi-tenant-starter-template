'use client';

import { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";
import { Goat } from '@/lib/types/goat';
import useSuperAdmin from '@/lib/mock-provider';

interface GoatSelectorProps {
  onSelect: (goat: Goat) => void;
}

export const GoatSelector = ({ onSelect }: GoatSelectorProps) => {
  const [goats, setGoats] = useState<Goat[]>([]);
  const [loading, setLoading] = useState(true);
  const { fetchGoats } = useSuperAdmin();

  useEffect(() => {
    const loadGoats = async () => {
      try {
        const { data, error } = await fetchGoats();
        if (error) throw error;
        setGoats(data || []);
        
        // Auto-select ElonMusk if available
        const elonMusk = data?.find(g => g.username === 'ElonMusk');
        if (elonMusk) {
          onSelect(elonMusk);
        }
      } catch (err) {
        console.error('Error loading goats:', err);
      } finally {
        setLoading(false);
      }
    };

    loadGoats();
  }, [fetchGoats, onSelect]);

  if (loading) {
    return (
      <div className="h-10 w-[200px] rounded-md border border-input bg-background px-3 py-2 flex items-center">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="ml-2 text-sm text-muted-foreground">Loading...</span>
      </div>
    );
  }

  return (
    <Select
      defaultValue="ElonMusk"
      onValueChange={(value) => {
        const selectedGoat = goats.find(g => g.username === value);
        if (selectedGoat) onSelect(selectedGoat);
      }}
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select a goat" />
      </SelectTrigger>
      <SelectContent>
        {goats.map((goat) => (
          <SelectItem
            key={goat.username}
            value={goat.username}
            className="flex items-center gap-2"
          >
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={goat.img_url} />
                <AvatarFallback>{goat.username[0]}</AvatarFallback>
              </Avatar>
              <span>{goat.metadata_with_translations.name.english}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}; 