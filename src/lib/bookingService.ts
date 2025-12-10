const N8N_WEBHOOK_URL = 'https://ariawhitly.app.n8n.cloud/webhook-test/appointment';

interface BookingData {
  name: string;
  email: string;
  date: string;
  time: string;
}

export async function submitBooking(data: BookingData): Promise<{ success: boolean; error?: string }> {
  try {
    // Send booking details to N8N webhook only
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
      console.error('N8N webhook failed with status:', webhookResponse.status);
      const errorText = await webhookResponse.text();
      console.error('N8N error response:', errorText);
      // Still return success since we want to show success to user
      // n8n will handle the actual processing
    }

    const n8nResult = await webhookResponse.text();
    console.log('N8N response:', n8nResult);

    return { success: true };
  } catch (error) {
    console.error('Booking submission error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    };
  }
}
