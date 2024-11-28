import { NextResponse } from 'next/server';

const ROCKET_CONFIG = {
  BASE_URL: "https://amigurumi-gaur.pikapod.net/api/v1",
  AUTH: {
    userId: 'qrzRQGpEiGxsSG6M2',
    authToken: 'TkZDG5qK3T1FJiw9N2joUBtNaD8VGQqP3P8jJlHS4rH'
  }
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    console.log('🔍 Fetching channels for user:', username);

    // First get all channels
    const response = await fetch(`${ROCKET_CONFIG.BASE_URL}/channels.list.joined`, {
      headers: {
        'X-Auth-Token': ROCKET_CONFIG.AUTH.authToken,
        'X-User-Id': ROCKET_CONFIG.AUTH.userId,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch channels: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('📦 Raw channels data:', data);

    // Transform the channels into the expected format
    const channels = data.channels.map((channel: any) => ({
      _id: channel._id,
      name: channel.name,
      t: channel.t,
      msgs: channel.msgs,
      usersCount: channel.usersCount,
      u: channel.u,
      ts: channel.ts,
      ro: channel.ro,
      default: channel.default,
      sysMes: channel.sysMes,
      _updatedAt: channel._updatedAt,
      teamId: channel.teamId,
      teamDefault: channel.teamDefault,
      announcement: channel.announcement,
      description: channel.description,
      topic: channel.topic,
      broadcast: channel.broadcast,
      encrypted: channel.encrypted,
      // Add any other fields needed by your frontend
    }));

    console.log('✅ Transformed channels:', channels);

    return NextResponse.json({
      success: true,
      channels
    });

  } catch (error) {
    console.error('❌ Error fetching channels:', error);
    return NextResponse.json(
      { error: 'Failed to fetch channels', details: error },
      { status: 500 }
    );
  }
} 