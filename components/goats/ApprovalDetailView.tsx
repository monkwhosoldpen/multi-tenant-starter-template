'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Clock, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { CHANNEL_ICONS } from "./UserApprovalsTable";

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
};

interface ApprovalDetailViewProps {
  approvals: ApprovalType[];
  loading: boolean;
  onApprove: (approvalId: string) => Promise<void>;
  onReject: (approvalId: string) => Promise<void>;
  processingIds: Set<string>;
}

export function ApprovalDetailView({ 
  approvals, 
  loading,
  onApprove,
  onReject,
  processingIds
}: ApprovalDetailViewProps) {
  const [selectedApprovalId, setSelectedApprovalId] = useState<string>("");
  const selectedApproval = approvals.find(a => a.id === selectedApprovalId);

  return (
    <div className="space-y-6">
      <Select
        value={selectedApprovalId}
        onValueChange={setSelectedApprovalId}
      >
        <SelectTrigger className="w-[300px]">
          <SelectValue placeholder="Select an approval request" />
        </SelectTrigger>
        <SelectContent>
          {approvals.map((approval) => (
            <SelectItem key={approval.id} value={approval.id}>
              <div className="flex items-center gap-2">
                <img
                  src={approval.user_profiles?.img_url || "https://via.placeholder.com/24"}
                  alt=""
                  className="w-6 h-6 rounded-full"
                />
                {approval.user_profiles?.username}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedApproval && (
        <div className="space-y-6 border rounded-lg p-6">
          <div className="flex items-start gap-6">
            <img
              src={selectedApproval.user_profiles?.img_url || "https://via.placeholder.com/100"}
              alt=""
              className="w-24 h-24 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Username</label>
                  <Input value={selectedApproval.user_profiles?.username || ''} disabled />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Twitter Username</label>
                  <Input value={selectedApproval.user_profiles?.twitter_username || ''} disabled />
                </div>

                <div>
                  <label className="text-sm font-medium">Channel</label>
                  <div className="flex items-center gap-2 mt-1">
                    {CHANNEL_ICONS[selectedApproval.channel_id] && (
                      <div>
                        {(() => {
                          const { Icon, color } = CHANNEL_ICONS[selectedApproval.channel_id];
                          return <Icon className={`w-4 h-4 ${color}`} />;
                        })()}
                      </div>
                    )}
                    {selectedApproval.channel_id}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Status</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Select
                      value={selectedApproval.status}
                      onValueChange={(value: 'PENDING' | 'APPROVED' | 'REJECTED') => {
                        if (value === 'APPROVED') {
                          onApprove(selectedApproval.id);
                        } else if (value === 'REJECTED') {
                          onReject(selectedApproval.id);
                        }
                      }}
                      disabled={processingIds.has(selectedApproval.id)}
                    >
                      <SelectTrigger className="w-[150px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          { value: 'PENDING', label: 'Pending', icon: Clock, color: 'text-yellow-500' },
                          { value: 'APPROVED', label: 'Approved', icon: CheckCircle, color: 'text-green-500' },
                          { value: 'REJECTED', label: 'Rejected', icon: XCircle, color: 'text-red-500' },
                        ].map(option => (
                          <SelectItem 
                            key={option.value} 
                            value={option.value}
                            className={option.color}
                          >
                            <div className="flex items-center gap-2">
                              <option.icon className="w-4 h-4" />
                              {option.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {processingIds.has(selectedApproval.id) && (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Created At</label>
                  <Input 
                    value={format(new Date(selectedApproval.created_at), 'PPpp')} 
                    disabled 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 