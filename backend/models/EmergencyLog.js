const mongoose = require('mongoose');

const emergencyLogSchema = new mongoose.Schema({
  profileId: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile', required: true },
  qrId: { type: String, required: true },
  location: {
    lat: Number,
    lng: Number,
    address: { type: String, default: 'Location not available' }
  },
  scannedBy: { type: String, default: 'Anonymous' },
  alertSent: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('EmergencyLog', emergencyLogSchema);