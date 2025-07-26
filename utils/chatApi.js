// Real API call to backend chat endpoint
export const chatWithAnimus = async (prompt) => {
  try {
    const response = await fetch('http://192.168.91.92:5001/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: 'You are a helpful assistant' },
          { role: 'user', content: prompt }
        ],
        maxTokens: 500
      })
    });
    const data = await response.json();
    return { response: data.reply };
  } catch (error) {
    return { response: 'Sorry, I could not process your request. Please try again.' };
  }
};
