// Email notifications. Swap the stub for SendGrid / Resend / SMTP in production.
export async function sendEmail({ to, subject, html }) {
  if (!process.env.EMAIL_PROVIDER_API_KEY) {
    // eslint-disable-next-line no-console
    console.log(`[email:stub] -> ${to} | ${subject}`);
    return { stub: true };
  }
  // TODO: integrate provider SDK here.
  return { sent: true };
}

export const sendWelcomeEmail = (user) =>
  sendEmail({ to: user.email, subject: 'Welcome to Sai Stationary 🎉', html: `<p>Hi ${user.name}, welcome!</p>` });

export const sendOrderConfirmation = (order) =>
  sendEmail({
    to: order.address?.email || order.email,
    subject: `Order ${order.id} confirmed`,
    html: `<p>Thanks! Your order ${order.id} is confirmed.</p>`,
  });

export const sendShippingUpdate = (order, status) =>
  sendEmail({
    to: order.address?.email || order.email,
    subject: `Order ${order.id} update: ${status}`,
    html: `<p>Your order ${order.id} is now <b>${status}</b>.</p>`,
  });
