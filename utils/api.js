// Recommendations API
export async function getRecommendations(token, { analysis, userId, scanType, scanData, vitalsId }) {
  try {
    const res = await fetch(`${BASE_URL}/recommendations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ analysis, userId, scanType, scanData, vitalsId }),
    });
    return await res.json();
  } catch (error) {
    return { message: 'Network request failed', error: error?.message || error };
  }
}
// Reminder API
export async function getReminders(token) {
  try {
    const res = await fetch(`${BASE_URL}/reminders`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    return await res.json();
  } catch (error) {
    return { message: 'Network request failed', error: error?.message || error };
  }
}

export async function createReminder(token, data) {
  try {
    const res = await fetch(`${BASE_URL}/reminders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (error) {
    return { message: 'Network request failed', error: error?.message || error };
  }
}

export async function updateReminder(token, id, data) {
  try {
    const res = await fetch(`${BASE_URL}/reminders/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (error) {
    return { message: 'Network request failed', error: error?.message || error };
  }
}

export async function deleteReminder(token, id) {
  try {
    const res = await fetch(`${BASE_URL}/reminders/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    return await res.json();
  } catch (error) {
    return { message: 'Network request failed', error: error?.message || error };
  }
}
// Goals API
export async function getGoals(token) {
  try {
    const res = await fetch(`${BASE_URL}/goals`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    return await res.json();
  } catch (error) {
    return { message: 'Network request failed', error: error?.message || error };
  }
}

export async function createGoal(token, data) {
  try {
    const res = await fetch(`${BASE_URL}/goals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (error) {
    return { message: 'Network request failed', error: error?.message || error };
  }
}

export async function updateGoal(token, id, data) {
  try {
    const res = await fetch(`${BASE_URL}/goals/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (error) {
    return { message: 'Network request failed', error: error?.message || error };
  }
}

export async function deleteGoal(token, id) {
  try {
    const res = await fetch(`${BASE_URL}/goals/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    return await res.json();
  } catch (error) {
    return { message: 'Network request failed', error: error?.message || error };
  }
}
// Symptoms API
export async function getSymptoms(token) {
  try {
    const res = await fetch(`${BASE_URL}/symptoms`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    return await res.json();
  } catch (error) {
    return { message: 'Network request failed', error: error?.message || error };
  }
}

export async function createSymptom(token, data) {
  try {
    const res = await fetch(`${BASE_URL}/symptoms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (error) {
    return { message: 'Network request failed', error: error?.message || error };
  }
}

export async function deleteSymptom(token, id) {
  try {
    const res = await fetch(`${BASE_URL}/symptoms/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    return await res.json();
  } catch (error) {
    return { message: 'Network request failed', error: error?.message || error };
  }
}
// Health Report API
export async function getHealthReports(token) {
  try {
    const res = await fetch(`${BASE_URL}/health-report`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    return await res.json();
  } catch (error) {
    return { message: 'Network request failed', error: error?.message || error };
  }
}

export async function createHealthReport(token, data) {
  try {
    const res = await fetch(`${BASE_URL}/health-report`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (error) {
    return { message: 'Network request failed', error: error?.message || error };
  }
}

export async function updateHealthReport(token, id, data) {
  try {
    const res = await fetch(`${BASE_URL}/health-report/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (error) {
    return { message: 'Network request failed', error: error?.message || error };
  }
}

export async function deleteHealthReport(token, id) {
  try {
    const res = await fetch(`${BASE_URL}/health-report/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    return await res.json();
  } catch (error) {
    return { message: 'Network request failed', error: error?.message || error };
  }
}
// Medical History API
export async function getMedicalHistories(token) {
  try {
    const res = await fetch(`${BASE_URL}/medical-history`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    return await res.json();
  } catch (error) {
    return { message: 'Network request failed', error: error?.message || error };
  }
}

export async function createMedicalHistory(token, data) {
  try {
    const res = await fetch(`${BASE_URL}/medical-history`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (error) {
    return { message: 'Network request failed', error: error?.message || error };
  }
}

export async function updateMedicalHistory(token, id, data) {
  try {
    const res = await fetch(`${BASE_URL}/medical-history/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (error) {
    return { message: 'Network request failed', error: error?.message || error };
  }
}

export async function deleteMedicalHistory(token, id) {
  try {
    const res = await fetch(`${BASE_URL}/medical-history/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    return await res.json();
  } catch (error) {
    return { message: 'Network request failed', error: error?.message || error };
  }
}
const BASE_URL = 'http://192.168.91.92:5001/api'; // Replace with your local IP

export async function getProfile(token) {
  try {
    const res = await fetch(`${BASE_URL}/user/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    return await res.json();
  } catch (error) {
    return { message: 'Network request failed', error: error?.message || error };
  }
}

export async function updateProfile(token, name, email) {
  try {
    const res = await fetch(`${BASE_URL}/user/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ name, email }),
    });
    return await res.json();
  } catch (error) {
    return { message: 'Network request failed', error: error?.message || error };
  }
}


export async function signup(name, email, password) {
  try {
    const res = await fetch(`${BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    return await res.json();
  } catch (error) {
    return { message: 'Network request failed', error: error?.message || error };
  }
}


export async function login(email, password) {
  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return await res.json();
  } catch (error) {
    return { message: 'Network request failed', error: error?.message || error };
  }
}
