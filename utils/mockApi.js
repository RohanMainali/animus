import {
  mockDiagnoses,
  mockSkinDiagnoses,
  mockEyeDiagnoses,
  mockVitalsAssessments,
  mockSymptomResponses,
  mockChatResponses,
} from "../constants/mockData"

const MOCK_API_DELAY = 1500 // milliseconds

// Central LLM Diagnostic Assistant
export const llmDiagnose = async (scanType, scanData, userHistory = []) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let summary = "No specific summary available."
      let topConditions = ["General Health Check"]
      let urgency = "Low"
      let suggestions = "Maintain a healthy lifestyle."
      let confidence = 0.7
      let explanation = "Detailed explanation not available."

      switch (scanType) {
        case "cardiac":
          const cardiacDiagnosis = mockDiagnoses.find((d) => d.name === scanData.diagnosis)
          summary = `Your heartbeat analysis showed a ${scanData.diagnosis} rhythm with ${Math.round(
            scanData.confidence * 100,
          )}% confidence.`
          topConditions = [scanData.diagnosis, "Normal Cardiac Function"]
          urgency = cardiacDiagnosis?.urgency || "Low"
          suggestions =
            cardiacDiagnosis?.lifestyleSuggestions ||
            "Maintain a healthy lifestyle with balanced diet and regular exercise."
          explanation = cardiacDiagnosis?.description || "No specific explanation available for this cardiac diagnosis."
          confidence = scanData.confidence
          break
        case "skin":
          const skinDiagnosis = mockSkinDiagnoses.find((d) => d.name === scanData.diagnosis)
          summary = `Your skin scan suggests symptoms consistent with ${scanData.diagnosis} with ${Math.round(
            scanData.confidence * 100,
          )}% confidence.`
          topConditions = [scanData.diagnosis, "Skin Irritation"]
          urgency = skinDiagnosis?.urgency || "Low"
          suggestions =
            skinDiagnosis?.lifestyleSuggestions || "Keep the affected area clean and moisturized. Avoid irritants."
          explanation = skinDiagnosis?.description || "No specific explanation available for this skin condition."
          confidence = scanData.confidence
          break
        case "eye":
          const eyeDiagnosis = mockEyeDiagnoses.find((d) => d.name === scanData.diagnosis)
          summary = `Your eye scan indicates ${scanData.diagnosis} with ${Math.round(
            scanData.confidence * 100,
          )}% confidence.`
          topConditions = [scanData.diagnosis, "Eye Irritation"]
          urgency = eyeDiagnosis?.urgency || "Low"
          suggestions =
            eyeDiagnosis?.lifestyleSuggestions || "Rest your eyes and avoid rubbing them. Consult an eye doctor."
          explanation = eyeDiagnosis?.description || "No specific explanation available for this eye condition."
          confidence = scanData.confidence
          break
        case "vitals":
          const vitalsAssessment = mockVitalsAssessments.find((v) => v.name === scanData.diagnosis)
          summary = `Your vitals assessment indicates: ${vitalsAssessment?.summary || "Normal readings."}`
          topConditions = [scanData.diagnosis, "Overall Health"]
          urgency = vitalsAssessment?.urgency || "Low"
          suggestions = vitalsAssessment?.lifestyleSuggestions || "Continue monitoring your vitals regularly."
          explanation = vitalsAssessment?.description || "Detailed assessment of your vital signs."
          confidence = scanData.confidence
          break
        case "symptom":
          const symptomKey = Object.keys(mockSymptomResponses).find((key) =>
            scanData.symptoms.toLowerCase().includes(key),
          )
          const symptomResponse = mockSymptomResponses[symptomKey] || mockSymptomResponses["default"]
          summary = symptomResponse.summary
          topConditions = symptomResponse.topConditions
          urgency = symptomResponse.urgency
          suggestions = symptomResponse.suggestions.join(" ")
          explanation = symptomResponse.summary // For simplicity, using summary as explanation for symptoms
          confidence = symptomResponse.confidence
          break
        default:
          break
      }

      resolve({
        summary,
        topConditions,
        urgency,
        suggestions,
        confidence,
        explanation, // Detailed explanation for the "Explanation" section
      })
    }, MOCK_API_DELAY)
  })
}

export const analyzeHeartbeat = async (audioFileUri) => {
  return new Promise((resolve) => {
    setTimeout(async () => {
      const randomDiagnosis = mockDiagnoses[Math.floor(Math.random() * mockDiagnoses.length)]
      const confidence = Number.parseFloat((Math.random() * (0.99 - 0.6) + 0.6).toFixed(2)) // 60-99%

      const scanData = {
        diagnosis: randomDiagnosis.name,
        confidence: confidence,
        waveformUrl: `/placeholder.svg?height=100&width=300&query=heartbeat waveform ${randomDiagnosis.name.toLowerCase()}`,
        spectrogramUrl: `/placeholder.svg?height=100&width=300&query=heartbeat spectrogram ${randomDiagnosis.name.toLowerCase()}`,
      }

      const llmResponse = await llmDiagnose("cardiac", scanData)

      resolve({
        scanType: "cardiac",
        scanData: scanData,
        llmResponse: llmResponse,
      })
    }, MOCK_API_DELAY)
  })
}

