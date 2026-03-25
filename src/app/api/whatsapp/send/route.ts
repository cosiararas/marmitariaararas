import { NextRequest, NextResponse } from "next/server";

const EVOLUTION_URL = "https://energetictriggerfish-evolution.cloudfy.live";
const EVOLUTION_KEY = process.env.EVOLUTION_API_KEY || "T3VVWMWY14jKAbsTxE6bA0VCx6TzeQtA";
const INSTANCE = "marmitaria";

export async function POST(req: NextRequest) {
  try {
    const { number, text } = await req.json();
    if (!number || !text) {
      return NextResponse.json({ error: "number e text obrigatorios" }, { status: 400 });
    }

    const res = await fetch(`${EVOLUTION_URL}/message/sendText/${INSTANCE}`, {
      method: "POST",
      headers: {
        apikey: EVOLUTION_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ number, text }),
    });

    if (!res.ok) {
      const body = await res.text();
      return NextResponse.json({ error: "Falha ao enviar", detail: body }, { status: 502 });
    }

    const data = await res.json();
    return NextResponse.json({ ok: true, data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erro interno" }, { status: 500 });
  }
}
