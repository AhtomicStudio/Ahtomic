import nodemailer from "nodemailer";

// Vercel serverless function — sends a notification email when the Contact
// form is submitted. Firestore (written client-side in Contact.jsx) stays
// the source of truth for inquiries; this is a best-effort notification on
// top of it, so a failure here never blocks the visitor's submission from
// succeeding.
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { name, email, budget, message, types } = req.body || {};
  if (!name || !email || !message) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;
  if (!gmailUser || !gmailPass) {
    console.error("send-inquiry-email: GMAIL_USER/GMAIL_APP_PASSWORD not configured");
    res.status(500).json({ error: "Email not configured" });
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: gmailUser, pass: gmailPass },
    });

    const typeList = types && typeof types === "object"
      ? Object.entries(types).filter(([, v]) => v).map(([k]) => k).join(", ")
      : "";

    await transporter.sendMail({
      from: `"Ahtomic Studio site" <${gmailUser}>`,
      to: gmailUser,
      replyTo: email,
      subject: `New inquiry from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nBudget: ${budget || "not specified"}\nProject type: ${typeList || "not specified"}\n\n${message}`,
    });

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error("send-inquiry-email failed:", err);
    res.status(500).json({ error: "Failed to send email" });
  }
}
