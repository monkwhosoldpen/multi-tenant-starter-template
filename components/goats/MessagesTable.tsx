'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import useSuperAdmin from "@/lib/usesuperamin";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { AutoComplete } from "@/components/ui/auto-complete";

type Goat = {
  uid: string;
  username: string;
  twitter_username: string;
  img_url?: string;
};

type Subgroup = {
  subgroup_id: number;
  username: string;
  img_url?: string;
  metadata_with_translations: {
    name: {
      english: string;
    };
  };
};

type Message = {
  id: string;
  content: string;
  sender_id: string;
  goat_id: string;
  subgroup_id: string;
  created_at: string;
  user_profile?: {
    img_url?: string;
    username?: string;
  };
};

export function MessagesTable() {
  const [loading, setLoading] = useState(false);
  const [goats, setGoats] = useState<Goat[]>([]);
  const [subgroups, setSubgroups] = useState<Subgroup[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedGoat, setSelectedGoat] = useState<string>("");
  const [selectedSubgroup, setSelectedSubgroup] = useState<string>("");
  const [creating, setCreating] = useState(false);
  const [bulkCreating, setBulkCreating] = useState(false);
  const { fetchGoats, fetchSubgroups, fetchMessages, createMessage, createBulkMessages } = useSuperAdmin();

  useEffect(() => {
    loadGoats();
  }, []);

  useEffect(() => {
    if (selectedGoat) {
      const selectedGoatData = goats.find(g => g.uid === selectedGoat);
      if (selectedGoatData) {
        loadSubgroups(selectedGoatData.username);
      }
      setSelectedSubgroup("");
    }
  }, [selectedGoat]);

  useEffect(() => {
    if (selectedGoat && selectedSubgroup) {
      loadMessages(selectedGoat, selectedSubgroup);
    }
  }, [selectedSubgroup]);

  const loadGoats = async () => {
    setLoading(true);
    try {
      const { data, error } = await fetchGoats();
      if (error) throw error;
      setGoats(data || []);
    } catch (err) {
      console.error('Error loading goats:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadSubgroups = async (username: string) => {
    setLoading(true);
    try {
      const { data, error } = await fetchSubgroups(username);
      if (error) throw error;
      setSubgroups(data || []);
    } catch (err) {
      console.error('Error loading subgroups:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (goatId: string, subgroupId: string) => {
    setLoading(true);
    try {
      const { data, error } = await fetchMessages(goatId, subgroupId);
      if (error) throw error;
      setMessages(data || []);
    } catch (err) {
      console.error('Error loading messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMessage = async () => {
    if (!selectedGoat || !selectedSubgroup) return;
    setCreating(true);
    try {
      const selectedGoatData = goats.find(g => g.uid === selectedGoat);
      if (!selectedGoatData) throw new Error('Goat not found');

      const mockMessage = {
        content: `Mock message ${Math.random().toString(36).substring(7)}`,
        sender_id: selectedGoatData.username,
        goat_id: selectedGoatData.username,
        subgroup_id: selectedSubgroup,
        created_at: new Date().toISOString()
      };
      
      const { error } = await createMessage(mockMessage);
      if (error) throw error;
      await loadMessages(selectedGoatData.username, selectedSubgroup);
    } catch (err) {
      console.error('Error creating message:', err);
    } finally {
      setCreating(false);
    }
  };

  const handleBulkCreate = async () => {
    if (!selectedGoat || !selectedSubgroup) return;
    setBulkCreating(true);
    try {
      const selectedGoatData = goats.find(g => g.uid === selectedGoat);
      if (!selectedGoatData) throw new Error('Goat not found');

      const mockMessages = Array(10).fill(null).map((_, index) => ({
        content: `Bulk message ${index + 1}: ${Math.random().toString(36).substring(7)}`,
        sender_id: selectedGoatData.username,
        goat_id: selectedGoatData.username,
        subgroup_id: selectedSubgroup,
        created_at: new Date().toISOString()
      }));
      
      const { error } = await createBulkMessages(mockMessages);
      if (error) throw error;
      await loadMessages(selectedGoatData.username, selectedSubgroup);
    } catch (err) {
      console.error('Error bulk creating messages:', err);
    } finally {
      setBulkCreating(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Messages</h2>
          <div className="flex gap-2">
            <Button
              onClick={handleAddMessage}
              disabled={creating || !selectedGoat || !selectedSubgroup}
            >
              {creating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Add Message'
              )}
            </Button>
            <Button
              onClick={handleBulkCreate}
              disabled={bulkCreating || !selectedGoat || !selectedSubgroup}
              variant="outline"
            >
              {bulkCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Bulk...
                </>
              ) : (
                'Create 10 Messages'
              )}
            </Button>
          </div>
        </div>
        <div className="flex gap-4 mb-4">
          <AutoComplete
            options={goats.map(goat => ({
              value: goat.uid,
              label: goat.username,
              image: goat.img_url
            }))}
            value={selectedGoat}
            onValueChange={setSelectedGoat}
            placeholder="Select a goat"
            emptyText="No goats found."
          />

          {selectedGoat && (
            <AutoComplete
              options={subgroups.map((subgroup) => ({
                value: subgroup.subgroup_id.toString(),
                label: subgroup.metadata_with_translations?.name?.english || subgroup.username,
                image: subgroup.img_url
              }))}
              value={selectedSubgroup}
              onValueChange={setSelectedSubgroup}
              placeholder="Select a subgroup"
              emptyText="No subgroups found."
            />
          )}
        </div>
      </div>

      {selectedGoat && selectedSubgroup && (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Content</TableHead>
                <TableHead>Sender</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin inline-block" />
                  </TableCell>
                </TableRow>
              ) : messages.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8">
                    No messages found.
                  </TableCell>
                </TableRow>
              ) : (
                messages.map((message) => (
                  <TableRow key={message.id}>
                    <TableCell>{message.content}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {message.user_profile?.img_url && (
                          <img
                            src={message.user_profile.img_url}
                            alt=""
                            className="w-6 h-6 rounded-full"
                          />
                        )}
                        {message.user_profile?.username || message.sender_id}
                      </div>
                    </TableCell>
                    <TableCell>{format(new Date(message.created_at), 'MMM d, yyyy HH:mm')}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
} 