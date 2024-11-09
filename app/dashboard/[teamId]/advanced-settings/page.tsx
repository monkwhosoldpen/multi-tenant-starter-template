"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import useTenant from "@/lib/usetenant";

const AdvancedSettings = () => {
  const { tenantConfig } = useTenant();

  if (!tenantConfig) {
    return null;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Advanced Settings</CardTitle>
          <CardDescription>
            Your Supabase connection and admin settings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="supabase_project_url">Supabase URL</Label>
              <Input
                id="supabase_project_url"
                value={tenantConfig.TENANT_PUBLIC_SUPABASE_URL || ""}
                readOnly
                disabled
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="supabase_anon_key">Supabase Anonymous Key</Label>
              <Input
                id="supabase_anon_key"
                value={tenantConfig.TENANT_SUPABASE_ANON_KEY || ""}
                type="password"
                readOnly
                disabled
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin_email">Admin Email</Label>
              <Input
                id="admin_email"
                value={tenantConfig.TENANT_SUPER_ADMIN_EMAIL || ""}
                type="email"
                readOnly
                disabled
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedSettings;
