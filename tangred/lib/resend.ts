import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = process.env.FROM_EMAIL ?? 'noreply@tangred.in'

export async function sendOrderConfirmationEmail(
  to: string,
  name: string,
  orderNumber: string,
  total: number
) {
  await resend.emails.send({
    from: FROM,
    to,
    subject: `Order Confirmed — ${orderNumber} | Tangred`,
    html: `
      <div style="background:#0A0A0A;color:#F5F5F5;font-family:sans-serif;padding:40px;max-width:600px;margin:auto;">
        <h1 style="color:#C0392B;font-size:28px;letter-spacing:0.1em;">TANGRED</h1>
        <p style="color:#A0A0A0;font-size:14px;">PREMIUM HANDCRAFTED LEATHER GOODS</p>
        <hr style="border-color:#2A2A2A;margin:24px 0;" />
        <h2 style="color:#F5F5F5;font-size:22px;">Your order is confirmed, ${name}.</h2>
        <p style="color:#A0A0A0;">Order Number: <strong style="color:#C0392B;">${orderNumber}</strong></p>
        <p style="color:#A0A0A0;">Total Paid: <strong style="color:#F5F5F5;">₹${total.toLocaleString('en-IN')}</strong></p>
        <p style="color:#A0A0A0;margin-top:24px;">Your Tangred piece is being carefully crafted. We will notify you with shipping updates.</p>
        <hr style="border-color:#2A2A2A;margin:24px 0;" />
        <p style="color:#2A2A2A;font-size:12px;">© Tangred | Handcrafted in India</p>
      </div>
    `,
  })
}

export async function sendTanLeidaConfirmationEmail(
  to: string,
  name: string,
  tanLeidaId: string
) {
  await resend.emails.send({
    from: FROM,
    to,
    subject: `Your Tan Leida™ Session | ID: ${tanLeidaId}`,
    html: `
      <div style="background:#0A0A0A;color:#F5F5F5;font-family:sans-serif;padding:40px;max-width:600px;margin:auto;">
        <h1 style="color:#C0392B;font-size:28px;letter-spacing:0.1em;">TAN LEIDA™</h1>
        <p style="color:#A0A0A0;font-size:14px;">YOUR PERSONAL AI MASTER TAILOR BY TANGRED</p>
        <hr style="border-color:#2A2A2A;margin:24px 0;" />
        <h2 style="color:#F5F5F5;font-size:22px;">Welcome, ${name}.</h2>
        <p style="color:#A0A0A0;">Your Tan Leida session has been confirmed.</p>
        <p style="color:#A0A0A0;">Session ID: <strong style="color:#C0392B;font-size:20px;letter-spacing:0.15em;">${tanLeidaId}</strong></p>
        <p style="color:#A0A0A0;margin-top:24px;">This is your lifetime access ID. Keep it safe. You may begin your consultation at any time through your Tangred account.</p>
        <hr style="border-color:#2A2A2A;margin:24px 0;" />
        <p style="color:#2A2A2A;font-size:12px;">© Tangred | Crafted for Those Who Command Respect</p>
      </div>
    `,
  })
}

export async function sendVerificationEmail(
  to: string,
  name: string,
  otp: string
) {
  await resend.emails.send({
    from: FROM,
    to,
    subject: `Verify Your Tangred Account — ${otp}`,
    html: `
      <div style="background:#0A0A0A;color:#F5F5F5;font-family:sans-serif;padding:40px;max-width:600px;margin:auto;">
        <h1 style="color:#C0392B;font-size:28px;letter-spacing:0.1em;">TANGRED</h1>
        <hr style="border-color:#2A2A2A;margin:24px 0;" />
        <h2 style="color:#F5F5F5;font-size:22px;">Welcome, ${name}.</h2>
        <p style="color:#A0A0A0;">Your verification code is:</p>
        <p style="color:#C0392B;font-size:40px;letter-spacing:0.3em;font-weight:bold;">${otp}</p>
        <p style="color:#A0A0A0;font-size:14px;">This code expires in 10 minutes.</p>
        <hr style="border-color:#2A2A2A;margin:24px 0;" />
        <p style="color:#2A2A2A;font-size:12px;">© Tangred | Handcrafted in India</p>
      </div>
    `,
  })
}
