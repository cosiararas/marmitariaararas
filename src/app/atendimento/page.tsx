"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";

interface Conversation {
  id: string;
  remote_jid: string;
  contact_name: string | null;
  contact_phone: string | null;
  last_message: string | null;
  last_message_at: string | null;
  unread_count: number;
  status: string;
  assigned_to: string | null;
}

interface Message {
  id: string;
  remote_jid: string;
  sender_name: string | null;
  message_text: string | null;
  message_type: string;
  direction: "incoming" | "outgoing";
  answered_by: string | null;
  created_at: string;
}

const STATUS_LABEL: Record<string, string> = {
  open: "Aberta",
  waiting: "Aguardando",
  closed: "Fechada",
};

const STATUS_STYLE: Record<string, string> = {
  open: "bg-red-100 text-red-700",
  waiting: "bg-yellow-100 text-yellow-700",
  closed: "bg-stone-100 text-stone-600",
};

function LoginScreen({ onLogin }: { onLogin: (pw: string) => void }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!pw.trim()) return;
    // Validate via API
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
          <h1 className="text-2xl font-bold text-stone-800">Atendimento Admin</h1>
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

export default function AtendimentoPage() {
  const [password, setPassword] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selected, setSelected] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [filter, setFilter] = useState<"all" | "open" | "waiting" | "closed">("all");
  const [mobileView, setMobileView] = useState<"list" | "chat">("list");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadConversations = useCallback(async () => {
    const { data } = await supabase
      .from("whatsapp_conversations")
      .select("*")
      .eq("instance_name", "marmitaria")
      .order("last_message_at", { ascending: false })
      .limit(100);
    setConversations(data ?? []);
  }, []);

  const loadMessages = useCallback(async (jid: string) => {
    const { data } = await supabase
      .from("whatsapp_messages")
      .select("*")
      .eq("remote_jid", jid)
      .eq("instance_name", "marmitaria")
      .order("created_at", { ascending: true })
      .limit(200);
    setMessages(data ?? []);
  }, []);

  useEffect(() => {
    if (!password) return;
    loadConversations();
    const sub = supabase
      .channel("admin_conv")
      .on("postgres_changes", { event: "*", schema: "public", table: "whatsapp_conversations" }, () => loadConversations())
      .subscribe();
    return () => { supabase.removeChannel(sub); };
  }, [password, loadConversations]);

  useEffect(() => {
    if (!selected) return;
    loadMessages(selected.remote_jid);
    const sub = supabase
      .channel("admin_msg_" + selected.remote_jid)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "whatsapp_messages",
        filter: `remote_jid=eq.${selected.remote_jid}`,
      }, () => loadMessages(selected.remote_jid))
      .subscribe();
    return () => { supabase.removeChannel(sub); };
  }, [selected, loadMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!password) return <LoginScreen onLogin={setPassword} />;

  function selectConversation(c: Conversation) {
    setSelected(c);
    setMobileView("chat");
  }

  async function sendReply() {
    if (!reply.trim() || !selected || sending) return;
    setSending(true);
    try {
      const res = await fetch("/api/whatsapp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          number: selected.remote_jid.replace("@s.whatsapp.net", ""),
          text: reply,
        }),
      });

      if (res.ok) {
        await supabase.from("whatsapp_messages").insert({
          remote_jid: selected.remote_jid,
          sender_name: "Admin",
          sender_phone: "5519971644177",
          message_text: reply,
          message_type: "text",
          direction: "outgoing",
          status: "received",
          answered_by: "admin",
          instance_name: "marmitaria",
        });

        await supabase
          .from("whatsapp_conversations")
          .update({
            last_message: reply,
            last_message_at: new Date().toISOString(),
            status: "waiting",
            assigned_to: "admin",
            updated_at: new Date().toISOString(),
          })
          .eq("remote_jid", selected.remote_jid);

        setReply("");
      }
    } catch (e) {
      console.error("Erro ao enviar:", e);
    } finally {
      setSending(false);
    }
  }

  async function closeConversation(jid: string) {
    await supabase
      .from("whatsapp_conversations")
      .update({ status: "closed", unread_count: 0, updated_at: new Date().toISOString() })
      .eq("remote_jid", jid);
  }

  const filtered = conversations.filter((c) => filter === "all" || c.status === filter);
  const displayName = (c: Conversation) =>
    c.contact_name || c.contact_phone || c.remote_jid.replace("@s.whatsapp.net", "");
  const timeStr = (dt: string | null) =>
    dt ? new Date(dt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) : "";

  const openCount = conversations.filter((c) => c.status === "open").length;
  const waitingCount = conversations.filter((c) => c.status === "waiting").length;
  const totalUnread = conversations.reduce((sum, c) => sum + c.unread_count, 0);

  return (
    <div className="min-h-screen bg-amber-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-amber-100 px-4 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-stone-800">Atendimento WhatsApp</h1>
          <p className="text-xs text-stone-400">Marmitaria Araras</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex gap-3 text-sm">
            <span className="text-red-500 font-medium">{openCount} abertas</span>
            <span className="text-yellow-600 font-medium">{waitingCount} aguardando</span>
            <span className="text-stone-500">{totalUnread} nao lidas</span>
          </div>
          <button onClick={() => setPassword("")} className="text-xs text-stone-400 hover:text-stone-600 transition-colors">Sair</button>
        </div>
      </header>

      {/* Filters */}
      <div className="px-4 py-3 flex gap-2 bg-white border-b border-amber-100">
        {(["all", "open", "waiting", "closed"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              filter === f
                ? "bg-amber-500 text-white shadow-sm"
                : "bg-amber-50 text-stone-600 hover:bg-amber-100"
            }`}
          >
            {f === "all" ? "Todas" : STATUS_LABEL[f]}
          </button>
        ))}
      </div>

      <div className="flex" style={{ height: "calc(100vh - 120px)" }}>
        {/* Conversation List */}
        <div className={`w-full md:w-80 border-r border-amber-100 bg-white overflow-y-auto ${mobileView === "chat" ? "hidden md:block" : "block"}`}>
          {filtered.length === 0 ? (
            <p className="p-4 text-stone-400 text-sm">Nenhuma conversa</p>
          ) : (
            filtered.map((c) => (
              <button
                key={c.id}
                onClick={() => selectConversation(c)}
                className={`w-full text-left px-4 py-3 border-b border-amber-50 hover:bg-amber-50 transition-colors ${
                  selected?.id === c.id ? "bg-amber-50" : ""
                }`}
              >
                <div className="flex justify-between items-start gap-1">
                  <p className="font-medium text-sm text-stone-800 truncate">{displayName(c)}</p>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${STATUS_STYLE[c.status] ?? "bg-stone-100 text-stone-600"}`}>
                    {STATUS_LABEL[c.status] ?? c.status}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-stone-500 truncate flex-1">{c.last_message || "..."}</p>
                  <div className="flex items-center gap-1 ml-1 shrink-0">
                    <span className="text-[10px] text-stone-400">{timeStr(c.last_message_at)}</span>
                    {c.unread_count > 0 && (
                      <span className="bg-green-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                        {c.unread_count}
                      </span>
                    )}
                  </div>
                </div>
                {c.assigned_to && (
                  <p className="text-[10px] text-amber-600 mt-0.5">{c.assigned_to}</p>
                )}
              </button>
            ))
          )}
        </div>

        {/* Chat Area */}
        <div className={`flex-1 flex flex-col ${mobileView === "list" ? "hidden md:flex" : "flex"}`}>
          {!selected ? (
            <div className="flex-1 flex items-center justify-center text-stone-400 text-sm">
              Selecione uma conversa
            </div>
          ) : (
            <>
              <div className="border-b border-amber-100 bg-white px-4 py-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setMobileView("list")}
                    className="md:hidden text-stone-500 hover:text-stone-700 mr-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                  </button>
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-xs">
                    {displayName(selected).charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-stone-800">{displayName(selected)}</p>
                    <p className="text-xs text-stone-400">{selected.contact_phone}</p>
                  </div>
                </div>
                <button
                  onClick={() => closeConversation(selected.remote_jid)}
                  className="text-xs text-stone-500 border border-stone-200 rounded-lg px-3 py-1.5 hover:bg-stone-50 transition-colors"
                >
                  Fechar conversa
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-amber-50/50">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.direction === "outgoing" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[65%] rounded-xl px-3 py-2 ${
                        msg.direction === "outgoing"
                          ? "bg-green-100 text-stone-800"
                          : "bg-white text-stone-800 shadow-sm border border-amber-100"
                      }`}
                    >
                      {msg.answered_by && msg.direction === "outgoing" && (
                        <p className="text-[10px] text-amber-600 mb-0.5">{msg.answered_by}</p>
                      )}
                      <p className="text-sm whitespace-pre-wrap break-words">{msg.message_text}</p>
                      <p className={`text-[10px] mt-1 ${msg.direction === "outgoing" ? "text-green-600" : "text-stone-400"}`}>
                        {timeStr(msg.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="border-t border-amber-100 bg-white p-2 flex gap-2">
                <input
                  type="text"
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendReply()}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 border border-amber-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                <button
                  onClick={sendReply}
                  disabled={sending || !reply.trim()}
                  className="bg-green-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-green-600 disabled:opacity-50 transition-colors"
                >
                  {sending ? "..." : "Enviar"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
