const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  async request(url, options = {}) {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  }

  async downloadFile(url) {
    const response = await fetch(`${API_BASE_URL}${url}`);
    if (!response.ok) {
      throw new Error('Download failed');
    }
    return response.blob();
  }

  async uploadFile(url, formData) {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Upload failed');
    }

    return response.json();
  }
}

export const apiService = new ApiService();

export const productAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiService.request(`/products${queryString ? `?${queryString}` : ''}`);
  },
  
  getById: (id) => apiService.request(`/products/${id}`),
  
  create: (product) => apiService.request('/products', {
    method: 'POST',
    body: JSON.stringify(product),
  }),
  
  update: (id, product) => apiService.request(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(product),
  }),
  
  delete: (id) => apiService.request(`/products/${id}`, {
    method: 'DELETE',
  }),
  
  getCategories: () => apiService.request('/products/categories'),
  
  getHistory: (id) => apiService.request(`/products/${id}/history`),
  
  exportCsv: () => apiService.downloadFile('/products/export/csv'),
  
  importCsv: (file) => {
    const formData = new FormData();
    formData.append('csvFile', file);
    return apiService.uploadFile('/products/import/csv', formData);
  },
};