import { Subgroup } from './types/goat';

export const syncSubgroupWithRocket = async (subgroup: any) => {
  try {
    const response = await fetch('/api/rocket/sync-channel', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: subgroup.name,
        type: subgroup.type || 'c',
        username: subgroup.username || 'ElonMusk',
        description: subgroup.description || `Channel for ${subgroup.name}`
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to sync channel with Rocket.Chat');
    }

    return await response.json();
  } catch (error) {
    console.error('Error syncing channel:', error);
    throw error;
  }
}; 