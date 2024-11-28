import { NextResponse } from 'next/server';
import { ROCKET_CONFIG, getHeaders, clearAuthTokens } from '../../utils';

export async function POST() {
  try {
    const response = await fetch(`${ROCKET_CONFIG.BASE_URL}/logout`, {
      method: 'POST',
      headers: getHeaders()
    });

    if (!response.ok) {
      throw new Error('Logout failed');
    }

    clearAuthTokens();

    return NextResponse.json({ 
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error: any) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Logout failed',
        details: error.message
      },
      { status: 500 }
    );
  }
} 