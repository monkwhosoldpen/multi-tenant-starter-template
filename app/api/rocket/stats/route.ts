import { NextResponse } from 'next/server';

const BASE_URL = "https://amigurumi-gaur.pikapod.net/api/v1";
const ACCESS_TOKEN = 'bFS2r7xPPHGT0egVC-KN7ZUyAYDCwjQqHr-68vF8P51';
const USER_ID = 'qrzRQGpEiGxsSG6M2';

const headers = {
  "X-Auth-Token": ACCESS_TOKEN,
  "X-User-Id": USER_ID,
  "Content-Type": "application/json"
};

export async function GET() {
  try {
    // Fetch channels
    const channelsResponse = await fetch(`${BASE_URL}/channels.list`, {
      method: 'GET',
      headers
    });
    const channelsData = await channelsResponse.json();

    // Fetch users
    const usersResponse = await fetch(`${BASE_URL}/users.list`, {
      method: 'GET',
      headers
    });
    const usersData = await usersResponse.json();

    // Get message counts for each channel
    const channelsWithMessages = await Promise.all(
      channelsData.channels.map(async (channel: any) => {
        const messagesResponse = await fetch(`${BASE_URL}/channels.messages?roomId=${channel._id}`, {
          method: 'GET',
          headers
        });
        const messagesData = await messagesResponse.json();
        
        return {
          name: channel.name,
          messagesCount: messagesData.messages?.length || 0
        };
      })
    );

    return NextResponse.json({
      totalChannels: channelsData.channels.length,
      totalUsers: usersData.users.length,
      channels: channelsWithMessages
    });
  } catch (error: any) {
    console.error('Error fetching Rocket.Chat stats:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch Rocket.Chat stats',
        details: error.message
      },
      { status: 500 }
    );
  }
} 