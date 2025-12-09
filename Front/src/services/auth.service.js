import api from './api';

class AuthService {
  async login(email, password) {
    try {
      // Usar FormData para OAuth2 como en tu componente Login
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);

      const response = await fetch(`${this.baseURL || 'http://127.0.0.1:8000/api'}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.detail || 'Credenciales incorrectas');
      }

      const data = await response.json();
      const token = data.access_token;

      if (!token) {
        throw new Error('Token no recibido del servidor');
      }

      // Guardar token
      api.setToken(token);
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async getMe() {
    try {
      const response = await api.get('/auth/me');
      return response;
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  }

  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      return response;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  }

  async updateProfile(userData) {
    try {
      const response = await api.patch('/auth/profile', userData);
      return response;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  logout() {
    api.removeToken();
  }

  isAuthenticated() {
    return !!api.getToken();
  }
}

export default new AuthService();