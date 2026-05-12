const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

let cachedConnection = null;

async function connectDB() {
  if (cachedConnection && mongoose.connection.readyState === 1) return;
  if (!MONGODB_URI) return;
  cachedConnection = await mongoose.connect(MONGODB_URI);
}

const LeadSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  stage: String,
  message: String,
  source: String,
  createdAt: { type: Date, default: Date.now },
});

const Lead = mongoose.models.Lead || mongoose.model('Lead', LeadSchema);

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-key');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const adminKey = req.headers['x-admin-key'] || req.query.key;
  const expectedKey = process.env.ADMIN_KEY || 'prospero2026';
  if (adminKey !== expectedKey) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!MONGODB_URI) {
    return res.status(500).json({ error: 'Database not configured' });
  }

  try {
    await connectDB();
    const leads = await Lead.find({}).sort({ createdAt: -1 }).limit(200);
    const total = await Lead.countDocuments();
    res.status(200).json({ leads, total });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch leads', details: err.message });
  }
};
