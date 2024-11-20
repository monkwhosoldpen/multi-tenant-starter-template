'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import useSuperAdmin from "@/lib/usesuperamin";
import { Button } from "@/components/ui/button";
import { SubgroupsList } from "./SubgroupsList";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { AutoComplete } from "@/components/ui/auto-complete";

type Goat = {
  uid: string;
  username: string;
  twitter_username: string;
  img_url?: string;
};

type SubgroupData = {
  subgroup_id: number;
  stream_id: string | null;
  username: string;
  verified: boolean;
  metadata_with_translations: {
    bio: {
      english: string;
      hindi?: string;
      telugu?: string;
    };
    name: {
      english: string;
      hindi?: string;
      telugu?: string;
    };
  };
  img_url: string;
  cover_url: string;
  type: string;
  is_premium: boolean;
  owner_username: string;
};

interface ComponentSubgroup {
  subgroup_id: number;
  username: string;
  verified: boolean;
  metadata_with_translations: {
    bio: {
      english: string;
    };
    name: {
      english: string;
    };
  };
  img_url: string;
  cover_url: string;
  type: string;
  is_premium: boolean;
  owner_username: string;
}

export function SubgroupsTable() {
  const [loading, setLoading] = useState(false);
  const [goats, setGoats] = useState<Goat[]>([]);
  const [selectedGoat, setSelectedGoat] = useState<string>("");
  const [subgroups, setSubgroups] = useState<SubgroupData[]>([]);
  const [creating, setCreating] = useState(false);
  const [bulkCreating, setBulkCreating] = useState(false);
  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set());
  const { fetchGoats, fetchSubgroups, createSubgroup, createBulkSubgroups, deleteSubgroup } = useSuperAdmin();

  useEffect(() => {
    loadGoats();
  }, []);

  useEffect(() => {
    if (selectedGoat) {
      loadSubgroups(selectedGoat);
    }
  }, [selectedGoat]);

  const loadGoats = async () => {
    setLoading(true);
    try {
      const { data, error } = await fetchGoats();
      if (error) throw error;
      setGoats(data || []);
    } catch (err) {
      console.error('Error loading goats:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadSubgroups = async (goatId: string) => {
    setLoading(true);
    try {
      const selectedGoatData = goats.find(g => g.uid === goatId);
      if (!selectedGoatData) throw new Error('Goat not found');

      const { data, error } = await fetchSubgroups(selectedGoatData.username);
      if (error) throw error;
      setSubgroups(data || []);
    } catch (err) {
      console.error('Error loading subgroups:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubgroup = async () => {
    if (!selectedGoat) return;
    setCreating(true);
    try {
      const selectedGoatData = goats.find(g => g.uid === selectedGoat);
      if (!selectedGoatData) throw new Error('Goat not found');

      const suffixes = ['twitter', 'fb', 'fans', 'tesla_fans', 'spacex', 'official', 'community', 'updates'];
      const randomSuffix = suffixes[Math.floor(Math.random() * suffixes.length)];
      const username = `${selectedGoatData.username}_${randomSuffix}`.toLowerCase();
      
      const mockSubgroup = {
        stream_id: null,
        username,
        verified: Math.random() > 0.5,
        metadata_with_translations: {
          bio: {
            english: `Official ${randomSuffix.replace('_', ' ')} group`,
            hindi: "यादृच्छिक बायो",
            telugu: "యాదృచ్ఛిక జీవితం"
          },
          name: {
            english: `${username} ${randomSuffix.replace('_', ' ')}`.toUpperCase(),
            hindi: "यादृच्छिक नाम",
            telugu: "యాదృచ్ఛిక పేరు"
          }
        },
        img_url: `https://placehold.co/150?text=${username}`,
        cover_url: `https://placehold.co/600x200?text=${username}`,
        type: 'TOP',
        is_premium: Math.random() > 0.7,
        owner_username: selectedGoatData.username,
        is_secondary_stream: false,
        is_party: Math.random() > 0.7,
        is_historical: false,
        is_open: true,
        is_demo: false,
        tags: [],
        entity_type: [],
        blocked_profile_ids: [],
        latest_message: null
      };
      
      const { error } = await createSubgroup(mockSubgroup);
      if (error) throw error;
      await loadSubgroups(selectedGoat);
    } catch (err) {
      console.error('Error creating subgroup:', err);
    } finally {
      setCreating(false);
    }
  };

  const handleBulkCreate = async () => {
    if (!selectedGoat) return;
    setBulkCreating(true);
    try {
      const selectedGoatData = goats.find(g => g.uid === selectedGoat);
      if (!selectedGoatData) throw new Error('Goat not found');

      const mockSubgroups = Array(5).fill(null).map((_, index) => {
        const suffixes = ['twitter', 'fb', 'fans', 'tesla_fans', 'spacex', 'official', 'community', 'updates'];
        const randomSuffix = suffixes[Math.floor(Math.random() * suffixes.length)];
        const username = `${selectedGoatData.username}_${randomSuffix}_${index}`.toLowerCase();
        
        return {
          stream_id: null,
          username,
          verified: Math.random() > 0.5,
          metadata_with_translations: {
            bio: {
              english: `Bulk created ${randomSuffix.replace('_', ' ')} group ${index + 1}`,
              hindi: "यादृच्छिक बायो",
              telugu: "యాదృచ్ఛిక జీవితం"
            },
            name: {
              english: `${username} ${randomSuffix.replace('_', ' ')}`.toUpperCase(),
              hindi: "यादृच्छिक नाम",
              telugu: "యాదృచ్ఛిక పేరు"
            }
          },
          img_url: `https://placehold.co/150?text=${username}`,
          cover_url: `https://placehold.co/600x200?text=${username}`,
          type: 'TOP',
          is_premium: Math.random() > 0.7,
          owner_username: selectedGoatData.username,
          is_secondary_stream: false,
          is_party: Math.random() > 0.7,
          is_historical: false,
          is_open: true,
          is_demo: false,
          tags: [],
          entity_type: [],
          blocked_profile_ids: [],
          latest_message: null
        };
      });
      
      const { error } = await createBulkSubgroups(mockSubgroups);
      if (error) throw error;
      await loadSubgroups(selectedGoat);
    } catch (err) {
      console.error('Error bulk creating subgroups:', err);
    } finally {
      setBulkCreating(false);
    }
  };

  const handleView = (subgroup: ComponentSubgroup) => {
    console.log('View subgroup:', subgroup);
  };

  const handleEdit = (subgroup: ComponentSubgroup) => {
    console.log('Edit subgroup:', subgroup);
  };

  const handleDelete = async (subgroupId: number) => {
    setDeletingIds(prev => new Set(prev).add(subgroupId));
    try {
      const { error } = await deleteSubgroup(subgroupId);
      if (error) throw error;
      await loadSubgroups(selectedGoat);
    } catch (err) {
      console.error('Error deleting subgroup:', err);
    } finally {
      setDeletingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(subgroupId);
        return newSet;
      });
    }
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Subgroups</h2>
          <div className="flex gap-2">
            <Button
              onClick={handleAddSubgroup}
              disabled={creating || !selectedGoat}
            >
              {creating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Add Subgroup'
              )}
            </Button>
            <Button
              onClick={handleBulkCreate}
              disabled={bulkCreating || !selectedGoat}
              variant="outline"
            >
              {bulkCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Bulk...
                </>
              ) : (
                'Create 5 Subgroups'
              )}
            </Button>
          </div>
        </div>
        <AutoComplete
          options={goats.map(goat => ({
            value: goat.uid,
            label: goat.username,
            image: goat.img_url
          }))}
          value={selectedGoat}
          onValueChange={setSelectedGoat}
          placeholder="Select a goat"
          emptyText="No goats found."
        />
      </div>

      {selectedGoat && (
        <SubgroupsList 
          subgroups={subgroups.map(subgroup => ({
            ...subgroup,
            metadata_with_translations: {
              bio: {
                english: subgroup.metadata_with_translations.bio.english
              },
              name: {
                english: subgroup.metadata_with_translations.name.english
              }
            }
          }))} 
          loading={loading}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          deletingIds={deletingIds}
        />
      )}
    </div>
  );
} 