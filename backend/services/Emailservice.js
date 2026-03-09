import { Resend } from 'resend'

// Initialize lazily so dotenv loads first
function getResend() {
    return new Resend(process.env.RESEND_API_KEY)
}

// ── Send OTP Email ────────────────────────────────────
export async function sendOTPEmail({ to, name, otp }) {
    await getResend().emails.send({
        from:    'Marbvelous <onboarding@resend.dev>',
        to,
        subject: 'Your Marbvelous OTP Code',
        html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #f9fafb; border-radius: 12px;">
        <h1 style="font-family: Georgia, serif; font-size: 28px; color: #1a1a2e; margin: 0 0 24px;">
          <span style="color: #4A90D9;">M</span>arbvelous
        </h1>
        <p style="font-size: 16px; color: #1a1a2e; margin: 0 0 8px;">Hi ${name},</p>
        <p style="font-size: 15px; color: #6b7280; margin: 0 0 32px;">
          Use the OTP below to verify your account. It expires in 10 minutes.
        </p>
        <div style="background: #ffffff; border: 1.5px solid #e5e7eb; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 32px;">
          <p style="font-size: 13px; color: #6b7280; margin: 0 0 8px; text-transform: uppercase; letter-spacing: 0.1em;">Your OTP</p>
          <p style="font-size: 42px; font-weight: 700; color: #4A90D9; letter-spacing: 12px; margin: 0;">${otp}</p>
        </div>
        <p style="font-size: 13px; color: #9ca3af; margin: 0 0 8px;">
          Never share this OTP with anyone. Marbvelous will never ask for your OTP.
        </p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
        <p style="font-size: 12px; color: #d1d5db; margin: 0; text-align: center;">2026 Marbvelous. All rights reserved.</p>
      </div>
    `,
    })
}

// ── Send Welcome Email (Buyer) ────────────────────────
export async function sendBuyerWelcomeEmail({ to, name }) {
    await getResend().emails.send({
        from:    'Marbvelous <onboarding@resend.dev>',
        to,
        subject: 'Welcome to Marbvelous!',
        html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #f9fafb; border-radius: 12px;">
        <h1 style="font-family: Georgia, serif; font-size: 28px; color: #1a1a2e; margin: 0 0 24px;">
          <span style="color: #4A90D9;">M</span>arbvelous
        </h1>
        <p style="font-size: 16px; color: #1a1a2e; margin: 0 0 8px;">Welcome, ${name}!</p>
        <p style="font-size: 15px; color: #6b7280; margin: 0 0 24px;">
          Your account has been created successfully. You can now browse and buy premium tiles, marbles, faucets, sinks and plumbing tools.
        </p>
        <div style="background: #e8f2fc; border-radius: 10px; padding: 20px; margin-bottom: 32px;">
          <p style="font-size: 14px; font-weight: 600; color: #1a1a2e; margin: 0 0 12px;">What you can do now:</p>
          <p style="font-size: 14px; color: #4b5563; margin: 0 0 6px;">Browse thousands of tiles and marbles</p>
          <p style="font-size: 14px; color: #4b5563; margin: 0 0 6px;">Track your orders in real time</p>
          <p style="font-size: 14px; color: #4b5563; margin: 0;">Save payment methods for faster checkout</p>
        </div>
        <a href="http://localhost:5173" style="display: inline-block; background: #4A90D9; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px;">
          Start Shopping
        </a>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0 16px;" />
        <p style="font-size: 12px; color: #d1d5db; margin: 0; text-align: center;">2026 Marbvelous. All rights reserved.</p>
      </div>
    `,
    })
}

// ── Send Welcome Email (Seller) ───────────────────────
export async function sendSellerWelcomeEmail({ to, name, storeName }) {
    await getResend().emails.send({
        from:    'Marbvelous <onboarding@resend.dev>',
        to,
        subject: 'Your Marbvelous Seller Account is Under Review',
        html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #f9fafb; border-radius: 12px;">
        <h1 style="font-family: Georgia, serif; font-size: 28px; color: #1a1a2e; margin: 0 0 24px;">
          <span style="color: #4A90D9;">M</span>arbvelous
        </h1>
        <p style="font-size: 16px; color: #1a1a2e; margin: 0 0 8px;">Hi ${name},</p>
        <p style="font-size: 15px; color: #6b7280; margin: 0 0 24px;">
          Thank you for registering <strong>${storeName}</strong> on Marbvelous. Your seller account is currently under review.
        </p>
        <div style="background: #fff7ed; border: 1.5px solid #fed7aa; border-radius: 10px; padding: 20px; margin-bottom: 32px;">
          <p style="font-size: 14px; font-weight: 600; color: #92400e; margin: 0 0 8px;">Account Status: Under Review</p>
          <p style="font-size: 14px; color: #78350f; margin: 0;">
            Our team will verify your documents and approve your account within <strong>24-48 hours</strong>.
          </p>
        </div>
        <p style="font-size: 14px; color: #6b7280; margin: 0 0 8px;">Once approved you can:</p>
        <p style="font-size: 14px; color: #4b5563; margin: 0 0 6px;">List your tiles and marble products</p>
        <p style="font-size: 14px; color: #4b5563; margin: 0 0 6px;">Receive payments directly to your bank</p>
        <p style="font-size: 14px; color: #4b5563; margin: 0 0 24px;">Track orders and manage your store</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0 16px;" />
        <p style="font-size: 12px; color: #d1d5db; margin: 0; text-align: center;">2026 Marbvelous. All rights reserved.</p>
      </div>
    `,
    })
}