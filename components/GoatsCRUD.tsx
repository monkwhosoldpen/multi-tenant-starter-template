"use client";
import { useState, useEffect } from "react";
import { Loader2, Trash2, Plus, ArrowLeft, RefreshCw } from 'lucide-react';
import { GoatCategory, generateMockGoat, generateAllMockData, generateMockSubgroup, generateMockGoatSync } from "@/lib/mockGoatsData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Goat, Subgroup, Message, SubgroupOrChannel } from "@/lib/types/goat";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import useSuperAdmin from "@/lib/mock-provider";
import { MessagesGrid } from "./goats/MessagesGrid";
import { useRealtimeMessagesContext } from "@/lib/realtime-provider";
import { RocketStatsModal } from "./RocketStatsModal";
import { syncSubgroupWithRocket } from "@/lib/rocket-sync";

// Mock categories for subgroups
export const SUBGROUP_CATEGORIES = [
  { id: 'cricket', name: 'Cricket' },
  { id: 'football', name: 'Football' },
  { id: 'basketball', name: 'Basketball' },
  { id: 'tennis', name: 'Tennis' },
  { id: 'music', name: 'Music' },
  { id: 'acting', name: 'Acting' },
];

type ExtendedGoatCategory = GoatCategory | 'all';

const GoatsCrud: React.FC = () => {
  const [selectedGoatCategory, setSelectedGoatCategory] = useState<ExtendedGoatCategory>('all');
  const [selectedGoatId, setSelectedGoatId] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('official');
  const [loading, setLoading] = useState(true);
  const [creatingElonMusk, setCreatingElonMusk] = useState(false);
  const [creatingAllGoats, setCreatingAllGoats] = useState(false);
  const [deletingAllGoats, setDeletingAllGoats] = useState(false);
  const [goats, setGoats] = useState<Goat[]>([]);
  const selectedGoat = goats.find(goat => goat.username === selectedGoatId);
  const [messageCounts, setMessageCounts] = useState<Record<string, number>>({});
  const [selectedSubgroupId, setSelectedSubgroupId] = useState<string>('');
  const [subgroups, setSubgroups] = useState<Subgroup[]>([]);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [selectedSubgroup, setSelectedSubgroup] = useState<SubgroupOrChannel | null>(null);
  const [isSuperAdmin] = useState(true);
  const [bulkCreating, setBulkCreating] = useState(false);
  const [selectedSubgroupDetails, setSelectedSubgroupDetails] = useState<Subgroup | null>(null);
  const [clearing, setClearing] = useState(false);
  const [addingMessages, setAddingMessages] = useState(false);
  const [clearingMessages, setClearingMessages] = useState(false);
  const [messagesKey, setMessagesKey] = useState(0);
  const [creatingDemoGoats, setCreatingDemoGoats] = useState(false);
  const subgroupMessageCounts: Record<string, number> = {};
  const [isRocketStatsOpen, setIsRocketStatsOpen] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [rocketChannels, setRocketChannels] = useState<any[]>([]);

  const {
    fetchGoats,
    createGoat,
    clearAllGoats,
    supabase,
    fetchSubgroups,
    createSubgroup,
    clearAllSubgroups,
    createBulkMessages,
    deleteMessages
  } = useSuperAdmin();

  useEffect(() => {
    loadGoats();
  }, []);

  useEffect(() => {
    if (goats.length > 0) {
      // Try to find ElonMusk first
      const elonMusk = goats.find(g => g.username === 'ElonMusk');
      if (elonMusk) {
        setSelectedGoatCategory('technology');
        setSelectedGoatId('ElonMusk');
        loadSubgroups('ElonMusk');
      } else {
        // If no ElonMusk, select the first goat
        const firstGoat = goats[0];
        setSelectedGoatCategory(firstGoat.category as GoatCategory);
        setSelectedGoatId(firstGoat.username);
        loadSubgroups(firstGoat.username);
      }
    }
  }, [goats]);

  // When a goat is selected, close the messages panel
  useEffect(() => {
    setIsMessagesOpen(false);
    setSelectedSubgroup(null);
  }, [selectedGoatId]);

  // Add console logs for selectedSubgroup changes
  useEffect(() => {
  }, [selectedSubgroup]);

  const loadGoats = async () => {
    setLoading(true);
    try {
      const { data, error } = await fetchGoats();
      if (error) throw error;
      setGoats(data || []);
    } catch (err) {
      console.error('Error loading goats:', err);
      setGoats([]);
    } finally {
      setLoading(false);
    }
  };

  const loadSubgroups = async (username: string) => {
    try {
      // Only fetch Rocket.Chat channels for ElonMusk
      if (username.toLowerCase() === 'elonmusk') {
        const response = await fetch(`/api/rocket/channels?username=${username}`);
        if (!response.ok) {
          throw new Error('Failed to fetch Rocket.Chat channels');
        }
        const data = await response.json();
        console.log('Rocket.Chat channels:', data.channels);
        setSubgroups(data.channels);
      } else {
        // For other users, return empty array
        setSubgroups([]);
      }
    } catch (err) {
      console.error('Error loading subgroups:', err);
      setSubgroups([]);
    }
  };

  const handleCreateElonMusk = async () => {
    setCreatingElonMusk(true);
    try {
      const mockElonMusk = await generateMockGoat('ElonMusk', 'technology', supabase);
      const { error } = await createGoat(mockElonMusk);
      if (error) throw error;
      await loadGoats();
      setSelectedGoatCategory('technology');
      setSelectedGoatId('ElonMusk');
    } catch (error) {
      console.error('Error creating Elon Musk profile:', error);
    } finally {
      setCreatingElonMusk(false);
    }
  };

  const handleCreateAllGoats = async () => {
    setCreatingAllGoats(true);
    try {
      const allData = generateAllMockData();
      for (const category of Object.keys(allData) as GoatCategory[]) {
        if (category !== 'demo') { // Skip demo category
          for (const goatData of allData[category].goats) {
            // Create goat
            const mockGoat = {
              ...generateMockGoatSync(goatData.username, category),
              uid: crypto.randomUUID(),
            };
            const { error: goatError } = await createGoat(mockGoat);
            if (goatError) {
              console.error(`Error creating goat ${goatData.username}:`, goatError);
              continue;
            }
            console.log(`Created goat: ${goatData.username}`);

            // Create subgroups for the goat
            for (const { id: type } of SUBGROUP_CATEGORIES) {
              const subgroup = generateMockSubgroup(goatData.username, type);
              const { error: subgroupError } = await createSubgroup(subgroup);
              if (subgroupError) {
                console.error(`Error creating subgroup ${type} for ${goatData.username}:`, subgroupError);
                continue;
              }
              console.log(`Created subgroup ${type} for ${goatData.username}`);
            }
          }
        }
      }
      await loadGoats();
    } catch (error) {
      console.error('Error creating all goats:', error);
    } finally {
      setCreatingAllGoats(false);
    }
  };

  const handleCreateDemoGoats = async () => {
    setCreatingDemoGoats(true);
    try {
      // Create ElonMusk goat
      const mockGoat = {
        ...await generateMockGoat('ElonMusk', 'demo', supabase),
        uid: crypto.randomUUID(),
      };

      const { error: goatError } = await createGoat(mockGoat);
      if (goatError) {
        console.error('Error creating ElonMusk goat:', goatError);
        return;
      }
      console.log('Created ElonMusk goat');

      // Create Rocket.Chat channels
      try {
        const response = await fetch('/api/rocket/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ownerUsername: 'ElonMusk'
          })
        });

        if (!response.ok) {
          throw new Error('Failed to create Rocket.Chat channels');
        }

        const result = await response.json();
        console.log('Created Rocket.Chat channels:', result);
      } catch (error) {
        console.error('Error creating Rocket.Chat channels:', error);
      }

      await loadGoats();
      setSelectedGoatCategory('demo');
      setSelectedGoatId('ElonMusk');
    } catch (error) {
      console.error('Error creating ElonMusk:', error);
    } finally {
      setCreatingDemoGoats(false);
    }
  };

  const handleDeleteAllGoats = async () => {
    setDeletingAllGoats(true);
    try {
      // First delete Rocket.Chat channels for ElonMusk
      try {
        const response = await fetch('/api/rocket/delete', {
          method: 'POST'
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete Rocket.Chat channels');
        }
        
        const result = await response.json();
        console.log('Deleted Rocket.Chat channels:', result.deletedChannels);
      } catch (rocketError) {
        console.error('Error deleting Rocket.Chat channels:', rocketError);
      }

      // Then delete all goats from Supabase
      const { error } = await clearAllGoats();
      if (error) throw error;
      
      setGoats([]);
      setSelectedGoatId('');
      setSubgroups([]);
    } catch (error) {
      console.error('Error deleting all goats:', error);
    } finally {
      setDeletingAllGoats(false);
    }
  };

  const handleGoatCardClick = (goat: Goat) => {
    setSelectedGoatCategory(goat.category as GoatCategory);
    setSelectedGoatId(goat.username);
    setIsMessagesOpen(false);
    setSelectedSubgroup(null);

    // Only load subgroups for ElonMusk
    if (goat.username.toLowerCase() === 'elonmusk') {
      loadSubgroups(goat.username);
    }
  };

  const filteredGoats = selectedGoatCategory === 'all'
    ? goats
    : goats.filter(goat => goat.category && goat.category === selectedGoatCategory);

  const hasGoats = goats.length > 0;

  // Get unique, valid categories from goats
  const availableCategories = Array.from(
    new Set(
      goats
        .filter(g => g.category) // Filter out goats with undefined categories
        .map(g => g.category)
    )
  ).filter(Boolean); // Extra safety to remove any null/undefined values

  const handleClearAll = async (ownerUsername: string) => {
    if (!ownerUsername) return;
    setClearing(true);
    try {
      const { error } = await clearAllSubgroups(ownerUsername);
      if (error) throw error;
      await loadSubgroups(ownerUsername); // Reload subgroups after clearing
    } catch (err) {
      console.error('Error clearing subgroups:', err);
    } finally {
      setClearing(false);
    }
  };

  const handleBulkCreate = async (ownerUsername: string) => {
    if (!ownerUsername) return;
    setBulkCreating(true);
    try {
      // Create subgroups for each category
      for (const { id: type } of SUBGROUP_CATEGORIES) {
        const subgroup = generateMockSubgroup(ownerUsername, type);
        const { error } = await createSubgroup(subgroup);
        if (error) {
          console.error(`Error creating subgroup ${type}:`, error);
          continue;
        }
      }

      await loadSubgroups(ownerUsername);
    } catch (err) {
      console.error('Error bulk creating subgroups:', err);
    } finally {
      setBulkCreating(false);
    }
  };

  const handleAddMockMessages = async (username: string) => {
    if (!username || !selectedSubgroup || !selectedGoat) return;
    setAddingMessages(true);
    try {
      const subgroupName = selectedSubgroup.metadata_with_translations.name.english;
      const tableType = selectedSubgroup.is_realtime ? 'live_messages' : 'messages';
      const isPublic = selectedSubgroup.is_public;

      // Create 10 mock messages
      const mockMessages: Message[] = Array(10).fill(null).map((_, index) => {
        const date = new Date(Date.now() - (10 - index) * 1000 * 60);
        return {
          username: isPublic ? selectedGoat.username : username, // For public group, use goat's username
          content: `[${date.toLocaleString()}] ${selectedGoat.username} in ${subgroupName}: Mock message ${index + 1} - This is a test message from ${selectedGoat.username} in the ${subgroupName} subgroup.`,
          created_at: date.toISOString(),
        };
      });

      const { error } = await createBulkMessages(mockMessages, tableType);
      if (error) throw error;

      // Force refresh of MessagesGrid
      setMessagesKey(prev => prev + 1);
    } catch (err) {
      console.error('Error adding mock messages:', err);
    } finally {
      setAddingMessages(false);
    }
  };

  const handleClearMessages = async (username: string) => {
    if (!username || !selectedSubgroup) return;
    setClearingMessages(true);
    try {
      const tableType = selectedSubgroup.is_realtime ? 'live_messages' : 'messages';
      const isPublic = username.toLowerCase() === 'public';

      const { error } = await deleteMessages(selectedSubgroup.owner_username, username, tableType, 'DEFAULT');
      if (error) throw error;

      // Force refresh of MessagesGrid
      setMessagesKey(prev => prev + 1);
    } catch (err) {
      console.error('Error clearing messages:', err);
    } finally {
      setClearingMessages(false);
    }
  };

  const handleResetAll = async () => {
    setResetting(true);
    try {
      // First delete all Rocket.Chat data
      const rocketResponse = await fetch('/api/rocket/delete', {
        method: 'POST'
      });
      
      if (!rocketResponse.ok) {
        throw new Error('Failed to reset Rocket.Chat');
      }
      
      console.log('Rocket.Chat reset successful');

      // Then delete all goats
      await handleDeleteAllGoats();
      
      console.log('Frontend reset successful');
    } catch (error) {
      console.error('Error during reset:', error);
    } finally {
      setResetting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!hasGoats) {
    return (
      <Card className="w-full max-w-2xl mx-auto mt-8">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 items-center">
            <h2 className="text-xl font-semibold mb-4">No Goats Available</h2>
            <Button
              onClick={handleCreateDemoGoats}
              disabled={creatingDemoGoats}
              className="w-full max-w-md"
            >
              {creatingDemoGoats ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Demo Goats...
                </>
              ) : (
                'Create Demo Goats'
              )}
            </Button>
            <Button
              onClick={handleCreateAllGoats}
              disabled={creatingAllGoats}
              variant="outline"
              className="w-full max-w-md"
            >
              {creatingAllGoats ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating All Goats...
                </>
              ) : (
                'Create All Goats'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem-20px)] overflow-hidden">
      {/* Left Sidebar - Goats List (Always visible) */}
      <div className="w-16 md:w-20 flex-shrink-0 bg-gray-900 flex flex-col items-center py-2 md:py-4 space-y-2 md:space-y-4">
        {/* Goats List */}
        <ScrollArea className="flex-1 w-full px-1 md:px-2">
          <div className="space-y-1 md:space-y-2">
            {goats.map((goat, index) => (
              <button
                key={index}
                onClick={() => handleGoatCardClick(goat)}
                className="group relative w-10 h-10 md:w-12 md:h-12"
              >
                <Avatar className={`w-10 h-10 md:w-12 md:h-12 transition-all duration-200 ${selectedGoatId === goat.username
                  ? 'rounded-2xl bg-indigo-500'
                  : 'rounded-full hover:rounded-2xl'
                  }`}>
                  <AvatarImage src={goat.img_url} className="object-cover" />
                  <AvatarFallback className="text-xs">{goat.username[0]}</AvatarFallback>
                </Avatar>
                {/* Tooltip */}
                <div className="absolute left-full ml-2 px-2 py-1 bg-black text-white text-xs rounded hidden group-hover:block whitespace-nowrap z-50">
                  {goat.metadata_with_translations.name.english}
                </div>
                {/* Selection Indicator */}
                {selectedGoatId === goat.username && (
                  <div className="absolute left-0 w-1 h-6 md:h-8 bg-white rounded-r-full top-1/2 -translate-y-1/2 -translate-x-2" />
                )}
              </button>
            ))}
          </div>
        </ScrollArea>

        {/* Admin Actions */}
        {isSuperAdmin && hasGoats && (
          <div className="space-y-2">
            <button
              onClick={() => setIsRocketStatsOpen(true)}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center text-white"
            >
              <svg
                className="h-4 w-4 md:h-5 md:w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </button>
            <button
              onClick={handleResetAll}
              disabled={resetting}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-yellow-500 hover:bg-yellow-600 flex items-center justify-center text-white"
            >
              {resetting ? (
                <Loader2 className="h-3 w-3 md:h-4 md:w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-3 w-3 md:h-4 md:w-4" />
              )}
            </button>
            <button
              onClick={handleDeleteAllGoats}
              disabled={deletingAllGoats}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white"
            >
              {deletingAllGoats ? (
                <Loader2 className="h-3 w-3 md:h-4 md:w-4 animate-spin" />
              ) : (
                <Trash2 className="h-3 w-3 md:h-4 md:w-4" />
              )}
            </button>
          </div>
        )}
      </div>

      {/* Add the modal */}
      <RocketStatsModal 
        open={isRocketStatsOpen} 
        onOpenChange={setIsRocketStatsOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 relative">
        {/* Subgroups Area */}
        <div className={`absolute inset-0 bg-gray-100 transition-all duration-300 ${isMessagesOpen ? 'opacity-0 invisible' : 'opacity-100 visible'
          }`}>
          {selectedGoat ? (
            <div className="flex flex-col h-full">
              {/* Subgroups Area Header */}
              <div className="px-3 md:px-4 py-2 md:py-3 bg-white border-b flex-shrink-0">
                <div className="flex items-center justify-between">
                  <h2 className="text-base md:text-lg font-semibold">
                    {selectedGoat.metadata_with_translations.name.english}
                  </h2>
                  {isSuperAdmin && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleBulkCreate(selectedGoat.username)}
                        disabled={bulkCreating}
                      >
                        {bulkCreating ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          </>
                        ) : (
                          <>
                            <Plus className="mr-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                      {subgroups.length > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleClearAll(selectedGoat.username)}
                          disabled={clearing}
                          className="text-red-600 hover:text-red-700"
                        >
                          {clearing ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            </>
                          ) : (
                            <>
                              <Trash2 className="mr-2 h-4 w-4" />
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Subgroups Grid with ScrollArea */}
              <ScrollArea className="flex-1 p-2 md:p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-2 md:gap-3">
                  {subgroups.map((subgroup: any, index: number) => (
                    <Card
                      key={index}
                      className={`cursor-pointer hover:shadow-md transition-shadow ${
                        subgroup.is_published ? 'bg-green-50' : 'bg-purple-50'
                      } ${selectedSubgroupDetails?.username === subgroup.username ? 'ring-2 ring-primary' : ''}`}
                      onClick={() => {
                        setSelectedSubgroupDetails(subgroup);
                        setSelectedSubgroup(subgroup);
                        setIsMessagesOpen(true);
                      }}
                    >
                      <CardHeader className="p-2 md:p-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 truncate">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium text-xs md:text-sm truncate">
                                {subgroup.name || subgroup.metadata_with_translations?.name?.english}
                              </h3>
                              <Badge
                                variant="secondary"
                                className="h-5 min-w-[20px] px-1 flex items-center justify-center bg-gray-200 text-gray-500"
                              >
                                {subgroup.messagesCount || 0}
                              </Badge>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-[10px] md:text-xs">
                            {subgroup.t === 'c' ? 'Channel' : 'Group'}
                          </Badge>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-gray-500 p-4">
                <h2 className="text-lg md:text-xl font-semibold mb-2">Select a Goat</h2>
                <p className="text-sm md:text-base">Choose a goat from the sidebar to view their subgroups</p>
              </div>
            </div>
          )}
        </div>

        {/* Messages Area - Discord Style */}
        <div className={`absolute inset-0 bg-[#313338] transition-transform duration-300 ${isMessagesOpen ? 'translate-x-0' : 'translate-x-[100%]'
          }`}>
          {/* Header with back button, name, and actions */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#3f4147]">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMessagesOpen(false)}
                className="text-gray-300 hover:text-white hover:bg-[#3f4147]"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-lg font-semibold text-gray-100">
                {selectedSubgroup 
                  ? ('name' in selectedSubgroup 
                      ? selectedSubgroup.name 
                      : selectedSubgroup.metadata_with_translations?.name?.english)
                  : 'Channel'}
              </h2>
            </div>

            {isSuperAdmin && selectedSubgroup && (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleAddMockMessages(selectedSubgroup.username)}
                  disabled={addingMessages}
                  className="text-gray-300 hover:text-white hover:bg-[#3f4147]"
                >
                  {addingMessages ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                    </>
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleClearMessages(selectedSubgroup.username)}
                  disabled={clearingMessages}
                  className="text-red-400 hover:text-red-300 hover:bg-[#3f4147]"
                >
                  {clearingMessages ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    </>
                  ) : (
                    <>
                      <Trash2 className="mr-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* Messages Content */}
          {selectedSubgroup && (
            <MessagesGrid
              key={messagesKey}
              goatId={selectedGoat?.username || ''}
              ownerUsername={selectedSubgroup.username}
              selectedCategory={selectedCategory}
              subgroup={selectedSubgroup}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default GoatsCrud;
