# Marmitaria Araras — E-commerce de Marmitas

Site: **marmitariaararas.com.br**
Repo: `cosiararas/marmitariaararas`

## Stack
- **Next.js** (TypeScript)
- **Supabase**: `https://energetictriggerfish-supabase.cloudfy.live`
- **Vercel**: deploy automatico
- **MercadoPago**: pagamentos

## Estrutura
- `src/` — codigo Next.js
- `supabase/` — migrations
- `public/` — assets estaticos

## Projetos Relacionados
- `~/.antigravity/marmitaria-print/` — Sistema de impressao termica (daemon que imprime pedidos)
- Repo impressao: `cosiararas/marmitaria-print`

## Credenciais
- Supabase e WhatsApp em `~/.antigravity/.env`
- n8n: `https://energetictriggerfish-n8n.cloudfy.live/`

## OBRIGATORIO: Push e Deploy ao Finalizar

Ao terminar qualquer sessao de trabalho neste projeto, SEMPRE executar:

1. `git add` dos arquivos modificados (nunca .env, .pdf, .log)
2. `git commit` com mensagem descritiva
3. `git push origin main`
4. Vercel faz deploy automatico apos o push

Nao esperar o usuario pedir. Fazer automaticamente antes de encerrar.
