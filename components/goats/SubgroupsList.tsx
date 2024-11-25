'use client';

import { Subgroup } from "@/lib/types/goat";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2, Loader2 } from "lucide-react";

interface SubgroupsListProps {
  subgroups: Subgroup[];
  loading: boolean;
  onView: (subgroup: Subgroup) => void;
  onEdit: (subgroup: Subgroup) => void;
  onDelete: (subgroupId: number) => void;
  deletingIds: Set<number>;
}

export function SubgroupsList({
  subgroups,
  loading,
  onView,
  onEdit,
  onDelete,
  deletingIds
}: SubgroupsListProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4 text-gray-400">
        <Loader2 className="h-8 w-8 animate-spin" />
        <div>Loading subgroups...</div>
      </div>
    );
  }

  if (subgroups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4 text-gray-400">
        <div className="text-6xl">📁</div>
        <div className="text-xl font-semibold">No Subgroups Found</div>
        <div className="text-sm text-center max-w-md">
          This goat doesn't have any subgroups yet.
          <br />
          Use the buttons above to create subgroups.
        </div>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {subgroups.map((subgroup) => (
          <TableRow key={subgroup.subgroup_id}>
            <TableCell>{subgroup.metadata_with_translations.name.english}</TableCell>
            <TableCell>{subgroup.category}</TableCell>
            <TableCell>
              {subgroup.is_published ? 'Published' : 'Draft'}
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onView(subgroup)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(subgroup)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(subgroup.subgroup_id)}
                  disabled={deletingIds.has(subgroup.subgroup_id)}
                >
                  {deletingIds.has(subgroup.subgroup_id) ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
} 