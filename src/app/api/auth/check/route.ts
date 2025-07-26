import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = cookies();
  const authToken = (await cookieStore).get('auth_token');
  const phone = (await cookieStore).get('phone'); // Assuming you set this during login

  if (!authToken) {
    return NextResponse.json(
      { authenticated: false },
      { status: 401 }
    );
  }

  return NextResponse.json({
    authenticated: true,
    phone: phone?.value || null
  });
}