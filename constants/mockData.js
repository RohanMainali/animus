import { Colors } from "./colors"

export const mockDiagnoses = [
  {
    name: "Normal",
    description: "Your heartbeat sounds healthy and regular, indicating good cardiovascular health.",
    urgency: "Low",
    color: Colors.accentGreen,
  },
  {
    name: "Murmur",
    description:
      "A heart murmur is an extra or unusual sound heard during a heartbeat. It may be harmless or indicate an underlying heart condition requiring further evaluation.",
    urgency: "Medium",
    color: Colors.secondary,
  },
  {
    name: "Arrhythmia (AFib)",
    description:
      "Atrial fibrillation (AFib) is an irregular and often rapid heart rate that can lead to blood clots in the heart, increasing stroke risk. Medical attention is advised.",
    urgency: "High",
    color: Colors.accentRed,
  },
  {
    name: "Mitral Regurgitation",
    description:
      "Mitral regurgitation is a condition where the heart's mitral valve doesn't close tightly, allowing blood to flow backward. This can strain the heart over time.",
    urgency: "Medium",
    color: Colors.secondary,
  },
  {
    name: "Aortic Stenosis",
    description:
      "Aortic stenosis is a narrowing of the aortic valve, restricting blood flow from the heart to the body. This can cause symptoms like chest pain or dizziness.",
    urgency: "Medium",
    color: Colors.secondary,
  },
]

export const mockHistory = [
  {
    id: "1",
    date: "2024-07-20",
    scanType: "cardiac",
    scanData: {
      diagnosis: "Normal",
      confidence: 0.98,
      waveformUrl: "/placeholder.svg?height=100&width=300",
      spectrogramUrl: "/placeholder.svg?height=100&width=300",
    },
    llmResponse: {
      summary: "Your heartbeat analysis on 2024-07-20 showed a normal rhythm with high confidence.",
      topConditions: ["Normal Cardiac Function"],
      urgency: "Low",
      suggestions:
        "Continue with a balanced diet, regular exercise, and stress management to maintain your excellent heart health. Regular check-ups are always recommended.",
      confidence: 0.98,
      explanation:
        "A normal heartbeat indicates that your heart is pumping blood efficiently and rhythmically. This is a positive sign of good cardiovascular health.",
    },
  },
  {
    id: "2",
    date: "2024-07-15",
    scanType: "cardiac",
    scanData: {
      diagnosis: "Murmur",
      confidence: 0.75,
      waveformUrl: "/placeholder.svg?height=100&width=300",
      spectrogramUrl: "/placeholder.svg?height=100&width=300",
    },
    llmResponse: {
      summary: "On 2024-07-15, a heart murmur was detected with medium confidence.",
      topConditions: ["Innocent Murmur", "Valvular Murmur"],
      urgency: "Medium",
      suggestions:
        "A heart murmur is an extra or unusual sound heard during a heartbeat. While some murmurs are harmless, others can indicate an underlying heart condition. It's important to follow up with a doctor.",
      confidence: 0.75,
      explanation:
        "Avoid excessive caffeine and alcohol. Maintain a healthy weight and discuss any symptoms or concerns with your doctor. Regular monitoring is advisable.",
    },
  },
  {
    id: "3",
    date: "2024-07-10",
    scanType: "skin",
    scanData: {
      diagnosis: "Eczema",
      confidence: 0.85,
      imageUrl: "/placeholder.svg?height=200&width=200",
    },
    llmResponse: {
      summary: "Your skin scan on 2024-07-10 suggests symptoms consistent with eczema.",
      topConditions: ["Eczema (Atopic Dermatitis)", "Contact Dermatitis"],
      urgency: "Medium",
      suggestions:
        "Keep the affected area moisturized, avoid irritants, and consider over-the-counter hydrocortisone cream. If symptoms persist or worsen, consult a dermatologist.",
      confidence: 0.85,
      explanation:
        "Eczema is a common inflammatory skin condition characterized by dry, itchy, and red patches. It can be triggered by various factors including allergens, irritants, and stress.",
    },
  },
  {
    id: "4",
    date: "2024-07-05",
    scanType: "eye",
    scanData: {
      diagnosis: "Red Eye (Conjunctivitis)",
      confidence: 0.7,
      imageUrl: "/placeholder.svg?height=200&width=200",
    },
    llmResponse: {
      summary: "Your eye scan on 2024-07-05 indicates redness, possibly due to conjunctivitis.",
      topConditions: ["Conjunctivitis", "Eye Irritation"],
      urgency: "Low",
      suggestions:
        "Avoid touching your eyes, use artificial tears, and if symptoms persist or vision changes, consult an ophthalmologist. If contagious, practice good hygiene.",
      confidence: 0.7,
      explanation:
        "Red eye, or conjunctivitis, is an inflammation of the conjunctiva, the clear membrane that covers the white part of your eye and lines the inside of your eyelids. It can be caused by viruses, bacteria, or allergies.",
    },
  },
  {
    id: "5",
    date: "2024-07-01",
    scanType: "vitals",
    scanData: {
      bloodPressure: "135/85",
      pulseRate: "78 bpm",
      bloodOxygen: "97%",
      temperature: "98.6°F",
      confidence: 0.95,
    },
    llmResponse: {
      summary: "Your vitals on 2024-07-01 are within normal ranges, indicating good overall health.",
      topConditions: ["Normal Vitals"],
      urgency: "Low",
      suggestions: "Maintain your healthy lifestyle. Regular monitoring is always beneficial.",
      confidence: 0.95,
      explanation:
        "All vital signs (blood pressure, pulse, oxygen, temperature) are within healthy parameters, suggesting stable physiological function.",
    },
  },
  {
    id: "6",
    date: "2024-06-28",
    scanType: "symptom",
    scanData: {
      symptoms: "Persistent cough and fatigue.",
      confidence: 0.65,
    },
    llmResponse: {
      summary: "Your symptoms of persistent cough and fatigue could be related to a common cold or mild infection.",
      topConditions: ["Common Cold", "Bronchitis", "Fatigue Syndrome"],
      urgency: "Low",
      suggestions:
        "Rest, stay hydrated, and consider over-the-counter remedies. If symptoms worsen or persist for more than a week, consult a doctor.",
      confidence: 0.65,
      explanation:
        "Cough and fatigue are non-specific symptoms that can accompany various conditions, from viral infections to general exhaustion. Monitoring for other symptoms is key.",
    },
  },
]

