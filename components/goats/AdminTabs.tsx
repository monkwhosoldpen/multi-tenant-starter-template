import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GoatsCrud from "../GoatsCRUD";
// import { UserApprovalsTable } from "./UserApprovalsTable";
import { MessageSquare, Users, UserCheck, Layers } from "lucide-react";
import { UserApprovalsTable } from "./UserApprovalsTable";
import { SubgroupsTable } from "./SubgroupsTable";
import { MessagesTable } from "./MessagesTable";

export function AdminTabs() {
  return (
    <Tabs defaultValue="goats" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="goats" className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          Goats
        </TabsTrigger>
        <TabsTrigger value="subgroups" className="flex items-center gap-2">
          <Layers className="h-4 w-4" />
          Subgroups
        </TabsTrigger>
        <TabsTrigger value="messages" className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Messages
        </TabsTrigger>
        <TabsTrigger value="approvals" className="flex items-center gap-2">
          <UserCheck className="h-4 w-4" />
          User Approvals
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="goats" className="mt-6">
        <GoatsCrud />
      </TabsContent>
      
      <TabsContent value="subgroups" className="mt-6">
        <SubgroupsTable />
      </TabsContent>
      
      <TabsContent value="messages" className="mt-6">
        <MessagesTable />
      </TabsContent>
      
      <TabsContent value="approvals" className="mt-6">
        <UserApprovalsTable />
      </TabsContent>
    </Tabs>
  );
} 