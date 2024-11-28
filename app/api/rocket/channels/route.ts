import { NextResponse } from 'next/server';
import { ROCKET_CONFIG, getHeaders } from '../utils';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    const response = await fetch(`${ROCKET_CONFIG.BASE_URL}/channels.list`, {
      method: 'GET',
      headers: getHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch channels');
    }

    const data = await response.json();
    
    // Filter channels if username is provided
    const filteredChannels = username 
      ? data.channels.filter((channel: any) => 
          channel.name.toLowerCase().startsWith(username.toLowerCase())
        )
      : data.channels;

    // Return full channel data
    return NextResponse.json({ 
      success: true,
      channels: filteredChannels
    });
  } catch (error: any) {
    console.error('Error fetching channels:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch channels',
        details: error.message
      },
      { status: 500 }
    );
  }
} 