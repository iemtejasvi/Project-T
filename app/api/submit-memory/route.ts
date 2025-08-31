import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

interface SubmissionData {
  recipient: string;
  message: string;
  sender?: string;
  color: string;
  full_bg: boolean;
  animation?: string;
  tag?: string;
  sub_tag?: string;
}

const twoMemoryLimitMessages = [
  "Only 2 memories allowed. Some goodbyes must stay in your heart.",
  "Only 2 memories allowed. Two pieces of your story, that's all we can hold.",
  "Only 2 memories allowed. Two moments of love, the rest stays with you.",
  "Only 2 memories allowed. Two fragments of forever, the rest is yours.",
  "Only 2 memories allowed. Two echoes of your heart, the rest remains.",
  "Only 2 memories allowed. Two pieces of your truth, the rest is private.",
  "Only 2 memories allowed. Two moments of courage, the rest is strength.",
  "Only 2 memories allowed. Two pieces of your soul, the rest is sacred.",
  "Only 2 memories allowed. Two echoes of love, the rest is yours.",
  "Only 2 memories allowed. Two pieces of your story, the rest is poetry.",
  "Only 2 memories allowed. Two glimpses of forever, the rest is dream.",
  "Only 2 memories allowed. Two moments of heart, the rest is prayer.",
  "Only 2 memories allowed. Two pieces of truth, the rest is space.",
  "Only 2 memories allowed. Two echoes of soul, the rest is light.",
  "Only 2 memories allowed. Two pieces of love, the rest is song.",
  "Only 2 memories allowed. Two moments of story, the rest is verse.",
  "Only 2 memories allowed. Two pieces of heart, the rest is dream.",
  "Only 2 memories allowed. Two echoes of truth, the rest is yours.",
  "Only 2 memories allowed. Two moments of soul, the rest is sacred.",
  "Only 2 memories allowed. Two pieces of love, the rest is private."
];

function getClientIP(request: NextRequest): string | null {
  // Try multiple headers for IP detection
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  
  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwardedFor.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  if (cfConnectingIP) {
    return cfConnectingIP;
  }
  
  // Fallback to connection remote address
  // Fallback for when no IP headers are available
  return null;
}

function getCookieValue(request: NextRequest, name: string): string | null {
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) return null;
  
  const cookies = cookieHeader.split(';').map(cookie => cookie.trim());
  const targetCookie = cookies.find(cookie => cookie.startsWith(`${name}=`));
  
  if (targetCookie) {
    return targetCookie.split('=')[1];
  }
  
  return null;
}

async function getCountryFromIP(ip: string): Promise<string | null> {
  try {
    const response = await fetch(`https://ipapi.co/${ip}/json/`);
    if (response.ok) {
      const data = await response.json();
      return data.country_name || null;
    }
  } catch (error) {
    console.error('Error fetching country from IP:', error);
  }
  return null;
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: SubmissionData & { uuid?: string } = await request.json();
    const { recipient, message, sender, color, full_bg, animation, tag, sub_tag, uuid } = body;

    // Basic validation
    if (!recipient || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: recipient and message are required.' },
        { status: 400 }
      );
    }

    // Word count validation
    const wordCount = message.trim().split(/[\s.]+/).filter(word => word.length > 0).length;
    if (wordCount > 50) {
      return NextResponse.json(
        { error: 'Message exceeds 50 word limit.' },
        { status: 400 }
      );
    }

    // Get client IP and UUID
    const clientIP = getClientIP(request);
    const clientUUID = uuid || getCookieValue(request, 'user_uuid');
    
    // Owner exemption - skip all checks for owner IP
    if (clientIP === '103.161.233.157') {
      // Allow owner to submit without limits
    } else {
      // Optimized single-pass validation
      if (clientIP || clientUUID) {
        const queries = [];
        if (clientIP) queries.push(`ip.eq.${clientIP}`);
        if (clientUUID) queries.push(`uuid.eq.${clientUUID}`);
        
        if (queries.length > 0) {
          const orCondition = queries.join(',');
          
          // Single parallel check for both ban and memory count
          const [banCheck, memoryCheck] = await Promise.all([
            supabase
              .from('banned_users')
              .select('id')
              .or(orCondition)
              .limit(1),
            supabase
              .from('memories')
              .select('id', { count: 'exact' })
              .or(orCondition)
          ]);

          // Check ban status
          if (banCheck.error) {
            console.error('Ban check error:', banCheck.error);
            return NextResponse.json(
              { error: 'Server error during validation. Please try again.' },
              { status: 500 }
            );
          }

          if (banCheck.data && banCheck.data.length > 0) {
            return NextResponse.json(
              { error: 'You are banned from submitting memories.' },
              { status: 403 }
            );
          }

          // Check memory count
          if (memoryCheck.error) {
            console.error('Memory count error:', memoryCheck.error);
            return NextResponse.json(
              { error: 'Server error during validation. Please try again.' },
              { status: 500 }
            );
          }

          if (memoryCheck.count && memoryCheck.count >= 2) {
            const randomMessage = twoMemoryLimitMessages[Math.floor(Math.random() * twoMemoryLimitMessages.length)];
            return NextResponse.json(
              { error: randomMessage },
              { status: 429 }
            );
          }
        }
      }
    }

    // Prepare submission data (country lookup can be async/optional)
    const submissionData = {
      recipient: recipient.trim(),
      message: message.trim(),
      sender: sender?.trim() || null,
      status: 'pending',
      color: color || 'default',
      full_bg: Boolean(full_bg),
      animation: animation || null,
      ip: clientIP,
      country: null, // Will be updated async after insertion if needed
      uuid: clientUUID,
      tag: tag || null,
      sub_tag: sub_tag || null,
      created_at: new Date().toISOString()
    };

    // Insert into database
    const { data, error } = await supabase
      .from('memories')
      .insert([submissionData])
      .select()
      .single();

    if (error) {
      console.error('Database insertion error:', error);
      return NextResponse.json(
        { error: `Failed to submit memory: ${error.message}` },
        { status: 500 }
      );
    }

    // Optional: Update country async (non-blocking)
    if (clientIP && data.id) {
      getCountryFromIP(clientIP).then(country => {
        if (country) {
          supabase
            .from('memories')
            .update({ country })
            .eq('id', data.id)
            .then(result => {
              if (result.error) {
                console.log('Country update failed:', result.error);
              }
            });
        }
      }).catch(error => {
        console.log('Country lookup failed:', error);
      });
    }

    // Success response
    return NextResponse.json(
      { 
        success: true, 
        message: 'Memory submitted successfully and is pending approval.',
        data: { id: data.id }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Unexpected server error:', error);
    return NextResponse.json(
      { error: 'An unexpected server error occurred. Please try again.' },
      { status: 500 }
    );
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to submit memories.' },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to submit memories.' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to submit memories.' },
    { status: 405 }
  );
}
