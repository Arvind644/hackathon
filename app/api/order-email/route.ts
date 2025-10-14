import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

import type { JewelryItem } from '@/lib/types';

type OrderEmailPayload = {
  email: string;
  customerName?: string;
  sessionId?: string;
  subtotal: number;
  shipping: number;
  total: number;
  selectedJewelry: JewelryItem[];
  tryOnImage?: string;
  faceImage?: string;
};

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (transporter) {
    return transporter;
  }

  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = Number(process.env.SMTP_PORT || '465');
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    throw new Error('SMTP_USER and SMTP_PASS environment variables must be set');
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });

  return transporter;
}

function renderItems(items: JewelryItem[]) {
  return items
    .map((item) => {
      const price = typeof item.price === 'number' ? `$${item.price.toFixed(2)}` : '—';
      return `
        <tr>
          <td style="padding: 8px 12px; border-bottom: 1px solid #f2f2f2;">
            <strong>${item.name}</strong><br />
            <span style="color:#666; font-size:13px;">${item.description}</span>
          </td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #f2f2f2; text-align:right;">
            ${price}
          </td>
        </tr>`;
    })
    .join('');
}

function renderEmailHtml(payload: OrderEmailPayload) {
  const itemsTable = renderItems(payload.selectedJewelry);
  const subtotal = `$${payload.subtotal.toFixed(2)}`;
  const shipping = `$${payload.shipping.toFixed(2)}`;
  const total = `$${payload.total.toFixed(2)}`;

  const previewImage = payload.tryOnImage || payload.faceImage;

  return `
    <div style="font-family: 'Segoe UI', Helvetica, Arial, sans-serif; color:#1d1d1f;">
      <h1 style="font-size:24px; margin-bottom:8px;">Thank you for visiting EVOL Jewels</h1>
      <p style="margin:0 0 16px;">${payload.customerName ? `Hi ${payload.customerName},` : 'Hi there,'} thanks for exploring our AI try-on experience. Here's a snapshot of the pieces you selected.</p>

      ${previewImage ? `<img src="${previewImage}" alt="Your try-on result" style="width:100%; max-width:520px; border-radius:16px; margin-bottom:24px;" />` : ''}

      <table style="width:100%; border-collapse:collapse; margin-bottom:16px;">
        <thead>
          <tr>
            <th style="text-align:left; padding:8px 12px; border-bottom:2px solid #dcbc84;">Jewelry</th>
            <th style="text-align:right; padding:8px 12px; border-bottom:2px solid #dcbc84;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${itemsTable}
        </tbody>
        <tfoot>
          <tr>
            <td style="padding:8px 12px; text-align:right; font-weight:600;">Subtotal</td>
            <td style="padding:8px 12px; text-align:right;">${subtotal}</td>
          </tr>
          <tr>
            <td style="padding:8px 12px; text-align:right; font-weight:600;">Shipping</td>
            <td style="padding:8px 12px; text-align:right;">${shipping}</td>
          </tr>
          <tr>
            <td style="padding:8px 12px; text-align:right; font-weight:700; font-size:18px;">Total</td>
            <td style="padding:8px 12px; text-align:right; font-weight:700; font-size:18px;">${total}</td>
          </tr>
        </tfoot>
      </table>

      <p style="margin:0 0 12px;">We'll keep these pieces reserved in your cart so you can continue shopping anytime. Use the button below to return to the kiosk journey.</p>
      <p style="margin:0 0 32px;"><a href="${process.env.NEXT_PUBLIC_KIOSK_URL ?? 'https://evoljewels.com'}" style="background:#dcbc84; color:#1d1d1f; padding:12px 24px; text-decoration:none; border-radius:999px; font-weight:600; display:inline-block;">Resume Journey</a></p>

      <p style="font-size:12px; color:#888;">Session: ${payload.sessionId ?? 'N/A'}</p>
      <p style="font-size:12px; color:#888;">Need assistance? Reply to this email and our concierge team will help you finalize your look.</p>
    </div>
  `;
}

function renderTextSummary(payload: OrderEmailPayload) {
  const lines = payload.selectedJewelry.map((item) => {
    const price = typeof item.price === 'number' ? `$${item.price.toFixed(2)}` : 'n/a';
    return `- ${item.name} (${price})`;
  });

  return [
    `Thank you for visiting EVOL Jewels${payload.customerName ? `, ${payload.customerName}` : ''}!`,
    '',
    'Your selected pieces:',
    ...lines,
    '',
    `Subtotal: $${payload.subtotal.toFixed(2)}`,
    `Shipping: $${payload.shipping.toFixed(2)}`,
    `Total: $${payload.total.toFixed(2)}`,
    '',
    `Session: ${payload.sessionId ?? 'N/A'}`,
    'We look forward to seeing you again soon!',
  ].join('\n');
}

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as Partial<OrderEmailPayload>;

    if (!payload.email || typeof payload.email !== 'string') {
      return NextResponse.json({ error: 'A valid recipient email is required' }, { status: 400 });
    }

    if (!Array.isArray(payload.selectedJewelry) || payload.selectedJewelry.length === 0) {
      return NextResponse.json({ error: 'At least one jewelry item must be provided' }, { status: 400 });
    }

    if (typeof payload.subtotal !== 'number' || typeof payload.total !== 'number') {
      return NextResponse.json({ error: 'Order totals are missing or invalid' }, { status: 400 });
    }

    const transporterInstance = getTransporter();

    const from = process.env.EMAIL_FROM || process.env.SMTP_USER || 'no-reply@evoljewels.com';
    const subject = `Your Evol Jewels look • Total ${payload.total.toFixed(2)}`;

    const html = renderEmailHtml(payload as OrderEmailPayload);
    const text = renderTextSummary(payload as OrderEmailPayload);

    await transporterInstance.sendMail({
      from,
      to: payload.email,
      subject,
      html,
      text,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to send order email:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: `Email delivery failed: ${message}` }, { status: 500 });
  }
}
