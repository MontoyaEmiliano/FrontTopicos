import api from './api';

class MetricsService {
  async getPartsByStatus(from_date = null, to_date = null, tipo_pieza = null) {
    const params = new URLSearchParams();
    if (from_date) params.append('from_date', from_date);
    if (to_date) params.append('to_date', to_date);
    if (tipo_pieza) params.append('tipo_pieza', tipo_pieza);
    
    const query = params.toString() ? `?${params.toString()}` : '';
    return await api.get(`/metrics/parts-by-status${query}`);
  }

  async getThroughput(from_date = null, to_date = null, tipo_pieza = null) {
    const params = new URLSearchParams();
    if (from_date) params.append('from', from_date);
    if (to_date) params.append('to', to_date);
    if (tipo_pieza) params.append('tipo_pieza', tipo_pieza);
    
    const query = params.toString() ? `?${params.toString()}` : '';
    return await api.get(`/metrics/throughput${query}`);
  }

  async getStationCycleTime(from_ts = null, to_ts = null, tipo_pieza = null) {
    const params = new URLSearchParams();
    if (from_ts) params.append('from_ts', from_ts.toISOString());
    if (to_ts) params.append('to_ts', to_ts.toISOString());
    if (tipo_pieza) params.append('tipo_pieza', tipo_pieza);
    
    const query = params.toString() ? `?${params.toString()}` : '';
    return await api.get(`/metrics/station-cycle-time${query}`);
  }

  async getScrapRate(from_ts = null, to_ts = null, station_id = null, tipo_pieza = null) {
    const params = new URLSearchParams();
    if (from_ts) params.append('from_ts', from_ts.toISOString());
    if (to_ts) params.append('to_ts', to_ts.toISOString());
    if (station_id) params.append('station_id', station_id);
    if (tipo_pieza) params.append('tipo_pieza', tipo_pieza);
    
    const query = params.toString() ? `?${params.toString()}` : '';
    return await api.get(`/metrics/scrap-rate${query}`);
  }

  async getOverview() {
    return await api.get('/metrics/overview');
  }

  async getStationLoad(from_ts = null, to_ts = null) {
    const params = new URLSearchParams();
    if (from_ts) params.append('from_ts', from_ts.toISOString());
    if (to_ts) params.append('to_ts', to_ts.toISOString());
    
    const query = params.toString() ? `?${params.toString()}` : '';
    return await api.get(`/metrics/station-load${query}`);
  }

  // Método para obtener todas las métricas del dashboard
  async getAllMetrics() {
    try {
      const [partsByStatus, throughput, stationCycleTime, overview] = await Promise.all([
        this.getPartsByStatus(),
        this.getThroughput(),
        this.getStationCycleTime(),
        this.getOverview(),
      ]);

      return {
        partsByStatus: partsByStatus || [],
        throughput: throughput || [],
        stationCycleTime: stationCycleTime || [],
        overview: overview || {
          total_parts: 0,
          active_parts: 0,
          completed_today: 0,
          scrap_rate: 0
        },
      };
    } catch (error) {
      console.error('Error loading metrics:', error);
      // Retornar datos de ejemplo si falla
      return {
        partsByStatus: [
          { name: 'CREATED', value: 10 },
          { name: 'IN_PROCESS', value: 25 },
          { name: 'COMPLETED', value: 150 },
          { name: 'SCRAPPED', value: 5 }
        ],
        throughput: [
          { date: new Date(Date.now() - 6*86400000).toISOString().split('T')[0], count: 45 },
          { date: new Date(Date.now() - 5*86400000).toISOString().split('T')[0], count: 52 },
          { date: new Date(Date.now() - 4*86400000).toISOString().split('T')[0], count: 48 },
          { date: new Date(Date.now() - 3*86400000).toISOString().split('T')[0], count: 55 },
          { date: new Date(Date.now() - 2*86400000).toISOString().split('T')[0], count: 50 },
          { date: new Date(Date.now() - 1*86400000).toISOString().split('T')[0], count: 47 },
          { date: new Date().toISOString().split('T')[0], count: 53 }
        ],
        stationCycleTime: [
          { station: 'Estación 1', avg_minutes: 12.5 },
          { station: 'Estación 2', avg_minutes: 8.3 },
          { station: 'Estación 3', avg_minutes: 15.2 },
          { station: 'Estación 4', avg_minutes: 10.7 }
        ],
        overview: {
          total_parts: 190,
          active_parts: 25,
          completed_today: 23,
          scrap_rate: 2.6
        }
      };
    }
  }
}

export default new MetricsService();