export const mockComparisonSamples = {
  healthy: {
    name: "Healthy Cardiac Sample",
    diagnosis: "Normal",
    waveformUrl: "/placeholder.svg?height=100&width=300",
    text: 'This sample represents a typical healthy heartbeat, characterized by clear, distinct "lub-dub" sounds and a regular, consistent rhythm. There are no extra sounds or irregularities, indicating optimal cardiac function.',
  },
  murmur: {
    name: "Cardiac Murmur Sample",
    diagnosis: "Murmur",
    waveformUrl: "/placeholder.svg?height=100&width=300",
    text: "This sample exhibits a heart murmur, which is an additional sound heard during the heartbeat. It might sound like a whooshing or swishing noise, indicating turbulent blood flow. This requires further medical assessment.",
  },
  arrhythmia: {
    name: "Cardiac Arrhythmia Sample",
    diagnosis: "Arrhythmia (AFib)",
    waveformUrl: "/placeholder.svg?height=100&width=300",
    text: "This sample shows an irregular heartbeat, characteristic of an arrhythmia, specifically Atrial Fibrillation (AFib). The rhythm is inconsistent and chaotic, which can lead to serious health complications. Immediate medical consultation is advised.",
  },
}

export const mockChatResponses = {
  "What does a murmur mean?":
    "A heart murmur is an extra or unusual sound heard during a heartbeat. It can be a soft, whooshing, or swishing noise. While some murmurs are harmless (innocent murmurs), others can indicate an underlying heart condition (abnormal murmurs) that might need medical attention. It's crucial to consult a doctor for proper diagnosis and guidance.",
  "How serious is my result?":
    'The seriousness of your result depends on the specific diagnosis and urgency level provided. For a "High" urgency, immediate medical consultation is strongly recommended. For "Medium" urgency, follow-up with a doctor is advised soon. "Low" urgency usually means no immediate concern, but always discuss any results with a healthcare professional for personalized advice.',
  "What should I do next?":
    "Based on your results, if the urgency is Medium or High, it's strongly recommended to consult a cardiologist or your primary care physician for a thorough examination and further tests. If the urgency is Low, continue healthy lifestyle habits and consider regular monitoring of your heart health. Always prioritize professional medical advice.",
  "What is a mitral valve?":
    "The mitral valve is one of the four valves in your heart. It's located between the left atrium and the left ventricle. Its primary function is to ensure blood flows in one direction, from the left atrium to the left ventricle, and prevents backflow when the ventricle contracts. Problems with this valve can lead to conditions like mitral regurgitation or stenosis.",
  default:
    "I am Animus, your AI-powered health assistant. I can help explain medical terms, summarize your results, and offer general lifestyle suggestions. What would you like to know about your health today?",
}

