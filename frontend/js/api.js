// Small fetch wrapper used by every page. Centralises auth header handling,
// JSON parsing and error surfacing so the other JS files stay clean.

const api = {
  async request(endpoint, { method = 'GET', body = null, auth = false } = {}) {
    const headers = { 'Content-Type': 'application/json' };

    if (auth) {
      const token = localStorage.getItem('shopease_token');
      if (token) headers['Authorization'] = `Bearer ${token}`;
    }

    const config = { method, headers };
    if (body) config.body = JSON.stringify(body);

    let response;
    try {
      response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    } catch (networkErr) {
      throw new Error('Could not reach the server. Please check that the backend is running.');
    }

    let data = {};
    try {
      data = await response.json();
    } catch (parseErr) {
      // no JSON body (e.g. some 204 responses) - fine
    }

    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data;
  },

  get(endpoint, auth = false) {
    return this.request(endpoint, { method: 'GET', auth });
  },
  post(endpoint, body, auth = false) {
    return this.request(endpoint, { method: 'POST', body, auth });
  },
  put(endpoint, body, auth = false) {
    return this.request(endpoint, { method: 'PUT', body, auth });
  },
  delete(endpoint, auth = false) {
    return this.request(endpoint, { method: 'DELETE', auth });
  }
};
