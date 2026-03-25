"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

interface PrintJob {
  id: string;
  order_id: string;
  order_type: string;
  status: "pending" | "printing" | "printed" | "failed";
  created_at: string;
  error_message: string | null;
}

const TYPE_LABEL: Record<string, string> = {
  marmita_normal: "Marmita",
  marmitaria_interna: "Interna",
  corporativo: "Corporativo",
  encomenda: "Encomenda",
};

function StatusDot({ status }: { status: string }) {
  const color =
    status === "printed" ? "bg-green-500" :
    status === "printing" ? "bg-blue-500 animate-pulse" :
    status === "pending" ? "bg-yellow-400 animate-pulse" :
    "bg-red-500";
  return <span className={`inline-block w-3 h-3 rounded-full ${color} mr-2`} />;
}

export default function PainelImpressaoPage() {
  const [jobs, setJobs] = useState<PrintJob[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [daemonOk, setDaemonOk] = useState<boolean | null>(null);

  const loadJobs = useCallback(async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const { data } = await supabase
      .from("print_queue")
      .select("id, order_id, order_type, status, created_at, error_message")
      .eq("target", "marmitaria")
      .gte("created_at", today.toISOString())
      .order("created_at", { ascending: false })
      .limit(50);

    const list = data ?? [];
    setJobs(list);
    setLastUpdate(new Date());

    const lastPrinted = list.find((j) => j.status === "printed" || j.status === "printing");
    if (lastPrinted) {
      const diff = Date.now() - new Date(lastPrinted.created_at).getTime();
      setDaemonOk(diff < 15 * 60 * 1000);
    } else {
      setDaemonOk(list.length === 0 ? null : false);
    }
  }, []);

  useEffect(() => {
    loadJobs();
    const sub = supabase
      .channel("painel_marmitaria")
      .on("postgres_changes", { event: "*", schema: "public", table: "print_queue" }, () => loadJobs())
      .subscribe();
    return () => { supabase.removeChannel(sub); };
  }, [loadJobs]);

  const pending = jobs.filter((j) => j.status === "pending" || j.status === "printing");
  const recent = jobs.filter((j) => j.status === "printed").slice(0, 5);
  const errors = jobs.filter((j) => j.status === "failed");

  return (
    <div className="min-h-screen bg-amber-50 p-4 md:p-6 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">Fila de Impressao</h1>
          <p className="text-xs text-stone-400">Marmitaria Araras</p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          {daemonOk === true && <span className="flex items-center gap-1.5 text-green-600 font-medium"><span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse inline-block" /> Daemon ativo</span>}
          {daemonOk === false && <span className="flex items-center gap-1.5 text-red-500 font-medium"><span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" /> Daemon inativo</span>}
          {daemonOk === null && <span className="flex items-center gap-1.5 text-stone-400"><span className="w-2.5 h-2.5 rounded-full bg-stone-400 inline-block" /> Sem atividade</span>}
          <span className="ml-3 text-xs text-stone-400">
            {lastUpdate.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          </span>
        </div>
      </div>

      {/* Erros */}
      {errors.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 rounded-xl p-4 mb-6">
          <p className="font-bold text-red-700 text-lg mb-2">Erros ({errors.length})</p>
          {errors.map((j) => (
            <div key={j.id} className="text-red-600 text-sm mb-1">
              <span className="font-mono font-bold">{j.order_id.slice(0, 8)}</span>
              {" - "}
              {j.error_message ?? "Erro desconhecido"}
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Aguardando / Imprimindo */}
        <div className="bg-white rounded-2xl shadow-sm border border-amber-100">
          <div className="px-5 py-4 border-b border-amber-100 flex items-center justify-between">
            <h2 className="font-bold text-stone-700 text-lg">Aguardando</h2>
            <span className="bg-yellow-100 text-yellow-700 text-sm font-bold px-3 py-1 rounded-full">{pending.length}</span>
          </div>
          <div className="divide-y divide-amber-50">
            {pending.length === 0 ? (
              <p className="p-5 text-stone-400 text-base">Fila vazia</p>
            ) : (
              pending.map((job) => (
                <div key={job.id} className="px-5 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-base font-semibold text-stone-800">
                      <StatusDot status={job.status} />
                      {TYPE_LABEL[job.order_type] ?? job.order_type}
                    </p>
                    <p className="text-sm text-stone-400 mt-0.5">
                      {new Date(job.created_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  <span className="text-sm text-stone-500 font-mono">{job.order_id.slice(0, 8)}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Impressos recentes */}
        <div className="bg-white rounded-2xl shadow-sm border border-amber-100">
          <div className="px-5 py-4 border-b border-amber-100 flex items-center justify-between">
            <h2 className="font-bold text-stone-700 text-lg">Impressos</h2>
            <span className="bg-green-100 text-green-700 text-sm font-bold px-3 py-1 rounded-full">{jobs.filter((j) => j.status === "printed").length}</span>
          </div>
          <div className="divide-y divide-amber-50">
            {recent.length === 0 ? (
              <p className="p-5 text-stone-400 text-base">Nenhum ainda hoje</p>
            ) : (
              recent.map((job) => (
                <div key={job.id} className="px-5 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-base font-semibold text-stone-800">
                      <StatusDot status={job.status} />
                      {TYPE_LABEL[job.order_type] ?? job.order_type}
                    </p>
                    <p className="text-sm text-stone-400 mt-0.5">
                      {new Date(job.created_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  <span className="text-sm text-stone-500 font-mono">{job.order_id.slice(0, 8)}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