export const analyzeSkin = async (imageUri) => {
  return new Promise((resolve) => {
    setTimeout(async () => {
      const randomDiagnosis = mockSkinDiagnoses[Math.floor(Math.random() * mockSkinDiagnoses.length)]
      const confidence = Number.parseFloat((Math.random() * (0.99 - 0.6) + 0.6).toFixed(2))

      const scanData = {
        diagnosis: randomDiagnosis.name,
        confidence: confidence,
        imageUrl: `/placeholder.svg?height=200&width=200&query=skin condition ${randomDiagnosis.name.toLowerCase()}`,
      }

      const llmResponse = await llmDiagnose("skin", scanData)

      resolve({
        scanType: "skin",
        scanData: scanData,
        llmResponse: llmResponse,
      })
    }, MOCK_API_DELAY)
  })
}

export const analyzeEye = async (imageUri) => {
  return new Promise((resolve) => {
    setTimeout(async () => {
      const randomDiagnosis = mockEyeDiagnoses[Math.floor(Math.random() * mockEyeDiagnoses.length)]
      const confidence = Number.parseFloat((Math.random() * (0.99 - 0.6) + 0.6).toFixed(2))

      const scanData = {
        diagnosis: randomDiagnosis.name,
        confidence: confidence,
        imageUrl: `/placeholder.svg?height=200&width=200&query=eye condition ${randomDiagnosis.name.toLowerCase()}`,
      }

      const llmResponse = await llmDiagnose("eye", scanData)

      resolve({
        scanType: "eye",
        scanData: scanData,
        llmResponse: llmResponse,
      })
    }, MOCK_API_DELAY)
  })
}

export const analyzeVitals = async (vitalsData) => {
  return new Promise((resolve) => {
    setTimeout(async () => {
      // Simple mock logic to determine diagnosis based on input vitals
      let diagnosisName = "Normal Vitals"
      let confidence = 0.95

      if (
        (vitalsData.bloodPressure && vitalsData.bloodPressure.startsWith("130")) ||
        vitalsData.bloodPressure.startsWith("140")
      ) {
        diagnosisName = "Elevated Blood Pressure"
        confidence = 0.8
      } else if (vitalsData.bloodOxygen && Number.parseFloat(vitalsData.bloodOxygen) < 95) {
        diagnosisName = "Low Blood Oxygen (SpO2)"
        confidence = 0.9
      } else if (vitalsData.pulseRate && Number.parseFloat(vitalsData.pulseRate) > 100) {
        diagnosisName = "High Pulse Rate"
        confidence = 0.75
      } else if (vitalsData.temperature && Number.parseFloat(vitalsData.temperature) > 99.5) {
        diagnosisName = "Elevated Temperature"
        confidence = 0.7
      }

      const scanData = {
        ...vitalsData,
        diagnosis: diagnosisName,
        confidence: confidence,
      }

      const llmResponse = await llmDiagnose("vitals", scanData)

      resolve({
        scanType: "vitals",
        scanData: scanData,
        llmResponse: llmResponse,
      })
    }, MOCK_API_DELAY)
  })
}

export const symptomCheck = async (symptomsText) => {
  return new Promise((resolve) => {
    setTimeout(async () => {
      const symptomKey = Object.keys(mockSymptomResponses).find((key) => symptomsText.toLowerCase().includes(key))
      const responseData = mockSymptomResponses[symptomKey] || mockSymptomResponses["default"]

      const scanData = {
        symptoms: symptomsText,
        confidence: responseData.confidence,
      }

      const llmResponse = await llmDiagnose("symptom", scanData)

      resolve({
        scanType: "symptom",
        scanData: scanData,
        llmResponse: llmResponse,
      })
    }, MOCK_API_DELAY)
  })
}

export const chatWithAnimus = async (prompt) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let response = mockChatResponses[prompt] || mockChatResponses["default"]

      // Dynamic responses based on keywords
      if (prompt.toLowerCase().includes("stress")) {
        response =
          "Managing stress is vital for heart health. Try deep breathing exercises, meditation, yoga, or spending time in nature. Regular physical activity also helps reduce stress levels."
      } else if (prompt.toLowerCase().includes("diet")) {
        response =
          "A heart-healthy diet emphasizes fruits, vegetables, whole grains, lean proteins, and healthy fats. Limit processed foods, sugary drinks, excessive sodium, and unhealthy fats."
      } else if (prompt.toLowerCase().includes("exercise")) {
        response =
          "Regular exercise strengthens your heart. Aim for at least 150 minutes of moderate-intensity aerobic activity or 75 minutes of vigorous-intensity activity per week, along with muscle-strengthening activities."
      } else if (prompt.toLowerCase().includes("sleep")) {
        response =
          "Adequate sleep is crucial for heart health. Aim for 7-9 hours of quality sleep per night. Poor sleep can contribute to high blood pressure, obesity, and diabetes, all risk factors for heart disease."
      } else if (prompt.toLowerCase().includes("symptoms")) {
        response =
          "If you are experiencing symptoms like chest pain, shortness of breath, dizziness, or irregular heartbeats, please consult a healthcare professional immediately. Animus is a monitoring tool, not a diagnostic one."
      } else if (prompt.toLowerCase().includes("skin")) {
        response =
          "For skin concerns, Animus can help detect common conditions like acne, eczema, or suspicious moles. Remember, it's a screening tool, and a dermatologist should confirm any diagnosis."
      } else if (prompt.toLowerCase().includes("eye")) {
        response =
          "Animus can scan your eyes for signs of redness, dryness, or yellowing. These can indicate various conditions, from minor irritation to more serious health issues. Always consult an eye care professional for definitive diagnosis."
      } else if (prompt.toLowerCase().includes("vitals")) {
        response =
          "Monitoring vitals like blood pressure, pulse, blood oxygen, and temperature provides a snapshot of your overall health. Consistent abnormal readings should always be discussed with your doctor."
      }

      resolve({
        response: response,
      })
    }, MOCK_API_DELAY)
  })
}
