import api from './api';

class EventsService {
  // Usar el endpoint correcto /trace-events
  async getAllTraceEvents(station_id = null, resultado = null, from_ts = null, to_ts = null, skip = 0, limit = 100) {
    try {
      const params = new URLSearchParams();
      if (station_id !== null) params.append('station_id', station_id);
      if (resultado) params.append('resultado', resultado);
      if (from_ts) params.append('from_ts', from_ts.toISOString());
      if (to_ts) params.append('to_ts', to_ts.toISOString());
      params.append('skip', skip);
      params.append('limit', limit);
      
      const query = params.toString();
      const response = await api.get(`/trace-events${query ? `?${query}` : ''}`);
      return response;
    } catch (error) {
      console.error('Error fetching trace events:', error);
      // Retornar array vacío en caso de error
      return [];
    }
  }

  async getTraceEventById(id) {
    try {
      const response = await api.get(`/trace-events/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching trace event:', error);
      throw error;
    }
  }

  async createTraceEvent(eventData) {
    try {
      const response = await api.post('/trace-events', eventData);
      return response;
    } catch (error) {
      console.error('Error creating trace event:', error);
      throw error;
    }
  }

  async updateTraceEvent(id, eventData) {
    try {
      const response = await api.patch(`/trace-events/${id}`, eventData);
      return response;
    } catch (error) {
      console.error('Error updating trace event:', error);
      throw error;
    }
  }

  async deleteTraceEvent(id) {
    try {
      const response = await api.delete(`/trace-events/${id}`);
      return response;
    } catch (error) {
      console.error('Error deleting trace event:', error);
      throw error;
    }
  }

  async getEventsByPart(partId) {
    try {
      // Simular filtro por parte usando el endpoint general
      const allEvents = await this.getAllTraceEvents();
      return allEvents.filter(event => event.part_id === partId);
    } catch (error) {
      console.error('Error fetching events by part:', error);
      throw error;
    }
  }

  async getEventsByStation(stationId) {
    try {
      const response = await this.getAllTraceEvents(stationId);
      return response;
    } catch (error) {
      console.error('Error fetching events by station:', error);
      throw error;
    }
  }

  async getEventsByDateRange(startDate, endDate) {
    try {
      const response = await this.getAllTraceEvents(null, null, startDate, endDate);
      return response;
    } catch (error) {
      console.error('Error fetching events by date range:', error);
      throw error;
    }
  }

  async getEventsByResult(resultado) {
    try {
      const response = await this.getAllTraceEvents(null, resultado);
      return response;
    } catch (error) {
      console.error('Error fetching events by result:', error);
      throw error;
    }
  }

  // Métodos específicos que podrían no existir en tu backend
  async registerEntry(partId, stationId) {
    try {
      // Crear un evento manual con timestamp actual
      const now = new Date();
      const eventData = {
        part_id: partId,
        station_id: stationId,
        timestamp_entrada: now.toISOString(),
        resultado: 'OK' // Valor por defecto
      };
      
      const response = await this.createTraceEvent(eventData);
      return response;
    } catch (error) {
      console.error('Error registering entry:', error);
      throw error;
    }
  }

  async registerExit(partId, stationId, resultado, observaciones = null) {
    try {
      // Buscar evento activo para esta pieza y estación
      const events = await this.getAllTraceEvents();
      const activeEvent = events.find(event => 
        event.part_id === partId && 
        event.station_id === stationId && 
        !event.timestamp_salida
      );
      
      if (activeEvent) {
        // Actualizar evento existente
        const updateData = {
          timestamp_salida: new Date().toISOString(),
          resultado: resultado,
          observaciones: observaciones
        };
        return await this.updateTraceEvent(activeEvent.id, updateData);
      } else {
        // Crear nuevo evento con ambos timestamps
        const now = new Date();
        const fiveMinutesAgo = new Date(now.getTime() - 5 * 60000);
        
        const eventData = {
          part_id: partId,
          station_id: stationId,
          timestamp_entrada: fiveMinutesAgo.toISOString(),
          timestamp_salida: now.toISOString(),
          resultado: resultado,
          observaciones: observaciones
        };
        
        return await this.createTraceEvent(eventData);
      }
    } catch (error) {
      console.error('Error registering exit:', error);
      throw error;
    }
  }

  async getCurrentEvents() {
    try {
      const events = await this.getAllTraceEvents();
      // Eventos "actuales" son aquellos sin timestamp_salida
      return events.filter(event => !event.timestamp_salida);
    } catch (error) {
      console.error('Error fetching current events:', error);
      throw error;
    }
  }
}

export default new EventsService();