export const mockBadges = [
  {
    id: "first_scan",
    name: "First Scan",
    description: "Completed your very first health scan!",
    icon: "sparkles",
    color: Colors.primary,
  },
  {
    id: "health_champion",
    name: "Health Champion",
    description: "Completed 7 scans in a single week!",
    icon: "shield-half",
    color: Colors.accentGreen,
  },
  {
    id: "consistent_monitor",
    name: "Consistent Monitor",
    description: "Maintained a consistent scanning streak for 30 days!",
    icon: "pulse",
    color: Colors.secondary,
  },
  {
    id: "knowledge_seeker",
    name: "Knowledge Seeker",
    description: "Asked Animus 10 unique questions!",
    icon: "book",
    color: Colors.primary,
  },
]

export const funFacts = [
  "Did you know? The human brain weighs about 3 pounds but uses 20% of the body's oxygen and calories!",
  "The average adult heart beats about 100,000 times a day.",
  "Your skin is the body's largest organ, covering an area of about 2 square meters.",
  "The human eye can distinguish about 10 million different colors.",
  "Bones are stronger than steel, pound for pound, due to their intricate internal structure.",
  "Your body produces about 1 liter of saliva every day.",
  "The 'lub-dub' sound of your heartbeat is caused by the closing of your heart valves.",
]

export const mockSkinDiagnoses = [
  {
    name: "Normal Skin",
    description: "Your skin appears healthy with no significant abnormalities detected.",
    urgency: "Low",
    color: Colors.accentGreen,
  },
  {
    name: "Acne",
    description:
      "Acne is a common skin condition that occurs when hair follicles become clogged with oil and dead skin cells. It can cause pimples, blackheads, or whiteheads.",
    urgency: "Low",
    color: Colors.secondary,
  },
  {
    name: "Eczema",
    description:
      "Eczema (atopic dermatitis) is a condition that causes dry, itchy, and inflamed skin. It's common in children but can occur at any age.",
    urgency: "Medium",
    color: Colors.secondary,
  },
  {
    name: "Psoriasis",
    description:
      "Psoriasis is a chronic autoimmune condition that causes skin cells to build up rapidly on the surface of the skin, forming thick, silvery scales and itchy, dry, red patches.",
    urgency: "Medium",
    color: Colors.secondary,
  },
  {
    name: "Fungal Infection",
    description:
      "Fungal skin infections are common and can appear in various forms, often causing redness, itching, and scaling. Examples include ringworm, athlete's foot, and jock itch.",
    urgency: "Medium",
    color: Colors.secondary,
  },
  {
    name: "Suspicious Mole",
    description:
      "A mole with irregular borders, varied color, large diameter, or evolving appearance could be suspicious. It is highly recommended to consult a dermatologist for evaluation.",
    urgency: "High",
    color: Colors.accentRed,
  },
]

