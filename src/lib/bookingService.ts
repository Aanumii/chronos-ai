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
    // First, send to N8N webhook and wait for confirmation
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

    // Only proceed if N8N confirms successful processing
    if (!webhookResponse.ok) {
      console.error('N8N webhook failed with status:', webhookResponse.status);
      return { 
        success: false, 
        error: 'Failed to process appointment. Please try again.' 
      };
    }

    // Wait for N8N response before inserting into database
    const n8nResult = await webhookResponse.text();
    console.log('N8N response:', n8nResult);

    // Only insert into Supabase after N8N confirms
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
