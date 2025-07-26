import fetch from 'node-fetch';

const TURBOLINE_URL = 'https://api.turboline.ai/coreai/deployments/gpt-4.1/chat/completions?api-version=2025-01-01-preview';
const TURBOLINE_KEY = process.env.TURBOLINE_KEY || 'a7ecc401f1be4d08a79256618c3977b0';

export async function analyzeTextWithLLM(userText, maxTokens = 500, type = 'default') {
  let systemPrompt = 'You are a helpful assistant.';

  if (type === 'symptom') {
    systemPrompt = `
You are a medical assistant. Analyze the user's symptoms and respond ONLY in valid JSON.

Your response MUST be brief and concise. Each field should be just 1–3 sentences max. Avoid wordiness.

Strictly respond in this format (no markdown, no comments):
{
  "short_summary": "<3-5 word summary of the main concern>",
  "analysis": "<brief medical explanation (max 2 sentences)>",
  "confidence": <float between 0 and 1>,
  "scan_details": "<rephrased user input or relevant scan summary>",
  "insights": "<suggested next steps or likely diagnosis (max 2 sentences)>"
}
If unsure, return null values.
`.trim();

  } else if (type === 'vitals') {
    systemPrompt = `
You are a medical assistant. Your task is to analyze a patient's vital signs and respond ONLY in valid JSON.

Strictly output the following structure (no markdown, no comments):
{
  "analysis": "<3-5 word summary of the patient's overall status>",
  "confidence": <float between 0 and 1>,
  "scan_details": "<relevant scan summary based on the vitals>",
  "insights": "<suggested next steps or possible diagnoses>"
}
If unsure, return null values.
`.trim();
  } else if (type === 'recommendation') {
    systemPrompt = `
You are a medical assistant. Given the following analysis, respond ONLY in valid JSON:
{
  "insights": "<detailed, actionable recommendations or next steps>",
  "urgency": "<Low | Medium | High>",
  "isMedicalCondition": <0 or 1>
}
If unsure, return null values.
`.trim();
  }

  const body = {
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userText }
    ],
    max_tokens: maxTokens
  };

  const res = await fetch(TURBOLINE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'tl-key': TURBOLINE_KEY
    },
    body: JSON.stringify(body)
  });

  const data = await res.json();
  const choice = data?.choices?.[0] || {};
  const content = choice?.message?.content || '';
  const finishReason = choice?.finish_reason;

  // Try to extract valid JSON block
  let extracted = content;
  const jsonMatch = content.match(/```json\s*([\s\S]*?)```/i) || content.match(/({[\s\S]*})/);
  if (jsonMatch) {
    extracted = jsonMatch[1].trim();
  }

  let parsed;
  try {
    parsed = JSON.parse(extracted);
  } catch (err) {
    console.warn('⚠️ Failed to parse LLM JSON:', content);
    const fallbackAnalysis = finishReason === 'length'
      ? 'Response incomplete due to length limit.'
      : extracted || 'No analysis available.';

    if (type === 'recommendation') {
      return {
        insights: '',
        urgency: '',
        isMedicalCondition: null,
        finish_reason: finishReason,
        usage: data?.usage,
        model: data?.model,
        raw: data
      };
    }

    const fallback = {
      short_summary: '',
      analysis: fallbackAnalysis,
      confidence: null,
      scan_details: '',
      insights: '',
      finish_reason: finishReason,
      usage: data?.usage,
      model: data?.model,
      raw: data
    };

    if (type === 'vitals') delete fallback.short_summary;

    return fallback;
  }

  // Fallbacks for partial JSON fields
  if (type === 'recommendation') {
    return {
      insights: parsed.insights || '',
      urgency: parsed.urgency || '',
      isMedicalCondition:
        parsed.isMedicalCondition !== undefined ? parsed.isMedicalCondition : null,
      finish_reason: finishReason,
      usage: data?.usage,
      model: data?.model,
      raw: data
    };
  }

  return {
    short_summary: parsed.short_summary || '',
    analysis: parsed.analysis || '',
    confidence: parsed.confidence !== undefined ? parsed.confidence : null,
    scan_details: parsed.scan_details || '',
    insights: parsed.insights || '',
    finish_reason: finishReason,
    usage: data?.usage,
    model: data?.model,
    raw: data
  };
}


