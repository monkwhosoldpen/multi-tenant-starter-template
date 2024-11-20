'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { 
  Loader2, 
  CheckCircle, 
  XCircle, 
  Clock,
  Twitter,
  Instagram,
  Youtube,
  Facebook,
  Share2,
  LayoutGrid,
  LayoutList
} from "lucide-react";
import useSuperAdmin from "@/lib/usesuperamin";
import { format } from "date-fns";
import { ApprovalDetailView } from "./ApprovalDetailView";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ChannelIcon {
  Icon: React.ComponentType<{ className?: string }>;
  color: string;
}

type ApprovalType = {
  id: string;
  user_id: string;
  channel_id: keyof typeof CHANNEL_ICONS;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  created_at: string;
  updated_at: string;
  user_profiles: {
    uid: string;
    img_url?: string;
    username?: string;
    twitter_username?: string;
  };
}

export const CHANNEL_ICONS = {
  'TWITTER': { Icon: Twitter, color: 'text-blue-400' },
  'INSTAGRAM': { Icon: Instagram, color: 'text-pink-500' },
  'YOUTUBE': { Icon: Youtube, color: 'text-red-500' },
  'FACEBOOK': { Icon: Facebook, color: 'text-blue-600' },
  'TIKTOK': { Icon: Share2, color: 'text-black' },
} as const;

type ApprovalResponse = {
  id: string;
  user_id: string;
  channel_id: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  created_at: string;
  updated_at: string;
  user_profiles?: {
    uid: string;
    img_url?: string;
    username?: string;
    twitter_username?: string;
  };
};

export function UserApprovalsTable() {
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState<Set<string>>(new Set());
  const [approvals, setApprovals] = useState<ApprovalType[]>([]);
  const { fetchApprovals, generateMockApprovals, handleApproval } = useSuperAdmin();
  const [viewMode, setViewMode] = useState<'table' | 'detail'>('table');

  const loadApprovals = async () => {
    setLoading(true);
    try {
      const { data, error } = await fetchApprovals();
      if (error) throw error;
      const transformedData = (data || []).map((item: ApprovalResponse) => ({
        ...item,
        channel_id: item.channel_id as keyof typeof CHANNEL_ICONS,
        user_profiles: item.user_profiles || {
          uid: item.user_id,
          img_url: undefined,
          username: undefined,
          twitter_username: undefined
        }
      }));
      setApprovals(transformedData);
    } catch (err) {
      console.error('Error loading approvals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApprovals();
  }, []);

  const handleGenerateMock = async () => {
    setLoading(true);
    try {
      await generateMockApprovals();
      await loadApprovals();
    } catch (err) {
      console.error('Error generating mock approvals:', err);
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = [
    { value: 'PENDING', label: 'Pending' },
    { value: 'APPROVED', label: 'Approved' },
    { value: 'REJECTED', label: 'Rejected' },
  ] as const;

  const handleStatusChange = async (approvalId: string, newStatus: 'APPROVED' | 'REJECTED') => {
    setProcessing(prev => new Set(prev).add(approvalId));
    try {
      const { error } = await handleApproval(approvalId, newStatus);
      if (error) throw error;
      await loadApprovals();
    } catch (err) {
      console.error('Error updating status:', err);
    } finally {
      setProcessing(prev => {
        const newSet = new Set(prev);
        newSet.delete(approvalId);
        return newSet;
      });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold">User Approvals</h2>
          <div className="flex items-center border rounded-lg overflow-hidden">
            <Button
              variant={viewMode === 'table' ? 'secondary' : 'ghost'}
              size="sm"
              className="rounded-none"
              onClick={() => setViewMode('table')}
            >
              <LayoutList className="h-4 w-4 mr-2" />
              Table
            </Button>
            <Button
              variant={viewMode === 'detail' ? 'secondary' : 'ghost'}
              size="sm"
              className="rounded-none"
              onClick={() => setViewMode('detail')}
            >
              <LayoutGrid className="h-4 w-4 mr-2" />
              Detail
            </Button>
          </div>
        </div>
        <Button
          onClick={handleGenerateMock}
          disabled={loading}
        >
          Generate Mock Approvals
        </Button>
      </div>

      {viewMode === 'table' ? (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin inline-block" />
                  </TableCell>
                </TableRow>
              ) : approvals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    No approval requests found.
                  </TableCell>
                </TableRow>
              ) : (
                approvals.map((approval) => (
                  <TableRow key={approval.id}>
                    <TableCell>
                      {format(new Date(approval.created_at), 'MMM d, yyyy HH:mm')}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <img
                          src={approval.user_profiles?.img_url || "https://via.placeholder.com/32"}
                          alt=""
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <div className="font-medium">{approval.user_profiles?.username}</div>
                          <div className="text-sm text-gray-500">@{approval.user_profiles?.twitter_username}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {approval.channel_id in CHANNEL_ICONS && (
                          <div>
                            {(() => {
                              const { Icon, color } = CHANNEL_ICONS[approval.channel_id];
                              return <Icon className={`w-4 h-4 ${color}`} />;
                            })()}
                          </div>
                        )}
                        {approval.channel_id}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Select
                          value={approval.status}
                          onValueChange={(value: 'PENDING' | 'APPROVED' | 'REJECTED') => {
                            if (value !== approval.status && value !== 'PENDING') {
                              handleStatusChange(approval.id, value as 'APPROVED' | 'REJECTED');
                            }
                          }}
                          disabled={processing.has(approval.id)}
                        >
                          <SelectTrigger className="w-[110px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {statusOptions.map(option => (
                              <SelectItem 
                                key={option.value} 
                                value={option.value}
                                className={
                                  option.value === 'PENDING' ? 'text-yellow-500' :
                                  option.value === 'APPROVED' ? 'text-green-500' :
                                  'text-red-500'
                                }
                              >
                                <div className="flex items-center gap-2">
                                  {option.value === 'PENDING' && <Clock className="w-4 h-4" />}
                                  {option.value === 'APPROVED' && <CheckCircle className="w-4 h-4" />}
                                  {option.value === 'REJECTED' && <XCircle className="w-4 h-4" />}
                                  {option.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {processing.has(approval.id) && (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {processing.has(approval.id) && (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      ) : (
        <ApprovalDetailView 
          approvals={approvals}
          loading={loading}
          onApprove={async (id) => {
            await handleStatusChange(id, 'APPROVED');
          }}
          onReject={async (id) => {
            await handleStatusChange(id, 'REJECTED');
          }}
          processingIds={processing}
        />
      )}
    </div>
  );
} 