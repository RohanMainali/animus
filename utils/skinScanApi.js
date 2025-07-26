// Real API call to backend skin scan endpoint with AI image analysis
export const createSkinScanReport = async (skinScanData, token = null) => {
  try {
    const response = await fetch('http://192.168.91.92:5001/api/skin-scan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify(skinScanData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to create skin scan report');
    return data;
  } catch (error) {
    return {
      error: error?.message || error
    };
  }
};

export const getSkinScanReports = async (token = null) => {
  try {
    const response = await fetch('http://192.168.91.92:5001/api/skin-scan', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch skin scan reports');
    return data;
  } catch (error) {
    return {
      error: error?.message || error
    };
  }
};

export const deleteSkinScanReport = async (id, token = null) => {
  try {
    const response = await fetch(`http://192.168.91.92:5001/api/skin-scan/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to delete skin scan report');
    return data;
  } catch (error) {
    return {
      error: error?.message || error
    };
  }
};
