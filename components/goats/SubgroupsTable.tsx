'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SubgroupsList } from "./SubgroupsList";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { generateMockSubgroup } from "@/lib/mockGoatsData";
import { Subgroup } from "@/lib/types/goat";
import useSuperAdmin from "@/lib/usesuperamin";
import { SUBGROUP_CATEGORIES } from "@/components/GoatsCRUD";

interface SubgroupsTableProps {
  goatId: string;
  ownerUsername: string;
  selectedCategory: string;
}

export function SubgroupsTable({ 
  goatId, 
  ownerUsername, 
  selectedCategory,
}: SubgroupsTableProps) {
  const [loading, setLoading] = useState(false);
  const [subgroups, setSubgroups] = useState<Subgroup[]>([]);
  const [creating, setCreating] = useState(false);
  const [bulkCreating, setBulkCreating] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set());

  const { fetchSubgroups, createSubgroup, deleteSubgroup, clearAllSubgroups } = useSuperAdmin();

  useEffect(() => {
    if (ownerUsername) {
      loadSubgroups();
    }
  }, [ownerUsername]);

  const loadSubgroups = async () => {
    setLoading(true);
    try {
      const { data, error } = await fetchSubgroups(ownerUsername);
      if (error) throw error;
      setSubgroups(data || []);
    } catch (err) {
      console.error('Error loading subgroups:', err);
      setSubgroups([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubgroup = async () => {
    if (!selectedCategory) {
      console.log('No category selected');
      return;
    }
    setCreating(true);
    try {
      const mockSubgroup = generateMockSubgroup(ownerUsername, selectedCategory);
      const { error } = await createSubgroup(mockSubgroup);
      if (error) throw error;
      await loadSubgroups();
    } catch (err) {
      console.error('Error creating subgroup:', err);
    } finally {
      setCreating(false);
    }
  };

  const handleBulkCreate = async () => {
    setBulkCreating(true);
    try {
      // Step 1: Create public subgroup first
      console.log(`Creating public subgroup for ${ownerUsername}`);
      const publicSubgroup = generateMockSubgroup(ownerUsername, 'public');
      const { error: publicError } = await createSubgroup(publicSubgroup);
      if (publicError) throw publicError;

      // Step 2: Create all standard subgroups
      for (const { id: type } of SUBGROUP_CATEGORIES) {
        if (type === 'public') continue; // Skip public as it's already created
        
        console.log(`Creating subgroup ${type} for ${ownerUsername}`);
        const subgroup = generateMockSubgroup(ownerUsername, type);
        const { error } = await createSubgroup(subgroup);
        if (error) {
          console.error(`Error creating subgroup ${type}:`, error);
          continue;
        }
      }

      await loadSubgroups(); // Reload all subgroups after creation
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
      await loadSubgroups();
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
      setSubgroups([]);
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
            {subgroups.length === 0 ? (
              <>
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
                  disabled={bulkCreating}
                  variant="outline"
                >
                  {bulkCreating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating All...
                    </>
                  ) : (
                    'Create All Subgroups'
                  )}
                </Button>
              </>
            ) : (
              <Button
                onClick={handleClearAll}
                disabled={clearing}
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
            )}
          </div>
        </div>
      </div>

      <SubgroupsList 
        subgroups={subgroups}
        loading={loading}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        deletingIds={deletingIds}
      />
    </div>
  );
} 