import React, { useEffect } from "react";
import { Plus } from "lucide-react";
import useFetch from "../../hooks/useFetch";
import { listStations } from "../../services/stations.service";
import Loading from "../../components/Loading";

export default function StationsList() {
  const { data: stations, loading, load } = useFetch(listStations);

  useEffect(() => {
    load();
  }, []); // eslint-disable-line

  if (loading) return <Loading />;

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b flex justify-between items-center">
        <h2 className="text-xl font-semibold">Estaciones</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded flex items-center">
          <Plus className="w-5 h-5 mr-2" /> Nueva Estación
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
        {(stations || []).map((s) => (
          <div key={s.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-gray-800">{s.nombre ?? s.name}</h3>
                <p className="text-sm text-gray-600">{s.descripcion ?? s.description}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${s.activo || s.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {s.activo || s.active ? 'Activa' : 'Inactiva'}
              </span>
            </div>

            <div className="flex gap-2 mt-3">
              <button className="flex-1 bg-blue-50 text-blue-600 px-3 py-1 rounded text-sm">Editar</button>
              <button className="flex-1 bg-red-50 text-red-600 px-3 py-1 rounded text-sm">Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
