import nodemailer from "nodemailer";

// Vercel serverless function — sends the admin's typed reply to an inquiry,
// from the studio's Gmail account. Requires a valid Firebase ID token so
// this can't be used as an open relay by anyone who finds the endpoint;
// verified via Google's Identity Toolkit REST API using the public Firebase
// web API key (Firebase web API keys identify the project, not a secret —
// security is enforced by who holds a valid ID token, not by hiding this
// key, so no service-account credential is needed here).
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { idToken, to, subject, message } = req.body || {};
  if (!idToken || !to || !message) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  const apiKey = process.env.VITE_FIREBASE_API_KEY;
  if (!apiKey) {
    console.error("send-reply-email: VITE_FIREBASE_API_KEY not configured");
    res.status(500).json({ error: "Server not configured" });
    return;
  }

  try {
    const verifyRes = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      }
    );
    const verifyData = await verifyRes.json();
    if (!verifyRes.ok || !verifyData.users || !verifyData.users.length) {
      res.status(401).json({ error: "Not authorized" });
      return;
    }
  } catch (err) {
    console.error("send-reply-email: token verification failed:", err);
    res.status(401).json({ error: "Not authorized" });
    return;
  }

  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;
  if (!gmailUser || !gmailPass) {
    console.error("send-reply-email: GMAIL_USER/GMAIL_APP_PASSWORD not configured");
    res.status(500).json({ error: "Email not configured" });
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: gmailUser, pass: gmailPass },
    });

    await transporter.sendMail({
      from: `"Ahtomic Studio" <${gmailUser}>`,
      to,
      subject: subject || "Re: your inquiry to Ahtomic Studio",
      text: message,
    });

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error("send-reply-email failed:", err);
    res.status(500).json({ error: "Failed to send reply" });
  }
}
