// Real API call to backend vitals endpoint with AI analysis
export const createVitals = async (vitalsData, token = null) => {
  try {
    const response = await fetch('http://192.168.91.92:5001/api/vitals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify(vitalsData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to create vitals');
    return data;
  } catch (error) {
    return {
      error: error?.message || error
    };
  }
};

