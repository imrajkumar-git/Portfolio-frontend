import { NextResponse } from "next/server";

// This route receives the contact form submission.
// Plug in an email service (Resend, Nodemailer + SMTP, SendGrid, etc.)
// here to forward messages to rajkumararyal0977@gmail.com.
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, budget, message } = body || {};

    if (!name || !email || !message) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields." },
        { status: 400 }
      );
    }

    // Example: log the submission on the server.
    // Replace this with a real email/CRM integration.
    console.log("New contact form submission:", {
      name,
      email,
      budget,
      message,
      receivedAt: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: "Invalid request." },
      { status: 400 }
    );
  }
}
