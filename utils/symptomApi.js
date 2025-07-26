// New CRUD API for symptom reports (mirrors vitalsApi.js)
export const createSymptomReport = async (symptomData, token = null) => {
  try {
    const response = await fetch('http://192.168.91.92:5001/api/symptoms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify(symptomData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to create symptom report');
    return data;
  } catch (error) {
    return {
      error: error?.message || error
    };
  }
};

export const getSymptomReports = async (token = null) => {
  try {
    const response = await fetch('http://192.168.91.92:5001/api/symptoms', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch symptom reports');
    return data;
  } catch (error) {
    return {
      error: error?.message || error
    };
  }
};

export const updateSymptomReport = async (id, update, token = null) => {
  try {
    const response = await fetch(`http://192.168.91.92:5001/api/symptoms/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify(update)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to update symptom report');
    return data;
  } catch (error) {
    return {
      error: error?.message || error
    };
  }
};

export const deleteSymptomReport = async (id, token = null) => {
  try {
    const response = await fetch(`http://192.168.91.92:5001/api/symptoms/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to delete symptom report');
    return data;
  } catch (error) {
    return {
      error: error?.message || error
    };
  }
};
