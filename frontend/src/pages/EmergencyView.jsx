import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Shield, Phone, MapPin, MessageSquare, FileText, Volume2, AlertTriangle, Copy, Languages, Home, Stethoscope, Activity, CheckCircle2, AlertCircle, AlertOctagon, X, Search, MessageCircle, ChevronDown, Globe } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';

const speak = (text) => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.85; window.speechSynthesis.speak(u);
    toast(`Announcing: "${text}"`, { icon: '🔊', duration: 3000 });
  }
};

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', flag: '🇮🇳' }
];

const STATUSES = [
  { id: 0, label: 'Conscious & Responsive', icon: 'ti-circle-check', color: 'emerald' },
  { id: 1, label: 'Unresponsive', icon: 'ti-alert-circle', color: 'amber' },
  { id: 2, label: 'Needs Immediate Help', icon: 'ti-urgent', color: 'rose', pulse: true },
  { id: 3, label: 'Transported to Hospital', icon: 'ti-ambulance', color: 'violet' },
  { id: 4, label: 'Incident Resolved', icon: 'ti-check', color: 'slate' }
];

const UI_STRINGS = {
  en: {
    banner: "Emergency Profile — Non-Verbal Patient",
    bannerDemo: "Live Demo Mode — Experience SilentSOS",
    rescuePlaybook: "Rescue Playbook",
    safetyAssistant: "AI Safety Assistant",
    safetyAssistantDesc: "Describe symptoms or behavior to receive immediate safety guidance.",
    symptomsPlaceholder: "e.g. 'Difficulty breathing' or 'Appears scared'...",
    getGuidance: "Get Safety Guidance",
    analyzing: "Analyzing Symptoms...",
    severity: "Severity",
    recommendedActions: "Recommended Actions",
    whatToAvoid: "What to Avoid",
    medicalNotice: "Notice: Guidance is informational and does not constitute a medical diagnosis.",
    pinpointingLocation: "Pinpointing location...",
    copyUrl: "Copy URL",
    messageCaregiver: "Message for Caregiver",
    exampleNote: "Example: 'I've found person near the park...'",
    sendUpdate: "Send Update to Family",
    messageSent: "✓ Message transmitted to caregiver",
    criticalAllergies: "Critical Allergies",
    otherAllergies: "Other Allergies",
    medications: "Current Medications",
    calmsThem: "🌿 Calms Them",
    avoid: "⚠️ Avoid",
    emergencyContacts: "📞 Emergency Contacts",
    call: "Call",
    primary: "Primary",
    sendSos: "SEND SOS ALERT",
    alertSent: "Alert Sent!",
    whatsappSos: "WHATSAPP SOS",
    contactCaregiver: "Contact Caregiver",
    symbolCommunicator: "Symbol Communicator",
    hospitalHandoff: "Hospital Handoff",
    poweredBy: "Powered by SilentSOS · Emergency platform for non-verbal individuals",
    nonVerbal: "Non-Verbal",
    age: "Age"
  },
  hi: {
    banner: "आपातकालीन प्रोफाइल — मूक रोगी",
    bannerDemo: "लाइव डेमो मोड — SilentSOS का अनुभव करें",
    rescuePlaybook: "बचाव नियमावली",
    safetyAssistant: "AI सुरक्षा सहायक",
    safetyAssistantDesc: "तत्काल सुरक्षा मार्गदर्शन प्राप्त करने के लिए लक्षणों या व्यवहार का वर्णन करें।",
    symptomsPlaceholder: "जैसे 'सांस लेने में कठिनाई' या 'डरा हुआ लग रहा है'...",
    getGuidance: "सुरक्षा मार्गदर्शन प्राप्त करें",
    analyzing: "विश्लेषण किया जा रहा है...",
    severity: "गंभीरता",
    recommendedActions: "अनुशंसित क्रियाएं",
    whatToAvoid: "इनसे बचें",
    medicalNotice: "सूचना: मार्गदर्शन केवल जानकारी के लिए है। हमेशा डॉक्टर की सलाह लें।",
    pinpointingLocation: "स्थान का पता लगाया जा रहा है...",
    copyUrl: "URL कॉपी करें",
    messageCaregiver: "देखभाल करने वाले के लिए संदेश",
    exampleNote: "उदाहरण: 'मैंने पार्क के पास व्यक्ति को पाया है...'",
    sendUpdate: "परिवार को अपडेट भेजें",
    messageSent: "✓ संदेश परिवार तक पहुँचाया गया",
    criticalAllergies: "गंभीर एलर्जी",
    otherAllergies: "अन्य एलर्जी",
    medications: "वर्तमान दवाएं",
    calmsThem: "🌿 उन्हें शांत करने वाली चीजें",
    avoid: "⚠️ इनसे बचें",
    emergencyContacts: "📞 आपातकालीन संपर्क",
    call: "कॉल करें",
    primary: "मुख्य",
    sendSos: "आपातकालीन अलर्ट भेजें",
    alertSent: "अलर्ट भेज दिया गया!",
    whatsappSos: "WHATSAPP SOS",
    contactCaregiver: "देखभाल करने वाले से संपर्क करें",
    symbolCommunicator: "प्रतीक संचारक",
    hospitalHandoff: "अस्पताल रिपोर्ट",
    poweredBy: "SilentSOS द्वारा संचालित · मूक व्यक्तियों के लिए आपातकालीन मंच",
    nonVerbal: "बोलने में असमर्थ",
    age: "उम्र"
  }
  ,
  kn: {
    banner: "ತುರ್ತು ವಿವರ — ಮಾತನಾಡದ ರೋಗಿ",
    bannerDemo: "ಲೈವ್ ಡೆಮೊ ಮೋಡ್ — SilentSOS ಅನುಭವಿಸಿ",
    rescuePlaybook: "ಬಚಾವೊ ಕೈಪಿಡಿ",
    safetyAssistant: "AI ಸುರಕ್ಷತಾ ಸಹಾಯಕ",
    safetyAssistantDesc: "ತಕ್ಷಣದ ಸುರಕ್ಷತಾ ಮಾರ್ಗದರ್ಶನ ಪಡೆಯಲು ಲಕ್ಷಣಗಳು ಅಥವಾ ನಡವಳಿಕೆಯನ್ನು ವಿವರಿಸಿ.",
    symptomsPlaceholder: "ಉದಾಹರಣೆಗೆ 'ಉಸಿರಾಟದ ತೊಂದರೆ' ಅಥವಾ 'ಹೆದರಿದಂತೆ ಕಾಣುತ್ತಿದ್ದಾರೆ'...",
    getGuidance: "ಸುರಕ್ಷತಾ ಮಾರ್ಗದರ್ಶನ ಪಡೆಯಿರಿ",
    analyzing: "ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...",
    severity: "ತೀವ್ರತೆ",
    recommendedActions: "ಶಿಫಾರಸು ಮಾಡಿದ ಕ್ರಮಗಳು",
    whatToAvoid: "ಏನನ್ನು ತಪ್ಪಿಸಬೇಕು",
    medicalNotice: "ಸೂಚನೆ: ಮಾರ್ಗದರ್ಶನವು ಕೇವಲ ಮಾಹಿತಿಗಾಗಿ ಮಾತ್ರ ಮತ್ತು ವೈದ್ಯಕೀಯ ರೋಗನಿರ್ಣಯವಲ್ಲ.",
    pinpointingLocation: "ಸ್ಥಳವನ್ನು ಗುರುತಿಸಲಾಗುತ್ತಿದೆ...",
    copyUrl: "URL ನಕಲಿಸಿ",
    messageCaregiver: "ಪಾಲನೆ ಮಾಡುವವರಿಗೆ ಸಂದೇಶ",
    exampleNote: "ಉದಾಹರಣೆ: 'ನಾನು ವ್ಯಕ್ತಿಯನ್ನು ಉದ್ಯಾನವನದ ಬಳಿ ಕಂಡುಕೊಂಡಿದ್ದೇನೆ...'",
    sendUpdate: "ಕುಟುಂಬಕ್ಕೆ ಮಾಹಿತಿ ಕಳುಹಿಸಿ",
    messageSent: "✓ ಸಂದೇಶವನ್ನು ಪಾಲನೆ ಮಾಡುವವರಿಗೆ ರವಾನಿಸಲಾಗಿದೆ",
    criticalAllergies: "ಗಂಭೀರ ಅಲರ್ಜಿಗಳು",
    otherAllergies: "ಇತರ ಅಲರ್ಜಿಗಳು",
    medications: "ಪ್ರಸ್ತುತ ಔಷಧಗಳು",
    calmsThem: "🌿 ಅವರನ್ನು ಶಾಂತಗೊಳಿಸುವ ವಿಷಯಗಳು",
    avoid: "⚠️ ತಪ್ಪಿಸಿ",
    emergencyContacts: "📞 ತುರ್ತು ಸಂಪರ್ಕಗಳು",
    call: "ಕರೆ ಮಾಡಿ",
    primary: "ಮುಖ್ಯ",
    sendSos: "SOS ಅಲರ್ಟ್ ಕಳುಹಿಸಿ",
    alertSent: "ಅಲರ್ಟ್ ಕಳುಹಿಸಲಾಗಿದೆ!",
    whatsappSos: "WHATSAPP SOS",
    contactCaregiver: "ಪಾಲನೆ ಮಾಡುವವರನ್ನು ಸಂಪರ್ಕಿಸಿ",
    symbolCommunicator: "ಚಿಹ್ನೆ ಸಂವಹನಕಾರ",
    hospitalHandoff: "ಆಸ್ಪತ್ರೆ ಹಸ್ತಾಂತರ",
    poweredBy: "SilentSOS ನಿಂದ ನಡೆಸಲ್ಪಡುತ್ತಿದೆ · ಮಾತನಾಡದ ವ್ಯಕ್ತಿಗಳಿಗಾಗಿ ತುರ್ತು ವೇದಿಕೆ",
    nonVerbal: "ಮಾತನಾಡದ",
    age: "ವಯಸ್ಸು"
  },
  ta: {
    banner: "அவசர சுயவிவரம் — பேசாத நோயாளி",
    bannerDemo: "நேரடி டெமோ முறை — SilentSOS ஐ அனுபவிக்கவும்",
    rescuePlaybook: "மீட்பு கையேடு",
    safetyAssistant: "AI பாதுகாப்பு உதவியாளர்",
    safetyAssistantDesc: "உடனடி பாதுகாப்பு வழிகாட்டலைப் பெற அறிகுறிகள் அல்லது நடத்தையை விவரிக்கவும்.",
    symptomsPlaceholder: "உதாரணமாக 'சுவாசிப்பதில் சிரமம்' அல்லது 'பயந்த நிலையில் உள்ளார்'...",
    getGuidance: "பாதுகாப்பு வழிகாட்டலைப் பெறுங்கள்",
    analyzing: "பகுப்பாய்வு செய்யப்படுகிறது...",
    severity: "தீவிரம்",
    recommendedActions: "பரிந்துரைக்கப்பட்ட நடவடிக்கைகள்",
    whatToAvoid: "தவிர்க்க வேண்டியவை",
    medicalNotice: "அறிவிப்பு: வழிகாட்டுதல் தகவல் நோக்கத்திற்காக மட்டுமே மற்றும் மருத்துவ நோயறிதல் அல்ல.",
    pinpointingLocation: "இருப்பிடத்தைக் கண்டறிதல்...",
    copyUrl: "URL ஐ நகலெடுக்கவும்",
    messageCaregiver: "கவனிப்பாளருக்கான செய்தி",
    exampleNote: "உதாரணம்: 'பூங்காவிற்கு அருகில் ஒருவரைக் கண்டுபிடித்தேன்...'",
    sendUpdate: "குடும்பத்தினருக்கு புதுப்பிப்பை அனுப்புங்கள்",
    messageSent: "✓ செய்தி கவனிப்பாளருக்கு அனுப்பப்பட்டது",
    criticalAllergies: "தீவிர ஒவ்வாமை",
    otherAllergies: "இதர ஒவ்வாமை",
    medications: "தற்போதைய மருந்துகள்",
    calmsThem: "🌿 அவர்களை அமைதிப்படுத்துபவை",
    avoid: "⚠️ தவிர்க்கவும்",
    emergencyContacts: "📞 அவசர தொடர்புகள்",
    call: "அழைப்பு",
    primary: "முதன்மை",
    sendSos: "SOS எச்சரிக்கையை அனுப்பு",
    alertSent: "எச்சரிக்கை அனுப்பப்பட்டது!",
    whatsappSos: "WHATSAPP SOS",
    contactCaregiver: "கவனிப்பாளரைத் தொடர்பு கொள்ளவும்",
    symbolCommunicator: "குறியீடு தொடர்பாளர்",
    hospitalHandoff: "மருத்துவமனை ஒப்படைப்பு",
    poweredBy: "SilentSOS மூலம் இயக்கப்படுகிறது · பேசாதவர்களுக்கான அவசர கால தளம்",
    nonVerbal: "பேசாதவர்",
    age: "வயது"
  },
  te: {
    banner: "అవసర ప్రొఫైల్ — మాట్లాడలేని రోగి",
    bannerDemo: "లైవ్ డెమో మోడ్ — SilentSOS అనుభవించండి",
    rescuePlaybook: "రక్షణ గైడ్",
    safetyAssistant: "AI రక్షణ సహాయకుడు",
    safetyAssistantDesc: "తక్షణ రక్షణ మార్గదర్శకత్వం పొందడానికి లక్షణాలు లేదా ప్రవర్తనను వివరించండి.",
    symptomsPlaceholder: "ఉదాహరణకు 'శ్వాస తీసుకోవడంలో ఇబ్బంది' లేదా 'భయపడుతున్నట్లు కనిపిస్తున్నారు'...",
    getGuidance: "రక్షణ మార్గదర్శకత్వం పొందండి",
    analyzing: "విశ్లేషిస్తోంది...",
    severity: "తీవ్రత",
    recommendedActions: "సిఫార్సు చేసిన చర్యలు",
    whatToAvoid: "నివారించవలసినవి",
    medicalNotice: "గమనిక: మార్గదర్శకత్వం కేవలం సమాచారం కోసం మాత్రమే మరియు వైద్య రోగ నిర్ధారణ కాదు.",
    pinpointingLocation: "స్థానాన్ని గుర్తిస్తోంది...",
    copyUrl: "URL కాపీ చేయండి",
    messageCaregiver: "సంరక్షకునికి సందేశం",
    exampleNote: "ఉదాహరణ: 'పార్కు దగ్గర ఒక వ్యక్తిని కనుగొన్నాను...'",
    sendUpdate: "కుటుంబానికి అప్‌డేట్ పంపండి",
    messageSent: "✓ సందేశం సంరక్షకునికి పంపబడింది",
    criticalAllergies: "తీవ్రమైన అలెర్జీలు",
    otherAllergies: "ఇతర అలెర్జీలు",
    medications: "ప్రస్తుత మందులు",
    calmsThem: "🌿 వారిని శాంతింపజేసేవి",
    avoid: "⚠️ నివారించండి",
    emergencyContacts: "📞 అత్యవసర పరిచయాలు",
    call: "కాల్ చేయండి",
    primary: "ప్రధాన",
    sendSos: "SOS హెచ్చరిక పంపండి",
    alertSent: "హెచ్చరిక పంపబడింది!",
    whatsappSos: "WHATSAPP SOS",
    contactCaregiver: "సంరక్షకుడిని సంప్రదించండి",
    symbolCommunicator: "చిహ్న కమ్యూనికేటర్",
    hospitalHandoff: "ఆసుపత్రి బదిలీ",
    poweredBy: "SilentSOS ద్వారా అందించబడింది · మాట్లాడలేని వారి కోసం అత్యవసర ప్లాట్‌ఫారమ్",
    nonVerbal: "మాట్లాడలేని",
    age: "వయస్సు"
  }
};

