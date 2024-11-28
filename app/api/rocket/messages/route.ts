import { NextResponse } from 'next/server';
import { ROCKET_CONFIG, getHeaders } from '../utils';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const channelId = searchParams.get('channelId');

    if (!channelId) {
      throw new Error('Channel ID is required');
    }

    // Fetch messages with additional fields
    const response = await fetch(`${ROCKET_CONFIG.BASE_URL}/channels.messages?roomId=${channelId}`, {
      method: 'GET',
      headers: getHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch messages');
    }

    const data = await response.json();
    console.log('Raw messages data:', data);

    // Transform messages to our format
    const messages = data.messages.map((msg: any) => ({
      id: msg._id,
      content: msg.msg,
      username: msg.u.username,
      created_at: msg.ts,
      user: {
        id: msg.u._id,
        name: msg.u.name,
        username: msg.u.username
      },
      // Additional fields
      isEdited: msg._updatedAt !== msg.ts,
      editedAt: msg._updatedAt !== msg.ts ? msg._updatedAt : null,
      reactions: msg.reactions || {},
      attachments: msg.attachments || [],
      isPinned: msg.pinned || false,
      isDeleted: msg.t === 'rm'
    }));

    console.log('Formatted messages:', messages);

    return NextResponse.json({ 
      success: true,
      messages
    });
  } catch (error: any) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch messages',
        details: error.message
      },
      { status: 500 }
    );
  }
} 