const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Fetch all leads sorted by newest first
 * @returns {Promise<Array>}
 */
export async function getLeads() {
  const response = await fetch(`${API_BASE_URL}/leads`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch leads from server');
  }
  return data.data || [];
}

/**
 * Fetch a single lead by ID
 * @param {string} id
 * @returns {Promise<Object>}
 */
export async function getLeadById(id) {
  const response = await fetch(`${API_BASE_URL}/leads/${id}`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to retrieve lead details');
  }
  return data.data;
}

/**
 * Delete a lead by ID
 * @param {string} id
 * @returns {Promise<Object>}
 */
export async function deleteLead(id) {
  const response = await fetch(`${API_BASE_URL}/leads/${id}`, {
    method: 'DELETE',
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to delete lead');
  }
  return data;
}

/**
 * Create a new lead directly
 * @param {Object} leadData
 * @returns {Promise<Object>}
 */
export async function createLead(leadData) {
  const response = await fetch(`${API_BASE_URL}/leads`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(leadData),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to create lead');
  }
  return data.data;
}

/**
 * Check backend health status
 */
export async function checkHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return await response.json();
  } catch (err) {
    return { status: 'offline', error: err.message };
  }
}