const MEDICAL_DICT = {
  en: {},
  hi: {
    "Autism Spectrum Disorder": "ऑटिज्म",
    "Cerebral Palsy": "सेरेब्रल पाल्सी",
    "Stroke": "स्ट्रोक",
    "Speech Impairment": "वाक् दोष",
    "Dementia": "डिमेंशिया (भूलने की बीमारी)",
    "Down Syndrome": "डाउन सिंड्रोम",
    "Epilepsy": "मिर्गी",
    "Penicillin": "पेनिसिलिन",
    "Peanuts": "मूँगफली",
    "Dairy": "डेयरी उत्पाद",
    "Anaphylaxis": "गंभीर एलर्जी प्रतिक्रिया",
    "Severe swelling": "गंभीर सूजन",
    "Hives": "पित्ती",
    "Risperidone": "रिसपेरीडोन",
    "Nightly": "रात को",
    "Mother": "माता",
    "Father": "पिता",
    "Physician": "डॉक्टर",
    "Brother": "भाई",
    "Sister": "बहन"
  }
  ,
  kn: {
    "Autism Spectrum Disorder": "ಆಟಿಸಂ",
    "Epilepsy": "ಮೃಗಿ",
    "Penicillin": "ಪೆನ್ಸಿಲಿನ್",
    "Peanuts": "ಕಡಲೆಕಾಯಿ",
    "Mother": "ತಾಯಿ",
    "Father": "ತಂದೆ",
    "Brother": "ಸಹೋದರ"
  },
  ta: {
    "Autism Spectrum Disorder": "ஆட்டிசம்",
    "Epilepsy": "காக்காய் வலிப்பு",
    "Penicillin": "பென்சிலின்",
    "Peanuts": "நிலக்கடலை",
    "Mother": "தாய்",
    "Father": "தந்தை",
    "Brother": "சகோதரர்"
  },
  te: {
    "Autism Spectrum Disorder": "ఆటిజం",
    "Epilepsy": "మూర్ఛ వ్యాధి",
    "Penicillin": "పెన్సిలిన్",
    "Peanuts": "వేరుశనగ",
    "Mother": "తల్లి",
    "Father": "తండ్రి",
    "Brother": "సోదరుడు"
  }
};

