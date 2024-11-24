import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Pencil, Trash2, Loader2 } from 'lucide-react';

interface GoatsTableViewProps {
  goats: any[];
  loading: boolean;
  deletingIds: Set<string>;
  availableCategories: Array<{ locale: string; name: string; }>;
  onView: (goat: any) => void;
  onEdit: (goat: any) => void;
  onDelete: (uid: string, e: React.MouseEvent) => void;
}

export const GoatsTableView: React.FC<GoatsTableViewProps> = ({
  goats,
  loading,
  deletingIds,
  availableCategories,
  onView,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="rounded-md border mt-4">
      <div className="max-h-[70vh] overflow-auto">
        <Table>
          {/* Copy the existing table structure from GoatsCRUD.tsx */}
        </Table>
      </div>
    </div>
  );
}; 