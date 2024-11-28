'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface RocketStatsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface RocketStats {
  totalChannels: number;
  totalUsers: number;
  channels: Array<{
    name: string;
    messagesCount: number;
  }>;
}

export function RocketStatsModal({ open, onOpenChange }: RocketStatsModalProps) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<RocketStats | null>(null);

  useEffect(() => {
    if (open) {
      fetchStats();
    }
  }, [open]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/rocket/stats');
      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching Rocket.Chat stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Rocket.Chat Stats</DialogTitle>
        </DialogHeader>
        
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        ) : stats ? (
          <div className="space-y-6">
            {/* Overview Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-100 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-gray-900">{stats.totalChannels}</div>
                <div className="text-sm text-gray-600">Total Channels</div>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-gray-900">{stats.totalUsers}</div>
                <div className="text-sm text-gray-600">Total Users</div>
              </div>
            </div>

            {/* Channel List */}
            <div className="border rounded-lg divide-y">
              {stats.channels.map((channel) => (
                <div key={channel.name} className="p-3 flex justify-between items-center">
                  <span className="text-sm font-medium">{channel.name}</span>
                  <span className="text-sm text-gray-500">{channel.messagesCount} messages</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">
            Failed to load Rocket.Chat stats
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
} 