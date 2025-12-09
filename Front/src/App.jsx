import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  LogIn, Package, MapPin, Activity, Users, TrendingUp, 
  AlertCircle, CheckCircle, Clock, Trash2, Edit, Plus, X,
  Search, Filter, Brain
} from 'lucide-react';


// Importar servicios
import authService from './services/auth.service';
import partsService from './services/parts.service';
import stationsService from './services/stations.service';
import eventsService from './services/events.service';
import metricsService from './services/metrics.service';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
const GOOGLE_API_KEY = 'AIzaSyAgzlBQkCjwYvrslZotrrcknIvjC1xVDS0';

// Componentes de modales
const Modal = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

const PartForm = ({ part, onSubmit, onCancel, isEditing }) => {
  const [formData, setFormData] = useState({
    tipo_pieza: part?.tipo_pieza || '',
    lote: part?.lote || '',
    status: part?.status || 'CREATED',
    num_retrabajos: part?.num_retrabajos || 0,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tipo de Pieza
        </label>
        <input
          type="text"
          value={formData.tipo_pieza}
          onChange={(e) => setFormData({...formData, tipo_pieza: e.target.value})}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Lote
        </label>
        <input
          type="text"
          value={formData.lote}
          onChange={(e) => setFormData({...formData, lote: e.target.value})}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Estado
        </label>
        <select
          value={formData.status}
          onChange={(e) => setFormData({...formData, status: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="CREATED">Creada</option>
          <option value="IN_PROCESS">En Proceso</option>
          <option value="COMPLETED">Completada</option>
          <option value="SCRAPPED">Scrap</option>
        </select>
      </div>
      
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {isEditing ? 'Actualizar' : 'Crear'}
        </button>
      </div>
    </form>
  );
};

const StationForm = ({ station, onSubmit, onCancel, isEditing }) => {
  const [formData, setFormData] = useState({
    nombre: station?.nombre || '',
    tipo: station?.tipo || 'INSPECCION',
    linea: station?.linea || '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nombre
        </label>
        <input
          type="text"
          value={formData.nombre}
          onChange={(e) => setFormData({...formData, nombre: e.target.value})}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tipo
        </label>
        <select
          value={formData.tipo}
          onChange={(e) => setFormData({...formData, tipo: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="INSPECCION">Inspección</option>
          <option value="ENSAMBLE">Ensamblaje</option>
          <option value="PRUEBA">Prueba</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Línea
        </label>
        <input
          type="text"
          value={formData.linea}
          onChange={(e) => setFormData({...formData, linea: e.target.value})}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {isEditing ? 'Actualizar' : 'Crear'}
        </button>
      </div>
    </form>
  );
};

const EventForm = ({ event, parts, stations, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    part_id: event?.part_id || '',
    station_id: event?.station_id || '',
    resultado: event?.resultado || 'OK',
    observaciones: event?.observaciones || '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Pieza
        </label>
        <select
          value={formData.part_id}
          onChange={(e) => setFormData({...formData, part_id: e.target.value})}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Seleccionar pieza</option>
          {parts.map(part => (
            <option key={part.id} value={part.id}>
              {part.id} - {part.tipo_pieza}
            </option>
          ))}
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Estación
        </label>
        <select
          value={formData.station_id}
          onChange={(e) => setFormData({...formData, station_id: e.target.value})}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Seleccionar estación</option>
          {stations.map(station => (
            <option key={station.id} value={station.id}>
              {station.nombre} - {station.tipo}
            </option>
          ))}
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Resultado
        </label>
        <select
          value={formData.resultado}
          onChange={(e) => setFormData({...formData, resultado: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="OK">OK</option>
          <option value="SCRAP">Scrap</option>
          <option value="RETRABAJO">Retrabajo</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Observaciones
        </label>
        <textarea
          value={formData.observaciones}
          onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Registrar Evento
        </button>
      </div>
    </form>
  );
};

// ============================================
// COMPONENTE DE ANÁLISIS IA - AGREGAR AQUÍ
// ============================================

const AIAnalysis = ({ metrics, parts, stations, traceEvents }) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState('general');

  const analyzeData = (type = 'general') => {
    setLoading(true);
    setTimeout(() => {
      let result;
      switch(type) {
        case 'general':
          result = analyzeGeneral();
          break;
        case 'quality':
          result = analyzeQuality();
          break;
        case 'efficiency':
          result = analyzeEfficiency();
          break;
        case 'predictive':
          result = analyzePredictive();
          break;
        default:
          result = analyzeGeneral();
      }
      setAnalysis(result);
      setLoading(false);
    }, 1500);
  };

  const analyzeGeneral = () => {
    const totalParts = metrics?.overview?.total_parts || 0;
    const inProcess = metrics?.overview?.in_process || 0;
    const completed = metrics?.overview?.completed || 0;
    const scrapToday = metrics?.overview?.scrap_today || 0;
    const completedToday = metrics?.overview?.completed_today || 0;
    
    const completionRate = totalParts > 0 ? (completed / totalParts * 100) : 0;
    const scrapRate = totalParts > 0 ? (scrapToday / totalParts * 100) : 0;
    
    let status = 'good';
    let summary = '';
    
    if (scrapRate > 5) {
      status = 'critical';
      summary = 'Se detectan problemas críticos. Se requiere atención inmediata.';
    } else if (scrapRate > 2 || completionRate < 70) {
      status = 'warning';
      summary = 'La producción muestra áreas de mejora identificadas.';
    } else {
      status = 'good';
      summary = 'La producción opera dentro de parámetros normales.';
    }
    
    const recommendations = [
      scrapRate > 2 ? `Reducir tasa de scrap (${scrapRate.toFixed(1)}%)` : 'Mantener estándares actuales',
      'Implementar monitoreo en tiempo real de OEE',
      'Optimizar balance de línea entre estaciones',
      'Capacitar operadores en detección de defectos'
    ];
    
    return {
      status,
      summary,
      recommendations,
      kpis: {
        completionRate: completionRate.toFixed(1),
        scrapRate: scrapRate.toFixed(1),
        productivity: completedToday
      }
    };
  };

  const analyzeQuality = () => {
    const totalParts = metrics?.overview?.total_parts || 0;
    const scrapToday = metrics?.overview?.scrap_today || 0;
    const scrapRate = totalParts > 0 ? (scrapToday / totalParts * 100) : 0;
    
    let qualityScore = 100 - (scrapRate * 10);
    qualityScore = Math.max(0, Math.min(100, qualityScore));
    
    return {
      quality_score: qualityScore,
      scrap_analysis: scrapRate < 2 ? 
        'Control de calidad excelente' : 
        'Se requiere atención en control de calidad',
      problem_stations: scrapRate > 2 ? 
        ['Revisar estaciones con mayor tasa de defectos'] : 
        [],
      recommendations: [
        'Calibrar equipos de medición',
        'Implementar control estadístico de procesos',
        'Aumentar frecuencia de inspecciones'
      ]
    };
  };

  const analyzeEfficiency = () => {
    const totalParts = metrics?.overview?.total_parts || 0;
    const inProcess = metrics?.overview?.in_process || 0;
    const wipLevel = totalParts > 0 ? (inProcess / totalParts * 100) : 0;
    
    let efficiencyScore = 100 - (wipLevel * 2);
    efficiencyScore = Math.max(0, Math.min(100, efficiencyScore));
    
    return {
      efficiency_score: efficiencyScore,
      bottlenecks: wipLevel > 20 ? 
        [`Exceso de WIP (${inProcess} piezas)`] : 
        [],
      recommendations: [
        'Implementar sistema kanban',
        'Reducir tiempos de setup',
        'Balancear carga entre estaciones'
      ]
    };
  };

  const analyzePredictive = () => {
    const scrapToday = metrics?.overview?.scrap_today || 0;
    
    return {
      trends: [
        'Monitorear tendencia de scrap diario',
        'Observar variabilidad en tiempos de ciclo'
      ],
      risks: scrapToday > 5 ? 
        ['Alto: Tasa de scrap elevada'] : 
        ['Bajo: Operación normal'],
      predictions: [
        'Proyección basada en datos históricos en desarrollo'
      ],
      preventive_actions: [
        'Implementar mantenimiento preventivo',
        'Establecer alertas tempranas de KPIs'
      ]
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center space-x-3">
          <Brain className="w-10 h-10" />
          <div>
            <h2 className="text-2xl font-bold">Análisis Inteligente</h2>
            <p className="text-purple-100">Análisis automatizado de datos</p>
          </div>
        </div>
      </div>

      {/* Selector */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Tipo de Análisis
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {['general', 'quality', 'efficiency', 'predictive'].map(type => (
            <button
              key={type}
              onClick={() => setSelectedAnalysis(type)}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedAnalysis === type
                  ? 'border-purple-600 bg-purple-50'
                  : 'border-gray-200 hover:border-purple-300'
              }`}
            >
              <p className="font-semibold capitalize">{type}</p>
            </button>
          ))}
        </div>

        <button
          onClick={() => analyzeData(selectedAnalysis)}
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 flex items-center justify-center"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Analizando...
            </>
          ) : (
            <>
              <Activity className="w-5 h-5 mr-2" />
              Generar Análisis
            </>
          )}
        </button>
      </div>

      {/* Resultados */}
      {analysis && !loading && (
        <div className="space-y-4">
          {/* General */}
          {selectedAnalysis === 'general' && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className={`p-4 rounded-lg mb-4 ${
                analysis.status === 'good' ? 'bg-green-50' :
                analysis.status === 'warning' ? 'bg-yellow-50' : 'bg-red-50'
              }`}>
                <p className="font-semibold">{analysis.summary}</p>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Completado</p>
                  <p className="text-2xl font-bold">{analysis.kpis.completionRate}%</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Scrap</p>
                  <p className="text-2xl font-bold">{analysis.kpis.scrapRate}%</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Hoy</p>
                  <p className="text-2xl font-bold">{analysis.kpis.productivity}</p>
                </div>
              </div>
              
              <h4 className="font-semibold mb-2">Recomendaciones:</h4>
              <ul className="space-y-2">
                {analysis.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Quality */}
          {selectedAnalysis === 'quality' && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Score de Calidad</h3>
                <div className={`text-3xl font-bold ${
                  analysis.quality_score >= 90 ? 'text-green-600' :
                  analysis.quality_score >= 70 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {analysis.quality_score.toFixed(0)}%
                </div>
              </div>
              <p className="text-gray-600 mb-4">{analysis.scrap_analysis}</p>
              
              {analysis.problem_stations.length > 0 && (
                <div className="bg-red-50 p-4 rounded-lg mb-4">
                  <h4 className="font-semibold text-red-800 mb-2">Atención Requerida:</h4>
                  <ul>
                    {analysis.problem_stations.map((station, idx) => (
                      <li key={idx} className="text-red-700">• {station}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <h4 className="font-semibold mb-2">Recomendaciones:</h4>
              <ul className="space-y-2">
                {analysis.recommendations.map((rec, idx) => (
                  <li key={idx}>• {rec}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Efficiency */}
          {selectedAnalysis === 'efficiency' && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Score de Eficiencia</h3>
                <div className="text-3xl font-bold text-blue-600">
                  {analysis.efficiency_score.toFixed(0)}%
                </div>
              </div>
              
              {analysis.bottlenecks.length > 0 && (
                <div className="bg-yellow-50 p-4 rounded-lg mb-4">
                  <h4 className="font-semibold text-yellow-800 mb-2">Cuellos de Botella:</h4>
                  <ul>
                    {analysis.bottlenecks.map((bottleneck, idx) => (
                      <li key={idx} className="text-yellow-700">⚠️ {bottleneck}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <h4 className="font-semibold mb-2">Recomendaciones:</h4>
              <ul className="space-y-2">
                {analysis.recommendations.map((rec, idx) => (
                  <li key={idx}>• {rec}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Predictive */}
          {selectedAnalysis === 'predictive' && (
            <div className="space-y-4">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-3">Tendencias</h3>
                <ul className="space-y-2">
                  {analysis.trends.map((trend, idx) => (
                    <li key={idx}>📈 {trend}</li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-red-50 rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-red-800 mb-3">Riesgos</h3>
                <ul className="space-y-2">
                  {analysis.risks.map((risk, idx) => (
                    <li key={idx} className="text-red-700">⚠️ {risk}</li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-green-50 rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-green-800 mb-3">Acciones Preventivas</h3>
                <ul className="space-y-2">
                  {analysis.preventive_actions.map((action, idx) => (
                    <li key={idx} className="text-green-700">✓ {action}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ============================================
// FIN DEL COMPONENTE DE ANÁLISIS IA
// ============================================

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("admin@example.com"); // Valor por defecto
  const [password, setPassword] = useState("password123"); // Valor por defecto
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await submit();
  };

  const submit = async () => {
    setLoading(true);
    setError("");

    try {
      // 🔥 Usar FormData para OAuth2PasswordRequestForm
      const formData = new URLSearchParams();
      formData.append('username', email);  // OAuth2 usa 'username', no 'email'
      formData.append('password', password);

      console.log('Enviando datos de login:', { email, password });

      const res = await fetch("http://127.0.0.1:8000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Accept": "application/json"
        },
        body: formData.toString()
      });

      console.log('Status de respuesta:', res.status);
      
      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        console.error('Error del servidor:', errData);
        throw new Error(errData?.detail || `Error ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      console.log('Datos recibidos:', data);

      const token = data.access_token || data.token || data.accessToken;
      const user = data.user || null;

      if (!token) {
        setError("Respuesta inválida del servidor: no se recibió token");
        return;
      }

      // Guardar token en localStorage
      localStorage.setItem("token", token);
      if (user) localStorage.setItem("user", JSON.stringify(user));

      // Si no viene usuario en la respuesta, obtenerlo del endpoint /me
      if (!user) {
        try {
          const userRes = await fetch("http://127.0.0.1:8000/api/auth/me", {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Accept": "application/json"
            }
          });
          
          if (userRes.ok) {
            const userData = await userRes.json();
            localStorage.setItem("user", JSON.stringify(userData));
            onLogin(token, userData);
          } else {
            onLogin(token, { email });
          }
        } catch (userError) {
          console.warn("No se pudieron obtener datos del usuario:", userError);
          onLogin(token, { email });
        }
      } else {
        onLogin(token, user);
      }

    } catch (err) {
      console.error('Error completo:', err);
      setError(err.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <Package className="w-12 h-12 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-800">Traceability</h1>
        </div>

        <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">
          Iniciar Sesión
        </h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            <span className="flex-1">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center transition-colors"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Cargando...
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5 mr-2" />
                Iniciar Sesión
              </>
            )}
          </button>
        </form>

        <div className="mt-4 text-sm text-gray-600 text-center">
        </div>
      </div>
    </div>
  );
};

const Dashboard = ({ metrics }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <DashboardCard
        title="Total Piezas"
        value={metrics?.overview?.total_parts || 0}
        icon={<Package className="w-12 h-12 text-blue-500" />}
      />
      
      <DashboardCard
        title="En Proceso"
        value={metrics?.overview?.active_parts || 0}
        icon={<Clock className="w-12 h-12 text-yellow-500" />}
      />
      
      <DashboardCard
        title="Completadas Hoy"
        value={metrics?.overview?.completed_today || 0}
        icon={<CheckCircle className="w-12 h-12 text-green-500" />}
      />
      
      <DashboardCard
        title="Tasa de Scrap"
        value={`${metrics?.overview?.scrap_rate?.toFixed(1) || 0}%`}
        icon={<AlertCircle className="w-12 h-12 text-red-500" />}
      />
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ChartCard title="Piezas por Estado">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={metrics?.partsByStatus || []}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {(metrics?.partsByStatus || []).map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>
      
      <ChartCard title="Producción Semanal">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={metrics?.throughput || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
    
    <ChartCard title="Tiempo de Ciclo por Estación">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={metrics?.stationCycleTime || []}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="station" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="avg_minutes" fill="#10b981" />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  </div>
);

const PartsList = ({ parts, onEdit, onDelete, onCreate, searchTerm, setSearchTerm }) => {
  const [filteredParts, setFilteredParts] = useState(parts);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    let filtered = parts;
    
    if (searchTerm) {
      filtered = filtered.filter(part => 
        part.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        part.tipo_pieza.toLowerCase().includes(searchTerm.toLowerCase()) ||
        part.lote.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(part => part.status === statusFilter);
    }
    
    setFilteredParts(filtered);
  }, [parts, searchTerm, statusFilter]);

  const getStatusStyle = (status) => {
    const styles = {
      COMPLETED: 'bg-green-100 text-green-800',
      IN_PROCESS: 'bg-yellow-100 text-yellow-800',
      SCRAPPED: 'bg-red-100 text-red-800',
      CREATED: 'bg-blue-100 text-blue-800'
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  const formatStatus = (status) => {
    const statusMap = {
      COMPLETED: 'Completada',
      IN_PROCESS: 'En Proceso',
      SCRAPPED: 'Scrap',
      CREATED: 'Creada'
    };
    return statusMap[status] || status;
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <Header title="Piezas" buttonText="Nueva Pieza" onButtonClick={onCreate} />
      
      {/* Filtros */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por serial, tipo o lote..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos los estados</option>
              <option value="CREATED">Creada</option>
              <option value="IN_PROCESS">En Proceso</option>
              <option value="COMPLETED">Completada</option>
              <option value="SCRAPPED">Scrap</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <TableHeader>Serial</TableHeader>
              <TableHeader>Tipo</TableHeader>
              <TableHeader>Lote</TableHeader>
              <TableHeader>Estado</TableHeader>
              <TableHeader>Retrabajos</TableHeader>
              <TableHeader>Acciones</TableHeader>
            </tr>
          </thead>
          
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredParts.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  {searchTerm || statusFilter !== 'all' ? 'No se encontraron piezas' : 'No hay piezas registradas'}
                </td>
              </tr>
            ) : (
              filteredParts.map((part) => (
                <tr key={part.id} className="hover:bg-gray-50">
                  <TableCell>{part.id}</TableCell>
                  <TableCell>{part.tipo_pieza}</TableCell>
                  <TableCell>{part.lote}</TableCell>
                  <TableCell>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyle(part.status)}`}>
                      {formatStatus(part.status)}
                    </span>
                  </TableCell>
                  <TableCell>{part.num_retrabajos}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => onEdit(part)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => onDelete(part.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </TableCell>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const StationsList = ({ stations, onEdit, onDelete, onCreate, searchTerm, setSearchTerm }) => {
  const [filteredStations, setFilteredStations] = useState(stations);

  useEffect(() => {
    let filtered = stations;
    
    if (searchTerm) {
      filtered = filtered.filter(station => 
        station.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        station.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        station.linea.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredStations(filtered);
  }, [stations, searchTerm]);

  const getTypeColor = (tipo) => {
    const colors = {
      INSPECCION: 'bg-blue-100 text-blue-800',
      ENSAMBLE: 'bg-green-100 text-green-800',
      PRUEBA: 'bg-yellow-100 text-yellow-800'
    };
    return colors[tipo] || 'bg-gray-100 text-gray-800';
  };

  const formatType = (tipo) => {
    const typeMap = {
      INSPECCION: 'Inspección',
      ENSAMBLE: 'Ensamblaje',
      PRUEBA: 'Prueba'
    };
    return typeMap[tipo] || tipo;
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <Header title="Estaciones" buttonText="Nueva Estación" onButtonClick={onCreate} />
      
      {/* Filtros */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por nombre, tipo o línea..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
        {filteredStations.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 py-8">
            {searchTerm ? 'No se encontraron estaciones' : 'No hay estaciones registradas'}
          </div>
        ) : (
          filteredStations.map((station) => (
            <div key={station.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-blue-600 mr-2" />
                  <h3 className="font-semibold text-gray-800">{station.nombre}</h3>
                </div>
                
                <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(station.tipo)}`}>
                  {formatType(station.tipo)}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">Línea: {station.linea}</p>
              
              <div className="flex space-x-2">
                <button 
                  onClick={() => onEdit(station)}
                  className="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded text-sm hover:bg-blue-100"
                >
                  Editar
                </button>
                <button 
                  onClick={() => onDelete(station.id)}
                  className="flex-1 bg-red-50 text-red-600 px-3 py-2 rounded text-sm hover:bg-red-100"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const EventsList = ({ events, onCreate, searchTerm, setSearchTerm }) => {
  const [filteredEvents, setFilteredEvents] = useState(events);
  const [resultFilter, setResultFilter] = useState('all');

  useEffect(() => {
    let filtered = events;
    
    if (searchTerm) {
      filtered = filtered.filter(event => 
        event.part_id?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.station_id?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (resultFilter !== 'all') {
      filtered = filtered.filter(event => event.resultado === resultFilter);
    }
    
    setFilteredEvents(filtered);
  }, [events, searchTerm, resultFilter]);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleString('es-MX', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formateando fecha:', dateString, error);
      return dateString;
    }
  };

  const getResultColor = (resultado) => {
    const colors = {
      OK: 'bg-green-100 text-green-800',
      SCRAP: 'bg-red-100 text-red-800',
      RETRABAJO: 'bg-yellow-100 text-yellow-800'
    };
    return colors[resultado] || 'bg-gray-100 text-gray-800';
  };

  const formatResult = (resultado) => {
    const resultMap = {
      OK: 'OK',
      SCRAP: 'Scrap',
      RETRABAJO: 'Retrabajo'
    };
    return resultMap[resultado] || resultado;
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <Header title="Eventos de Trazabilidad" buttonText="Registrar Evento" onButtonClick={onCreate} />
      
      {/* Filtros */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por ID de pieza o estación..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={resultFilter}
              onChange={(e) => setResultFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos los resultados</option>
              <option value="OK">OK</option>
              <option value="SCRAP">Scrap</option>
              <option value="RETRABAJO">Retrabajo</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <TableHeader>ID</TableHeader>
              <TableHeader>Pieza</TableHeader>
              <TableHeader>Estación</TableHeader>
              <TableHeader>Entrada</TableHeader>
              <TableHeader>Salida</TableHeader>
              <TableHeader>Resultado</TableHeader>
              <TableHeader>Observaciones</TableHeader>
            </tr>
          </thead>
          
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredEvents.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                  {searchTerm || resultFilter !== 'all' ? 'No se encontraron eventos' : 'No hay eventos registrados'}
                </td>
              </tr>
            ) : (
              filteredEvents.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50">
                  <TableCell>{event.id}</TableCell>
                  <TableCell>{event.part_id}</TableCell>
                  <TableCell>{event.station_id}</TableCell>
                  <TableCell>{formatDate(event.timestamp_entrada)}</TableCell>
                  <TableCell>{formatDate(event.timestamp_salida)}</TableCell>
                  <TableCell>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getResultColor(event.resultado)}`}>
                      {formatResult(event.resultado)}
                    </span>
                  </TableCell>
                  <TableCell>{event.observaciones || '-'}</TableCell>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Componentes auxiliares
const DashboardCard = ({ title, value, icon }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
      </div>
      {icon}
    </div>
  </div>
);

const ChartCard = ({ title, children }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
    {children}
  </div>
);

const Header = ({ title, buttonText, onButtonClick }) => (
  <div className="p-6 border-b border-gray-200 flex justify-between items-center">
    <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
    <button 
      onClick={onButtonClick}
      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
    >
      <Plus className="w-5 h-5 mr-2" />
      {buttonText}
    </button>
  </div>
);

const TableHeader = ({ children }) => (
  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
    {children}
  </th>
);

const TableCell = ({ children }) => (
  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
    {children}
  </td>
);

const Navigation = ({ view, setView, user, onLogout }) => (
  <nav className="bg-white shadow-lg">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16">
        <div className="flex items-center">
          <Package className="w-8 h-8 text-blue-600 mr-3" />
          <span className="text-xl font-bold text-gray-800">Traceability System</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <NavButton
            view="dashboard"
            currentView={view}
            onClick={() => setView('dashboard')}
            icon={<TrendingUp className="w-4 h-4 mr-1" />}
            label="Dashboard"
          />
          
          <NavButton
            view="parts"
            currentView={view}
            onClick={() => setView('parts')}
            icon={<Package className="w-4 h-4 mr-1" />}
            label="Piezas"
          />
          
          <NavButton
            view="stations"
            currentView={view}
            onClick={() => setView('stations')}
            icon={<MapPin className="w-4 h-4 mr-1" />}
            label="Estaciones"
          />
          
          <NavButton
            view="events"
            currentView={view}
            onClick={() => setView('events')}
            icon={<Activity className="w-4 h-4 mr-1" />}
            label="Eventos"
          />

          <NavButton
  view="ai"
  currentView={view}
  onClick={() => setView('ai')}
  icon={<Brain className="w-4 h-4 mr-1" />}
  label="Análisis IA"
/>
          
          <div className="border-l border-gray-300 pl-4 ml-4">
            <span className="text-sm text-gray-700 mr-3">{user?.nombre || user?.email || 'Usuario'}</span>
            <button
              onClick={onLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700"
            >
              Salir
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
);

const NavButton = ({ view, currentView, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${
      view === currentView 
        ? 'bg-blue-100 text-blue-700' 
        : 'text-gray-700 hover:bg-gray-100'
    }`}
  >
    {icon}
    {label}
  </button>
);

// Componente principal
const App = () => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [view, setView] = useState('login');
  const [parts, setParts] = useState([]);
  const [stations, setStations] = useState([]);
  const [traceEvents, setTraceEvents] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Estados para modales
  const [showPartModal, setShowPartModal] = useState(false);
  const [showStationModal, setShowStationModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingPart, setEditingPart] = useState(null);
  const [editingStation, setEditingStation] = useState(null);

  // Estados para búsqueda
  const [searchParts, setSearchParts] = useState('');
  const [searchStations, setSearchStations] = useState('');
  const [searchEvents, setSearchEvents] = useState('');

  // Verificar si hay sesión activa al cargar
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    
    if (storedToken) {
      setToken(storedToken);
      
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error("Error parsing stored user:", e);
        }
      }
      
      setView('dashboard');
    }
  }, []);

  const login = async (receivedToken, userData) => {
    setLoading(true);
    setError('');
    
    try {
      setToken(receivedToken);
      setUser(userData || { email: 'Usuario' });
      setView('dashboard');
      
      // Cargar datos iniciales
      await loadMetrics();
    } catch (err) {
      setError('Error al procesar el login');
      console.error('Login processing error:', err);
    }
    
    setLoading(false);
  };

  const logout = () => {
    // Limpiar localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    setToken(null);
    setUser(null);
    setView('login');
    setParts([]);
    setStations([]);
    setTraceEvents([]);
    setMetrics(null);
  };

  // Funciones de carga de datos
  const loadParts = async () => {
  setLoading(true);
  try {
    const data = await partsService.getAllParts();
    console.log('Piezas recibidas:', data); // Ver en consola
    setParts(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error('Error al cargar piezas:', err);
    setParts([]);
  }
  setLoading(false);
};

  const loadStations = async () => {
  setLoading(true);
  try {
    const data = await stationsService.getAllStations();
    console.log('Estaciones recibidas:', data);
    setStations(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error('Error al cargar estaciones:', err);
    setStations([]);
  }
  setLoading(false);
};

  const loadTraceEvents = async () => {
  setLoading(true);
  try {
    const data = await eventsService.getAllTraceEvents();
    console.log('Eventos recibidos:', data);
    setTraceEvents(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error('Error al cargar eventos:', err);
    setTraceEvents([]);
  }
  setLoading(false);
};

  const loadMetrics = async () => {
    setLoading(true);
    try {
      const data = await metricsService.getAllMetrics();
      setMetrics(data);
    } catch (err) {
      console.error('Error al cargar métricas:', err);
      // Usar datos de ejemplo si falla
      setMetrics({
        partsByStatus: [
          { name: 'CREATED', value: 10 },
          { name: 'IN_PROCESS', value: 25 },
          { name: 'COMPLETED', value: 150 },
          { name: 'SCRAPPED', value: 5 }
        ],
        throughput: [
          { date: '2024-01-01', count: 45 },
          { date: '2024-01-02', count: 52 },
          { date: '2024-01-03', count: 48 },
          { date: '2024-01-04', count: 55 },
          { date: '2024-01-05', count: 50 },
          { date: '2024-01-06', count: 47 },
          { date: '2024-01-07', count: 53 }
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
      });
    }
    setLoading(false);
  };

  // Funciones para piezas
  const handleCreatePart = () => {
    setEditingPart(null);
    setShowPartModal(true);
  };

  const handleEditPart = (part) => {
    setEditingPart(part);
    setShowPartModal(true);
  };

  const handleDeletePart = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta pieza?')) {
      setLoading(true);
      try {
        await partsService.deletePart(id);
        await loadParts();
      } catch (err) {
        setError('Error al eliminar pieza');
        console.error(err);
      }
      setLoading(false);
    }
  };

  // Modificar handleSubmitPart:
const handleSubmitPart = async (formData) => {
  setLoading(true);
  setError('');
  try {
    // Generar un ID único si no estamos editando
    const dataToSend = { ...formData };
    
    if (!editingPart) {
      // Generar un ID único (puedes ajustar esta lógica)
      dataToSend.id = `P${Date.now()}`;
    }
    
    if (editingPart) {
      await partsService.updatePart(editingPart.id, dataToSend);
    } else {
      await partsService.createPart(dataToSend);
    }
    await loadParts();
    setShowPartModal(false);
    setEditingPart(null);
  } catch (err) {
    console.error('Error detallado:', err);
    setError(`Error al ${editingPart ? 'actualizar' : 'crear'} pieza: ${err.message || err.detail || 'Error desconocido'}`);
  }
  setLoading(false);
};

  // Funciones para estaciones
  const handleCreateStation = () => {
    setEditingStation(null);
    setShowStationModal(true);
  };

  const handleEditStation = (station) => {
    setEditingStation(station);
    setShowStationModal(true);
  };

  const handleDeleteStation = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta estación?')) {
      setLoading(true);
      try {
        await stationsService.deleteStation(id);
        await loadStations();
      } catch (err) {
        setError('Error al eliminar estación');
        console.error(err);
      }
      setLoading(false);
    }
  };

  const handleSubmitStation = async (formData) => {
    setLoading(true);
    try {
      if (editingStation) {
        await stationsService.updateStation(editingStation.id, formData);
      } else {
        await stationsService.createStation(formData);
      }
      await loadStations();
      setShowStationModal(false);
      setEditingStation(null);
    } catch (err) {
      setError(`Error al ${editingStation ? 'actualizar' : 'crear'} estación`);
      console.error(err);
    }
    setLoading(false);
  };

  // Funciones para eventos
  const handleCreateEvent = () => {
    setShowEventModal(true);
  };

  // Modificar handleSubmitEvent:
const handleSubmitEvent = async (formData) => {
  setLoading(true);
  setError('');
  try {
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60000);
    
    const dataToSend = {
      ...formData,
      timestamp_entrada: fiveMinutesAgo.toISOString(),
      timestamp_salida: now.toISOString(),
      // Asegurar que los IDs sean del tipo correcto
      part_id: formData.part_id.toString(),
      station_id: parseInt(formData.station_id),
    };
    
    console.log('Enviando evento:', dataToSend);
    
    await eventsService.createTraceEvent(dataToSend);
    await loadTraceEvents();
    setShowEventModal(false);
  } catch (err) {
    console.error('Error detallado:', err);
    setError(`Error al registrar evento: ${err.message || err.detail || 'Error desconocido'}`);
  }
  setLoading(false);
};

  useEffect(() => {
    if (!token) return;

    switch (view) {
      case 'dashboard':
        loadMetrics();
        break;
      case 'parts':
        loadParts();
        break;
      case 'stations':
        loadStations();
        break;
      case 'events':
        loadTraceEvents();
        break;
      default:
        break;
    }
  }, [token, view]);

  if (!token) {
    return <Login onLogin={login} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation view={view} setView={setView} user={user} onLogout={logout} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            <span className="flex-1">{error}</span>
            <button 
              onClick={() => setError('')} 
              className="ml-2 text-red-500 hover:text-red-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        
        {loading && view === 'dashboard' && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Cargando dashboard...</p>
          </div>
        )}
        
        {!loading && view === 'dashboard' && <Dashboard metrics={metrics} />}
        
        {!loading && view === 'parts' && (
          <PartsList 
            parts={parts} 
            onEdit={handleEditPart}
            onDelete={handleDeletePart}
            onCreate={handleCreatePart}
            searchTerm={searchParts}
            setSearchTerm={setSearchParts}
          />
        )}
        
        {!loading && view === 'stations' && (
          <StationsList 
            stations={stations} 
            onEdit={handleEditStation}
            onDelete={handleDeleteStation}
            onCreate={handleCreateStation}
            searchTerm={searchStations}
            setSearchTerm={setSearchStations}
          />
        )}
        
        {!loading && view === 'events' && (
          <EventsList 
            events={traceEvents} 
            onCreate={handleCreateEvent}
            searchTerm={searchEvents}
            setSearchTerm={setSearchEvents}
          />
        )}

        {!loading && view === 'ai' && (
  <AIAnalysis 
    metrics={metrics}
    parts={parts}
    stations={stations}
    traceEvents={traceEvents}
  />
)}
      </main>

      {/* Modal para Piezas */}
      <Modal
        isOpen={showPartModal}
        onClose={() => {
          setShowPartModal(false);
          setEditingPart(null);
        }}
        title={editingPart ? 'Editar Pieza' : 'Nueva Pieza'}
      >
        <PartForm
          part={editingPart}
          onSubmit={handleSubmitPart}
          onCancel={() => {
            setShowPartModal(false);
            setEditingPart(null);
          }}
          isEditing={!!editingPart}
        />
      </Modal>

      {/* Modal para Estaciones */}
      <Modal
        isOpen={showStationModal}
        onClose={() => {
          setShowStationModal(false);
          setEditingStation(null);
        }}
        title={editingStation ? 'Editar Estación' : 'Nueva Estación'}
      >
        <StationForm
          station={editingStation}
          onSubmit={handleSubmitStation}
          onCancel={() => {
            setShowStationModal(false);
            setEditingStation(null);
          }}
          isEditing={!!editingStation}
        />
      </Modal>

      {/* Modal para Eventos */}
      <Modal
        isOpen={showEventModal}
        onClose={() => setShowEventModal(false)}
        title="Registrar Evento"
      >
        <EventForm
          parts={parts.filter(p => p.status !== 'COMPLETED' && p.status !== 'SCRAPPED')}
          stations={stations}
          onSubmit={handleSubmitEvent}
          onCancel={() => setShowEventModal(false)}
        />
      </Modal>
    </div>
  );
};

export default App;