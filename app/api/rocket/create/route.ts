import { NextResponse } from 'next/server';

const BASE_URL = "https://amigurumi-gaur.pikapod.net/api/v1";
const ACCESS_TOKEN = 'bFS2r7xPPHGT0egVC-KN7ZUyAYDCwjQqHr-68vF8P51';
const USER_ID = 'qrzRQGpEiGxsSG6M2';

const headers = {
  "X-Auth-Token": ACCESS_TOKEN,
  "X-User-Id": USER_ID,
  "Content-Type": "application/json"
};

export const CATEGORIES = [
  { id: 'cricket', name: 'Cricket' },
  { id: 'football', name: 'Football' },
  { id: 'basketball', name: 'Basketball' },
  { id: 'tennis', name: 'Tennis' },
  { id: 'music', name: 'Music' },
  { id: 'acting', name: 'Acting' },
  // Add other categories as needed
];

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

async function createWelcomeMessage(channelId: string, category: { id: string, name: string }) {
  try {
    const response = await fetch(`${BASE_URL}/chat.postMessage`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        channel: channelId,
        text: `Welcome to the official ${category.name} channel! This is a read-only channel for official announcements.`
      })
    });

    if (!response.ok) {
      throw new Error('Failed to send welcome message');
    }
  } catch (err) {
    console.error('Error sending welcome message:', err);
  }
}

export async function POST() {
  try {
    const createdChannels = [];
    
    // Create channels for ElonMusk
    for (const category of CATEGORIES) {
      const result = await createChannel('elonmusk', category);
      if (result) {
        // Send welcome message to each channel
        await createWelcomeMessage(result.channelId, category);
        createdChannels.push(result);
      }
    }

    return NextResponse.json({ 
      success: true,
      message: 'Channels created successfully',
      createdChannels
    });
  } catch (error: any) {
    console.error('Error creating channels:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create channels',
        details: error.message
      },
      { status: 500 }
    );
  }
} 