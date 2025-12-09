import api from './api';

class StationsService {
  async getAllStations() {
    try {
      const response = await api.get('/stations');
      return response;
    } catch (error) {
      console.error('Error fetching stations:', error);
      throw error;
    }
  }

  async getStationById(id) {
    try {
      const response = await api.get(`/stations/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching station:', error);
      throw error;
    }
  }

  async createStation(stationData) {
    try {
      const response = await api.post('/stations', stationData);
      return response;
    } catch (error) {
      console.error('Error creating station:', error);
      throw error;
    }
  }

  async updateStation(id, stationData) {
    try {
      const response = await api.patch(`/stations/${id}`, stationData);
      return response;
    } catch (error) {
      console.error('Error updating station:', error);
      throw error;
    }
  }

  async deleteStation(id) {
    try {
      const response = await api.delete(`/stations/${id}`);
      return response;
    } catch (error) {
      console.error('Error deleting station:', error);
      throw error;
    }
  }

  async getStationsByType(tipo) {
    try {
      const response = await api.get(`/stations/type/${tipo}`);
      return response;
    } catch (error) {
      console.error('Error fetching stations by type:', error);
      throw error;
    }
  }

  async getStationsByLinea(linea) {
    try {
      const response = await api.get(`/stations/line/${linea}`);
      return response;
    } catch (error) {
      console.error('Error fetching stations by line:', error);
      throw error;
    }
  }

  async getStationCurrentLoad(id) {
    try {
      const response = await api.get(`/stations/${id}/load`);
      return response;
    } catch (error) {
      console.error('Error fetching station load:', error);
      throw error;
    }
  }

  async getAvailableStations() {
    try {
      const response = await api.get('/stations/available');
      return response;
    } catch (error) {
      console.error('Error fetching available stations:', error);
      throw error;
    }
  }

  async updateStationStatus(id, status) {
    try {
      const response = await api.patch(`/stations/${id}/status`, { status });
      return response;
    } catch (error) {
      console.error('Error updating station status:', error);
      throw error;
    }
  }
}

export default new StationsService();