const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');
const EmergencyLog = require('../models/EmergencyLog');

// GET /api/emergency/:qrId — PUBLIC — no auth required (stranger scans QR)
router.get('/:qrId', async (req, res) => {
  try {
    const profile = await Profile.findOne({ qrId: req.params.qrId, isActive: true })
      .select('-caregiverId -emergencyLogs -__v');

    if (!profile) return res.status(404).json({ message: 'Profile not found or inactive.' });

    // DSA: Log this emergency scan (push to stack in profile)
    const log = await EmergencyLog.create({
      profileId: profile._id,
      qrId: req.params.qrId,
      location: { address: 'Initializing GPS...' },
      scannedBy: req.headers['x-forwarded-for'] || req.ip
    });

    // Return only essential emergency fields
    res.json({
      name: profile.name,
      age: profile.age,
      photo: profile.photo,
      bloodGroup: profile.bloodGroup,
      conditions: profile.conditions,
      allergies: profile.allergies,          // already sorted: critical first
      medications: profile.medications,
      calmTriggers: profile.calmTriggers,
      avoidTriggers: profile.avoidTriggers,
      communicationNotes: profile.communicationNotes,
      emergencyContacts: profile.emergencyContacts,  // primary first
      aiSummary: profile.aiSummary,
      preferredLanguage: profile.preferredLanguage,
      logId: log._id
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/emergency/:qrId/location — update location on scan
router.post('/:qrId/location', async (req, res) => {
  try {
    const { lat, lng, address, logId } = req.body;
    await EmergencyLog.findByIdAndUpdate(logId, { location: { lat, lng, address } });
    res.json({ message: 'Location updated.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/emergency/:qrId/note — allow stranger to leave a note for caregiver
router.post('/:qrId/note', async (req, res) => {
  try {
    const { note, logId } = req.body;
    await EmergencyLog.findByIdAndUpdate(logId, { note });
    res.json({ message: 'Note sent to caregiver.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;