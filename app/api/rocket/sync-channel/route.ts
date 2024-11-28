import { NextResponse } from 'next/server';

const ROCKET_CONFIG = {
  BASE_URL: "https://amigurumi-gaur.pikapod.net/api/v1",
  AUTH: {
    userId: 'qrzRQGpEiGxsSG6M2',
    authToken: 'TkZDG5qK3T1FJiw9N2joUBtNaD8VGQqP3P8jJlHS4rH'
  }
};

export async function POST(request: Request) {
  try {
    const subgroup = await request.json();
    
    console.log('🚀 Creating Rocket.Chat channel:', subgroup.name);

    // Create channel in Rocket.Chat
    const response = await fetch(`${ROCKET_CONFIG.BASE_URL}/channels.create`, {
      method: 'POST',
      headers: {
        'X-Auth-Token': ROCKET_CONFIG.AUTH.authToken,
        'X-User-Id': ROCKET_CONFIG.AUTH.userId,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: subgroup.name.toLowerCase().replace(/\s+/g, '-'),
        type: subgroup.type || 'p',
        readOnly: subgroup.readOnly || false,
        members: subgroup.members || [],
        extraData: subgroup.extraData || {}
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('❌ Error creating channel:', error);
      return NextResponse.json(
        { error: 'Failed to create channel', details: error },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('✅ Channel created successfully:', data);

    return NextResponse.json({
      success: true,
      channel: data
    });

  } catch (error) {
    console.error('❌ Error in sync-channel route:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error },
      { status: 500 }
    );
  }
} 