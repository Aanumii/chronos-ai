import { supabase } from '@/integrations/supabase/client';

const N8N_WEBHOOK_URL = 'https://ariawhitly.app.n8n.cloud/webhook-test/appointment';

interface BookingData {
  name: string;
  email: string;
  date: string;
  time: string;
}

export async function submitBooking(data: BookingData): Promise<{ success: boolean; error?: string }> {
  try {
    // First, send to N8N webhook for AI automation
    const webhookResponse = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        date: data.date,
        time: data.time,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!webhookResponse.ok) {
      console.warn('N8N webhook failed, but continuing with database insert');
    }

    // Insert into Supabase
    const { error: dbError } = await supabase
      .from('appointments')
      .insert({
        name: data.name,
        email: data.email,
        date: data.date,
        time: data.time,
        status: 'scheduled',
      });

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error('Failed to save appointment');
    }

    return { success: true };
  } catch (error) {
    console.error('Booking submission error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    };
  }
}
