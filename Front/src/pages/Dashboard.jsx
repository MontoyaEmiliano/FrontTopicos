// src/pages/Dashboard.jsx
import React, { useEffect } from "react";
import { Package, Clock, CheckCircle, AlertCircle } from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import * as metricsApi from "../services/metrics";
import useFetch from "../hooks/useFetch";
import Loading from "../components/Loading";

export default function Dashboard() {
  const { data: overview, loading: l1, load: loadOverview } = useFetch(metricsApi.overview);
  const { data: partsByStatus, load: loadByStatus, loading: l2 } = useFetch(metricsApi.partsByStatus);
  const { data: throughput, load: loadThroughput, loading: l3 } = useFetch(() => {
    const today = new Date().toISOString().split('T')[0];
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    return metricsApi.throughput(sevenDaysAgo, today);
  });
  const { data: stationCycle, load: loadCycle, loading: l4 } = useFetch(metricsApi.stationCycleTime);

  useEffect(() => {
    loadOverview();
    loadByStatus();
    loadThroughput();
    loadCycle();
  }, []); // eslint-disable-line

  const loading = l1 || l2 || l3 || l4;

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-500 text-sm">Total Piezas</p>
          <p className="text-3xl font-bold">{overview?.total_parts ?? 0}</p>
          <Package className="w-12 h-12 text-blue-500 mt-2" />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-500 text-sm">En Proceso</p>
          <p className="text-3xl font-bold">{overview?.active_parts ?? 0}</p>
          <Clock className="w-12 h-12 text-yellow-500 mt-2" />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-500 text-sm">Completadas Hoy</p>
          <p className="text-3xl font-bold">{overview?.completed_today ?? 0}</p>
          <CheckCircle className="w-12 h-12 text-green-500 mt-2" />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-500 text-sm">Tasa de Scrap</p>
          <p className="text-3xl font-bold">{overview?.scrap_rate ?? 0}%</p>
          <AlertCircle className="w-12 h-12 text-red-500 mt-2" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Piezas por Estado</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={partsByStatus || []}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
              >
                {(partsByStatus || []).map((entry, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Producción Últimos 7 Días</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={throughput || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Tiempo de Ciclo por Estación</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stationCycle || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="station" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="avg_minutes" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}