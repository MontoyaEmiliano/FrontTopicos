import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { getPartHistory } from "../../services/parts.service";
import { fmtDateTime } from "../../utils/format";
import Loading from "../../components/Loading";
import useFetch from "../../hooks/useFetch";

export default function PartHistory() {
  const { id } = useParams();
  const { data: events, loading, load } = useFetch(getPartHistory);

  useEffect(() => {
    load(id);
  }, [id]); // eslint-disable-line

  if (loading) return <Loading />;

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Historial de {id}</h1>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">ID</th>
              <th className="p-2">Station</th>
              <th className="p-2">Entrada</th>
              <th className="p-2">Salida</th>
              <th className="p-2">Resultado</th>
            </tr>
          </thead>
          <tbody>
            {(events || []).map((e) => (
              <tr key={e.id} className="border-t">
                <td className="p-2">{e.id}</td>
                <td className="p-2">{e.station_id}</td>
                <td className="p-2">{fmtDateTime(e.timestamp_entrada)}</td>
                <td className="p-2">{fmtDateTime(e.timestamp_salida)}</td>
                <td className="p-2">{String(e.resultado)}</td>
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