const DEMO_SUMMARIES = {
  hi: "अर्जुन मूक है और शोर-शराबे से परेशान हो सकता है। कृपया धीमी और शांत आवाज में बात करें। उसे पेनिसिलिन और मूंगफली से गंभीर एलर्जी है। जब तक वह तत्काल शारीरिक खतरे में न हो, उसे रोकने की कोशिश न करें। उसकी जरूरतों को व्यक्त करने के लिए नीचे दिए गए प्रतीक संचारक (Symbol Communicator) का उपयोग करें।",
  kn: "ಅರ್ಜುನ್ ಮಾತನಾಡಲು ಸಾಧ್ಯವಿಲ್ಲ ಮತ್ತು ಜೋರಾದ ಶಬ್ದಗಳಿಂದ ತೊಂದರೆಗೊಳಗಾಗಬಹುದು. ದಯವಿಟ್ಟು ಶಾಂತವಾಗಿ ಮಾತನಾಡಿ. ಇವರಿಗೆ ಪೆನ್ಸಿಲಿನ್ ಮತ್ತು ಕಡಲೆಕಾಯಿಯಿಂದ ತೀವ್ರವಾದ ಅಲರ್ಜಿ ಇದೆ.",
  ta: "அர்ஜுன் பேச முடியாது மற்றும் பலத்த சத்தத்தால் தொந்தரவு அடையலாம். தயவுசெய்து மெதுவாகவும் அமைதியாகவும் பேசுங்கள். இவருக்கு பென்சிலின் மற்றும் நிலக்கடலையால் கடுமையான ஒவ்வாமை உள்ளது.",
  te: "అర్జున్ మాట్లాడలేడు మరియు పెద్ద శబ్దాల వల్ల ఇబ్బంది పడవచ్చు. దయచేసి నెమ్మదిగా మరియు ప్రశాంతంగా మాట్లాడండి. ఇతనికి పెన్సిలిన్ మరియు వేరుశనగ వల్ల తీవ్రమైన అలెర్జీ ఉంది."
};

