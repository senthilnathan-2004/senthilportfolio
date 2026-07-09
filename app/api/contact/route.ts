import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import ContactMessage from "@/models/ContactMessage";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Valid email is required"),
  message: z.string().min(5, "Message must be at least 5 characters").max(2000),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid form data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    await connectDB();

    const msg = await ContactMessage.create({
      name: parsed.data.name,
      email: parsed.data.email,
      message: parsed.data.message,
      read: false,
    });

    // Optional: send email via Nodemailer
    if (process.env.EMAIL_SERVER_HOST && process.env.EMAIL_SERVER_PASSWORD && process.env.CONTACT_RECEIVER_EMAIL) {
      try {
        const nodemailer = await import("nodemailer");
        const transporter = nodemailer.createTransport({
          host: process.env.EMAIL_SERVER_HOST,
          port: Number(process.env.EMAIL_SERVER_PORT) || 587,
          secure: Number(process.env.EMAIL_SERVER_PORT) === 465,
          auth: {
            user: process.env.EMAIL_SERVER_USER,
            pass: process.env.EMAIL_SERVER_PASSWORD,
          },
        });

        await transporter.sendMail({
          from: `"Portfolio Contact" <${process.env.EMAIL_FROM || process.env.EMAIL_SERVER_USER}>`,
          to: process.env.CONTACT_RECEIVER_EMAIL,
          subject: `New message from ${parsed.data.name}`,
          html: `
            <div style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace; max-width: 600px; margin: 0 auto; background-color: #0A0A0A; color: #E5E7EB; padding: 20px; border-radius: 12px; border: 1px solid #1F2937;">
              <div style="text-align: center; margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid rgba(0, 255, 128, 0.2);">
                <h2 style="color: #00FF80; font-size: 20px; margin: 0; text-transform: uppercase; letter-spacing: 2px;">Incoming Transmission</h2>
              </div>
              
              <div style="margin-bottom: 16px;">
                <span style="color: #6B7280; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Identifier</span>
                <p style="margin: 4px 0 0 0; font-size: 16px;">${parsed.data.name}</p>
              </div>

              <div style="margin-bottom: 24px;">
                <span style="color: #6B7280; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Return Address</span>
                <p style="margin: 4px 0 0 0; font-size: 16px;">
                  <a href="mailto:${parsed.data.email}" style="color: #00FF80; text-decoration: none;">${parsed.data.email}</a>
                </p>
              </div>

              <div>
                <span style="color: #6B7280; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Payload Content</span>
                <div style="background-color: rgba(255,255,255,0.03); border: 1px solid #1F2937; padding: 16px; border-radius: 8px; margin-top: 8px; font-family: sans-serif; line-height: 1.6; white-space: pre-wrap;">${parsed.data.message}</div>
              </div>
              
              <div style="text-align: center; margin-top: 32px; padding-top: 16px; border-top: 1px dashed rgba(255,255,255,0.1); font-size: 12px; color: #6B7280;">
                Sent via Senthilragu Portfolio Contact System
              </div>
            </div>
          `,
        });
      } catch (e) {
        // Email failed — message is still saved in DB
        console.error("Email send failed", e);
      }
    }

    return NextResponse.json({ success: true, id: msg._id.toString() });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json(
      { error: "Server error. Please try again." },
      { status: 500 }
    );
  }
}
