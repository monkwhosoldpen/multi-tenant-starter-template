import { NextResponse } from 'next/server';
import { CATEGORIES } from '../create/route';

// Rocket.Chat API details
const BASE_URL = "https://amigurumi-gaur.pikapod.net/api/v1";
const ACCESS_TOKEN = 'bFS2r7xPPHGT0egVC-KN7ZUyAYDCwjQqHr-68vF8P51';
const USER_ID = 'qrzRQGpEiGxsSG6M2';

const headers = {
  "X-Auth-Token": ACCESS_TOKEN,
  "X-User-Id": USER_ID,
  "Content-Type": "application/json"
};


async function deleteAllChannels() {
  const response = await fetch(`${BASE_URL}/channels.list`, {
    method: 'GET',
    headers
  });

  const { channels } = await response.json();
  const deletedChannels = [];

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

    if (response.ok) {
      return channelName;
    }
  } catch (err) {
    console.error(`Error creating channel ${channelName}:`, err);
  }
  return null;
}

export async function POST() {
  try {
    // Step 1: Delete all existing channels
    const deletedChannels = await deleteAllChannels();
    
    // Step 2: Wait a moment to ensure deletion is processed
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Step 3: Create new channels for each category
    const createdChannels = [];
    for (const category of CATEGORIES) {
      const channelName = await createChannel('elonmusk', category);
      if (channelName) {
        createdChannels.push(channelName);
      }
    }

    return NextResponse.json({ 
      success: true,
      message: 'Rocket.Chat reset completed',
      deletedChannels,
      createdChannels
    });
  } catch (error: any) {
    console.error('Error in reset operation:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to reset Rocket.Chat',
        details: error.message
      },
      { status: 500 }
    );
  }
} 