// Mock AI Analysis Logic (Ready for API integration)
const analyzeSymptoms = (symptoms, profile) => {
  const s = symptoms.toLowerCase();
  let severity = 'moderate';
  let concern = 'General Medical Assessment';
  let actions = ['Notify the primary caregiver', 'Keep the person calm and seated', 'Monitor for changes in condition'];
  let avoid = ['Leaving the person alone', 'Offering food or drink until stable'];
  let urgencyLevel = 1; // 0: Low, 1: Moderate, 2: High, 3: Critical

  if (s.includes('breath') || s.includes('chest') || s.includes('unconscious') || s.includes('seizure') || s.includes('heavy bleed')) {
    severity = 'critical';
    urgencyLevel = 3;
    concern = 'Life-Threatening Emergency Detected';
    actions = ['Call local emergency services (911/100) IMMEDIATELY', 'Check for pulse and breathing', 'Clear the surrounding area of hazards'];
  } else if (s.includes('allergic') || s.includes('sting') || s.includes('peanut') || s.includes('penicillin')) {
    severity = 'critical';
    urgencyLevel = 3;
    concern = 'Potential Severe Allergic Reaction (Anaphylaxis)';
    actions = ['Call emergency services immediately', 'Ask if they have an EpiPen', 'Check airway and monitor breathing'];
  } else if (s.includes('fever') || s.includes('vomit') || s.includes('rash')) {
    severity = 'high';
    urgencyLevel = 2;
    concern = 'High Priority Medical Condition';
    actions = ['Alert caregiver immediately', 'Monitor temperature', 'Seek nearest urgent care or physician'];
  } else if (s.includes('anxious') || s.includes('loud') || s.includes('scared') || s.includes('noise')) {
    severity = 'moderate';
    urgencyLevel = 1;
    concern = 'Sensory or Emotional Overload';
    actions = ['Speak in a low, quiet voice', 'Minimize sensory input (noise/lights)', 'Allow personal space'];
    avoid = ['Sudden movements', 'Physical touch without warning', 'Direct eye contact'];
  }

  // Profile Cross-Reference
  const profileAllergies = profile.allergies?.map(a => a.name.toLowerCase()) || [];
  if (profileAllergies.some(a => s.includes(a))) {
    severity = 'critical'; urgencyLevel = 3;
    concern = `CRITICAL: Known Profile Allergy Triggered`;
  }

  return { severity, concern, actions, avoid, urgencyLevel, confidence: 0.94 };
};