export const mockEyeDiagnoses = [
  {
    name: "Normal Eyes",
    description: "Your eyes appear healthy with no significant abnormalities detected.",
    urgency: "Low",
    color: Colors.accentGreen,
  },
  {
    name: "Red Eye (Conjunctivitis)",
    description:
      "Redness in the eye, often accompanied by itching or discharge, can indicate conjunctivitis (pink eye) or other irritations. It's usually not serious but can be contagious.",
    urgency: "Low",
    color: Colors.secondary,
  },
  {
    name: "Dry Eyes",
    description:
      "Dry eyes occur when your eyes don't produce enough tears or when your tears evaporate too quickly, leading to discomfort, stinging, or blurred vision.",
    urgency: "Low",
    color: Colors.secondary,
  },
  {
    name: "Yellowing (Jaundice)",
    description:
      "Yellowing of the whites of the eyes (scleral icterus) is a sign of jaundice, which indicates an underlying liver or bile duct issue. Medical attention is advised.",
    urgency: "High",
    color: Colors.accentRed,
  },
  {
    name: "Dark Circles",
    description:
      "Dark circles under the eyes are common and can be caused by fatigue, genetics, dehydration, or allergies. While usually harmless, they can indicate a need for more rest or hydration.",
    urgency: "Low",
    color: Colors.secondary,
  },
]

export const mockVitalsAssessments = [
  {
    name: "Normal Vitals",
    summary: "Your blood pressure, pulse, oxygen, and temperature are all within healthy ranges.",
    urgency: "Low",
    color: Colors.accentGreen,
  },
  {
    name: "Elevated Blood Pressure",
    summary:
      "Your blood pressure readings are consistently elevated, which may indicate early-stage hypertension. Regular monitoring and lifestyle changes are recommended.",
    urgency: "Medium",
    color: Colors.secondary,
  },
  {
    name: "High Pulse Rate",
    summary:
      "Your pulse rate is higher than normal. This could be due to stress, dehydration, or other factors. If persistent, consult a doctor.",
    urgency: "Low",
    color: Colors.secondary,
  },
  {
    name: "Low Blood Oxygen (SpO2)",
    summary:
      "Your blood oxygen level is lower than the healthy range. This requires immediate medical attention as it can indicate respiratory or circulatory issues.",
    urgency: "High",
    color: Colors.accentRed,
  },
  {
    name: "Elevated Temperature",
    summary: "Your temperature is slightly elevated, suggesting a fever or infection. Monitor closely.",
    urgency: "Low",
    color: Colors.secondary,
  },
]

export const mockSymptomResponses = {
  fever: {
    summary: "Your symptoms suggest a possible fever or infection.",
    topConditions: ["Common Cold", "Flu", "Bacterial Infection"],
    suggestions: ["Rest, hydrate, monitor temperature. Consult a doctor if symptoms worsen."],
    urgency: "Low",
    confidence: 0.8,
  },
  headache: {
    summary: "Headache is a common symptom, often related to stress or dehydration.",
    topConditions: ["Tension Headache", "Migraine", "Dehydration"],
    suggestions: ["Rest in a quiet room, drink water, consider over-the-counter pain relievers."],
    urgency: "Low",
    confidence: 0.7,
  },
  "chest pain": {
    summary: "Chest pain can be serious. While it might be indigestion, it could also indicate a heart-related issue.",
    topConditions: ["Indigestion", "Muscle Strain", "Angina"],
    suggestions: ["Seek immediate medical attention if severe or accompanied by shortness of breath."],
    urgency: "High",
    confidence: 0.9,
  },
  "shortness of breath": {
    summary: "Shortness of breath can be a sign of respiratory or cardiac issues. It requires prompt evaluation.",
    topConditions: ["Asthma", "Anxiety", "Heart Failure"],
    suggestions: ["Rest, try to calm down. If severe or persistent, seek immediate medical help."],
    urgency: "High",
    confidence: 0.9,
  },
  default: {
    summary:
      "Based on your description, I can suggest some general possibilities. For a precise diagnosis, please consult a healthcare professional.",
    topConditions: ["General Malaise", "Stress-related symptoms", "Mild infection"],
    suggestions: ["Monitor your symptoms, ensure adequate rest and hydration."],
    urgency: "Low",
    confidence: 0.6,
  },
}

