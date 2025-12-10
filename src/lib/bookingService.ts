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
    // Send to N8N webhook (non-blocking, continue even if it fails)
    let webhookSuccess = false;
    try {
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

      if (webhookResponse.ok) {
        const n8nResult = await webhookResponse.text();
        console.log('N8N response:', n8nResult);
        webhookSuccess = true;
      } else {
        console.warn('N8N webhook returned non-OK status:', webhookResponse.status);
        // Log the response for debugging but continue with booking
        const errorText = await webhookResponse.text();
        console.warn('N8N error response:', errorText);
      }
    } catch (webhookError) {
      console.warn('N8N webhook failed, continuing with booking:', webhookError);
    }

    // Insert into Supabase database
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

    console.log('Booking saved successfully. N8N webhook:', webhookSuccess ? 'sent' : 'failed (appointment still saved)');
    return { success: true };
  } catch (error) {
    console.error('Booking submission error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    };
  }
}
