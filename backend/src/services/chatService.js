import fetch from 'node-fetch';

const TURBOLINE_URL = 'https://api.turboline.ai/coreai/deployments/gpt-4.1/chat/completions?api-version=2025-01-01-preview';
const TURBOLINE_KEY = process.env.TURBOLINE_KEY || 'a7ecc401f1be4d08a79256618c3977b0';

export async function chatWithLLM(messages, maxTokens = 50) {
  const body = {
    messages,
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
  return {
    reply: choice?.message?.content || '',
    role: choice?.message?.role || 'assistant',
    usage: data?.usage,
    model: data?.model,
    finish_reason: choice?.finish_reason,
    content_filter_results: choice?.content_filter_results
  };
}
