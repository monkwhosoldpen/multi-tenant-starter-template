import { NextResponse } from 'next/server';
import { ROCKET_CONFIG, setAuthTokens } from '../../utils';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const response = await fetch(`${ROCKET_CONFIG.BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user: username,
        password: password
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }

    // Store the auth tokens
    setAuthTokens({
      userId: data.data.userId,
      authToken: data.data.authToken
    });

    return NextResponse.json({ 
      success: true,
      userId: data.data.userId,
      username: data.data.me.username,
      name: data.data.me.name
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Login failed',
        details: error.message
      },
      { status: 401 }
    );
  }
} 