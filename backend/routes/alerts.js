const express = require('express');
const router = express.Router();
const EmergencyLog = require('../models/EmergencyLog');
const Profile = require('../models/Profile');

// POST /api/alerts/sos — trigger SOS (log alert)
router.post('/sos', async (req, res) => {
  try {
    const { qrId, location } = req.body;
    const profile = await Profile.findOne({ qrId });
    if (!profile) return res.status(404).json({ message: 'Profile not found.' });

    // Log emergency with alert flag
    const log = await EmergencyLog.create({
      profileId: profile._id,
      qrId,
      location: location || {},
      alertSent: true
    });

    const primaryContact = profile.emergencyContacts.find(c => c.isPrimary) || profile.emergencyContacts[0];

    // Construct the Pre-filled WhatsApp Message
    const profileLink = `${process.env.CLIENT_URL}/emergency/${qrId}`;
    const mapsLink = location?.lat 
      ? `https://www.google.com/maps?q=${location.lat},${location.lng}`
      : 'Location Permission Denied';

    const messageText = `🚨 *EMERGENCY ALERT*\n\nI need immediate assistance.\n\n📍 *Live Location:*\n${mapsLink}\n\n🆔 *Emergency Profile:*\n${profileLink}\n\nPlease contact me immediately.`;

    res.json({
      message: 'SOS alert logged.',
      contact: primaryContact,
      logId: log._id,
      whatsappSosEnabled: profile.whatsappSosEnabled,
      whatsappLink: primaryContact
        ? `https://wa.me/${primaryContact.phone.replace(/\D/g, '')}?text=${encodeURIComponent(messageText)}`
        : null
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;