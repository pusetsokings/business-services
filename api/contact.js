const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

const MONGODB_URI = process.env.MONGODB_URI;

let cachedConnection = null;

async function connectDB() {
  if (cachedConnection && mongoose.connection.readyState === 1) return;
  if (!MONGODB_URI) return;
  cachedConnection = await mongoose.connect(MONGODB_URI);
}

const LeadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  stage: { type: String },
  message: { type: String },
  source: { type: String, default: 'website' },
  createdAt: { type: Date, default: Date.now },
});

const Lead = mongoose.models.Lead || mongoose.model('Lead', LeadSchema);

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, email, phone, stage, message } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const cleanEmail = String(email).trim().toLowerCase();
  const cleanName = String(name).trim();

  let savedToDb = false;
  try {
    await connectDB();
    await Lead.create({
      name: cleanName,
      email: cleanEmail,
      phone: phone ? String(phone).trim() : '',
      stage: stage ? String(stage) : '',
      message: message ? String(message).trim() : '',
      source: 'website',
    });
    savedToDb = true;
  } catch {
    savedToDb = false;
  }

  let emailSent = false;
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (smtpHost && smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: { user: smtpUser, pass: smtpPass },
      });

      await transporter.sendMail({
        from: `"Prospero Leads" <${smtpUser}>`,
        to: ['info@prosperokings.com', 'walterkadibadiba@gmail.com'],
        subject: `New Lead: ${cleanName}`,
        html: `
          <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #1A1814; color: #F5F0E8; border-radius: 12px;">
            <h2 style="color: #C8963E; margin-top: 0;">New Lead Submitted</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #A69B8C; width: 120px;">Name</td><td style="padding: 8px 0;">${cleanName}</td></tr>
              <tr><td style="padding: 8px 0; color: #A69B8C;">Email</td><td style="padding: 8px 0;"><a href="mailto:${cleanEmail}" style="color: #C8963E;">${cleanEmail}</a></td></tr>
              <tr><td style="padding: 8px 0; color: #A69B8C;">Phone</td><td style="padding: 8px 0;">${phone || '-'}</td></tr>
              <tr><td style="padding: 8px 0; color: #A69B8C;">Stage</td><td style="padding: 8px 0;">${stage || '-'}</td></tr>
              <tr><td style="padding: 8px 0; color: #A69B8C; vertical-align: top;">Message</td><td style="padding: 8px 0;">${message || '-'}</td></tr>
            </table>
            <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid rgba(200,150,62,0.2);">
              <a href="https://business-services-wine.vercel.app/" style="color: #C8963E; text-decoration: none;">View Dashboard &rarr;</a>
            </div>
          </div>
        `,
      });
      emailSent = true;
    } catch {
      emailSent = false;
    }
  }

  res.status(200).json({
    success: true,
    savedToDb,
    emailSent,
    message: savedToDb
      ? 'Thank you! We have received your inquiry and will contact you shortly.'
      : 'Thank you! Your inquiry has been received. We will contact you shortly.',
  });
};
