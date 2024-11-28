import { NextResponse } from 'next/server';
import { CATEGORIES } from '@/lib/constants';

// Rocket.Chat API details
const BASE_URL = "https://amigurumi-gaur.pikapod.net/api/v1";
const ACCESS_TOKEN = 'bFS2r7xPPHGT0egVC-KN7ZUyAYDCwjQqHr-68vF8P51';
const USER_ID = 'qrzRQGpEiGxsSG6M2';

const headers = {
  "X-Auth-Token": ACCESS_TOKEN,
  "X-User-Id": USER_ID,
  "Content-Type": "application/json"
};

// Helper functions
async function deleteAllChannels() {
  const response = await fetch(`${BASE_URL}/channels.list`, {
    method: 'GET',
    headers
  });

  const { channels } = await response.json();
  const deletedChannels: string[] = [];

  for (const channel of channels) {
    try {
      const deleteResponse = await fetch(`${BASE_URL}/channels.delete`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ roomId: channel._id })
      });

      if (deleteResponse.ok) {
        deletedChannels.push(channel.name);
      }
    } catch (err) {
      console.error(`Error deleting channel ${channel.name}:`, err);
    }
  }

  return deletedChannels;
}

async function createChannel(tenantName: string, category: { id: string, name: string }) {
  const channelName = `${tenantName}_${category.id}`.toLowerCase();
  
  try {
    const response = await fetch(`${BASE_URL}/channels.create`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        name: channelName,
        type: 'c',
        readOnly: true,
        description: `Official ${category.name} channel for ${tenantName}`
      })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to create channel');
    }

    return {
      channelId: data.channel._id,
      channelName
    };
  } catch (err) {
    console.error(`Error creating channel ${channelName}:`, err);
    return null;
  }
}

// API Route Handlers
export async function POST(request: Request) {
  try {
    const { action, ownerUsername, category } = await request.json();

    switch (action) {
      case 'reset':
        // Delete all channels and recreate for ElonMusk
        const deletedChannels = await deleteAllChannels();
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const createdChannels = [];
        for (const cat of CATEGORIES) {
          const result = await createChannel('elonmusk', cat);
          if (result) {
            createdChannels.push(result);
          }
        }

        return NextResponse.json({ 
          success: true,
          message: 'Rocket.Chat reset completed',
          deletedChannels,
          createdChannels
        });

      case 'createChannel':
        if (!ownerUsername || !category) {
          throw new Error('Missing required parameters');
        }

        if (ownerUsername.toLowerCase() !== 'elonmusk') {
          return NextResponse.json({ 
            success: false,
            message: 'Channel creation only supported for ElonMusk'
          });
        }

        const result = await createChannel(ownerUsername, category);
        return NextResponse.json({ 
          success: true,
          ...result
        });

      case 'deleteChannel':
        // Add delete single channel functionality if needed
        break;

      default:
        throw new Error('Invalid action');
    }
  } catch (error: any) {
    console.error('Error in Rocket.Chat operation:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Operation failed',
        details: error.message
      },
      { status: 500 }
    );
  }
} 