export const mockDoctors = [
  {
    id: "d1",
    name: "Dr. Anya Sharma",
    specialization: "Cardiologist",
    rating: 4.8,
    reviews: 120,
    address: "123 Heartbeat Ave, Metro City",
    phone: "555-1001",
    bio: "Specializes in complex arrhythmias and general heart health.",
    imageUrl: "/placeholder.svg?height=80&width=80",
    urgencyMatch: ["High", "Medium"],
    conditionsMatch: ["Arrhythmia", "Murmur", "Mitral Regurgitation", "Aortic Stenosis", "Heart Failure", "AFib", "Chest Pain"],
  },
  {
    id: "d2",
    name: "Dr. Ben Carter",
    specialization: "Dermatologist",
    rating: 4.5,
    reviews: 85,
    address: "456 Skin Rd, Metro City",
    phone: "555-1002",
    bio: "Expert in treating eczema, psoriasis, and skin lesion analysis.",
    imageUrl: "/placeholder.svg?height=80&width=80",
    urgencyMatch: ["High", "Medium"],
    conditionsMatch: ["Eczema", "Psoriasis", "Suspicious Mole", "Fungal Infection", "Skin Irritation", "Contact Dermatitis", "Acne"],
  },
  {
    id: "d3",
    name: "Dr. Chloe Davis",
    specialization: "Ophthalmologist",
    rating: 4.7,
    reviews: 90,
    address: "789 Eye St, Metro City",
    phone: "555-1003",
    bio: "Specializes in comprehensive eye care, including dry eye and conjunctivitis.",
    imageUrl: "/placeholder.svg?height=80&width=80",
    urgencyMatch: ["High", "Medium"],
    conditionsMatch: ["Red Eye (Conjunctivitis)", "Dry Eyes", "Yellowing (Jaundice)", "Eye Irritation", "Glaucoma", "Cataract"],
  },
  {
    id: "d4",
    name: "Dr. David Evans",
    specialization: "General Physician",
    rating: 4.6,
    reviews: 150,
    address: "101 Health Blvd, Metro City",
    phone: "555-1004",
    bio: "Provides general medical care, vitals monitoring, and initial symptom assessment.",
    imageUrl: "/placeholder.svg?height=80&width=80",
    urgencyMatch: ["Low", "Medium", "High"],
    conditionsMatch: [
      "Normal Vitals",
      "Elevated Blood Pressure",
      "High Pulse Rate",
      "Elevated Temperature",
      "Common Cold",
      "Flu",
      "Fatigue Syndrome",
      "General Malaise",
      "Bronchitis",
      "Indigestion",
      "Muscle Strain",
      "Asthma",
      "Anxiety",
      "Fever",
      "Cough",
      "Headache",
      "Back Pain",
    ],
  },
  {
    id: "d5",
    name: "Dr. Olivia Reed",
    specialization: "Emergency Medicine",
    rating: 4.9,
    reviews: 200,
    address: "999 Critical Care Way, Metro City",
    phone: "555-1005",
    bio: "Specializes in urgent medical conditions and emergency care.",
    imageUrl: "/placeholder.svg?height=80&width=80",
    urgencyMatch: ["High"],
    conditionsMatch: [
      "Arrhythmia (AFib)",
      "Low Blood Oxygen (SpO2)",
      "Chest Pain",
      "Shortness of Breath",
      "Yellowing (Jaundice)",
      "Severe Allergic Reaction",
      "Stroke",
      "Sepsis",
    ],
  },
  {
    id: "d6",
    name: "Dr. Priya Patel",
    specialization: "Endocrinologist",
    rating: 4.7,
    reviews: 110,
    address: "222 Hormone Ln, Metro City",
    phone: "555-1006",
    bio: "Expert in diabetes, thyroid, and metabolic disorders.",
    imageUrl: "/placeholder.svg?height=80&width=80",
    urgencyMatch: ["Medium", "High"],
    conditionsMatch: ["Diabetes", "Thyroid Disorder", "Metabolic Syndrome", "Obesity"],
  },
  {
    id: "d7",
    name: "Dr. Samuel Lee",
    specialization: "Pulmonologist",
    rating: 4.6,
    reviews: 95,
    address: "333 Lung Ave, Metro City",
    phone: "555-1007",
    bio: "Specializes in asthma, bronchitis, and chronic lung diseases.",
    imageUrl: "/placeholder.svg?height=80&width=80",
    urgencyMatch: ["Medium", "High"],
    conditionsMatch: ["Asthma", "Bronchitis", "COPD", "Pneumonia", "Shortness of Breath"],
  },
  {
    id: "d8",
    name: "Dr. Maria Gomez",
    specialization: "Gastroenterologist",
    rating: 4.8,
    reviews: 130,
    address: "444 Digestive Rd, Metro City",
    phone: "555-1008",
    bio: "Expert in digestive system disorders, including indigestion and IBS.",
    imageUrl: "/placeholder.svg?height=80&width=80",
    urgencyMatch: ["Medium", "High"],
    conditionsMatch: ["Indigestion", "IBS", "Gastritis", "Ulcer", "Liver Disease"],
  },
]

