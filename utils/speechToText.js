// Utility to transcribe audio using AssemblyAI (or similar speech-to-text API)
// You must set your AssemblyAI API key in the environment or replace below

const ASSEMBLYAI_API_KEY = 'd85e16f79a4c45a4bc0395cc01ec5ca8'; // <-- Replace with your key
const ASSEMBLYAI_UPLOAD_URL = 'https://api.assemblyai.com/v2/upload';
const ASSEMBLYAI_TRANSCRIBE_URL = 'https://api.assemblyai.com/v2/transcript';

export async function uploadAudioFile(uri) {
  // Fetch the file as a blob
  const response = await fetch(uri);
  const blob = await response.blob();
  // Upload to AssemblyAI
  const uploadRes = await fetch(ASSEMBLYAI_UPLOAD_URL, {
    method: 'POST',
    headers: {
      'authorization': ASSEMBLYAI_API_KEY,
      'transfer-encoding': 'chunked',
    },
    body: blob,
  });
  const uploadData = await uploadRes.json();
  return uploadData.upload_url;
}

export async function transcribeAudioUrl(audioUrl) {
  // Request transcription
  const res = await fetch(ASSEMBLYAI_TRANSCRIBE_URL, {
    method: 'POST',
    headers: {
      'authorization': ASSEMBLYAI_API_KEY,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ audio_url: audioUrl }),
  });
  const data = await res.json();
  const transcriptId = data.id;
  // Poll for completion
  let transcript = null;
  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 3000));
    const pollRes = await fetch(`${ASSEMBLYAI_TRANSCRIBE_URL}/${transcriptId}`, {
      headers: { 'authorization': ASSEMBLYAI_API_KEY },
    });
    const pollData = await pollRes.json();
    if (pollData.status === 'completed') {
      transcript = pollData.text;
      break;
    } else if (pollData.status === 'failed') {
      throw new Error('Transcription failed');
    }
  }
  if (!transcript) throw new Error('Transcription timed out');
  return transcript;
}

export async function transcribeAudioFile(uri) {
  const audioUrl = await uploadAudioFile(uri);
  return await transcribeAudioUrl(audioUrl);
}
