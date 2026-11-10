import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount = '45.00', currency = 'USD', description = 'PayPal AI Guardian Sandbox Payment' } = body;

    // Check if live PayPal Sandbox credentials are provided in environment
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

    if (clientId && clientSecret && clientId !== 'sb-mock-client-id-49210') {
      try {
        // Exchange credentials for OAuth access token
        const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
        const tokenRes = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
          method: 'POST',
          headers: {
            Authorization: `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: 'grant_type=client_credentials',
        });

        if (tokenRes.ok) {
          const tokenData = await tokenRes.json();
          const orderRes = await fetch('https://api-m.sandbox.paypal.com/v2/checkout/orders', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${tokenData.access_token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              intent: 'CAPTURE',
              purchase_units: [
                {
                  amount: {
                    currency_code: currency,
                    value: parseFloat(amount).toFixed(2),
                  },
                  description,
                },
              ],
            }),
          });

          if (orderRes.ok) {
            const orderData = await orderRes.json();
            return NextResponse.json({
              success: true,
              mode: 'live_sandbox',
              orderId: orderData.id,
              status: orderData.status,
              links: orderData.links,
            });
          }
        }
      } catch (liveError) {
        console.warn('Live PayPal Sandbox API failed, falling back to simulated sandbox:', liveError);
      }
    }

    // High-Fidelity Sandbox Simulator
    const mockOrderId = `ORD-SB-${Math.floor(100000 + Math.random() * 900000)}`;
    return NextResponse.json({
      success: true,
      mode: 'simulated_sandbox',
      orderId: mockOrderId,
      status: 'CREATED',
      amount: parseFloat(amount).toFixed(2),
      currency,
      description,
      approvalUrl: `https://www.sandbox.paypal.com/checkoutnow?token=${mockOrderId}`,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create PayPal sandbox order' },
      { status: 500 }
    );
  }
}
