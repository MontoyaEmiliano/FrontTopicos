import api from './api';

class PartsService {
  async getAllParts() {
    try {
      const response = await api.get('/parts');
      return response;
    } catch (error) {
      console.error('Error fetching parts:', error);
      throw error;
    }
  }

  async getPartById(id) {
    try {
      const response = await api.get(`/parts/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching part:', error);
      throw error;
    }
  }

  async createPart(partData) {
    try {
      const response = await api.post('/parts', partData);
      return response;
    } catch (error) {
      console.error('Error creating part:', error);
      throw error;
    }
  }

  async updatePart(id, partData) {
    try {
      const response = await api.patch(`/parts/${id}`, partData);
      return response;
    } catch (error) {
      console.error('Error updating part:', error);
      throw error;
    }
  }

  async deletePart(id) {
    try {
      const response = await api.delete(`/parts/${id}`);
      return response;
    } catch (error) {
      console.error('Error deleting part:', error);
      throw error;
    }
  }

  async getPartsByStatus(status) {
    try {
      const response = await api.get(`/parts/status/${status}`);
      return response;
    } catch (error) {
      console.error('Error fetching parts by status:', error);
      throw error;
    }
  }

  async searchParts(query) {
    try {
      const response = await api.get(`/parts/search?q=${query}`);
      return response;
    } catch (error) {
      console.error('Error searching parts:', error);
      throw error;
    }
  }

  async updatePartStatus(id, status, observaciones = null) {
    try {
      const data = { status };
      if (observaciones) {
        data.observaciones = observaciones;
      }
      const response = await api.patch(`/parts/${id}/status`, data);
      return response;
    } catch (error) {
      console.error('Error updating part status:', error);
      throw error;
    }
  }

  async addRework(id, motivo) {
    try {
      const response = await api.post(`/parts/${id}/rework`, { motivo });
      return response;
    } catch (error) {
      console.error('Error adding rework:', error);
      throw error;
    }
  }

  async getPartHistory(id) {
    try {
      const response = await api.get(`/parts/${id}/history`);
      return response;
    } catch (error) {
      console.error('Error fetching part history:', error);
      throw error;
    }
  }
}

export default new PartsService();