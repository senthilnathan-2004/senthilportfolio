"use server";

import connectDB from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";
import User from "@/models/User";
import ContactMessage from "@/models/ContactMessage";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

// --- Site Settings ---
export async function getSiteSettings() {
  await connectDB();
  const settings = await SiteSettings.findOne().lean();
  return JSON.parse(JSON.stringify(settings));
}

export async function updateSiteSettings(data: Partial<{
  logoText: string;
  navLinks: Array<{ label: string; href: string; order: number }>;
  ctaText: string;
  ctaHref: string;
  footerText: string;
  footerQuickLinks: Array<{ label: string; href: string; order: number }>;
  socialLinks: Array<{ platform: string; url: string; order: number }>;
  contactEmail: string;
  contactLocation: string;
  faviconUrl: string;
  faviconFileId: string;
  startupName: string;
  startupUrl: string;
}>) {
  await connectDB();
  const settings = await SiteSettings.findOneAndUpdate({}, data, { new: true, upsert: true });
  revalidatePath("/");
  revalidatePath("/", "layout");
  return JSON.parse(JSON.stringify(settings));
}

// --- Change Password ---
export async function changePassword(email: string, currentPassword: string, newPassword: string) {
  await connectDB();
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) return { error: "User not found" };

  const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!isValid) return { error: "Current password is incorrect" };

  if (newPassword.length < 8) return { error: "New password must be at least 8 characters" };

  const newHash = await bcrypt.hash(newPassword, 12);
  await User.findByIdAndUpdate(user._id, { passwordHash: newHash });
  return { success: true };
}

export async function updateAdminEmail(currentEmail: string, newEmail: string, password: string) {
  await connectDB();
  const user = await User.findOne({ email: currentEmail.toLowerCase() });
  if (!user) return { error: "User not found" };

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) return { error: "Password is incorrect" };

  const emailExists = await User.findOne({ email: newEmail.toLowerCase() });
  if (emailExists && emailExists._id.toString() !== user._id.toString()) {
    return { error: "Email already in use" };
  }

  await User.findByIdAndUpdate(user._id, { email: newEmail.toLowerCase() });
  return { success: true };
}

// --- Messages ---
export async function getMessages() {
  await connectDB();
  const messages = await ContactMessage.find().sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(messages));
}

export async function markMessageRead(id: string) {
  await connectDB();
  await ContactMessage.findByIdAndUpdate(id, { read: true });
}

export async function deleteMessage(id: string) {
  await connectDB();
  await ContactMessage.findByIdAndDelete(id);
}

export async function sendReply(id: string, replyText: string) {
  await connectDB();
  const msg = await ContactMessage.findById(id);
  if (!msg) throw new Error("Message not found");

  const emailHost = process.env.EMAIL_SERVER_HOST || process.env.SMTP_HOST;
  const emailPort = process.env.EMAIL_SERVER_PORT || process.env.SMTP_PORT;
  const emailUser = process.env.EMAIL_SERVER_USER || process.env.SMTP_USER;
  const emailPass = process.env.EMAIL_SERVER_PASSWORD || process.env.SMTP_PASS;

  if (emailHost && emailPass) {
    const nodemailer = await import("nodemailer");
    const transporter = nodemailer.createTransport({
      host: emailHost,
      port: Number(emailPort) || 587,
      secure: Number(emailPort) === 465,
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || `"Senthilnathan R" <${emailUser}>`,
      to: msg.email,
      subject: `Re: Your message to Senthilnathan R`,
      text: replyText,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
          <p>${replyText.replace(/\n/g, "<br>")}</p>
          <hr style="border: none; border-top: 1px solid #eaeaea; margin: 24px 0;" />
          <p style="font-size: 12px; color: #888;">
            On ${new Date(msg.createdAt).toLocaleDateString()}, you wrote:<br>
            <em style="color: #666;">${msg.message}</em>
          </p>
        </div>
      `,
    });
  } else {
    throw new Error("SMTP is not configured in .env.local");
  }

  await ContactMessage.findByIdAndUpdate(id, { read: true });
}

// --- Dashboard stats ---
export async function getDashboardStats() {
  await connectDB();
  const [projectCount, unreadCount] = await Promise.all([
    (await import("@/models/Project")).default.countDocuments(),
    ContactMessage.countDocuments({ read: false }),
  ]);
  return { projectCount, unreadCount };
}
