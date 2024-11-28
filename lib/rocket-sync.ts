import { Subgroup } from './types/goat';

export const syncSubgroupWithRocket = async (subgroup: Subgroup) => {
  try {
    const response = await fetch('/api/rocket/sync-channel', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subgroup),
    });

    if (!response.ok) {
      throw new Error(`Failed to sync channel: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Channel synced successfully:', data);
    return data;
  } catch (error) {
    console.error('❌ Error syncing channel:', error);
    throw error;
  }
}; 