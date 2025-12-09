import React, { useState } from "react";
import { createStation } from "../../services/stations.service";

export default function StationCreate() {
  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState("");
  const [linea, setLinea] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      await createStation({ nombre, tipo, linea });
      alert("Estación creada");
    } catch (err) {
      alert(err.response?.data?.detail || "Error");
    }
  };

  return (
    <form className="max-w-lg bg-white p-6 rounded shadow" onSubmit={submit}>
      <h2 className="text-lg font-semibold mb-4">Crear Estación</h2>

      <div>
        <label className="text-sm">Nombre</label>
        <input className="border p-2 w-full rounded" value={nombre} onChange={(e)=>setNombre(e.target.value)} required />
      </div>

      <div>
        <label className="text-sm">Tipo</label>
        <input className="border p-2 w-full rounded" value={tipo} onChange={(e)=>setTipo(e.target.value)} />
      </div>

      <div>
        <label className="text-sm">Línea</label>
        <input className="border p-2 w-full rounded" value={linea} onChange={(e)=>setLinea(e.target.value)} />
      </div>

      <div className="flex justify-end mt-4">
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Crear</button>
      </div>
    </form>
  );
}
