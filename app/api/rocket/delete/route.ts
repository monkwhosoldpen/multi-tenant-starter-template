import { NextResponse } from 'next/server';
import { ROCKET_CONFIG, getHeaders } from '../utils';

async function deleteAllChannels() {
  try {
    // Get all channels
    const response = await fetch(`${ROCKET_CONFIG.BASE_URL}/channels.list`, {
      method: 'GET',
      headers: getHeaders()
    });

    const { channels } = await response.json();
    const deletedChannels: string[] = [];
    const errors: string[] = [];

    // Delete each channel
    for (const channel of channels) {
      try {
        const deleteResponse = await fetch(`${ROCKET_CONFIG.BASE_URL}/channels.delete`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify({ roomId: channel._id })
        });

        if (deleteResponse.ok) {
          deletedChannels.push(channel.name);
          console.log(`Deleted channel: ${channel.name}`);
        } else {
          errors.push(`Failed to delete ${channel.name}`);
        }
      } catch (err) {
        console.error(`Error deleting channel ${channel.name}:`, err);
        errors.push(`Error deleting ${channel.name}`);
      }
    }

    return { deletedChannels, errors };
  } catch (error) {
    console.error('Error in deleteAllChannels:', error);
    throw error;
  }
}

export async function POST() {
  try {
    const { deletedChannels, errors } = await deleteAllChannels();

    return NextResponse.json({ 
      success: true,
      message: 'Cleanup completed',
      deletedChannels,
      errors
    });
  } catch (error: any) {
    console.error('Error in cleanup operation:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to cleanup',
        details: error.message
      },
      { status: 500 }
    );
  }
} 