const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Submit a new lead enquiry to the backend API
 * @param {Object} leadData - { name, phone, email, requirement }
 * @returns {Promise<Object>}
 */
export async function submitLead(leadData) {
  try {
    const response = await fetch(`${API_BASE_URL}/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(leadData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to submit lead enquiry');
    }

    return data;
  } catch (error) {
    console.error('API Error in submitLead:', error);
    throw error;
  }
}

/**
 * Check backend connection health
 */
export async function checkBackendHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return await response.json();
  } catch (error) {
    console.warn('Backend currently unreachable:', error.message);
    return { status: 'offline', error: error.message };
  }
}
