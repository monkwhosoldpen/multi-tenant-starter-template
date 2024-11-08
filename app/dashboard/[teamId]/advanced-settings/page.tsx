"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/lib/supabaseClient";
import React, { useEffect, useState } from "react";

const AdvancedSettings = () => {
  // State to store config values
  const [config, setConfig] = useState({
    supabase_url: "",
    supabase_anon_key: "",
    super_admin_email: "",
  });

  // State to handle loading, success, or error states
  const [loading, setLoading] = useState<boolean>(true);
  const [success, setSuccess] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch the current config when the component mounts
  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      // Assuming you have a table `goats_config` to store this data
      const { data, error } = await supabase
        .from("goats_config")
        .select("*")
        .single(); // Assuming one record exists in the table

      if (error) throw error;

      // Set the state with fetched data
      setConfig({
        supabase_url: data?.supabase_url || "",
        supabase_anon_key: data?.supabase_anon_key || "",
        super_admin_email: data?.super_admin_email || "",
      });
    } catch (error) {
      setError("Error fetching configuration.");
    } finally {
      setLoading(false);
    }
  };

  // Update config in Supabase
  const handleSave = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("goats_config")
        .upsert([config], { onConflict: 'id' }); // Pass 'id' as a string instead of an array    

      if (error) throw error;

      setSuccess(true);
      setError(null);
    } catch (error) {
      setSuccess(false);
      setError("Error saving configuration.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setConfig((prevConfig) => ({
      ...prevConfig,
      [name]: value,
    }));
  };

  if (loading) {
    return (
      <div className="space-y-4 p-6">
        <Skeleton className="h-8 w-[200px]" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[300px]" />
          <Skeleton className="h-12 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-[300px]" />
          <Skeleton className="h-12 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-[300px]" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Advanced Settings</CardTitle>
          <CardDescription>
            Configure your Supabase connection and admin settings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="supabase_url">Supabase URL</Label>
              <Input
                id="supabase_url"
                name="supabase_url"
                value={config.supabase_url}
                onChange={handleChange}
                placeholder="https://your-project.supabase.co"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="supabase_anon_key">Supabase Anonymous Key</Label>
              <Input
                id="supabase_anon_key"
                name="supabase_anon_key"
                value={config.supabase_anon_key}
                onChange={handleChange}
                type="password"
                placeholder="your-anon-key"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="super_admin_email">Super Admin Email</Label>
              <Input
                id="super_admin_email"
                name="super_admin_email"
                value={config.super_admin_email}
                onChange={handleChange}
                type="email"
                placeholder="admin@example.com"
              />
            </div>

            {success !== null && (
              <div className={success ? "text-green-500" : "text-destructive"}>
                <p>
                  {success ? "Configuration saved successfully!" : error}
                </p>
              </div>
            )}

            <Button
              type="button"
              onClick={handleSave}
              disabled={loading}
              className="w-full"
            >
              {loading ? "Saving..." : "Save Configuration"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedSettings;
