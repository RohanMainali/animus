// Real API call to backend eye scan endpoint with AI image analysis
export const createEyeScanReport = async (eyeScanData, token = null) => {
  try {
    const response = await fetch('http://192.168.91.92:5001/api/eye-scan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify(eyeScanData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to create eye scan report');
    return data;
  } catch (error) {
    return {
      error: error?.message || error
    };
  }
};

export const getEyeScanReports = async (token = null) => {
  try {
    const response = await fetch('http://192.168.91.92:5001/api/eye-scan', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch eye scan reports');
    return data;
  } catch (error) {
    return {
      error: error?.message || error
    };
  }
};

export const deleteEyeScanReport = async (id, token = null) => {
  try {
    const response = await fetch(`http://192.168.91.92:5001/api/eye-scan/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to delete eye scan report');
    return data;
  } catch (error) {
    return {
      error: error?.message || error
    };
  }
};
