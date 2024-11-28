import { NextResponse } from 'next/server';
import { ROCKET_CONFIG, setAuthTokens } from '../utils';

const TEST_CREDENTIALS = {
  username: 'monkwhosoldpen',
  password: 'Ashu@7569'
};

export async function GET() {
  try {
    console.log('Attempting login with test credentials...');
    
    const loginResponse = await fetch(`${ROCKET_CONFIG.BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: TEST_CREDENTIALS.username,
        password: TEST_CREDENTIALS.password
      })
    });

    if (!loginResponse.ok) {
      const errorData = await loginResponse.json();
      console.error('Login response:', errorData);
      throw new Error(errorData.message || 'Login failed');
    }

    const loginData = await loginResponse.json();
    console.log('Login successful:', loginData);

    setAuthTokens({
      userId: loginData.data.userId,
      authToken: loginData.data.authToken
    });

    const channelsResponse = await fetch(`${ROCKET_CONFIG.BASE_URL}/channels.list`, {
      method: 'GET',
      headers: {
        "X-Auth-Token": loginData.data.authToken,
        "X-User-Id": loginData.data.userId,
        "Content-Type": "application/json"
      }
    });

    if (!channelsResponse.ok) {
      throw new Error('Failed to fetch channels after login');
    }

    const channelsData = await channelsResponse.json();
    console.log('Successfully fetched channels:', channelsData);

    return NextResponse.json({ 
      success: true,
      loginData: {
        userId: loginData.data.userId,
        authToken: loginData.data.authToken,
        username: loginData.data.me.username
      },
      channels: channelsData.channels
    });

  } catch (error: any) {
    console.error('Test login error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Test login failed',
        details: error.message,
        stack: error.stack
      },
      { status: 401 }
    );
  }
} 