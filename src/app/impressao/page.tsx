"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

interface PrintJob {
  id: string;
  order_id: string;
  order_type: string;
  target: string;
  status: "pending" | "printing" | "printed" | "failed";
  created_at: string;
  printed_at: string | null;
  error_message: string | null;
}

const STATUS_LABEL: Record<string, string> = {
  pending: "Aguardando",
  printing: "Imprimindo",
  printed: "Impresso",
  failed: "Erro",
};

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  printing: "bg-blue-100 text-blue-700",
  printed: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
};

const TYPE_LABEL: Record<string, string> = {
  marmita_normal: "Marmita",
  marmitaria_interna: "Interna",
  corporativo: "Corporativo",
  encomenda: "Encomenda",
};

function LoginScreen({ onLogin }: { onLogin: (pw: string) => void }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!pw.trim()) return;
    fetch("/api/admin/prices", { headers: { Authorization: `Bearer ${pw}` } })
      .then((res) => {
        if (res.status === 401) { setError("Senha incorreta"); return; }
        if (!res.ok) { setError("Erro ao verificar"); return; }
        onLogin(pw);
      })
      .catch(() => setError("Erro de conexao"));
  }

  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-stone-800">Impressao Admin</h1>
          <p className="text-sm text-stone-400 mt-1">Marmitaria Araras</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="password" placeholder="Senha" value={pw} onChange={(e) => setPw(e.target.value)} autoFocus className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
          {error && <p className="text-red-500 text-xs text-center">{error}</p>}
          <button type="submit" disabled={!pw} className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors">Entrar</button>
        </form>
      </div>
    </div>
  );
}

function DaemonStatus({ jobs }: { jobs: PrintJob[] }) {
  const now = Date.now();
  const last = jobs.find((j) => j.printed_at || j.status === "printing");
  const lastActivity = last
    ? new Date(last.printed_at ?? last.created_at).getTime()
    : null;
  const minutesAgo = lastActivity ? Math.floor((now - lastActivity) / 60000) : null;

  const pendingCount = jobs.filter((j) => j.status === "pending").length;
  const failedCount = jobs.filter((j) => j.status === "failed").length;

  const isActive = minutesAgo !== null && minutesAgo < 10;
  const statusColor = isActive ? "bg-green-500" : "bg-yellow-400";
  const statusText = isActive ? "Ativo" : minutesAgo === null ? "Sem atividade" : `Inativo ha ${minutesAgo}min`;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-4 flex items-center gap-3">
        <span className={`w-3 h-3 rounded-full ${statusColor}`} />
        <div>
          <p className="text-xs text-stone-400">Status Daemon</p>
          <p className="font-semibold text-sm text-stone-800">{statusText}</p>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-4">
        <p className="text-xs text-stone-400">Na fila</p>
        <p className="text-2xl font-bold text-stone-800">{pendingCount}</p>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-4">
        <p className="text-xs text-stone-400">Erros hoje</p>
        <p className={`text-2xl font-bold ${failedCount > 0 ? "text-red-500" : "text-stone-800"}`}>
          {failedCount}
        </p>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-4">
        <p className="text-xs text-stone-400">Total hoje</p>
        <p className="text-2xl font-bold text-stone-800">{jobs.length}</p>
      </div>
    </div>
  );
}

export default function ImpressaoPage() {
  const [password, setPassword] = useState("");
  const [jobs, setJobs] = useState<PrintJob[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "failed">("all");

  const loadJobs = useCallback(async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const { data } = await supabase
      .from("print_queue")
      .select("*")
      .eq("target", "marmitaria")
      .gte("created_at", today.toISOString())
      .order("created_at", { ascending: false })
      .limit(200);
    setJobs(data ?? []);
  }, []);

  useEffect(() => {
    if (!password) return;
    loadJobs();
    const sub = supabase
      .channel("print_queue_admin")
      .on("postgres_changes", { event: "*", schema: "public", table: "print_queue" }, () => loadJobs())
      .subscribe();
    return () => { supabase.removeChannel(sub); };
  }, [password, loadJobs]);

  if (!password) return <LoginScreen onLogin={setPassword} />;

  const filtered = jobs.filter((j) => {
    if (filter !== "all" && j.status !== filter) return false;
    return true;
  });

  const errors = jobs.filter((j) => j.status === "failed");

  return (
    <div className="min-h-screen bg-amber-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-amber-100 px-4 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-stone-800">Fila de Impressao</h1>
          <p className="text-xs text-stone-400">Marmitaria Araras</p>
        </div>
        <button onClick={() => setPassword("")} className="text-xs text-stone-400 hover:text-stone-600 transition-colors">Sair</button>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <DaemonStatus jobs={jobs} />

        {errors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
            <p className="text-sm font-semibold text-red-700 mb-2">Erros hoje ({errors.length})</p>
            <div className="space-y-2">
              {errors.map((j) => (
                <div key={j.id} className="text-xs text-red-600 flex gap-2">
                  <span className="font-medium font-mono">{j.order_id.slice(0, 8)}</span>
                  <span className="text-red-400">-</span>
                  <span>{j.error_message ?? "Erro desconhecido"}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2 mb-4">
          {(["all", "pending", "failed"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                filter === f
                  ? "bg-amber-500 text-white shadow-sm"
                  : "bg-amber-50 text-stone-600 hover:bg-amber-100"
              }`}
            >
              {f === "all" ? "Todos" : f === "pending" ? "Aguardando" : "Erros"}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-amber-100 divide-y divide-amber-50">
          {filtered.length === 0 ? (
            <p className="p-6 text-stone-400 text-sm">Nenhum job encontrado.</p>
          ) : (
            filtered.map((job) => (
              <div key={job.id} className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs font-mono text-stone-400 shrink-0">{job.order_id.slice(0, 8)}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-stone-800 truncate">
                      {TYPE_LABEL[job.order_type] ?? job.order_type}
                    </p>
                    {job.error_message && (
                      <p className="text-xs text-red-500 truncate">{job.error_message}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-4">
                  <span className="text-xs text-stone-400">
                    {new Date(job.created_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLE[job.status] ?? "bg-stone-100 text-stone-600"}`}>
                    {STATUS_LABEL[job.status] ?? job.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
