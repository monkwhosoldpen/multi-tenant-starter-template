import { Subgroup } from './types/goat';

export async function syncSubgroupWithRocket(ownerUsername: string, subgroup: Subgroup) {
//   if (ownerUsername.toLowerCase() !== 'elonmusk') {
//     console.log('Skipping Rocket.Chat sync for non-ElonMusk user');
//     return null;
//   }

  try {
    console.log(`Creating Rocket.Chat channel via API route: ${ownerUsername}_${subgroup.category}`);
    const response = await fetch('/api/rocket/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ownerUsername,
        category: {
          id: subgroup.category,
          name: subgroup.metadata_with_translations.name.english
        }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.details || 'Failed to create channel');
    }

    const data = await response.json();
    console.log(`Successfully created Rocket.Chat channel:`, data);
    
    // Return the first channel's ID from the created channels
    return data.createdChannels[0]?.channelId;
  } catch (err) {
    console.error(`Error syncing with Rocket.Chat:`, err);
    throw err;
  }
} 