// Suggest doctors based on disease/condition name (case-insensitive substring match)

// New robust doctor assignment logic
// Accepts: conditions (array of strings), urgency (string, optional)
// Returns: sorted array of doctors by score (specialists first, GP only if no specialist matches)
export function assignDoctors({ conditions = [], urgency = null } = {}) {
  if (!Array.isArray(conditions)) conditions = conditions ? [conditions] : [];
  const lowerConds = conditions.map(c => c?.toLowerCase?.().trim()).filter(Boolean);
  if (lowerConds.length === 0) return mockDoctors.filter(doc => doc.specialization === 'General Physician');

  // Score doctors
  const scored = mockDoctors.map(doc => {
    let score = 0;
    let exactMatches = 0;
    let partialMatches = 0;
    for (const cond of lowerConds) {
      for (const docCond of doc.conditionsMatch) {
        const docCondLower = docCond.toLowerCase();
        if (cond === docCondLower) exactMatches++;
        else if (cond.includes(docCondLower) || docCondLower.includes(cond)) partialMatches++;
      }
    }
    score += exactMatches * 10 + partialMatches * 3;
    if (urgency && doc.urgencyMatch && doc.urgencyMatch.includes(urgency)) score += 2;
    // Prefer specialists
    if (doc.specialization !== 'General Physician') score += 1;
    return { ...doc, _score: score };
  });

  // Filter out GPs if any specialist has score > 0
  const maxSpecialistScore = Math.max(...scored.filter(d => d.specialization !== 'General Physician').map(d => d._score), 0);
  let filtered = scored;
  if (maxSpecialistScore > 0) {
    filtered = scored.filter(d => d.specialization !== 'General Physician');
  } else {
    filtered = scored.filter(d => d.specialization === 'General Physician');
  }

  // Only return those with score > 0 (unless only GPs)
  const hasSpecialist = filtered.some(d => d.specialization !== 'General Physician');
  let result = filtered.filter(d => d._score > 0);
  if (result.length === 0 && !hasSpecialist) {
    result = filtered;
  }

  // Sort by score, rating, reviews
  result.sort((a, b) => b._score - a._score || b.rating - a.rating || b.reviews - a.reviews);
  // Remove _score before returning
  return result.map(({ _score, ...rest }) => rest);
}
