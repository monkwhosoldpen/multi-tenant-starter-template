'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface GoatDetailsProps {
  goat: any;
}

export function GoatDetails({ goat }: GoatDetailsProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead colSpan={2} className="text-center">Goat Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">Username</TableCell>
            <TableCell className="truncate">{goat.username}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Name</TableCell>
            <TableCell className="truncate">{goat.metadata_with_translations?.name?.english}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Bio</TableCell>
            <TableCell className="truncate max-w-[200px]" title={goat.metadata_with_translations?.bio?.english}>
              {goat.metadata_with_translations?.bio?.english}
            </TableCell>
          </TableRow>
          {/* Add other details */}
        </TableBody>
      </Table>
    </div>
  );
} 