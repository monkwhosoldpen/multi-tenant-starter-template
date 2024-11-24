import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { LayoutGrid, LayoutList, Loader2 } from 'lucide-react';

interface GoatsHeaderProps {
  creating: boolean;
  mockingMultiple: boolean;
  clearing: boolean;
  selectedType: string;
  viewMode: 'table' | 'detail';
  goatsCount: number;
  availableCategories: Array<{ locale: string; name: string; }>;
  onAddGoat: () => void;
  onMockMultiple: () => void;
  onClearAll: () => void;
  onTypeChange: (value: string) => void;
  onViewModeChange: (mode: 'table' | 'detail') => void;
}

export const GoatsHeader: React.FC<GoatsHeaderProps> = ({
  creating,
  mockingMultiple,
  clearing,
  selectedType,
  viewMode,
  goatsCount,
  availableCategories,
  onAddGoat,
  onMockMultiple,
  onClearAll,
  onTypeChange,
  onViewModeChange,
}) => {
  return (
    <div className="flex gap-4 mb-4 items-center flex-wrap">
      <div className="flex items-center border rounded-lg overflow-hidden">
        <Button
          variant={viewMode === 'detail' ? 'secondary' : 'ghost'}
          size="sm"
          className="rounded-none"
          onClick={() => onViewModeChange('detail')}
        >
          <LayoutGrid className="h-4 w-4 mr-2" />
          Detail
        </Button>
        <Button
          variant={viewMode === 'table' ? 'secondary' : 'ghost'}
          size="sm"
          className="rounded-none"
          onClick={() => onViewModeChange('table')}
        >
          <LayoutList className="h-4 w-4 mr-2" />
          Table
        </Button>
      </div>

      <button 
        onClick={onAddGoat}
        disabled={creating}
        className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors ${
          creating ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {creating ? 'Adding...' : 'Add Goat'}
      </button>

      <button 
        onClick={onMockMultiple}
        disabled={mockingMultiple}
        className={`px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors ${
          mockingMultiple ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {mockingMultiple ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
            Generating...
          </>
        ) : (
          'Generate 10 per Category'
        )}
      </button>

      <Select
        value={selectedType}
        onValueChange={onTypeChange}
        defaultValue="elonmusk"
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All Types</SelectItem>
          <SelectItem value="elonmusk">Elon Musk</SelectItem>
          {availableCategories.map(category => (
            <SelectItem key={category.locale} value={category.locale}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button 
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={clearing || goatsCount === 0}
          >
            {clearing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
                Clearing...
              </>
            ) : (
              'Clear All'
            )}
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete all goats
              from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={onClearAll}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}; 