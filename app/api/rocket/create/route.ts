import { CATEGORIES } from '@/lib/constants';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Your POST handler logic
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create channel' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    // Your GET handler logic
    return NextResponse.json({ success: true, categories: CATEGORIES });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch categories' }, { status: 500 });
  }
} 