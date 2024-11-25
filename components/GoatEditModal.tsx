import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import useSuperAdmin from "@/lib/usesuperamin";
import { SubgroupsList } from "./goats/SubgroupsList";

interface GoatEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  goat: any;
  onSave: (updatedGoat: any) => Promise<void>;
  mode: 'view' | 'edit';
}

export function GoatEditModal({ isOpen, onClose, goat, onSave, mode }: GoatEditModalProps) {
  const { supabase } = useSuperAdmin();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: goat?.username || '',
    twitter_username: goat?.twitter_username || '',
    metadata_with_translations: {
      bio: {
        english: goat?.metadata_with_translations?.bio?.english || '',
        hindi: goat?.metadata_with_translations?.bio?.hindi || '',
        telugu: goat?.metadata_with_translations?.bio?.telugu || '',
      },
      name: {
        english: goat?.metadata_with_translations?.name?.english || '',
        hindi: goat?.metadata_with_translations?.name?.hindi || '',
        telugu: goat?.metadata_with_translations?.name?.telugu || '',
      }
    },
    img_url: goat?.img_url || '',
    cover_url: goat?.cover_url || '',
    type: goat?.type || 'TOP',
  });

  const [subgroups, setSubgroups] = useState<any[]>([]);

  useEffect(() => {
    const fetchSubgroups = async () => {
      if (!goat?.username) return;

      try {
        const { data, error } = await supabase
          .from('sub_groups')
          .select('*')
          .eq('owner_username', goat.username);

        if (error) throw error;
        setSubgroups(data || []);
      } catch (error) {
        console.error('Error fetching subgroups:', error);
      }
    };

    fetchSubgroups();
  }, [goat?.username]);

  const availableCategories = [
    { locale: 'TOP', name: 'Top' },
    { locale: 'FB', name: 'Football' },
    { locale: 'CR', name: 'Cricket' },
    { locale: 'BSK', name: 'Basketball' },
    { locale: 'ES', name: 'Esports' },
    { locale: 'CY', name: 'Cycling' },
    { locale: 'TR', name: 'Tennis' },
    { locale: 'AT', name: 'Athletics' },
    { locale: 'SW', name: 'Swimming' },
    { locale: 'BB', name: 'Baseball' },
    { locale: 'VB', name: 'Volleyball' },
    { locale: 'WF', name: 'Winter Sports' },
    { locale: 'MO', name: 'Motorsports' },
    { locale: 'RG', name: 'Rugby' },
    { locale: 'BO', name: 'Boxing' },
    { locale: 'WFH', name: 'Weightlifting' },
    { locale: 'GY', name: 'Gymnastics' },
    { locale: 'CH', name: 'Chess' },
    { locale: 'BD', name: 'Badminton' },
    { locale: 'HK', name: 'Hockey' },
    { locale: 'WW', name: 'Wrestling' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'view') return;

    setLoading(true);
    try {
      await onSave({
        ...goat,
        ...formData,
      });
      onClose();
    } catch (error) {
      console.error('Error saving goat:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockSubgroup = (ownerUsername: string) => {
    const suffixes = ['twitter', 'fb', 'fans', 'tesla_fans', 'spacex', 'official', 'community', 'updates'];
    const randomSuffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    const username = `${ownerUsername}_${randomSuffix}`.toLowerCase();

    return {
      subgroup_id: Math.floor(Math.random() * 1000000),
      stream_id: null,
      username,
      verified: Math.random() > 0.5,
      metadata_with_translations: {
        bio: {
          english: `Official ${randomSuffix.replace('_', ' ')} group for ${ownerUsername}`,
          hindi: "यादृच्छिक बायो",
          telugu: "యాదృచ్ఛిక జీవితం"
        },
        name: {
          english: `${ownerUsername} ${randomSuffix.replace('_', ' ')}`.toUpperCase(),
          hindi: "यादृच्छिक नाम",
          telugu: "యాదృచ్ఛిక పేరు"
        }
      },
      img_url: `https://placehold.co/150?text=${username}`,
      cover_url: `https://placehold.co/600x200?text=${username}`,
      type: formData.type,
      is_premium: Math.random() > 0.7,
      owner_username: ownerUsername
    };
  };

  const handleAddMockSubgroup = async () => {
    try {
      const mockSubgroup = generateMockSubgroup(formData.username);
      const { error } = await supabase
        .from('sub_groups')
        .insert([mockSubgroup]);

      if (error) throw error;

      // Refresh subgroups list
      const { data, error: fetchError } = await supabase
        .from('sub_groups')
        .select('*')
        .eq('owner_username', goat.username);

      if (fetchError) throw fetchError;
      setSubgroups(data || []);

    } catch (error) {
      console.error('Error adding mock subgroup:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95%] max-w-[80%] md:w-full sm:max-w-[95%] max-h-[90vh] overflow-y-auto">
        <DialogTitle>{mode === 'edit' ? 'Edit Goat' : 'View Goat'}</DialogTitle>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Username</label>
            <Input
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              disabled={mode === 'view'}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Twitter Username</label>
            <Input
              value={formData.twitter_username}
              onChange={(e) => setFormData({ ...formData, twitter_username: e.target.value })}
              disabled={mode === 'view'}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Bio (English)</label>
            <Textarea
              value={formData.metadata_with_translations.bio.english}
              onChange={(e) => setFormData({
                ...formData,
                metadata_with_translations: {
                  ...formData.metadata_with_translations,
                  bio: {
                    ...formData.metadata_with_translations.bio,
                    english: e.target.value
                  }
                }
              })}
              disabled={mode === 'view'}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Profile Image URL</label>
            <div className="flex gap-2 items-start">
              <Input
                value={formData.img_url}
                onChange={(e) => setFormData({ ...formData, img_url: e.target.value })}
                disabled={mode === 'view'}
                className="flex-1"
              />
              {formData.img_url && (
                <img
                  src={formData.img_url}
                  alt="Profile Preview"
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://via.placeholder.com/100";
                  }}
                />
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Cover Image URL</label>
            <div className="flex gap-2 items-start">
              <Input
                value={formData.cover_url}
                onChange={(e) => setFormData({ ...formData, cover_url: e.target.value })}
                disabled={mode === 'view'}
                className="flex-1"
              />
              {formData.cover_url && (
                <img
                  src={formData.cover_url}
                  alt="Cover Preview"
                  className="w-16 h-10 object-cover rounded-md flex-shrink-0"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://via.placeholder.com/600x200";
                  }}
                />
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Type</label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value })}
              disabled={mode === 'view'}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                {availableCategories.map(category => (
                  <SelectItem key={category.locale} value={category.locale}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 mt-6">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium">Subgroups</label>
              {mode === 'edit' && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddMockSubgroup}
                  className="h-8"
                >
                  Mock Subgroup
                </Button>
              )}
            </div>
            <SubgroupsList subgroups={subgroups} />
          </div>

          {mode === 'edit' && (
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
} 