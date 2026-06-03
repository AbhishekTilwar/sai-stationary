// WhatsApp notifications via Meta Cloud API / Gupshup / Twilio. Stubbed for dev.
export async function sendWhatsAppUpdate(order, status) {
  const phone = order.address?.phone;
  if (!process.env.WHATSAPP_API_TOKEN || !phone) {
    // eslint-disable-next-line no-console
    console.log(`[whatsapp:stub] -> ${phone || 'n/a'} | Order ${order.id}: ${status}`);
    return { stub: true };
  }
  // TODO: POST to WhatsApp Cloud API:
  //   https://graph.facebook.com/v20.0/{WHATSAPP_PHONE_ID}/messages
  return { sent: true };
}
