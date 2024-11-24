'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export type Subgroup = {
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
  is_subgroup: boolean;
  owner_username: string;
};

interface SubgroupsListProps {
  subgroups: Subgroup[];
  loading?: boolean;
  onView?: (subgroup: Subgroup) => void;
  onEdit?: (subgroup: Subgroup) => void;
  onDelete?: (subgroupId: number) => void;
  deletingIds?: Set<number>;
}

export function SubgroupsList({ 
  subgroups, 
  loading = false,
  onView,
  onEdit,
  onDelete,
  deletingIds = new Set()
}: SubgroupsListProps) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[120px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8">
                <Loader2 className="h-6 w-6 animate-spin inline-block" />
              </TableCell>
            </TableRow>
          ) : subgroups.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8">
                No subgroups found.
              </TableCell>
            </TableRow>
          ) : (
            subgroups.map((subgroup) => (
              <TableRow key={subgroup.subgroup_id}>
                <TableCell>
                  <img
                    src={subgroup.img_url || "https://via.placeholder.com/40"}
                    alt={subgroup.username}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {subgroup.metadata_with_translations?.name?.english || subgroup.username}
                    </span>
                    <span className="text-xs text-gray-500">
                      @{subgroup.username}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset">
                    {subgroup.type}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1 flex-wrap">
                    {subgroup.verified && (
                      <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                        Verified
                      </span>
                    )}
                    {subgroup.is_premium && (
                      <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700 ring-1 ring-inset ring-yellow-600/20">
                        Premium
                      </span>
                    )}
                    {subgroup.is_locked && (
                      <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">
                        Locked
                      </span>
                    )}
                    {subgroup.is_public && (
                      <span className="inline-flex items-center rounded-full bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-600/20">
                        Public
                      </span>
                    )}
                    {subgroup.is_published && (
                      <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                        Published
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {onView && (
                      <Button
                        onClick={() => onView(subgroup)}
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="h-4 w-4 text-blue-500" />
                      </Button>
                    )}
                    {onEdit && (
                      <Button
                        onClick={() => onEdit(subgroup)}
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                      >
                        <Pencil className="h-4 w-4 text-green-500" />
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        onClick={() => onDelete(subgroup.subgroup_id)}
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        disabled={deletingIds.has(subgroup.subgroup_id)}
                      >
                        {deletingIds.has(subgroup.subgroup_id) ? (
                          <Loader2 className="h-4 w-4 animate-spin text-red-500" />
                        ) : (
                          <Trash2 className="h-4 w-4 text-red-500" />
                        )}
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
} 