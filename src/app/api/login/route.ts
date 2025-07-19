// route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { phone, pin } = await req.json();

    if (!phone || !pin) {
      return NextResponse.json(
        { success: false, message: 'Phone and PIN are required' },
        { status: 400 }
      );
    }

    // Check if PIN exists
    const { data, error } = await supabase
      .from('pins')
      .select('*')
      .eq('phone', phone)
      .eq('pin', pin)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create a redirect response
    const response = NextResponse.redirect(new URL('/form', req.url));
    
    // Set cookie
    response.cookies.set('auth_token', 'authenticated', {
      path: '/',
      maxAge: 86400, // 1 day
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}