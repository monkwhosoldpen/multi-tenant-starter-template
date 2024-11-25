'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SubgroupsList } from "./SubgroupsList";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import useSuperAdmin from "@/lib/usesuperamin";

type GoatDetailViewProps = {
  goats: any[];
  loading: boolean;
  availableCategories: { locale: string; name: string; }[];
  onEdit?: (goat: any) => void;
};

export function GoatDetailView({ goats, loading, availableCategories, onEdit }: GoatDetailViewProps) {
  const [selectedGoatId, setSelectedGoatId] = useState<string>("");
  const [subgroups, setSubgroups] = useState<any[]>([]);
  const [loadingSubgroups, setLoadingSubgroups] = useState(false);
  const { supabase } = useSuperAdmin();

  useEffect(() => {
    if (selectedGoatId) {
      loadSubgroups();
    }
  }, [selectedGoatId]);

  const loadSubgroups = async () => {
    const selectedGoat = goats.find(g => g.uid === selectedGoatId);
    if (!selectedGoat?.username) return;

    setLoadingSubgroups(true);
    try {
      const { data, error } = await supabase
        .from('sub_groups')
        .select('*')
        .eq('owner_username', selectedGoat.username);
          
      if (error) throw error;
      setSubgroups(data || []);
    } catch (error) {
      console.error('Error fetching subgroups:', error);
    } finally {
      setLoadingSubgroups(false);
    }
  };

  const selectedGoat = goats.find(g => g.uid === selectedGoatId);

  return (
    <div className="space-y-6">
      <Select
        value={selectedGoatId}
        onValueChange={setSelectedGoatId}
      >
        <SelectTrigger className="w-[300px]">
          <SelectValue placeholder="Select a goat" />
        </SelectTrigger>
        <SelectContent>
          {goats.map((goat) => (
            <SelectItem key={goat.uid} value={goat.uid}>
              <div className="flex items-center gap-2">
                <img
                  src={goat.img_url || "https://via.placeholder.com/24"}
                  alt=""
                  className="w-6 h-6 rounded-full"
                />
                {goat.username}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedGoat && (
        <div className="space-y-6 border rounded-lg p-6">
          <div className="flex items-start gap-6">
            <img
              src={selectedGoat.img_url || "https://via.placeholder.com/100"}
              alt=""
              className="w-24 h-24 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Username</label>
                  <Input value={selectedGoat.username} disabled />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Twitter Username</label>
                  <Input value={selectedGoat.twitter_username} disabled />
                </div>

                <div>
                  <label className="text-sm font-medium">Bio (English)</label>
                  <Textarea
                    value={selectedGoat.metadata_with_translations?.bio?.english || ''}
                    disabled
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Type</label>
                  <Input 
                    value={availableCategories.find(cat => cat.locale === selectedGoat.type)?.name || selectedGoat.type} 
                    disabled 
                  />
                </div>

                <div className="flex gap-2">
                  {selectedGoat.verified && (
                    <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                      Verified
                    </span>
                  )}
                  {selectedGoat.is_premium && (
                    <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700 ring-1 ring-inset ring-yellow-600/20">
                      Premium
                    </span>
                  )}
                </div>

                {onEdit && (
                  <Button
                    onClick={() => onEdit(selectedGoat)}
                    className="w-full"
                  >
                    Edit Goat
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Subgroups</h3>
            {/* <SubgroupsList 
              subgroups={subgroups} 
              loading={loadingSubgroups}
            /> */}
          </div>
        </div>
      )}
    </div>
  );
} 