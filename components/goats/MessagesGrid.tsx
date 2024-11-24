'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import useSuperAdmin from "@/lib/usesuperamin";
import { useState, useEffect } from "react";
import { SUBGROUP_CATEGORIES } from "../GoatsCRUD";

interface Message {
  id: number;
  created_at: string;
  room: number;
  username: string;
  type: string;
  view: boolean;
  content: string;
  is_blocked: boolean;
}

interface MessagesGridProps {
  goatId: string;
  ownerUsername: string;
  selectedCategory: string;
}

export function MessagesGrid({ goatId, ownerUsername, selectedCategory }: MessagesGridProps) {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedType, setSelectedType] = useState('public');
  const [existingSubgroups, setExistingSubgroups] = useState<Set<string>>(new Set());
  const { createBulkMessages, fetchMessages, fetchSubgroups, deleteMessages } = useSuperAdmin();

  useEffect(() => {
    const loadExistingSubgroups = async () => {
      const { data: subgroups } = await fetchSubgroups(ownerUsername);
      if (subgroups) {
        const existingTypes = new Set(subgroups.map(sg => sg.type));
        setExistingSubgroups(existingTypes);
        
        if (!existingTypes.has('public') && existingTypes.size > 0) {
          setSelectedType(subgroups[0].type);
        }
      }
    };

    loadExistingSubgroups();
  }, [ownerUsername]);

  const loadMessages = async (type: string) => {
    try {
      // First fetch the subgroup to check is_realtime
      const { data: subgroups } = await fetchSubgroups(ownerUsername);
      const subgroup = subgroups?.find(sg => sg.type === type);
      
      if (subgroup) {
        const subgroupUsername = `${ownerUsername}_${type}`.toLowerCase();
        // Choose table based on is_realtime status
        const table = subgroup.is_realtime ? 'live_messages' : 'messages';
        
        // Pass parameters in the correct order: goatId, table, username, type
        const { data } = await fetchMessages(
          goatId,        // goatId parameter
          subgroupUsername, // username parameter
          table,         // table parameter ('live_messages' or 'messages')
        );
        
        setMessages(data || []);
      } else {
        setMessages([]);
      }
    } catch (err) {
      console.error('Error loading messages:', err);
      setMessages([]);
    }
  };

  useEffect(() => {
    if (selectedType) {
      loadMessages(selectedType);
    }
  }, [selectedType, goatId]);

  const handleMockMessages = async () => {
    if (!selectedType) return;
    
    setLoading(true);
    try {
      // First fetch the subgroup to check is_realtime
      const { data: subgroups } = await fetchSubgroups(ownerUsername);
      const subgroup = subgroups?.find(sg => sg.type === selectedType);
      
      if (subgroup) {
        // Use subgroup's username instead of owner's username
        const subgroupUsername = `${ownerUsername}_${selectedType}`.toLowerCase();
        
        // Create exactly 5 messages
        const mockMessages = Array(5).fill(null).map((_, i) => ({
          room: parseInt(goatId, 10),
          username: subgroupUsername,
          type: selectedType,
          view: true,
          content: `Mock message ${i + 1} for ${selectedType} subgroup`,
          is_blocked: false,
          created_at: new Date().toISOString()
        }));

        // Choose table based on subgroup's is_realtime status
        const tableType = subgroup.is_realtime ? 'live_messages' : 'messages';
        await createBulkMessages(mockMessages, tableType);
        
        // Reload messages after creating new ones
        await loadMessages(selectedType);
      }
    } catch (err) {
      console.error('Error creating mock messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMockAllSubgroups = async () => {
    setLoading(true);
    try {
      // Fetch all existing subgroups
      const { data: subgroups } = await fetchSubgroups(ownerUsername);
      
      if (subgroups && subgroups.length > 0) {
        for (const subgroup of subgroups) {
          const subgroupUsername = `${ownerUsername}_${subgroup.type}`.toLowerCase();
          
          // Create 5 messages for each subgroup
          const mockMessages = Array(5).fill(null).map((_, i) => ({
            room: parseInt(goatId, 10),
            username: subgroupUsername,
            type: subgroup.type,
            view: true,
            content: `Mock message ${i + 1} for ${subgroup.type} subgroup`,
            is_blocked: false,
            created_at: new Date().toISOString()
          }));

          // Choose table based on subgroup's is_realtime status
          const tableType = subgroup.is_realtime ? 'live_messages' : 'messages';
          await createBulkMessages(mockMessages, tableType);
        }
        
        // Reload messages for currently selected type
        await loadMessages(selectedType);
      }
    } catch (err) {
      console.error('Error creating mock messages for all subgroups:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMessages = async () => {
    if (!selectedType) return;
    
    setLoading(true);
    try {
      // First fetch the subgroup to check is_realtime
      const { data: subgroups } = await fetchSubgroups(ownerUsername);
      const subgroup = subgroups?.find(sg => sg.type === selectedType);
      
      if (subgroup) {
        const subgroupUsername = `${ownerUsername}_${selectedType}`.toLowerCase();
        const table = subgroup.is_realtime ? 'live_messages' : 'messages';
        
        // Delete messages for this subgroup
        await deleteMessages(subgroupUsername, table, selectedType);
        
        // Reload messages to show empty state
        setMessages([]);
      }
    } catch (err) {
      console.error('Error deleting messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAllMessages = async () => {
    setLoading(true);
    try {
      // Fetch all subgroups
      const { data: subgroups } = await fetchSubgroups(ownerUsername);
      
      if (subgroups && subgroups.length > 0) {
        for (const subgroup of subgroups) {
          const subgroupUsername = `${ownerUsername}_${subgroup.type}`.toLowerCase();
          const table = subgroup.is_realtime ? 'live_messages' : 'messages';
          
          // Delete messages for each subgroup
          await deleteMessages(subgroupUsername, table, subgroup.type);
        }
        
        // Clear current messages display
        setMessages([]);
      }
    } catch (err) {
      console.error('Error deleting all messages:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Select
            value={selectedType}
            onValueChange={setSelectedType}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select subgroup type" />
            </SelectTrigger>
            <SelectContent>
              {SUBGROUP_CATEGORIES.map((category) => (
                <SelectItem 
                  key={category.id} 
                  value={category.id}
                  disabled={!existingSubgroups.has(category.id)}
                  className={!existingSubgroups.has(category.id) ? 'opacity-50' : ''}
                >
                  {category.name}
                  {!existingSubgroups.has(category.id) && ' (Not Created)'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Button 
              onClick={handleMockMessages} 
              disabled={loading || !selectedType}
              size="sm"
              className="h-8 px-3"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                  Creating...
                </>
              ) : (
                'Mock Messages'
              )}
            </Button>

            <Button 
              onClick={handleDeleteMessages}
              disabled={loading || !selectedType}
              variant="destructive"
              size="sm"
              className="h-8 px-3"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Messages'
              )}
            </Button>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button 
            onClick={handleMockAllSubgroups} 
            disabled={loading || existingSubgroups.size === 0}
            variant="outline"
            size="sm"
            className="h-8 px-3"
          >
            {loading ? (
              <>
                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                Creating All...
              </>
            ) : (
              'Mock All Subgroups'
            )}
          </Button>

          <Button 
            onClick={handleDeleteAllMessages}
            disabled={loading || existingSubgroups.size === 0}
            variant="destructive"
            size="sm"
            className="h-8 px-3 bg-red-700"
          >
            {loading ? (
              <>
                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                Deleting All...
              </>
            ) : (
              'Delete All Messages'
            )}
          </Button>
        </div>
      </div>

      <div className="border rounded-lg p-4">
        <h3 className="font-medium mb-2">Messages</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Content</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages.map((message) => (
              <TableRow key={message.id}>
                <TableCell>{message.content}</TableCell>
                <TableCell>{message.username}</TableCell>
                <TableCell>{new Date(message.created_at).toLocaleString()}</TableCell>
                <TableCell>
                  {message.is_blocked ? (
                    <span className="text-red-500">Blocked</span>
                  ) : message.view ? (
                    <span className="text-green-500">Visible</span>
                  ) : (
                    <span className="text-gray-500">Hidden</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 