import { useState, useEffect, useRef } from "react";
import useSuperAdmin from "@/lib/usesuperamin";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, X } from 'lucide-react';
import { SubgroupsTable } from "./goats/SubgroupsTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TypesGrid } from "./goats/TypesGrid";
import { MessagesGrid } from "./goats/MessagesGrid";
import { GoatDetails } from "./goats/GoatDetails";

// Mock categories for subgroups
export const SUBGROUP_CATEGORIES = [
  { id: 'official', name: 'Official' },
  { id: 'public', name: 'Public' },
  { id: 'twitter', name: 'Twitter' },
  { id: 'facebook', name: 'Facebook' },
  { id: 'men', name: 'Men' },
  { id: 'women', name: 'Women' },
  { id: 'entrepreneurs', name: 'Entrepreneurs' },
  { id: 'football', name: 'Football' },
  { id: 'cricket', name: 'Cricket' },
  { id: 'sports', name: 'Sports' },
  { id: 'singing', name: 'Singing' },
  { id: 'dancing', name: 'Dancing' },
];

const GoatsCrud: React.FC = () => {
  const [goats, setGoats] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedGoatId, setSelectedGoatId] = useState<string>('elonmusk');
  const [selectedCategory, setSelectedCategory] = useState<string>('official');
  const [activeTab, setActiveTab] = useState("subgroups");

  const { fetchGoats } = useSuperAdmin();

  useEffect(() => {
    const loadGoats = async () => {
      setLoading(true);
      try {
        const { data, error } = await fetchGoats();
        if (error) throw error;
        setGoats(data || []);
      } catch (err) {
        console.error("Error fetching goats:", err);
        setGoats([]);
      } finally {
        setLoading(false);
      }
    };

    loadGoats();
  }, [fetchGoats]);

  const selectedGoat = goats.find(goat => goat.username === selectedGoatId);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-4 items-start">
        <div className="flex-1">
          <div className="flex gap-4">
            <Select
              value={selectedGoatId}
              onValueChange={setSelectedGoatId}
              defaultValue="elonmusk"
            >
              <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Select a goat" />
              </SelectTrigger>
              <SelectContent>
                {goats.map((goat) => (
                  <SelectItem key={goat.uid} value={goat.username}>
                    {goat.metadata_with_translations?.name?.english || goat.username}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {selectedGoat && (
        <div className="space-y-6">
          <Tabs defaultValue="subgroups" className="w-full">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="subgroups">Subgroups</TabsTrigger>
              <TabsTrigger value="types">Types</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>
            
            <TabsContent value="subgroups">
              <SubgroupsTable
                goatId={selectedGoat.uid}
                ownerUsername={selectedGoat.username}
                selectedCategory={selectedCategory}
              />
            </TabsContent>
            
            <TabsContent value="types">
              <TypesGrid 
                categories={SUBGROUP_CATEGORIES} 
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                ownerUsername={selectedGoat.username}
              />
            </TabsContent>
            
            <TabsContent value="messages">
              <MessagesGrid
                goatId={selectedGoat.uid}
                ownerUsername={selectedGoat.username}
                selectedCategory={selectedCategory}
              />
            </TabsContent>

            <TabsContent value="details">
              <GoatDetails goat={selectedGoat} />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default GoatsCrud;
