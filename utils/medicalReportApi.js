// Real API call to backend medical report analysis endpoint with AI image analysis
export const createMedicalReportAnalysis = async (data, token = null) => {
  try {
    const response = await fetch('http://192.168.91.92:5001/api/medical-report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify(data)
    });
    const resData = await response.json();
    if (!response.ok) throw new Error(resData.message || 'Failed to create medical report analysis');
    return resData;
  } catch (error) {
    return {
      error: error?.message || error
    };
  }
};

export const getMedicalReportAnalyses = async (token = null) => {
  try {
    const response = await fetch('http://192.168.91.92:5001/api/medical-report', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    });
    const resData = await response.json();
    if (!response.ok) throw new Error(resData.message || 'Failed to fetch medical report analyses');
    return resData;
  } catch (error) {
    return {
      error: error?.message || error
    };
  }
};

export const deleteMedicalReportAnalysis = async (id, token = null) => {
  try {
    const response = await fetch(`http://192.168.91.92:5001/api/medical-report/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    });
    const resData = await response.json();
    if (!response.ok) throw new Error(resData.message || 'Failed to delete medical report analysis');
    return resData;
  } catch (error) {
    return {
      error: error?.message || error
    };
  }
};
