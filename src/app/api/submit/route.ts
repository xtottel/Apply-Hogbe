
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { cookies } from 'next/headers';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

function normalizeGhanaPhone(phone: string): string {
  if (phone.startsWith('233') && phone.length === 12) {
    return '0' + phone.slice(3);
  }
  return phone;
}

export async function POST(request: Request) {
  try {
    // Get the auth token from cookies
    const cookieStore = cookies();
    const authToken = (await cookieStore).get('auth_token')?.value;
    const phoneCookie = (await cookieStore).get('phone')?.value;

    if (!authToken || !phoneCookie) {
      return NextResponse.json(
        { error: 'Authentication required. Please login first.' },
        { status: 401 }
      );
    }

    const formData = await request.json();

    if (!formData.phone) {
      return NextResponse.json(
        { error: 'Phone number is required' }, 
        { status: 400 }
      );
    }

    const phone = normalizeGhanaPhone(formData.phone);

    // Verify the logged-in user matches the form submission
    if (phone !== phoneCookie) {
      return NextResponse.json(
        { error: 'Form submission phone does not match logged-in user.' },
        { status: 403 }
      );
    }

    // Get the user's record from Supabase using auth token (user ID)
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, pin, used_pin')
      .eq('id', authToken)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'User not found in database.' },
        { status: 404 }
      );
    }

    // Check if PIN was already used
    if (user.used_pin) {
      return NextResponse.json(
        { error: 'PIN has already been used for registration.' },
        { status: 400 }
      );
    }

    // Update the user's record with form data and mark PIN as used
    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update({
        form_data: formData,
        used_pin: true,
        updated_at: new Date().toISOString(),
        // client_reference: `MH2025-${Date.now()}-${user.id}`
      })
      .eq('id', user.id)
      .select()
      .single();

    if (updateError) throw updateError;

    // Send registration confirmation email
    await sendRegistrationEmail(formData);

    return NextResponse.json({
      success: true,
      userId: updatedUser.id,
      clientReference: updatedUser.client_reference,
      message: 'Registration successful',
    });

  } catch (error) {
    console.error('Submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ... keep the existing sendRegistrationEmail and generateEmailHtml functions ...

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function sendRegistrationEmail(formData: any) {
  try {
    const emailHtml = generateEmailHtml(formData);
    
    const emailOptions = {
      from: `Mama Hogbe <${process.env.EMAIL_FROM}>`,
      to: process.env.ADMIN_EMAIL!,
      subject: `New Registration: ${formData.fullName}`,
      html: emailHtml,
    };

    // Add attachment if photoUrl exists
    const emailWithAttachment = formData.photoUrl 
      ? {
          ...emailOptions,
          attachments: [{
            filename: 'profile.jpg',
            path: formData.photoUrl
          }]
        }
      : emailOptions;

    await resend.emails.send(emailWithAttachment);
  } catch (error) {
    console.error('Error sending email:', error);
    // Don't fail the request if email fails
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function generateEmailHtml(formData: any): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        h1 { color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px; }
        h2 { color: #16a085; margin-top: 20px; }
        h3 { color: #2980b9; margin-bottom: 5px; }
        p { margin: 5px 0; }
        .section { margin-bottom: 20px; }
        .highlight { background-color: #f8f9fa; padding: 10px; border-radius: 5px; }
      </style>
    </head>
    <body>
      <h1>New Mama Hogbe 2025 Registration</h1>
      <div class="highlight">
        <h2>${formData.fullName}</h2>
        <p><strong>Phone:</strong> ${formData.phone}</p>
        <p><strong>Email:</strong> ${formData.email || 'N/A'}</p>
      </div>

      <div class="section">
        <h3>Personal Information</h3>
        <p><strong>Date of Birth:</strong> ${formData.dob}</p>
        <p><strong>Age:</strong> ${formData.age}</p>
        <p><strong>Marital Status:</strong> ${formData.maritalStatus}</p>
        <p><strong>Place of Birth:</strong> ${formData.pob}</p>
        <p><strong>Hometown:</strong> ${formData.hometown}</p>
        <p><strong>Home District:</strong> ${formData.homeDistrict}</p>
      </div>

      <div class="section">
        <h3>Contact Details</h3>
        <p><strong>Current Residence:</strong> ${formData.currentResidence}</p>
        <p><strong>Grew Up At:</strong> ${formData.grewUpAt}</p>
        <p><strong>Traditional Area:</strong> ${formData.traditionalArea}</p>
        <p><strong>Languages Spoken:</strong> ${formData.languages}</p>
        <p><strong>WhatsApp:</strong> ${formData.whatsapp || 'N/A'}</p>
        <p><strong>Digital Address:</strong> ${formData.digitalAddress || 'N/A'}</p>
      </div>

      <div class="section">
        <h3>Family Information</h3>
        <p><strong>Mother's Name:</strong> ${formData.motherName}</p>
        <p><strong>Mother's Phone:</strong> ${formData.motherPhone}</p>
        <p><strong>Father's/Guardian's Name:</strong> ${formData.fatherName}</p>
        <p><strong>Father's Phone:</strong> ${formData.fatherPhone}</p>
      </div>

      <div class="section">
        <h3>Education & Occupation</h3>
        <p><strong>Education Level:</strong> ${formData.educationLevel}</p>
        <p><strong>School/Institution:</strong> ${formData.schoolName || 'N/A'}</p>
        <p><strong>Co-curricular Activities:</strong> ${formData.cocurricular || 'N/A'}</p>
        <p><strong>Occupation:</strong> ${formData.occupation || 'N/A'}</p>
        <p><strong>Hobbies/Talents:</strong> ${formData.hobbies || 'N/A'}</p>
      </div>

      <div class="section">
        <h3>Pageant Information</h3>
        <p><strong>Audition Location:</strong> ${formData.auditionLocation}</p>
        <p><strong>Previous Pageant Experience:</strong> ${formData.hasPageantExperience}</p>
        ${formData.pageantDetails ? `<p><strong>Experience Details:</strong> ${formData.pageantDetails}</p>` : ''}
        <p><strong>Health Conditions:</strong> ${formData.healthCondition || 'None reported'}</p>
      </div>

      <div class="section highlight">
        <h3>Why do you want to contest?</h3>
        <p>${formData.whyContest}</p>
      </div>

      <div class="section highlight">
        <h3>Why do you want to be Mama Hogbe?</h3>
        <p>${formData.whyBeMamaHogbe}</p>
      </div>

      ${formData.photoUrl ? `
      <div class="section">
        <h3>Profile Photo</h3>
        <p>See attached photo or <a href="${formData.photoUrl}" target="_blank">view online</a></p>
      </div>
      ` : ''}
    </body>
    </html>
  `;
}