const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');
const Profile = require('../models/Profile');
const EmergencyLog = require('../models/EmergencyLog');
const { protect } = require('../middleware/auth');

// GET /api/profiles — all profiles for logged-in caregiver
router.get('/', protect, async (req, res) => {
  try {
    const profiles = await Profile.find({ caregiverId: req.user._id, isActive: true })
      .select('-emergencyLogs')
      .sort({ createdAt: -1 });
    res.json({ profiles });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/profiles/activity — Get recent scan activity for caregiver
router.get('/activity', protect, async (req, res) => {
  try {
    // Only fetch activity for profiles that are currently active
    const profileIds = await Profile.find({ 
      caregiverId: req.user._id, 
      isActive: true 
    }).distinct('_id');

    const logs = await EmergencyLog.find({ profileId: { $in: profileIds } })
      .populate('profileId', 'name photo')
      .sort({ timestamp: -1 })
      .limit(10);
    res.json({ logs });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/profiles — create new profile
router.post('/', protect, async (req, res) => {
  try {
    const profile = await Profile.create({ ...req.body, caregiverId: req.user._id });
    profile.aiSummary = profile.generateSummary();
    await profile.save();
    res.status(201).json({ profile });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET /api/profiles/:id — get single profile (caregiver only)
router.get('/:id', protect, async (req, res) => {
  try {
    const profile = await Profile.findOne({ _id: req.params.id, caregiverId: req.user._id });
    if (!profile) return res.status(404).json({ message: 'Profile not found.' });
    res.json({ profile });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/profiles/:id — update profile
router.put('/:id', protect, async (req, res) => {
  try {
    const profile = await Profile.findOneAndUpdate(
      { _id: req.params.id, caregiverId: req.user._id },
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    if (!profile) return res.status(404).json({ message: 'Profile not found.' });
    profile.aiSummary = profile.generateSummary();
    await profile.save();
    res.json({ profile });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/profiles/:id — soft delete
router.delete('/:id', protect, async (req, res) => {
  try {
    await Profile.findOneAndUpdate(
      { _id: req.params.id, caregiverId: req.user._id },
      { isActive: false }
    );
    res.json({ message: 'Profile deleted.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/profiles/:id/qr — generate QR code
router.get('/:id/qr', protect, async (req, res) => {
  try {
    const profile = await Profile.findOne({ _id: req.params.id, caregiverId: req.user._id });
    if (!profile) return res.status(404).json({ message: 'Profile not found.' });

    const url = `${process.env.CLIENT_URL}/emergency/${profile.qrId}`;
    const qrDataUrl = await QRCode.toDataURL(url, {
      width: 300,
      margin: 2,
      color: { dark: '#1a1a2e', light: '#ffffff' }
    });
    res.json({ qrDataUrl, qrId: profile.qrId, url });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;