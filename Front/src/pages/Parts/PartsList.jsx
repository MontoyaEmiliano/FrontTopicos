import React, { useEffect } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import useFetch from "../../hooks/useFetch";
import { listParts, getPart } from "../../services/parts.service";
import Loading from "../../components/Loading";

export default function PartsList() {
  const { data: parts, loading, error, load } = useFetch(listParts);

  useEffect(() => {
    load();
  }, []); // eslint-disable-line

  if (loading) return <Loading />;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Piezas</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center">
          <Plus className="w-5 h-5 mr-2" /> Nueva Pieza
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lote</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {(parts || []).map((p) => (
              <tr key={p.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.tipo_pieza}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.lote}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                    {String(p.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {(parts || []).length === 0 && (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">No hay piezas</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