const DEMO_PROFILE = {
  name: "Arjun Mehra",
  age: 16,
  bloodGroup: "O+",
  photo: "https://images.unsplash.com/photo-1590086782792-42dd2350140d?q=80&w=250&h=250&auto=format&fit=crop",
  conditions: ["Autism Spectrum Disorder", "Non-Verbal"],
  allergies: [
    { name: "Penicillin", severity: "critical", reaction: "Anaphylaxis" },
    { name: "Peanuts", severity: "critical", reaction: "Severe swelling" },
    { name: "Dairy", severity: "moderate", reaction: "Hives" }
  ],
  medications: [
    { name: "Risperidone", dosage: "0.5mg", frequency: "Nightly" }
  ],
  calmTriggers: ["Soft classical music", "Deep pressure/weighted blankets", "Dim lights"],
  avoidTriggers: ["Sudden physical touch", "Loud sirens", "Direct eye contact"],
  communicationNotes: "Arjun uses hand signs for 'Yes' and 'No'. He has a communication board on this device—please show it to him.",
  emergencyContacts: [
    { name: "Priya Mehra", phone: "+91 98765 43210", relationship: "Mother", isPrimary: true },
    { name: "Dr. Khanna", phone: "+91 99887 76655", relationship: "Physician", isPrimary: false }
  ],
  aiSummary: "Arjun is non-verbal and may appear distressed by loud noises. Please speak in a low, calm voice. He is highly allergic to Penicillin and Peanuts. Do not attempt to restrain him unless he is in immediate physical danger. Use the Symbol Communicator below to help him express needs.",
  whatsappSosEnabled: true
};

