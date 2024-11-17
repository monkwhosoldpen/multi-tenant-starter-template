import useSuperAdmin from "@/lib/usesuperamin";
import useTenant from "@/lib/usetenant";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import { Trash2, Eye, Pencil } from 'lucide-react';
import { GoatEditModal } from './GoatEditModal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Loader2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// GoatsList Component using the Tenant Context
const GoatsCrud: React.FC = () => {
  const [goats, setGoats] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [creating, setCreating] = useState<boolean>(false);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const [selectedGoat, setSelectedGoat] = useState<any>(null);
  const [modalMode, setModalMode] = useState<'view' | 'edit'>('view');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [clearing, setClearing] = useState(false);
  const [mockingMultiple, setMockingMultiple] = useState(false);
  const { fetchGoats, createGoat, deleteGoat, updateGoat, clearAllGoats, mockMultipleGoats } = useSuperAdmin();

  const generateRandomName = () => {
    const firstNames = ['John', 'Jane', 'Mike', 'Sarah', 'Alex', 'Emma', 'Chris', 'Lisa'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller'];
    return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
  };

  const generateRandomBio = () => {
    const bios = [
      'Tech enthusiast and innovator',
      'Digital creator and entrepreneur',
      'Passionate about blockchain and AI',
      'Building the future of technology',
      'Software engineer and problem solver'
    ];
    return bios[Math.floor(Math.random() * bios.length)];
  };

  const handleAddGoat = async () => {
    setCreating(true);
    const randomName = generateRandomName();
    const username = randomName.toLowerCase().replace(' ', '_');
    
    const mockGoat = {
      profile_id: Math.floor(Math.random() * 1000000),
      stream_id: null,
      uid: uuidv4(),
      username: username,
      verified: true,
      metadata_with_translations: {
        bio: {
          hindi: "यादृच्छिक बायो",
          telugu: "యాదృచ్ఛిక జీవితం",
          english: generateRandomBio()
        },
        name: {
          hindi: "यादृच्छिक नाम",
          telugu: "యాదృచ్ఛిక పేరు",
          english: randomName
        }
      },
      img_url: `https://placehold.co/150?text=${username}`,
      cover_url: `https://placehold.co/600x200?text=${username}`,
      player_id: null,
      country_code: ['US', 'UK', 'IN', 'CA', 'AU'][Math.floor(Math.random() * 5)],
      location_code: null,
      state_code: null,
      district_code: null,
      language_code: ['en', 'hi', 'te'][Math.floor(Math.random() * 3)],
      last_updated: new Date().toISOString(),
      notifications_last_opened: new Date().toISOString(),
      captcha_completed_at: new Date().toISOString(),
      hcaptcha_response_token: null,
      website_url: Math.random() > 0.5 ? `https://${username}.com` : null,
      wikipedia_url: null,
      instagram_username: Math.random() > 0.5 ? username : null,
      twitter_username: username,
      facebook_username: Math.random() > 0.5 ? username : null,
      spotify_artist_id: null,
      apple_music_artist_id: null,
      is_secondary_stream: false,
      is_party: Math.random() > 0.7,
      is_historical: false,
      is_open: true,
      is_premium: Math.random() > 0.5,
      is_demo: false,
      owner_username: null,
      tags: [],
      entity_type: [],
      type: 'TOP',
      blocked_profile_ids: [],
      latest_message: null
    };

    try {
      const { error } = await createGoat(mockGoat);
      
      if (error) {
        console.error("Error creating goat:", error);
        alert("Failed to create goat");
      } else {
        // Refresh the goats list
        const { data: newData, error: fetchError } = await fetchGoats();
        if (!fetchError && newData) {
          setGoats(newData);
        }
      }
    } catch (err) {
      console.error("Error in handleAddGoat:", err);
      alert("An unexpected error occurred");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (uid: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event
    
    if (deletingIds.has(uid)) return; // Prevent multiple clicks
    
    setDeletingIds(prev => new Set(prev).add(uid));
    
    try {
      const { error } = await deleteGoat(uid);
      
      if (error) {
        console.error("Error deleting goat:", error);
        alert("Failed to delete goat");
      } else {
        // Refresh the goats list
        const { data: newData, error: fetchError } = await fetchGoats();
        if (!fetchError && newData) {
          setGoats(newData);
        }
      }
    } catch (err) {
      console.error("Error in handleDelete:", err);
      alert("An unexpected error occurred");
    } finally {
      setDeletingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(uid);
        return newSet;
      });
    }
  };

  const handleEdit = async (updatedGoat: any) => {
    try {
      const { error } = await updateGoat(updatedGoat.uid, updatedGoat);
      if (error) throw error;
      
      // Refresh the goats list
      const { data: newData, error: fetchError } = await fetchGoats();
      if (fetchError) throw fetchError;
      if (newData) setGoats(newData);
      
    } catch (err) {
      console.error("Error updating goat:", err);
      alert("Failed to update goat");
    }
  };

  const handleClearAll = async () => {
    setClearing(true);
    try {
      const { error } = await clearAllGoats();
      
      if (error) {
        console.error("Error clearing goats:", error);
        alert("Failed to clear goats");
      } else {
        setGoats([]);
      }
    } catch (err) {
      console.error("Error in handleClearAll:", err);
      alert("An unexpected error occurred");
    } finally {
      setClearing(false);
    }
  };

  const generateMockGoat = (category: string, index: number) => {
    const randomName = generateRandomName();
    const timestamp = Date.now();
    const username = `${randomName.toLowerCase().replace(' ', '_')}_${timestamp}_${index}`;
    
    return {
      profile_id: Math.floor(Math.random() * 1000000) + index,
      stream_id: null,
      uid: uuidv4(),
      username: username,
      verified: Math.random() > 0.5,
      metadata_with_translations: {
        bio: {
          hindi: "यादृच्छिक बायो",
          telugu: "యాదృచ్ఛిక జీవితం",
          english: `${category} - ${generateRandomBio()}`
        },
        name: {
          hindi: "यादृच्छिक नाम",
          telugu: "యాదృచ్ఛిక పేరు",
          english: randomName
        }
      },
      img_url: `https://placehold.co/150?text=${username}`,
      cover_url: `https://placehold.co/600x200?text=${category}_${username}`,
      player_id: null,
      country_code: ['US', 'UK', 'IN', 'CA', 'AU'][Math.floor(Math.random() * 5)],
      location_code: null,
      state_code: null,
      district_code: null,
      language_code: ['en', 'hi', 'te'][Math.floor(Math.random() * 3)],
      last_updated: new Date().toISOString(),
      notifications_last_opened: new Date().toISOString(),
      captcha_completed_at: new Date().toISOString(),
      hcaptcha_response_token: null,
      website_url: Math.random() > 0.5 ? `https://${username}.com` : null,
      wikipedia_url: null,
      instagram_username: Math.random() > 0.5 ? username : null,
      twitter_username: username,
      facebook_username: Math.random() > 0.5 ? username : null,
      spotify_artist_id: null,
      apple_music_artist_id: null,
      is_secondary_stream: false,
      is_party: Math.random() > 0.7,
      is_historical: false,
      is_open: true,
      is_premium: Math.random() > 0.5,
      is_demo: false,
      owner_username: null,
      tags: [],
      entity_type: [],
      type: category,
      blocked_profile_ids: [],
      latest_message: null
    };
  };

  const handleMockMultiple = async () => {
    setMockingMultiple(true);
    try {
      let globalIndex = 0;
      const allMockGoats = availableCategories.flatMap(category => 
        Array(10).fill(null).map(() => {
          globalIndex++;
          return generateMockGoat(category.locale, globalIndex);
        })
      );

      const { error } = await mockMultipleGoats(allMockGoats);
      
      if (error) {
        console.error("Error creating mock goats:", error);
        alert("Failed to create mock goats");
      } else {
        // Refresh the goats list
        const { data: newData, error: fetchError } = await fetchGoats();
        if (!fetchError && newData) {
          setGoats(newData);
        }
      }
    } catch (err) {
      console.error("Error in handleMockMultiple:", err);
      alert("An unexpected error occurred");
    } finally {
      setMockingMultiple(false);
    }
  };

  useEffect(() => {
    const loadGoats = async () => {
      setLoading(true);
      const { data, error } = await fetchGoats();
      
      if (error) {
        console.error("Error fetching goats:", error);
        setGoats([]);
      } else {
        const typedGoats = data?.map((item: any) => ({
          ...item
        })) || [];
        setGoats(typedGoats);
      }
      
      setLoading(false);
    };

    loadGoats();
  }, [fetchGoats]);

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

  const filteredGoats = goats.filter(goat => 
    selectedType === 'ALL' ? true : goat.type === selectedType
  );

  return (
    <div>
      <div className="flex gap-4 mb-4 items-center flex-wrap">
        <button 
          onClick={handleAddGoat}
          disabled={creating}
          className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors ${
            creating ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {creating ? 'Adding...' : 'Add Goat'}
        </button>

        <button 
          onClick={handleMockMultiple}
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
          onValueChange={setSelectedType}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Types</SelectItem>
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
              disabled={clearing || goats.length === 0}
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
                onClick={handleClearAll}
                className="bg-red-500 hover:bg-red-600"
              >
                Delete All
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="rounded-md border mt-4">
        <div className="max-h-[70vh] overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-white dark:bg-gray-950">
              <TableRow>
                <TableHead className="w-[50px]">Avatar</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Bio</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    <Loader2 className="h-6 w-6 animate-spin inline-block" />
                  </TableCell>
                </TableRow>
              ) : filteredGoats.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No goats found
                  </TableCell>
                </TableRow>
              ) : (
                filteredGoats.map((goat) => (
                  <TableRow key={goat.uid}>
                    <TableCell>
                      <img
                        src={goat.img_url || "https://via.placeholder.com/100"}
                        alt={goat.twitter_username}
                        className="rounded-full w-8 h-8 object-cover"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{goat.username}</span>
                        <span className="text-xs text-gray-500">@{goat.twitter_username}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset">
                        {availableCategories.find(cat => cat.locale === goat.type)?.name || goat.type}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-[200px]">
                      <span className="truncate block">
                        {goat?.metadata_with_translations?.bio?.english || "NA"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col text-xs gap-1">
                        {goat.verified && (
                          <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                            Verified
                          </span>
                        )}
                        {goat.is_premium && (
                          <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700 ring-1 ring-inset ring-yellow-600/20">
                            Premium
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedGoat(goat);
                            setModalMode('view');
                          }}
                          className="p-1 rounded-full hover:bg-blue-100 transition-colors"
                        >
                          <Eye className="w-4 h-4 text-blue-500" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedGoat(goat);
                            setModalMode('edit');
                          }}
                          className="p-1 rounded-full hover:bg-green-100 transition-colors"
                        >
                          <Pencil className="w-4 h-4 text-green-500" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(goat.uid, e)}
                          disabled={deletingIds.has(goat.uid)}
                          className="p-1 rounded-full hover:bg-red-100 transition-colors"
                        >
                          {deletingIds.has(goat.uid) ? (
                            <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4 text-red-500" />
                          )}
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {selectedGoat && (
        <GoatEditModal
          isOpen={!!selectedGoat}
          onClose={() => setSelectedGoat(null)}
          goat={selectedGoat}
          onSave={handleEdit}
          mode={modalMode}
        />
      )}
    </div>
  );
};

export default GoatsCrud;
