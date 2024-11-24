'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import useSuperAdmin from "@/lib/usesuperamin";
import { Button } from "@/components/ui/button";
import { SubgroupsList, Subgroup } from "./SubgroupsList";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { SUBGROUP_CATEGORIES } from "../GoatsCRUD";

interface SubgroupData {
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
  is_locked: boolean;
  is_public: boolean;
  is_realtime: boolean;
  is_published: boolean;
  owner_username: string;
  is_secondary_stream: boolean;
  is_party: boolean;
  is_historical: boolean;
  is_open: boolean;
  is_demo: boolean;
  tags: string[];
  entity_type: string[];
  blocked_profile_ids: string[];
  latest_message: any;
  is_subgroup: boolean;
}

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
  is_locked: boolean;
  is_public: boolean;
  is_realtime: boolean;
  is_published: boolean;
  owner_username: string;
  is_secondary_stream: boolean;
  is_party: boolean;
  is_historical: boolean;
  is_open: boolean;
  is_demo: boolean;
  stream_id: string | null;
  tags: string[];
  entity_type: string[];
  blocked_profile_ids: string[];
  latest_message: any;
  is_subgroup: boolean;
}

interface SubgroupsTableProps {
  goatId: string;
  ownerUsername: string;
  selectedCategory: string;
}

export function SubgroupsTable({ goatId, ownerUsername, selectedCategory }: SubgroupsTableProps) {
  const [loading, setLoading] = useState(false);
  const [subgroups, setSubgroups] = useState<SubgroupData[]>([]);
  const [creating, setCreating] = useState(false);
  const [bulkCreating, setBulkCreating] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set());
  const { 
    fetchSubgroups, 
    createSubgroup, 
    createBulkSubgroups, 
    deleteSubgroup,
    clearAllSubgroups 
  } = useSuperAdmin();

  useEffect(() => {
    if (ownerUsername) {
      loadSubgroups(ownerUsername);
    }
  }, [ownerUsername]);

  const loadSubgroups = async (username: string) => {
    setLoading(true);
    try {
      const { data, error } = await fetchSubgroups(username);
      if (error) throw error;
      setSubgroups(data || []);
    } catch (err) {
      console.error('Error loading subgroups:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubgroup = async () => {
    console.log('Selected Category:', selectedCategory);
    if (!selectedCategory) {
      console.log('No category selected');
      return;
    }
    setCreating(true);
    try {
      const username = `${ownerUsername}_${selectedCategory}`.toLowerCase();
      const capitalizedName = selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1);
      
      const mockSubgroup = {
        stream_id: null,
        username,
        verified: false,
        metadata_with_translations: {
          bio: {
            english: `Official ${capitalizedName} group`,
            hindi: "यादृच्छिक बायो",
            telugu: "యాదృచ్ఛిక జీవితం"
          },
          name: {
            english: capitalizedName,
            hindi: "यादृच्छिक नाम",
            telugu: "యాదృచ్ఛిక పేరు"
          }
        },
        img_url: `https://placehold.co/150?text=${username}`,
        cover_url: `https://placehold.co/600x200?text=${username}`,
        type: selectedCategory,
        is_premium: true,
        is_locked: true,
        is_public: false,
        is_realtime: true,
        is_published: true,
        is_subgroup: true,
        owner_username: ownerUsername,
        is_secondary_stream: false,
        is_party: false,
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
      await loadSubgroups(ownerUsername);
    } catch (err) {
      console.error('Error creating subgroup:', err);
    } finally {
      setCreating(false);
    }
  };

  const handleBulkCreate = async () => {
    setBulkCreating(true);
    try {
      const mockSubgroups = SUBGROUP_CATEGORIES.map(category => {
        const username = `${ownerUsername}_${category.id}`.toLowerCase();
        const capitalizedName = category.id.charAt(0).toUpperCase() + category.id.slice(1);
        
        return {
          stream_id: null,
          username,
          verified: false,
          metadata_with_translations: {
            bio: {
              english: `Official ${capitalizedName} group`,
              hindi: "यादृच्छिक बायो",
              telugu: "యాదృచ్ఛిక జీవితం"
            },
            name: {
              english: capitalizedName,
              hindi: "यादृच्छिक नाम",
              telugu: "యాదృచ్ఛిక పేరు"
            }
          },
          img_url: `https://placehold.co/150?text=${username}`,
          cover_url: `https://placehold.co/600x200?text=${username}`,
          type: category.id,
          is_premium: true,
          is_locked: true,
          is_public: false,
          is_realtime: true,
          is_published: true,
          is_subgroup: true,
          owner_username: ownerUsername,
          is_secondary_stream: false,
          is_party: false,
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
      await loadSubgroups(ownerUsername);
    } catch (err) {
      console.error('Error bulk creating subgroups:', err);
    } finally {
      setBulkCreating(false);
    }
  };

  const handleView = (subgroup: Subgroup) => {
    console.log('View subgroup:', subgroup);
  };

  const handleEdit = (subgroup: Subgroup) => {
    console.log('Edit subgroup:', subgroup);
  };

  const handleDelete = async (subgroupId: number) => {
    setDeletingIds(prev => new Set(prev).add(subgroupId));
    try {
      const { error } = await deleteSubgroup(subgroupId);
      if (error) throw error;
      await loadSubgroups(ownerUsername);
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

  const handleClearAll = async () => {
    if (!ownerUsername) return;
    setClearing(true);
    try {
      const { error } = await clearAllSubgroups(ownerUsername);
      if (error) throw error;
      setSubgroups([]); // Clear local state
    } catch (err) {
      console.error('Error clearing subgroups:', err);
    } finally {
      setClearing(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            <Button
              onClick={handleAddSubgroup}
              disabled={creating || !selectedCategory}
              title={!selectedCategory ? "Please select a category first" : ""}
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
              disabled={bulkCreating || !selectedCategory}
              variant="outline"
              title={!selectedCategory ? "Please select a category first" : ""}
            >
              {bulkCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Subgroups'
              )}
            </Button>
            <Button
              onClick={handleClearAll}
              disabled={clearing || subgroups.length === 0}
              variant="destructive"
            >
              {clearing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Clearing...
                </>
              ) : (
                'Clear All Subgroups'
              )}
            </Button>
          </div>
        </div>
      </div>

      <SubgroupsList 
        subgroups={subgroups.map(subgroup => ({
          subgroup_id: subgroup.subgroup_id,
          username: subgroup.username,
          verified: subgroup.verified,
          metadata_with_translations: {
            bio: {
              english: subgroup.metadata_with_translations.bio.english
            },
            name: {
              english: subgroup.metadata_with_translations.name.english
            }
          },
          img_url: subgroup.img_url,
          cover_url: subgroup.cover_url,
          type: subgroup.type,
          is_premium: subgroup.is_premium,
          is_locked: subgroup.is_locked,
          is_public: subgroup.is_public,
          is_realtime: subgroup.is_realtime,
          is_published: subgroup.is_published,
          is_subgroup: subgroup.is_subgroup,
          owner_username: subgroup.owner_username,
        }))} 
        loading={loading}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        deletingIds={deletingIds}
      />
    </div>
  );
} 