export default function EmergencyView() {
  const { qrId } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [alertSent, setAlertSent] = useState(false);
  const [note, setNote] = useState('');
  const [noteSent, setNoteSent] = useState(false);
  const [symptoms, setSymptoms] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [lang, setLang] = useState('en');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [flashType, setFlashType] = useState(null); // 'sos' or 'note'
  const [activeStatus, setActiveStatus] = useState(STATUSES[0]);
  const [sendingNote, setSendingNote] = useState(false);

  useEffect(() => {
    if (qrId === 'demo') {
      setData(DEMO_PROFILE);
      setTimeout(() => speak(`Emergency. This is Arjun. They cannot speak. Please check their medical information.`), 800);
      return;
    }

    api.get(`/emergency/${qrId}`)
      .then(res => {
        setData(res.data);

        // Auto-detect language from profile
        const profileLang = res.data.preferredLanguage?.toLowerCase();
        const matched = LANGUAGES.find(l => profileLang?.includes(l.code) || l.name.toLowerCase() === profileLang);
        if (matched) setLang(matched.code);

        // Auto read aloud
        setTimeout(() => speak(`Emergency. This is ${res.data.name}. They cannot speak. Please check their medical information.`), 800);

        // Automatically try to update log with precise location on load
        if (navigator.geolocation && res.data.logId) {
          navigator.geolocation.getCurrentPosition(async (pos) => {
            const { latitude, longitude } = pos.coords;
            let address = `Coordinates: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
            
            try {
              // Reverse Geocoding using OpenStreetMap (Free, no API key needed for hackathon)
              if (navigator.onLine) {
                const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`, {
                  headers: {
                    'User-Agent': 'SilentSOS-Emergency-App'
                  }
                });
                const geoData = await geoRes.json();
                if (geoData.display_name) address = geoData.display_name;
              }
            } catch (err) { /* fallback to coords */ }

            api.post(`/emergency/${qrId}/location`, {
              logId: res.data.logId,
              lat: latitude,
              lng: longitude,
              address: address
            }).catch(() => {});
          }, null, { enableHighAccuracy: true });
        }
      })
      .catch(() => setError('Profile not found or inactive.'));
  }, [qrId]);

  const handleSOS = async () => {
    if (!navigator.onLine) {
      toast.error("You are currently offline. Please call the caregiver directly using the links below.");
      return;
    }
    try {
      let location = { address: 'Location unavailable' };
      if (navigator.geolocation) {
        await new Promise(resolve => navigator.geolocation.getCurrentPosition(
          pos => { location = { lat: pos.coords.latitude, lng: pos.coords.longitude, address: `https://www.google.com/maps?q=${pos.coords.latitude},${pos.coords.longitude}` }; resolve(); },
          (err) => {
            if (err.code === 1) toast.error("Location access denied. Please enable GPS and ensure you are on a secure (HTTPS) connection.");
            resolve();
          },
          { timeout: 3000 }
        ));
      }
      const res = await api.post('/alerts/sos', { qrId, location });
      setAlertSent(true);
      setFlashType('sos');
      setTimeout(() => setFlashType(null), 2500);
      if (res.data.whatsappLink) window.open(res.data.whatsappLink, '_blank');
    } catch {}
  };

  const submitNote = async () => {
    // Simulate success for Demo Mode since there is no real DB log
    if (qrId === 'demo') {
      setNoteSent(true);
      setFlashType('note');
      setTimeout(() => setFlashType(null), 2000);
      toast.success("Message sent successfully! (Demo Mode)");
      return;
    }

    setSendingNote(true);
    try {
      await api.post(`/emergency/${qrId}/note`, { 
        logId: data.logId,
        note: note.trim() || `Status Broadcast: ${activeStatus.label}`,
        status: activeStatus.label // This now sends the real status to the caretaker
      });
      setNoteSent(true);
      setFlashType('note');
      setTimeout(() => setFlashType(null), 2000);
      toast.success("Message sent successfully!");
    } catch (err) {
      toast.error("Failed to send update. Please check your connection.");
    } finally {
      setSendingNote(false);
    }
  };

  const runAnalysis = () => {
    if (!symptoms.trim()) return;
    setAnalyzing(true);
    // Simulate AI latency
    setTimeout(() => {
      setAnalysis(analyzeSymptoms(symptoms, data));
      setAnalyzing(false);
    }, 1500);
  };

  const copyLocation = () => {
    navigator.clipboard.writeText(data?.location?.address || "Location pending...");
    toast.success("Location copied to clipboard");
  };

  // Translation Helpers
  const t = (key) => UI_STRINGS[lang]?.[key] || UI_STRINGS['en'][key] || key;
  const tm = (term) => MEDICAL_DICT[lang]?.[term] || term;

  const getTranslatedSummary = () => {
    if (qrId === 'demo' && DEMO_SUMMARIES[lang]) return DEMO_SUMMARIES[lang];
    return data?.aiSummary;
  };

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-sky-50 px-6">
      <div className="text-center"> {/* This was already text-center */}
        <div className="text-6xl mb-4">❌</div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Profile not found</h2>
        <p className="text-slate-500">{error}</p>
      </div>
    </div>
  );

  if (!data) return (
    <div className="min-h-screen flex items-center justify-center bg-sky-50">
      <div className="text-center">
        <div className="text-4xl mb-3 animate-pulse">🔍</div>
        <p className="text-slate-500 font-semibold">Loading emergency information...</p>
      </div>
    </div>
  );

  const criticalAllergies = data.allergies?.filter(a => a.severity === 'critical') || [];
  const primaryContact = data.emergencyContacts?.[0];

  return (
    <div className="min-h-screen bg-sky-50">
      {/* Success/SOS Flash Overlay */}
      {flashType === 'sos' && (
        <div className="fixed inset-0 z-[100] bg-rose-600/30 backdrop-blur-md pointer-events-none animate-pulse flex items-center justify-center p-6">
          <div className="bg-rose-600 text-white px-8 py-6 rounded-[2.5rem] shadow-2xl font-black text-xl md:text-3xl flex flex-col items-center gap-4 text-center animate-zoom-in">
            <AlertOctagon className="w-16 h-16 animate-bounce" />
            <div>
              <div className="uppercase tracking-[0.2em] text-xs opacity-80 mb-1">Status: Transmitted</div>
              SOS ALERT SENT TO FAMILY
            </div>
          </div>
        </div>
      )}
      {flashType === 'note' && (
        <div className="fixed inset-0 z-[100] bg-emerald-500/20 backdrop-blur-md pointer-events-none flex items-center justify-center p-6">
          <div className="bg-emerald-500 text-white px-8 py-5 rounded-[2rem] shadow-2xl font-black text-xl flex items-center gap-4 animate-zoom-in">
            <CheckCircle2 className="w-10 h-10" /> MESSAGE DELIVERED
          </div>
        </div>
      )}

      {/* Emergency Banner */}
      <div className={`${qrId === 'demo' ? 'bg-sky-600' : 'bg-rose-600'} text-white px-6 py-4 text-center sticky top-0 z-50 shadow-lg`}>
        <div className="text-sm font-black tracking-widest flex items-center justify-between gap-2 uppercase relative">
          <Link to="/" className="hover:opacity-80 transition-opacity">
            <div className="bg-white/20 p-1.5 rounded-lg">
              <Shield className="w-5 h-5" />
            </div>
          </Link>
          
          <span className="flex items-center gap-2 mx-auto">
            <span className="animate-pulse">🚨</span> 
            {qrId === 'demo' ? t('bannerDemo') : t('banner')}
            <span className="animate-pulse">🚨</span>
          </span>
          
          <div className="relative">
            <button 
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-lg hover:bg-white/30 transition-all text-[10px]"
            >
              <Globe className="w-3 h-3" />
              {LANGUAGES.find(l => l.code === lang)?.flag}
              <ChevronDown className={`w-3 h-3 transition-transform ${showLangMenu ? 'rotate-180' : ''}`} />
            </button>
            
            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-2xl py-2 z-[60] border border-slate-100 normal-case tracking-normal">
                {LANGUAGES.map(l => (
                  <button 
                    key={l.code}
                    onClick={() => { setLang(l.code); setShowLangMenu(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-2 text-xs font-bold transition-colors ${lang === l.code ? 'text-sky-600 bg-sky-50' : 'text-slate-600 hover:bg-slate-50'}`}
                  >
                    <span>{l.flag}</span> {l.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-6 py-8 space-y-4"> {/* This was already max-w-lg */}
        {/* Patient Identity */}
        <div className="card p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-sky-200 to-emerald-200 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0">
              {data.photo ? <img src={data.photo} alt="" className="w-full h-full object-cover rounded-2xl" /> : '🧑'}
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900">{data.name}</h1>
              <div className="flex flex-wrap gap-2 mt-1">
                <span className="badge-info">{t('age')} {data.age}</span>
                <span className="bg-rose-100 text-rose-700 text-xs font-bold px-2.5 py-1 rounded-full">🩸 {data.bloodGroup}</span>
                <span className="badge-info">{t('nonVerbal')}</span>
              </div>
              {data.conditions?.length > 0 && (
                <div className="text-sm text-sky-700 font-semibold mt-1">{data.conditions.map(c => tm(c)).join(' · ')}</div>
              )}
            </div>
          </div>

          {/* AI Summary */}
          <div className="flex justify-between items-center mb-2 px-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('rescuePlaybook')}</span>
          </div>
          
          {getTranslatedSummary() && (
            <div className="bg-sky-50 rounded-2xl p-4 flex gap-3"> {/* This was already bg-sky-50 */}
              <Volume2 className="w-4 h-4 text-sky-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-sky-800 font-medium leading-relaxed">{getTranslatedSummary()}</p>
            </div>
          )}
        </div>

        {/* AI Safety Assistant */}
        <div className="card p-6 border-indigo-100 bg-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-indigo-50 rounded-xl">
                <Stethoscope className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 className="font-black text-slate-900">{t('safetyAssistant')}</h3>
            </div>
            {analysis && <button onClick={() => setAnalysis(null)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>}
          </div>
          
          {!analysis ? (
            <div className="space-y-4">
              <p className="text-xs text-slate-500 font-medium">{t('safetyAssistantDesc')}</p>
              <div className="relative">
                <textarea 
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-medium outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all"
                  placeholder={t('symptomsPlaceholder')}
                  value={symptoms} onChange={(e) => setSymptoms(e.target.value)} rows={3}
                />
              </div>
              <button onClick={runAnalysis} disabled={analyzing || !symptoms.trim()}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3 rounded-2xl flex items-center justify-center gap-2 transition-all disabled:opacity-50">
                {analyzing ? <Activity className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                {analyzing ? t('analyzing') : t('getGuidance')}
              </button>
            </div>
          ) : (
            <div className="animate-slide-up">
              <div className={`p-4 rounded-2xl mb-6 flex items-center gap-4 ${
                analysis.urgencyLevel === 3 ? 'bg-rose-600 text-white shadow-lg shadow-rose-200' :  /* This was already bg-rose-600 */
                analysis.urgencyLevel === 2 ? 'bg-rose-50 text-rose-800' : 'bg-amber-50 text-amber-800'
              }`}>
                {analysis.urgencyLevel === 3 ? <AlertOctagon className="w-8 h-8" /> : <AlertCircle className="w-6 h-6" />}
                <div>
                  <div className="text-xs font-black uppercase tracking-[0.2em] opacity-90">{t('severity')}: {analysis.severity}</div>
                  <div className="text-lg font-black leading-tight">{analysis.concern}</div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">{t('recommendedActions')}</h4>
                  <div className="space-y-3">
                    {analysis.actions.map((act, i) => (
                      <div key={i} className="flex gap-3 items-start">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm font-bold text-slate-700 leading-tight">{act}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {analysis.avoid && (
                  <div>
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 text-rose-500">{t('whatToAvoid')}</h4>
                    <div className="space-y-2">
                      {analysis.avoid.map((av, i) => (
                        <div key={i} className="text-sm font-bold text-rose-600 flex items-center gap-2 italic">
                          <X className="w-3 h-3" /> {av}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          <p className="text-xs text-slate-500 mt-6 pt-4 border-t border-slate-100 italic font-medium leading-relaxed">
            {t('medicalNotice')}
          </p>
        </div>

        {/* Location Card for Responder */}
        <div className="card p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <MapPin className="w-5 h-5 text-emerald-400" />
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            <div className="text-xs font-bold truncate max-w-[200px]">{data?.location?.address || t('pinpointingLocation')}</div>
          </div>
          <button onClick={() => navigator.clipboard.writeText(window.location.href)} className="text-xs bg-slate-800 px-3 py-1 rounded-lg flex items-center gap-1"><Copy className="w-3 h-3" /> {t('copyUrl')}</button>
        </div>

        {/* Bystander Update Card */}
        <style>{`@import url('https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css');`}</style>
        {!noteSent ? (
          <div className="card p-5 bg-sky-900 text-white">
            <h3 className="text-sm font-black uppercase tracking-widest mb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-sky-400" /> {t('messageCaregiver')}
            </h3>
            
            <div className="grid grid-cols-1 gap-2 mb-4">
              {STATUSES.slice(0, 3).map((status) => (
                <button key={status.id} onClick={() => setActiveStatus(status)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all text-left ${activeStatus.id === status.id ? 'bg-white text-sky-900 border-white' : 'bg-sky-800/50 border-sky-700 text-sky-200'}`}>
                  <i className={`ti ${status.icon} text-lg`} />
                  <span className="font-bold text-xs uppercase tracking-tight">{status.label}</span>
                </button>
              ))}
            </div>

            <textarea 
              className="w-full bg-sky-800/50 border border-sky-700 rounded-xl p-3 text-sm placeholder:text-sky-300 outline-none focus:ring-2 focus:ring-sky-400 mb-3"
              placeholder={t('exampleNote')}
              value={note} onChange={(e) => setNote(e.target.value)}
            />
            <button 
              onClick={submitNote} disabled={sendingNote}
              className="w-full bg-sky-500 hover:bg-sky-400 text-white font-black py-4 rounded-2xl text-xs uppercase tracking-[0.2em] transition-all active:scale-95 shadow-xl shadow-sky-500/20 disabled:opacity-50"
            >
              {sendingNote ? 'Transmitting...' : t('sendUpdate')}
            </button>
          </div>
        ) : (
          <div className="card p-4 bg-emerald-500 text-white text-center font-bold text-sm">{t('messageSent')}</div>
        )}

        {/* Critical Allergies */}
        {criticalAllergies.length > 0 && (
          <div className="bg-rose-600 rounded-3xl p-5 text-white">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-black text-lg uppercase tracking-wide">{t('criticalAllergies')}</span>
            </div>
            {criticalAllergies.map(a => (
              <div key={a.name} className="flex justify-between items-center bg-rose-700 rounded-2xl px-4 py-3 mb-2">
                <span className="font-black">{tm(a.name)}</span>
                {a.reaction && <span className="text-rose-200 text-sm">{a.reaction}</span>}
              </div>
            ))}
          </div>
        )}

        {/* All Allergies */}
        {data.allergies?.filter(a => a.severity !== 'critical').length > 0 && (
          <div className="card p-5">
            <h3 className="font-black text-slate-900 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" /> {t('otherAllergies')}
            </h3>
            <div className="space-y-2">
              {data.allergies.filter(a => a.severity !== 'critical').map(a => (
                <div key={a.name} className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700">{tm(a.name)}</span>
                  <span className={`badge-${a.severity}`}>{a.severity}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Medications */}
        {data.medications?.length > 0 && (
          <div className="card p-5">
            <h3 className="font-black text-slate-900 mb-3">💊 Current Medications</h3>
            {data.medications.map((m, i) => (
              <div key={i} className="flex justify-between py-2 border-b border-slate-100 last:border-0">
                <span className="font-semibold text-slate-700">{tm(m.name)}</span>
                <span className="text-slate-500 text-sm">{m.dosage} · {tm(m.frequency)}</span>
              </div>
            ))}
          </div>
        )}

        {/* Calm / Avoid */}
        <div className="grid grid-cols-2 gap-4">
          {data.calmTriggers?.length > 0 && (
            <div className="card p-4 bg-emerald-50 border-emerald-100">
              <div className="font-black text-emerald-800 mb-2 text-sm">{t('calmsThem')}</div>
              {data.calmTriggers.map(t => <div key={t} className="text-xs text-emerald-700 font-medium py-0.5">• {t}</div>)}
            </div>
          )}
          {data.avoidTriggers?.length > 0 && (
            <div className="card p-4 bg-rose-50 border-rose-100">
              <div className="font-black text-rose-800 mb-2 text-sm">{t('avoid')}</div>
              {data.avoidTriggers.map(t => <div key={t} className="text-xs text-rose-700 font-medium py-0.5">• {t}</div>)}
            </div>
          )}
        </div>

        {/* Emergency Contacts */}
        <div className="card p-5">
          <h3 className="font-black text-slate-900 mb-3">{t('emergencyContacts')}</h3>
          {data.emergencyContacts?.map((c, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
              <div>
                <div className="font-bold text-slate-900">{c.name}</div>
                <div className="text-xs text-slate-500">{tm(c.relationship)} {c.isPrimary && `· ${t('primary')}`}</div>
              </div>
              <a href={`tel:${c.phone}`}
                className="bg-emerald-500 text-white font-bold text-sm px-4 py-2 rounded-xl hover:bg-emerald-600 transition-colors flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" /> {t('call')}
              </a>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button onClick={handleSOS}
            className={`w-full py-5 rounded-3xl font-black text-xl transition-all flex items-center justify-center gap-3 ${alertSent ? 'bg-emerald-500 text-white' : 'bg-rose-600 hover:bg-rose-700 text-white hover:shadow-xl'}`}>
            {alertSent ? <CheckCircle2 className="w-6 h-6" /> : <AlertOctagon className="w-6 h-6" />}
            {alertSent ? t('alertSent') : t('sendSos')}
          </button>

          {data?.whatsappSosEnabled && (
            <button onClick={handleSOS}
              className="w-full py-4 bg-[#25D366] hover:bg-[#20bd5c] text-white rounded-3xl font-black text-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-100">
              <MessageCircle className="w-6 h-6 fill-white" />
              {t('whatsappSos')}
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Link to={`/emergency/${qrId}/connect`}
            className="card p-4 text-center font-bold text-slate-700 hover:bg-slate-50 transition-colors flex flex-col items-center gap-2">
            <Phone className="w-6 h-6" />
            <span className="text-sm">{t('contactCaregiver')}</span>
          </Link>
          <Link to={`/emergency/${qrId}/communicate`}
            className="card p-4 text-center font-bold text-sky-700 hover:bg-sky-50 transition-colors flex flex-col items-center gap-2">
            <MessageSquare className="w-6 h-6" />
            <span className="text-sm">{t('symbolCommunicator')}</span>
          </Link>
          <Link to={`/emergency/${qrId}/handoff`}
            className="card p-4 text-center font-bold text-slate-700 hover:bg-slate-50 transition-colors flex flex-col items-center gap-2">
            <FileText className="w-6 h-6" />
            <span className="text-sm">{t('hospitalHandoff')}</span>
          </Link>
        </div>

        <p className="text-center text-xs text-slate-400 font-medium pb-4">
          {t('poweredBy')}
        </p>
      </div>
    </div>
  );
}