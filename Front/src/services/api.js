// Configuración base de la API
const API_BASE_URL = 'http://localhost:8000/api';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Obtener token del localStorage
  getToken() {
    return localStorage.getItem('token');
  }

  // Guardar token
  setToken(token) {
    localStorage.setItem('token', token);
  }

  // Eliminar token
  removeToken() {
    localStorage.removeItem('token');
  }

  // Método genérico para hacer requests
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getToken();

    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Agregar token si existe
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);
      
      // Si es 401, limpiar token y redirigir
      if (response.status === 401) {
        this.removeToken();
        window.location.href = '/';
        throw new Error('Sesión expirada');
      }

      // Si no es exitoso, lanzar error
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Error en la petición');
      }

      // Si es 204 No Content, devolver null
      if (response.status === 204) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Métodos HTTP
  get(endpoint, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'GET',
    });
  }

  post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  patch(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'DELETE',
    });
  }
}

export default new ApiClient();