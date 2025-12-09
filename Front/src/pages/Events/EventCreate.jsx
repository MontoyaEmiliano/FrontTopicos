import React, { useState, useEffect } from "react";
import { createTraceEvent } from "../../services/events.service";
import { listStations } from "../../services/stations.service";
import { useNavigate } from "react-router-dom";

export default function EventCreate() {
  const [partId, setPartId] = useState("");
  const [stationId, setStationId] = useState("");
  const [entrada, setEntrada] = useState("");
  const [salida, setSalida] = useState("");
  const [resultado, setResultado] = useState("OK");
  const [observaciones, setObservaciones] = useState("");
  const [stations, setStations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    listStations().then(setStations).catch(()=>{});
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        part_id: partId,
        station_id: Number(stationId),
        timestamp_entrada: entrada,
        timestamp_salida: salida,
        resultado,
        observaciones,
      };
      await createTraceEvent(payload);
      navigate("/events");
    } catch (err) {
      alert(err.response?.data?.detail || "Error creando evento");
    }
  };

  return (
    <form onSubmit={submit} className="max-w-lg bg-white p-6 rounded shadow space-y-4">
      <h2 className="text-lg font-semibold">Registrar Evento</h2>

      <div>
        <label className="text-sm">Part ID</label>
        <input className="border p-2 w-full rounded" value={partId} onChange={(e)=>setPartId(e.target.value)} required />
      </div>

      <div>
        <label className="text-sm">Station</label>
        <select className="border p-2 w-full rounded" value={stationId} onChange={(e)=>setStationId(e.target.value)} required>
          <option value="">-- Seleccionar --</option>
          {stations.map(s => <option key={s.id} value={s.id}>{s.nombre ?? s.name}</option>)}
        </select>
      </div>

      <div>
        <label className="text-sm">Entrada</label>
        <input type="datetime-local" className="border p-2 w-full rounded" value={entrada} onChange={e=>setEntrada(e.target.value)} required />
      </div>

      <div>
        <label className="text-sm">Salida</label>
        <input type="datetime-local" className="border p-2 w-full rounded" value={salida} onChange={e=>setSalida(e.target.value)} required />
      </div>

      <div>
        <label className="text-sm">Resultado</label>
        <select className="border p-2 w-full rounded" value={resultado} onChange={e=>setResultado(e.target.value)}>
          <option value="OK">OK</option>
          <option value="FAIL">FAIL</option>
          <option value="REWORK">REWORK</option>
        </select>
      </div>

      <div>
        <label className="text-sm">Observaciones</label>
        <textarea className="border p-2 w-full rounded" value={observaciones} onChange={e=>setObservaciones(e.target.value)} rows="3" />
      </div>

      <div className="flex justify-end">
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Crear evento</button>
      </div>
    </form>
  );
}
