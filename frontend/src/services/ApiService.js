const BASE_URL = import.meta.env.VITE_BACKEND_URI || "http://localhost:3000";

class ApiService {
  async request(endpoint, options = {}) {
    const storedToken = localStorage.getItem('token');
    let token = null;
    
    try {
      token = storedToken ? JSON.parse(storedToken) : null;
    } catch (e) {
      token = storedToken;
    }
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, config);

      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('auth:logout'));
        const errorData = await response.json();
        throw { status: 401, message: errorData.message || "Session expirée" };
      }

      const data = await response.json();

      if (!response.ok) {
        throw { 
          status: response.status, 
          message: data.message || "Une erreur est survenue",
          details: data.details || null 
        };
      }

      return data;
    } catch (error) {
      if (error.status) throw error;
      throw { status: 500, message: "Erreur de connexion au serveur" };
    }
  }

  async register(userData) {
    return this.request('/users/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials) {
    return this.request('/users/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async getProfile() {
    return this.request('/users/profile', { method: 'GET' });
  }

  async updateProfile(profileData) {
    return this.request('/users/me', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async updatePassword(passwords) {
    return this.request('/users/new-password', {
      method: 'POST',
      body: JSON.stringify(passwords),
    });
  }

  async deleteAccount() {
    return this.request('/users/me', { method: 'DELETE' });
  }

  // ==========================================================================
  async getJobs(queryParams = "") {
    return this.request(`/jobs${queryParams}`, { method: 'GET' });
  }

  async getJobById(id) {
    return this.request(`/jobs/${id}`, { method: 'GET' });
  }

  async createJob(jobData) {
    return this.request('/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData),
    });
  }

  async createSimpleJob(jobData) {
    return this.request('/jobs/simple', {
      method: 'POST',
      body: JSON.stringify(jobData),
    });
  }

  async updateJob(id, jobData) {
    return this.request(`/jobs/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(jobData),
    });
  }

  async deleteJob(id) {
    return this.request(`/jobs/${id}`, { method: 'DELETE' });
  }

  // --- OCR Methods ---
  async uploadJobOffer(formData) {
    const storedToken = localStorage.getItem('token');
    let token = null;
    try { token = storedToken ? JSON.parse(storedToken) : null; } catch { token = storedToken; }
    // Note: Do NOT set Content-Type here - the browser sets it with the correct boundary for multipart/form-data
    const response = await fetch(`${BASE_URL}/jobs/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) throw { status: response.status, message: data.error || 'Erreur upload' };
    return data;
  }

  async validateJobOffer(id, fields) {
    return this.request(`/jobs/${id}/validate`, {
      method: 'PUT',
      body: JSON.stringify(fields),
    });
  }

  async addTag(id, tagName) {
    return this.request(`/jobs/${id}/tags/add`, {
      method: 'PATCH',
      body: JSON.stringify({ tagName }),
    });
  }

  async removeTag(id, tagName) {
    return this.request(`/jobs/${id}/tags/remove`, {
      method: 'PATCH',
      body: JSON.stringify({ tagName }),
    });
  }

  async addContact(id, contactData) {
    return this.request(`/jobs/${id}/contacts/add`, {
      method: 'PATCH',
      body: JSON.stringify(contactData),
    });
  }

  async removeContact(id, contactId) {
    return this.request(`/jobs/${id}/contacts/remove`, {
      method: 'PATCH',
      body: JSON.stringify({ contactId }),
    });
  }

  // =======================================================================
  
  async getApplications() {
    return this.request('/applications', { method: 'GET' });
  }

  async getApplicationById(id) {
    return this.request(`/applications/${id}`, { method: 'GET' });
  }

  async createApplication(appData) {
    return this.request('/applications', {
      method: 'POST',
      body: JSON.stringify(appData),
    });
  }

  async updateApplicationStatus(id, status) {
    return this.request(`/applications/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async addFollowUp(id, followUpData) {
    return this.request(`/applications/${id}/followup`, {
      method: 'PATCH',
      body: JSON.stringify(followUpData),
    });
  }

  async deleteApplication(id) {
    return this.request(`/applications/${id}`, { method: 'DELETE' });
  }
}

const apiService = new ApiService();
export default apiService;