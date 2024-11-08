"use client";

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

  return (
    <div className="settings-container">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <form className="settings-form">
          <div>
            <label>Supabase URL</label>
            <input
              type="text"
              name="supabase_url"
              value={config.supabase_url}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Supabase Anonymous Key</label>
            <input
              type="text"
              name="supabase_anon_key"
              value={config.supabase_anon_key}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Super Admin Email</label>
            <input
              type="email"
              name="super_admin_email"
              value={config.super_admin_email}
              onChange={handleChange}
            />
          </div>

          {success !== null && (
            <div>
              <p className={success ? "text-green-500" : "text-red-500"}>
                {success ? "Configuration saved successfully!" : error}
              </p>
            </div>
          )}

          <button type="button" onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Configuration"}
          </button>
        </form>
      )}
    </div>
  );
};

export default AdvancedSettings;
