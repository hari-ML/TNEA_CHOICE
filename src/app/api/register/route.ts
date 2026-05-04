import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, school, email, mobile } = body;

    if (!name || !school || !email || !mobile) {
      return NextResponse.json(
        { error: 'All fields are required.' },
        { status: 400 }
      );
    }

    // In a real application, you would connect to Google Sheets using the Google Drive/Sheets API here.
    // For example, using googleapis npm package and a service account key.
    console.log('Received registration data:', { name, school, email, mobile });

    // Mock successful save
    return NextResponse.json({ success: true, message: 'Registration successful!' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
