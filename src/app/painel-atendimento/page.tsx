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
}

interface Message {
  id: string;
  remote_jid: string;
  sender_name: string | null;
  message_text: string | null;
  message_type: string;
  direction: "incoming" | "outgoing";
  created_at: string;
}

export default function PainelAtendimentoPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selected, setSelected] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [mobileView, setMobileView] = useState<"list" | "chat">("list");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadConversations = useCallback(async () => {
    const { data } = await supabase
      .from("whatsapp_conversations")
      .select("*")
      .eq("instance_name", "marmitaria")
      .order("last_message_at", { ascending: false })
      .limit(50);
    setConversations(data ?? []);
  }, []);

  const loadMessages = useCallback(async (jid: string) => {
    const { data } = await supabase
      .from("whatsapp_messages")
      .select("*")
      .eq("remote_jid", jid)
      .eq("instance_name", "marmitaria")
      .order("created_at", { ascending: true })
      .limit(100);
    setMessages(data ?? []);

    await supabase
      .from("whatsapp_conversations")
      .update({ unread_count: 0 })
      .eq("remote_jid", jid);
  }, []);

  useEffect(() => {
    loadConversations();
    const sub = supabase
      .channel("conv_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "whatsapp_conversations" }, () => loadConversations())
      .subscribe();
    return () => { supabase.removeChannel(sub); };
  }, [loadConversations]);

  useEffect(() => {
    if (!selected) return;
    loadMessages(selected.remote_jid);
    const sub = supabase
      .channel("msg_changes_" + selected.remote_jid)
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
          sender_name: "Marmitaria",
          sender_phone: "5519971644177",
          message_text: reply,
          message_type: "text",
          direction: "outgoing",
          status: "received",
          instance_name: "marmitaria",
        });

        await supabase
          .from("whatsapp_conversations")
          .update({
            last_message: reply,
            last_message_at: new Date().toISOString(),
            status: "waiting",
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

  const displayName = (c: Conversation) =>
    c.contact_name || c.contact_phone || c.remote_jid.replace("@s.whatsapp.net", "");

  const timeStr = (dt: string | null) =>
    dt ? new Date(dt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) : "";

  return (
    <div className="flex h-screen bg-amber-50 font-sans">
      {/* Sidebar - Conversas */}
      <div className={`w-full md:w-80 bg-white border-r border-amber-100 flex flex-col ${mobileView === "chat" ? "hidden md:flex" : "flex"}`}>
        <div className="p-4 border-b border-amber-100">
          <h1 className="text-lg font-bold text-stone-800">Atendimento</h1>
          <p className="text-xs text-stone-400">Marmitaria Araras</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <p className="p-4 text-stone-400 text-sm">Nenhuma conversa</p>
          ) : (
            conversations.map((c) => (
              <button
                key={c.id}
                onClick={() => selectConversation(c)}
                className={`w-full text-left px-4 py-3 border-b border-amber-50 hover:bg-amber-50 transition-colors ${
                  selected?.id === c.id ? "bg-amber-50" : ""
                }`}
              >
                <div className="flex justify-between items-start">
                  <p className="font-medium text-sm text-stone-800 truncate flex-1">
                    {displayName(c)}
                  </p>
                  <span className="text-xs text-stone-400 ml-2 shrink-0">
                    {timeStr(c.last_message_at)}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-stone-500 truncate flex-1">
                    {c.last_message || "..."}
                  </p>
                  {c.unread_count > 0 && (
                    <span className="ml-2 bg-green-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shrink-0">
                      {c.unread_count}
                    </span>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat */}
      <div className={`flex-1 flex flex-col ${mobileView === "list" ? "hidden md:flex" : "flex"}`}>
        {!selected ? (
          <div className="flex-1 flex items-center justify-center text-stone-400">
            <p>Selecione uma conversa</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="bg-white border-b border-amber-100 px-4 md:px-6 py-3 flex items-center gap-3">
              <button
                onClick={() => setMobileView("list")}
                className="md:hidden text-stone-500 hover:text-stone-700 mr-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              </button>
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-sm">
                {displayName(selected).charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-sm text-stone-800">{displayName(selected)}</p>
                <p className="text-xs text-stone-400">{selected.contact_phone}</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-amber-50/50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.direction === "outgoing" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] rounded-xl px-3 py-2 ${
                      msg.direction === "outgoing"
                        ? "bg-green-100 text-stone-800"
                        : "bg-white text-stone-800 shadow-sm border border-amber-100"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">{msg.message_text}</p>
                    <p className={`text-xs mt-1 ${msg.direction === "outgoing" ? "text-green-600" : "text-stone-400"}`}>
                      {timeStr(msg.created_at)}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="bg-white border-t border-amber-100 p-3 flex gap-2">
              <input
                type="text"
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendReply()}
                placeholder="Digite sua mensagem..."
                className="flex-1 border border-amber-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <button
                onClick={sendReply}
                disabled={sending || !reply.trim()}
                className="bg-green-500 text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {sending ? "..." : "Enviar"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
