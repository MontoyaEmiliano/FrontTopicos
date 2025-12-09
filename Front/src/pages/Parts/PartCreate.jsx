import React, { useState } from "react";
import { createPart } from "../../services/parts.service";
import { useNavigate } from "react-router-dom";

export default function PartCreate() {
  const [id, setId] = useState("");
  const [tipo, setTipo] = useState("");
  const [lote, setLote] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await createPart({ id, tipo_pieza: tipo, lote });
      navigate("/parts");
    } catch (err) {
      setError(err.response?.data?.detail || "Error creando pieza");
    }
  };

  return (
    <form onSubmit={submit} className="max-w-lg bg-white shadow p-6 rounded space-y-4">
      <h1 className="text-xl font-bold">Crear pieza</h1>
      {error && <div className="text-red-600">{error}</div>}

      <div>
        <label className="text-sm">ID (serial)</label>
        <input className="border rounded p-2 w-full" value={id} onChange={(e)=>setId(e.target.value)} required />
      </div>

      <div>
        <label className="text-sm">Tipo</label>
        <input className="border rounded p-2 w-full" value={tipo} onChange={(e)=>setTipo(e.target.value)} required />
      </div>

      <div>
        <label className="text-sm">Lote</label>
        <input className="border rounded p-2 w-full" value={lote} onChange={(e)=>setLote(e.target.value)} required />
      </div>

      <div className="flex justify-end">
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Crear</button>
      </div>
    </form>
  );
}
