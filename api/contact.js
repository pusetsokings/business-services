const nodemailer = require('nodemailer');

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

  // Send email (primary - works without MongoDB)
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
        connectionTimeout: 5000,
        greetingTimeout: 5000,
        socketTimeout: 5000,
      });
      await transporter.verify();
      await transporter.sendMail({
        from: `"Prospero Leads" <${smtpUser}>`,
        to: ['info@prosperokings.com', 'walterkadibadiba@gmail.com'],
        subject: `New Lead: ${cleanName}`,
        html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#1A1814;color:#F5F0E8;"><h2 style="color:#C8963E;">New Lead</h2><table style="width:100%;"><tr><td style="color:#A69B8C;padding:8px 0;width:120px;">Name</td><td style="padding:8px 0;">${cleanName}</td></tr><tr><td style="color:#A69B8C;padding:8px 0;">Email</td><td style="padding:8px 0;">${cleanEmail}</td></tr><tr><td style="color:#A69B8C;padding:8px 0;">Phone</td><td style="padding:8px 0;">${phone || '-'}</td></tr><tr><td style="color:#A69B8C;padding:8px 0;">Stage</td><td style="padding:8px 0;">${stage || '-'}</td></tr><tr><td style="color:#A69B8C;padding:8px 0;vertical-align:top;">Message</td><td style="padding:8px 0;">${message || '-'}</td></tr></table></div>`,
      });
      emailSent = true;
    } catch (err) {
      console.error('Email error:', err.message);
    }
  }

  // Try MongoDB (bonus - 6 second timeout)
  let savedToDb = false;
  const mongoose = require('mongoose');
  const MONGODB_URI = process.env.MONGODB_URI;
  if (MONGODB_URI) {
    try {
      await Promise.race([
        mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 6000))
      ]);
      const LeadSchema = new mongoose.Schema({ name: String, email: String, phone: String, stage: String, message: String, source: String, createdAt: { type: Date, default: Date.now } });
      const Lead = mongoose.models.Lead || mongoose.model('Lead', LeadSchema);
      await Lead.create({ name: cleanName, email: cleanEmail, phone: phone ? String(phone).trim() : '', stage: stage ? String(stage) : '', message: message ? String(message).trim() : '', source: 'website' });
      savedToDb = true;
    } catch (err) {
      console.error('DB error:', err.message);
    }
  }

  res.status(200).json({
    success: true,
    savedToDb,
    emailSent,
    message: emailSent ? 'Thank you! We have received your inquiry and will contact you shortly.' : 'Thank you! We will contact you shortly.',
  });
};