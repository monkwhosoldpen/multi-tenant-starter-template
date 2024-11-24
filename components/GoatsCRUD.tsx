import { useState, useEffect, useRef } from "react";
import useSuperAdmin from "@/lib/usesuperamin";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, X } from 'lucide-react';
import { SubgroupsTable } from "./goats/SubgroupsTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TypesGrid } from "./goats/TypesGrid";

// Mock categories for subgroups
export const SUBGROUP_CATEGORIES = [
  { id: 'official', name: 'Official' },
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

            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Select subgroup category" />
              </SelectTrigger>
              <SelectContent>
                {SUBGROUP_CATEGORIES.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {selectedGoat && (
        <div className="flex gap-6 min-h-[calc(100vh-200px)]">
          <div className="w-[70%]">
            <Tabs defaultValue="subgroups" className="w-full">
              <TabsList>
                <TabsTrigger value="subgroups">Subgroups</TabsTrigger>
                <TabsTrigger value="types">Types</TabsTrigger>
                <TabsTrigger value="other">Other</TabsTrigger>
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
                />
              </TabsContent>
              
              <TabsContent value="other">
                <div className="p-4 border rounded-lg">
                  Other content coming soon...
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="w-[30%]">
            <div className="rounded-md border sticky top-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead colSpan={2} className="text-center">Goat Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Username</TableCell>
                    <TableCell className="truncate">{selectedGoat.username}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Name</TableCell>
                    <TableCell className="truncate">{selectedGoat.metadata_with_translations?.name?.english}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Bio</TableCell>
                    <TableCell className="truncate max-w-[200px]" title={selectedGoat.metadata_with_translations?.bio?.english}>
                      {selectedGoat.metadata_with_translations?.bio?.english}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Type</TableCell>
                    <TableCell>{selectedGoat.type}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Verified</TableCell>
                    <TableCell>{selectedGoat.verified ? 'Yes' : 'No'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Premium</TableCell>
                    <TableCell>{selectedGoat.is_premium ? 'Yes' : 'No'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Country</TableCell>
                    <TableCell>{selectedGoat.country_code}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Language</TableCell>
                    <TableCell>{selectedGoat.language_code}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Social Media</TableCell>
                    <TableCell className="space-y-1">
                      {selectedGoat.twitter_username && (
                        <div className="truncate">Twitter: @{selectedGoat.twitter_username}</div>
                      )}
                      {selectedGoat.instagram_username && (
                        <div className="truncate">Instagram: @{selectedGoat.instagram_username}</div>
                      )}
                      {selectedGoat.facebook_username && (
                        <div className="truncate">Facebook: @{selectedGoat.facebook_username}</div>
                      )}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoatsCrud;
