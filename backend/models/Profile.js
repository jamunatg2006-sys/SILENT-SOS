const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

// Emergency Contact sub-schema
const emergencyContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  relationship: { type: String, required: true },
  isPrimary: { type: Boolean, default: false }
});

// DSA Concept: Priority-based allergy list (critical > moderate > mild)
const allergySchema = new mongoose.Schema({
  name: { type: String, required: true },
  severity: { type: String, enum: ['critical', 'moderate', 'mild'], default: 'moderate' },
  reaction: { type: String }
});

const profileSchema = new mongoose.Schema({
  caregiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Unique QR identifier
  qrId: {
    type: String,
    default: () => uuidv4(),
    unique: true
  },

  // Basic Info
  name: { type: String, required: true, trim: true },
  age: { type: Number, required: true },
  photo: { type: String, default: '' },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'],
    default: 'Unknown'
  },
  preferredLanguage: { type: String, default: 'English' },

  // Medical
  conditions: [{ type: String }],
  // DSA: Sorted by severity using priority ordering
  allergies: [allergySchema],
  medications: [{ name: String, dosage: String, frequency: String }],
  calmAudioUrl: { type: String, default: '' },

  // Communication
  calmTriggers: [{ type: String }],
  avoidTriggers: [{ type: String }],
  communicationNotes: { type: String },

  // Emergency Contacts — sorted: primary first (DSA: max-heap concept)
  emergencyContacts: [emergencyContactSchema],

  // AI-generated plain-language summary
  aiSummary: { type: String, default: '' },

  whatsappSosEnabled: { type: Boolean, default: true },

  // Emergency log (DSA: Stack — most recent first)
  emergencyLogs: [{
    timestamp: { type: Date, default: Date.now },
    location: { lat: Number, lng: Number, address: String },
    scannedBy: { type: String }
  }],

  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// DSA Concept: Before saving, sort allergies by severity priority (critical first)
profileSchema.pre('save', function (next) {
  const priorityOrder = { critical: 0, moderate: 1, mild: 2 };
  this.allergies.sort((a, b) => priorityOrder[a.severity] - priorityOrder[b.severity]);

  // Sort contacts: primary first
  this.emergencyContacts.sort((a, b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0));

  this.updatedAt = new Date();
  next();
});

// DSA: Push new emergency log to front (stack behavior)
profileSchema.methods.logEmergency = function (location, scannedBy) {
  this.emergencyLogs.unshift({ location, scannedBy, timestamp: new Date() });
  // Keep only last 50 logs (bounded stack)
  if (this.emergencyLogs.length > 50) this.emergencyLogs = this.emergencyLogs.slice(0, 50);
};

// Generate plain-language AI summary
profileSchema.methods.generateSummary = function () {
  const conditions = this.conditions || [];
  const criticalAllergies = this.allergies.filter(a => a.severity === 'critical').map(a => a.name);
  
  let playbook = `This is ${this.name}. They are non-verbal and have ${conditions.length > 0 ? conditions.join(', ') : 'a communication impairment'}. `;
  
  // Add specific actionable advice based on conditions
  const lowerConditions = conditions.map(c => c.toLowerCase());
  if (lowerConditions.some(c => c.includes('autism') || c.includes('sensory'))) {
    playbook += "Sensory Alert: Avoid physical touch and minimize loud noises. Use simple signs. ";
  }
  if (lowerConditions.some(c => c.includes('epilepsy') || c.includes('seizure'))) {
    playbook += "If a seizure occurs, protect their head and do not put anything in their mouth. ";
  }
  if (lowerConditions.some(c => c.includes('stroke') || c.includes('palsy'))) {
    playbook += "Movement Alert: They may have limited mobility or difficulty swallowing. ";
  }
  if (lowerConditions.some(c => c.includes('dementia') || c.includes('down syndrome'))) {
    playbook += "They may be disoriented. Please speak slowly and use a gentle tone. ";
  }
  if (criticalAllergies.length > 0) {
    playbook += `CRITICAL ALLERGY: They are allergic to ${criticalAllergies.join(', ')}. `;
  }
  
  return playbook + "Please remain calm and stay with them until help arrives.";
};

module.exports = mongoose.model('Profile', profileSchema);