export async function analyzeImageWithLLM(imageUrl, type = 'skin', maxTokens = 1000, userText = '') {
  let prompt = '';
  if (type === 'skin') {
    prompt = `
You are a highly accurate dermatology image analysis assistant. Analyze the provided skin image and classify the most likely dermatological finding. This can be a disease, lesion, bump, mole, wart, blackhead, cyst, blister, rash, or any other skin-related condition or feature.

Respond ONLY in valid JSON with the following fields (no markdown, no comments):
{
  "short_summary": "<the most likely dermatological finding>",
  "analysis": "<a confident, detailed medical explanation in one paragraph>",
  "confidence": <float between 0.9 and 1.0>,
  "scan_details": "<objective description of the image>",
  "insights": "<suggested next steps or possible diagnoses>"
}
If you are unsure, return null values for all fields.
    `.trim();
  } else if (type === 'eye') {
    prompt = `
You are a highly accurate ophthalmology image analysis assistant. Analyze the provided eye image and classify the most likely abnormality, disease, or finding (e.g., cataract, glaucoma, redness, infection, etc.).

Respond ONLY in valid JSON with the following fields (no markdown, no comments):
{
  "short_summary": "<the most likely eye finding or diagnosis>",
  "analysis": "<a confident, detailed medical explanation in one paragraph>",
  "confidence": <float between 0 and 1>,
  "scan_details": "<objective description of the image>",
  "insights": "<suggested next steps, possible conditions, or recommendations>"
}
If you are unsure, return null values for all fields.
    `.trim();
  } else if (type === 'medical_report') {
    prompt = `
You are a medical AI assistant. Analyze the uploaded medical report image (e.g., blood report, lab report, or any clinical document) and extract the most important findings.

Respond ONLY in valid JSON with the following fields (no markdown, no comments):
{
  "short_summary": "<main finding or diagnosis>",
  "analysis": "<detailed summary of the report and its implications>",
  "confidence": <float between 0 and 1>,
  "scan_details": "<key values, metrics, or abnormalities found>",
  "insights": "<suggested next steps, possible conditions, or recommendations>"
}
If you are unsure, return null values for all fields.
    `.trim();
  } else {
    prompt = 'Analyze this medical image for concerns. Respond in valid JSON with short_summary (disease/condition name or finding), analysis (paragraph), confidence (0-1), scan_details, and insights.';
  }

  // If user provided extra context, add it to the prompt
  if (userText && userText.trim().length > 0) {
    prompt += `\n\nAdditional user context: ${userText.trim()}`;
  }

  const body = {
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: prompt },
          { type: 'image_url', image_url: { url: imageUrl } }
        ]
      }
    ],
    max_tokens: maxTokens
  };

  const res = await fetch(TURBOLINE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'tl-key': TURBOLINE_KEY
    },
    body: JSON.stringify(body)
  });

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content || '';

  let parsed = {};
  let extracted = content;
  const jsonBlockMatch = content.match(/```json([\s\S]*?)```/i);
  if (jsonBlockMatch) {
    extracted = jsonBlockMatch[1].trim();
  }

  try {
    parsed = JSON.parse(extracted);
  } catch (err) {
    console.warn('⚠️ Failed to parse image LLM JSON:', content);
    parsed = {
      short_summary: '',
      analysis: extracted || 'No analysis available.',
      confidence: null,
      scan_details: '',
      insights: ''
    };
  }

  return {
    short_summary: parsed.short_summary || '',
    analysis: parsed.analysis || '',
    confidence: parsed.confidence !== undefined ? parsed.confidence : null,
    scan_details: parsed.scan_details || '',
    insights: parsed.insights || '',
    finish_reason: data?.choices?.[0]?.finish_reason,
    content_filter_results: data?.choices?.[0]?.content_filter_results,
    usage: data?.usage,
    model: data?.model,
    raw: data
  };
}
