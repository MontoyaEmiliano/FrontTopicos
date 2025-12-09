import React, { useEffect, useState } from "react";
import { getPart, updatePart } from "../../services/parts.service";
import { useParams, useNavigate } from "react-router-dom";
import Loading from "../../components/Loading";

export default function PartEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [part, setPart] = useState(null);
  const [tipo, setTipo] = useState("");
  const [lote, setLote] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const p = await getPart(id);
        setPart(p);
        setTipo(p.tipo_pieza);
        setLote(p.lote);
        setStatus(p.status);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <Loading />;
  if (!part) return <div>Pieza no encontrada</div>;

  const submit = async (e) => {
    e.preventDefault();
    try {
      await updatePart(id, { tipo_pieza: tipo, lote, status });
      navigate("/parts");
    } catch (err) {
      alert(err.response?.data?.detail || "Error actualizando");
    }
  };

  return (
    <form onSubmit={submit} className="max-w-lg bg-white p-6 shadow rounded space-y-4">
      <h1 className="text-xl font-bold">Editar {id}</h1>

      <div>
        <label className="text-sm">Tipo</label>
        <input className="border p-2 w-full rounded" value={tipo} onChange={(e)=>setTipo(e.target.value)} />
      </div>

      <div>
        <label className="text-sm">Lote</label>
        <input className="border p-2 w-full rounded" value={lote} onChange={(e)=>setLote(e.target.value)} />
      </div>

      <div>
        <label className="text-sm">Status</label>
        <input className="border p-2 w-full rounded" value={status} onChange={(e)=>setStatus(e.target.value)} />
      </div>

      <div className="flex justify-end">
        <button className="bg-green-600 text-white px-4 py-2 rounded">Guardar</button>
      </div>
    </form>
  );
}
