import React, { useEffect } from "react";
import { Plus } from "lucide-react";
import useFetch from "../../hooks/useFetch";
import { listTraceEvents } from "../../services/events.service";
import Loading from "../../components/Loading";
import { fmtDateTime } from "../../utils/format";

export default function EventsList() {
  const { data: events, loading, load } = useFetch(listTraceEvents);

  useEffect(() => {
    load();
  }, []); // eslint-disable-line

  if (loading) return <Loading />;

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b flex justify-between items-center">
        <h2 className="text-xl font-semibold">Eventos de Trazabilidad</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded flex items-center">
          <Plus className="w-5 h-5 mr-2" /> Registrar Evento
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3">ID Pieza</th>
              <th className="px-6 py-3">Estación</th>
              <th className="px-6 py-3">Tipo de Evento</th>
              <th className="px-6 py-3">Fecha/Hora</th>
              <th className="px-6 py-3">Notas</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {(events || []).map((ev) => (
              <tr key={ev.id}>
                <td className="px-6 py-4">{ev.part_id}</td>
                <td className="px-6 py-4">{ev.station_id}</td>
                <td className="px-6 py-4">{ev.resultado ?? ev.event_type}</td>
                <td className="px-6 py-4">{fmtDateTime(ev.timestamp_entrada ?? ev.timestamp)}</td>
                <td className="px-6 py-4">{ev.observaciones ?? ev.notes}</td>
              </tr>
            ))}
            {(events || []).length === 0 && (
              <tr><td colSpan="5" className="p-4 text-center text-gray-500">Sin eventos</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
