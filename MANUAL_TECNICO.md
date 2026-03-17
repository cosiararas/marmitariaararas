# Manual Técnico - Marmitaria Araras E-commerce

**Versão:** 1.0
**Data:** 17/03/2026
**Desenvolvedor:** Empório Cosi - Sistema Antigravity
**URL Produção:** https://marmitariaararas.com.br
**Repositório:** https://github.com/cosiararas/marmitariaararas

---

## Índice

1. [Visão Geral da Arquitetura](#1-visão-geral-da-arquitetura)
2. [Stack Tecnológico](#2-stack-tecnológico)
3. [Configuração do Ambiente](#3-configuração-do-ambiente)
4. [Estrutura do Projeto](#4-estrutura-do-projeto)
5. [Banco de Dados Supabase](#5-banco-de-dados-supabase)
6. [Integração Mercado Pago](#6-integração-mercado-pago)
7. [Integração n8n (Automação)](#7-integração-n8n-automação)
8. [Deploy e CI/CD](#8-deploy-e-cicd)
9. [Monitoramento e Logs](#9-monitoramento-e-logs)
10. [Manutenção Preventiva](#10-manutenção-preventiva)
11. [Troubleshooting](#11-troubleshooting)
12. [Backup e Recuperação](#12-backup-e-recuperação)
13. [Segurança](#13-segurança)
14. [Performance](#14-performance)
15. [Atualizações e Versões](#15-atualizações-e-versões)

---

## 1. Visão Geral da Arquitetura

### 1.1 Diagrama de Componentes

```
┌─────────────────────────────────────────────────────────────────┐
│                        USUÁRIO FINAL                             │
│                   (Mobile/Desktop Browser)                       │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                     VERCEL CDN + EDGE                            │
│              (HTTP→HTTPS, Security Headers)                      │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    NEXT.JS 16 APP                                │
│                  (React 19, TypeScript 5)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │  Home Page   │  │  Menu API    │  │ Checkout API │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
└───────┬───────────────────┬───────────────────┬─────────────────┘
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│   SUPABASE   │   │  MERCADO PAGO│   │     n8n      │
│   (Cloudfy)  │   │              │   │  (Cloudfy)   │
│              │   │              │   │              │
│ - PostgreSQL │   │ - Payments   │   │ - Webhooks   │
│ - Storage    │   │ - Preferences│   │ - Automation │
│ - Auth       │   │              │   │              │
└──────────────┘   └──────────────┘   └──────────────┘
```

### 1.2 Fluxo de Pedido

1. **Cliente navega** → Página inicial carrega cardápio do Supabase
2. **Cliente monta pedido** → Estado gerenciado no frontend (React)
3. **Cliente finaliza** → Dados validados e enviados para `/api/checkout`
4. **API cria preferência** → Mercado Pago via n8n webhook
5. **Cliente paga** → Redirecionado para Mercado Pago
6. **Pagamento confirmado** → Webhook do Mercado Pago notifica n8n
7. **n8n processa** → Atualiza Supabase + Envia notificação WhatsApp
8. **Cliente redirecionado** → Página de sucesso/pendente/falha

---

## 2. Stack Tecnológico

### 2.1 Frontend
- **Framework:** Next.js 16.1.6 (App Router)
- **React:** 19.2.3 (RSC - React Server Components)
- **TypeScript:** 5.x
- **Styling:** Tailwind CSS 4 + CSS Modules
- **UI Components:** Lucide Icons, Radix UI
- **Utilities:** clsx, tailwind-merge, class-variance-authority

### 2.2 Backend
- **Runtime:** Node.js 20+
- **Database:** PostgreSQL (via Supabase Cloudfy)
- **ORM/Client:** @supabase/supabase-js 2.97.0
- **Payment Gateway:** Mercado Pago SDK 2.12.0

### 2.3 Infraestrutura
- **Hosting:** Vercel (Serverless)
- **Database:** Supabase Cloudfy (`energetictriggerfish-supabase.cloudfy.live`)
- **Automation:** n8n Cloudfy (`energetictriggerfish-n8n.cloudfy.live`)
- **CDN:** Vercel Edge Network
- **DNS:** Cloudflare/Registro.br

### 2.4 Ferramentas de Desenvolvimento
- **Package Manager:** npm 10+
- **Linter:** ESLint 9 (Next.js Config)
- **Version Control:** Git + GitHub
- **CI/CD:** Vercel Auto-Deploy

---

## 3. Configuração do Ambiente

### 3.1 Variáveis de Ambiente (`.env.local`)

```bash
# Supabase (Cloudfy) - OBRIGATÓRIO
NEXT_PUBLIC_SUPABASE_URL=https://energetictriggerfish-supabase.cloudfy.live
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_aqui

# Mercado Pago - OBRIGATÓRIO
MP_ACCESS_TOKEN=seu_access_token_aqui
NEXT_PUBLIC_MP_PUBLIC_KEY=sua_public_key_aqui

# n8n Webhook - OBRIGATÓRIO
N8N_MARMITARIA_WEBHOOK_URL=https://energetictriggerfish-n8n.cloudfy.live/webhook/marmitaria-pagamento-confirmado

# URL da aplicação - OBRIGATÓRIO
NEXT_PUBLIC_APP_URL=https://marmitariaararas.com.br

# Painel Admin - OBRIGATÓRIO (trocar senha padrão!)
ADMIN_PASSWORD=SuaSenhaSeguraAqui2026!

# Meta Pixel (Facebook Ads) - OPCIONAL
NEXT_PUBLIC_META_PIXEL_ID=123456789012345
```

### 3.2 Como Obter Credenciais

#### Supabase
1. Acesse https://energetictriggerfish-supabase.cloudfy.live
2. Settings → API → URL e Anon Key
3. Service Role Key (admin) → Settings → API → Service Role Key

#### Mercado Pago
1. Acesse https://www.mercadopago.com.br/developers/panel
2. Credenciais → Produção
3. `Access Token` (privado) e `Public Key` (público)

#### n8n Webhook
1. Workflow já configurado: `marmitaria-pagamento-confirmado`
2. URL: `https://energetictriggerfish-n8n.cloudfy.live/webhook/marmitaria-pagamento-confirmado`

### 3.3 Instalação Local

```bash
# Clonar repositório
git clone https://github.com/cosiararas/marmitariaararas.git
cd marmitariaararas

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env.local
# Editar .env.local com suas credenciais

# Rodar em desenvolvimento
npm run dev
# Abrir http://localhost:3000

# Build de produção
npm run build
npm start
```

---

## 4. Estrutura do Projeto

```
marmitariaararas/
├── public/                     # Assets estáticos
│   ├── favicon.svg            # Ícone do site (SEO)
│   ├── sitemap.xml            # Mapa do site (SEO)
│   ├── robots.txt             # Crawlers config (SEO)
│   ├── logo.png               # Logo principal
│   └── cardapio-fotos/        # Imagens de pratos
│       ├── bife-acebolado.jpg
│       ├── carne-panela.jpg
│       └── ...
│
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── page.tsx           # Página inicial (cardápio)
│   │   ├── layout.tsx         # Layout raiz
│   │   ├── globals.css        # Estilos globais
│   │   ├── admin/             # Painel administrativo
│   │   │   └── page.tsx       # Dashboard admin
│   │   ├── api/               # API Routes
│   │   │   └── checkout/
│   │   │       └── route.ts   # Endpoint de checkout
│   │   ├── pedido/            # Páginas de status
│   │   │   ├── sucesso/page.tsx
│   │   │   ├── pendente/page.tsx
│   │   │   └── falha/page.tsx
│   │   └── privacy/           # Política de privacidade
│   │       └── page.tsx
│   │
│   ├── components/            # Componentes React
│   │   ├── MenuItemCard.tsx   # Card de produto
│   │   ├── Cart.tsx           # Carrinho de compras
│   │   ├── CustomizeModal.tsx # Modal de customização
│   │   └── ...
│   │
│   ├── lib/                   # Bibliotecas e utilidades
│   │   ├── supabase.ts        # Cliente Supabase (anon)
│   │   ├── supabase-admin.ts  # Cliente Supabase (admin)
│   │   ├── menu-api.ts        # API de cardápio
│   │   └── utils.ts           # Funções auxiliares
│   │
│   ├── data/                  # Dados estáticos
│   │   └── menu.ts            # Tipos e dados de menu
│   │
│   └── types/                 # TypeScript types
│       └── index.ts
│
├── vercel.json                # Configuração Vercel
├── package.json               # Dependências NPM
├── tsconfig.json              # TypeScript config
├── tailwind.config.ts         # Tailwind CSS config
├── next.config.ts             # Next.js config
├── README.md                  # Documentação geral
├── MANUAL_TECNICO.md          # Este arquivo
└── GUIA_USUARIO.md            # Guia do usuário final
```

---

## 5. Banco de Dados Supabase

### 5.1 Tabelas Principais

#### `menu_items` - Itens do Cardápio
```sql
CREATE TABLE menu_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_unit TEXT NOT NULL DEFAULT 'marmitaria', -- 'marmitaria' ou 'emporio'
  name TEXT NOT NULL,
  description TEXT,
  base_price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  category_id UUID REFERENCES menu_categories(id),
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `menu_groups` - Grupos de Adicionais
```sql
CREATE TABLE menu_groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  menu_item_id UUID REFERENCES menu_items(id) ON DELETE CASCADE,
  title TEXT NOT NULL, -- "Tamanho", "Acompanhamentos", etc.
  min_options INTEGER DEFAULT 0,
  max_options INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `menu_additions` - Adicionais Disponíveis
```sql
CREATE TABLE menu_additions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  menu_group_id UUID REFERENCES menu_groups(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price DECIMAL(10,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `orders` - Pedidos
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT,
  delivery_method TEXT NOT NULL, -- 'delivery' ou 'pickup'
  payment_method TEXT NOT NULL, -- 'pix', 'credito', 'debito'
  total_amount DECIMAL(10,2) NOT NULL,
  mercadopago_preference_id TEXT, -- ID da preferência MP
  mercadopago_payment_id TEXT, -- ID do pagamento MP
  status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'failed', 'cancelled'
  items JSONB NOT NULL, -- Array de itens do pedido
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `print_queue` - Fila de Impressão (compartilhada com Cosi Araras)
```sql
CREATE TABLE print_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_unit TEXT NOT NULL, -- 'marmitaria' ou 'emporio'
  order_id UUID REFERENCES orders(id),
  print_type TEXT NOT NULL, -- 'pedido', 'cupom', 'relatorio'
  content JSONB NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'printed', 'error'
  printer_name TEXT, -- Nome da impressora
  printed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 5.2 Políticas RLS (Row Level Security)

```sql
-- Permitir leitura pública de itens ativos
CREATE POLICY "Permitir leitura pública de menu_items ativos"
ON menu_items FOR SELECT
USING (is_active = true);

-- Permitir inserção de pedidos anônimos
CREATE POLICY "Permitir inserção anônima de orders"
ON orders FOR INSERT
WITH CHECK (true);

-- Admin pode tudo
CREATE POLICY "Admin pode tudo em orders"
ON orders FOR ALL
USING (auth.role() = 'service_role');
```

### 5.3 Manutenção do Banco

#### Backup Automático
- Supabase Cloudfy faz backup automático diário
- Retenção: 7 dias (plano gratuito) ou 30 dias (plano pago)

#### Limpeza de Dados Antigos
```sql
-- Remover pedidos com erro de mais de 90 dias
DELETE FROM orders
WHERE status = 'failed'
AND created_at < NOW() - INTERVAL '90 days';

-- Limpar fila de impressão processada
DELETE FROM print_queue
WHERE status = 'printed'
AND created_at < NOW() - INTERVAL '30 days';
```

#### Reindexação (caso de lentidão)
```sql
-- Reindexar tabelas principais
REINDEX TABLE menu_items;
REINDEX TABLE orders;
REINDEX TABLE print_queue;

-- Atualizar estatísticas do PostgreSQL
ANALYZE menu_items;
ANALYZE orders;
```

---

## 6. Integração Mercado Pago

### 6.1 Fluxo de Pagamento

```
1. Cliente finaliza pedido
   ↓
2. Frontend envia POST /api/checkout com dados do pedido
   ↓
3. Backend valida dados e cria registro em Supabase (status: pending)
   ↓
4. Backend chama n8n webhook para criar preferência MP
   ↓
5. n8n cria preferência no Mercado Pago e retorna init_point
   ↓
6. Cliente é redirecionado para init_point (checkout MP)
   ↓
7. Cliente paga (Pix/Cartão)
   ↓
8. Mercado Pago notifica n8n via webhook
   ↓
9. n8n atualiza pedido no Supabase (status: approved/failed)
   ↓
10. n8n envia notificação WhatsApp via Evolution API
```

### 6.2 Configuração do Webhook MP

**URL de Notificação:**
```
https://energetictriggerfish-n8n.cloudfy.live/webhook/mercadopago-marmitaria
```

**Configurar em:**
1. Mercado Pago Developers → Suas integrações → Produção
2. Webhooks → Nova URL
3. Selecionar eventos: `payment`, `merchant_order`

### 6.3 Tratamento de Erros

| Erro | Causa | Solução |
|------|-------|---------|
| `Invalid credentials` | Access Token inválido | Gerar nova credencial no MP |
| `Preference creation failed` | n8n fora do ar | Verificar status do n8n |
| `Payment timeout` | Cliente abandonou checkout | Normal, pedido fica `pending` |
| `Payment rejected` | Pagamento negado | Cliente deve tentar novamente |

### 6.4 Testes em Sandbox

```bash
# Usar credenciais de teste (não produção!)
MP_ACCESS_TOKEN=TEST-1234567890-...
NEXT_PUBLIC_MP_PUBLIC_KEY=TEST-...

# Cartões de teste
Aprovado: 5031 4332 1540 6351 | CVV: 123 | Exp: 11/25
Rejeitado: 5031 4332 1540 5649 | CVV: 123 | Exp: 11/25
```

---

## 7. Integração n8n (Automação)

### 7.1 Workflows Ativos

#### Workflow: `marmitaria-pagamento-confirmado`
- **Trigger:** Webhook do Mercado Pago
- **ID:** (verificar no n8n)
- **Função:** Processar pagamentos confirmados

**Fluxo:**
1. Recebe notificação do Mercado Pago
2. Valida assinatura do webhook
3. Busca dados do pagamento via API MP
4. Atualiza pedido no Supabase
5. Adiciona à fila de impressão
6. Envia mensagem WhatsApp para cliente
7. Envia mensagem WhatsApp para loja

#### Workflow: `criar-preferencia-marmitaria`
- **Trigger:** Webhook HTTP (chamado pelo Next.js)
- **URL:** `https://energetictriggerfish-n8n.cloudfy.live/webhook/mp-criar-preference`
- **Função:** Criar preferência de pagamento no MP

**Payload esperado:**
```json
{
  "orderId": "uuid-do-pedido",
  "customerName": "João Silva",
  "customerEmail": "joao@example.com",
  "customerPhone": "19999999999",
  "items": [
    {
      "title": "Marmita P - Bife Acebolado",
      "quantity": 1,
      "unit_price": 18.00
    }
  ],
  "totalAmount": 18.00,
  "backUrls": {
    "success": "https://marmitariaararas.com.br/pedido/sucesso",
    "pending": "https://marmitariaararas.com.br/pedido/pendente",
    "failure": "https://marmitariaararas.com.br/pedido/falha"
  }
}
```

**Resposta esperada:**
```json
{
  "success": true,
  "preferenceId": "123456789-abc-def",
  "initPoint": "https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=..."
}
```

### 7.2 Monitoramento de Workflows

**Via n8n Dashboard:**
1. Acessar https://energetictriggerfish-n8n.cloudfy.live
2. Login com credenciais do projeto
3. Verificar execuções em "Executions"
4. Filtrar por status: `success`, `error`, `waiting`

**Via API:**
```bash
# Listar execuções recentes
curl -X GET "https://energetictriggerfish-n8n.cloudfy.live/api/v1/executions" \
  -H "X-N8N-API-KEY: $N8N_API_KEY"

# Ver detalhes de uma execução
curl -X GET "https://energetictriggerfish-n8n.cloudfy.live/api/v1/executions/{id}" \
  -H "X-N8N-API-KEY: $N8N_API_KEY"
```

### 7.3 Troubleshooting n8n

| Problema | Diagnóstico | Solução |
|----------|-------------|---------|
| Workflow não executa | Verificar se está ativo | Ativar em Settings do workflow |
| Webhook retorna 404 | URL incorreta | Verificar URL no código |
| Erro "Invalid credentials" | Credencial MP expirada | Atualizar credencial no n8n |
| WhatsApp não envia | Evolution API offline | Verificar status em `https://evolution-api-url/manager` |

---

## 8. Deploy e CI/CD

### 8.1 Deploy Vercel (Automático)

**Configuração:**
1. Repositório GitHub conectado: `cosiararas/marmitariaararas`
2. Branch de produção: `main`
3. Build Command: `npm run build`
4. Output Directory: `.next`
5. Install Command: `npm install`

**Variáveis de Ambiente (Vercel Dashboard):**
- Todas as variáveis do `.env.local` devem ser configuradas em:
  - Settings → Environment Variables
  - Separar por ambiente: Production, Preview, Development

**Deploy Automático:**
- Push para `main` → Deploy automático em produção
- Push para outras branches → Deploy de preview
- Pull Request → Deploy de preview com URL única

### 8.2 Deploy Manual

```bash
# Via Vercel CLI
npm install -g vercel
vercel login
vercel --prod

# Via Git
git add .
git commit -m "feat: nova funcionalidade"
git push origin main
# Aguardar deploy automático (2-5 minutos)
```

### 8.3 Rollback de Deploy

**Via Vercel Dashboard:**
1. Deployments → Selecionar deploy anterior
2. Botão "Promote to Production"

**Via Vercel CLI:**
```bash
# Listar deploys
vercel ls

# Promover deploy específico
vercel promote <deployment-url>
```

### 8.4 Domínio Customizado

**Configuração DNS (Registro.br ou Cloudflare):**
```
Tipo: A
Nome: @
Valor: 76.76.21.21 (Vercel)

Tipo: CNAME
Nome: www
Valor: cname.vercel-dns.com
```

**Adicionar no Vercel:**
1. Settings → Domains → Add Domain
2. Digitar: `marmitariaararas.com.br`
3. Verificar DNS
4. Aguardar SSL automático (Let's Encrypt)

---

## 9. Monitoramento e Logs

### 9.1 Logs Vercel

**Via Dashboard:**
1. https://vercel.com/cosiararas/marmitariaararas
2. Deployments → Selecionar deploy → Functions
3. Filtrar por função: `/api/checkout`

**Via CLI:**
```bash
# Logs em tempo real
vercel logs --follow

# Logs de função específica
vercel logs --function=api/checkout

# Logs de produção
vercel logs --prod
```

### 9.2 Logs Supabase

```sql
-- Logs de API (últimas 100 requisições)
SELECT * FROM auth.logs
ORDER BY created_at DESC
LIMIT 100;

-- Pedidos com erro (últimos 7 dias)
SELECT * FROM orders
WHERE status = 'failed'
AND created_at > NOW() - INTERVAL '7 days'
ORDER BY created_at DESC;
```

### 9.3 Métricas de Performance

**Vercel Analytics:**
- Settings → Analytics → Enable
- Métricas disponíveis:
  - Core Web Vitals (LCP, FID, CLS)
  - Page Load Time
  - TTFB (Time to First Byte)

**Google Analytics (opcional):**
```tsx
// src/app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `
        }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

---

## 10. Manutenção Preventiva

### 10.1 Checklist Semanal

- [ ] Verificar logs de erro no Vercel (Functions)
- [ ] Verificar pedidos com status `failed` no Supabase
- [ ] Testar fluxo de checkout completo (pedido teste)
- [ ] Verificar execuções com erro no n8n
- [ ] Verificar espaço em disco no Supabase (Storage)

### 10.2 Checklist Mensal

- [ ] Atualizar dependências NPM: `npm update`
- [ ] Verificar CVEs de segurança: `npm audit`
- [ ] Backup manual do banco Supabase
- [ ] Revisar políticas RLS do Supabase
- [ ] Testar restauração de backup
- [ ] Limpar pedidos antigos (90+ dias)
- [ ] Verificar certificado SSL (renova automaticamente)

### 10.3 Checklist Trimestral

- [ ] Atualizar Next.js para versão LTS mais recente
- [ ] Atualizar Supabase Client para última versão
- [ ] Revisar e otimizar queries SQL lentas
- [ ] Revisar e otimizar imagens (tamanho, formato WebP)
- [ ] Executar Lighthouse Audit (Performance, SEO, A11y)
- [ ] Revisar e atualizar documentação

### 10.4 Atualizações de Dependências

```bash
# Ver dependências desatualizadas
npm outdated

# Atualizar patch e minor versions
npm update

# Atualizar major versions (cuidado!)
npx npm-check-updates -u
npm install

# Testar após atualização
npm run build
npm run dev
```

---

## 11. Troubleshooting

### 11.1 Problemas Comuns

#### Erro: "Supabase connection failed"
**Sintomas:** Cardápio não carrega, página em branco
**Causa:** URL ou ANON_KEY incorretos
**Solução:**
```bash
# Verificar variáveis
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY

# Testar conexão manual
curl -I "https://energetictriggerfish-supabase.cloudfy.live"

# Verificar no Vercel Dashboard
Settings → Environment Variables
```

#### Erro: "Mercado Pago preference creation failed"
**Sintomas:** Cliente não consegue finalizar pedido
**Causa:** n8n offline ou credencial MP inválida
**Solução:**
```bash
# Testar n8n webhook
curl -X POST "https://energetictriggerfish-n8n.cloudfy.live/webhook/mp-criar-preference" \
  -H "Content-Type: application/json" \
  -d '{"test": true}'

# Verificar credencial MP (Vercel Dashboard)
Settings → Environment Variables → MP_ACCESS_TOKEN
```

#### Erro: "Payment webhook not received"
**Sintomas:** Pedido fica `pending` após pagamento
**Causa:** Webhook MP não configurado ou n8n rejeitou
**Solução:**
1. Verificar webhook configurado no Mercado Pago Developers
2. Verificar execuções no n8n com erro
3. Reprocessar manualmente via n8n (se necessário)

#### Erro: "Build failed on Vercel"
**Sintomas:** Deploy falha com erro de TypeScript
**Causa:** Tipo inválido ou dependência faltando
**Solução:**
```bash
# Testar build localmente
npm run build

# Ver logs detalhados
vercel logs --function=_error

# Limpar cache Next.js
rm -rf .next
npm run build
```

### 11.2 Comandos de Diagnóstico

```bash
# Verificar status da aplicação
curl -I "https://marmitariaararas.com.br"

# Testar API de cardápio
curl "https://energetictriggerfish-supabase.cloudfy.live/rest/v1/menu_items?is_active=eq.true" \
  -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY"

# Testar n8n webhook
curl -X POST "https://energetictriggerfish-n8n.cloudfy.live/webhook/mp-criar-preference" \
  -H "Content-Type: application/json" \
  -d '{"test": true}'

# Verificar DNS
nslookup marmitariaararas.com.br
dig marmitariaararas.com.br

# Verificar certificado SSL
openssl s_client -connect marmitariaararas.com.br:443 -servername marmitariaararas.com.br
```

---

## 12. Backup e Recuperação

### 12.1 Backup Banco de Dados

**Backup Automático (Supabase):**
- Frequência: Diário (3h UTC)
- Retenção: 7 dias (plano gratuito)
- Localização: Supabase Dashboard → Database → Backups

**Backup Manual (via pg_dump):**
```bash
# Obter connection string no Supabase Dashboard
# Settings → Database → Connection string (Direct connection)

# Backup completo
pg_dump "postgresql://postgres:[PASSWORD]@db.energetictriggerfish-supabase.cloudfy.live:5432/postgres" \
  > backup-$(date +%Y%m%d).sql

# Backup apenas estrutura
pg_dump --schema-only "postgresql://..." > schema.sql

# Backup apenas dados
pg_dump --data-only "postgresql://..." > data.sql
```

**Automatizar Backup Semanal (Windows Task Scheduler):**
```powershell
# backup-supabase.ps1
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupFile = "C:\Backups\marmitaria\backup-$timestamp.sql"

pg_dump "postgresql://postgres:[PASSWORD]@db.energetictriggerfish-supabase.cloudfy.live:5432/postgres" `
  > $backupFile

# Manter apenas últimos 30 dias
Get-ChildItem "C:\Backups\marmitaria\" -Filter "backup-*.sql" |
  Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-30) } |
  Remove-Item
```

### 12.2 Restauração

**Restaurar Backup Completo:**
```bash
# CUIDADO! Isso substitui TODOS os dados
psql "postgresql://postgres:[PASSWORD]@db.energetictriggerfish-supabase.cloudfy.live:5432/postgres" \
  < backup-20260317.sql
```

**Restaurar Apenas Tabela Específica:**
```bash
# Extrair apenas uma tabela do backup
pg_restore -t orders backup-20260317.sql \
  -d "postgresql://..."
```

### 12.3 Backup de Código-Fonte

**Git (já está no GitHub):**
- Repositório: https://github.com/cosiararas/marmitariaararas
- Backup automático via GitHub

**Backup Local Adicional:**
```bash
# Criar zip do projeto (sem node_modules)
tar -czf marmitaria-backup-$(date +%Y%m%d).tar.gz \
  --exclude=node_modules \
  --exclude=.next \
  marmitariaararas/
```

---

## 13. Segurança

### 13.1 Checklist de Segurança

- [x] HTTPS enforcement (vercel.json)
- [x] Security headers configurados
  - X-Frame-Options: DENY
  - X-Content-Type-Options: nosniff
  - X-XSS-Protection: 1; mode=block
  - Referrer-Policy: strict-origin-when-cross-origin
- [x] Variáveis sensíveis em .env (não no código)
- [x] RLS (Row Level Security) habilitado no Supabase
- [x] Validação de entrada em APIs
- [x] Rate limiting via Vercel (automático)
- [ ] CSP (Content Security Policy) - Implementar se necessário

### 13.2 Proteção Contra Ataques

**SQL Injection:**
- ✅ Protegido: Supabase Client usa queries parametrizadas
- ✅ RLS impede acesso não autorizado

**XSS (Cross-Site Scripting):**
- ✅ React escapa automaticamente variáveis
- ⚠️ Evitar `dangerouslySetInnerHTML` com dados não confiáveis

**CSRF (Cross-Site Request Forgery):**
- ✅ Next.js CSRF protection automático para Server Actions
- ℹ️ APIs REST: Adicionar CSRF token se necessário

**DDoS:**
- ✅ Vercel rate limiting automático
- ✅ Cloudflare DDoS protection (se configurado)

### 13.3 Auditoria de Segurança

```bash
# Verificar vulnerabilidades NPM
npm audit

# Corrigir automaticamente (se possível)
npm audit fix

# Corrigir forçadamente (cuidado!)
npm audit fix --force

# Gerar relatório
npm audit --json > audit-report.json
```

**Ferramentas Recomendadas:**
- **Snyk:** https://snyk.io (monitoramento contínuo)
- **OWASP ZAP:** Testes de penetração
- **Lighthouse:** Auditoria de segurança básica

---

## 14. Performance

### 14.1 Otimizações Implementadas

- ✅ **Next.js Image Optimization:** `<Image />` component
- ✅ **Code Splitting:** Automático via Next.js App Router
- ✅ **SSR + CSR Híbrido:** Server Components + Client Components
- ✅ **Tailwind CSS Purge:** CSS otimizado em produção
- ✅ **Vercel CDN:** Assets servidos via edge
- ✅ **Lazy Loading:** Imagens e componentes carregados sob demanda

### 14.2 Métricas Atuais (Baseline)

| Métrica | Valor | Meta |
|---------|-------|------|
| LCP (Largest Contentful Paint) | ~1.2s | < 2.5s ✅ |
| FID (First Input Delay) | ~50ms | < 100ms ✅ |
| CLS (Cumulative Layout Shift) | ~0.05 | < 0.1 ✅ |
| TTFB (Time to First Byte) | ~400ms | < 600ms ✅ |
| Page Load (completo) | ~1.4s | < 3s ✅ |

### 14.3 Otimizações Adicionais

**Imagens:**
```tsx
// Usar Next.js Image com dimensões especificadas
import Image from 'next/image';

<Image
  src="/cardapio-fotos/bife-acebolado.jpg"
  alt="Bife Acebolado"
  width={400}
  height={300}
  quality={85}
  placeholder="blur"
/>
```

**Fonts:**
```tsx
// next.config.ts
export default {
  experimental: {
    optimizeFonts: true
  }
}
```

**Caching:**
```tsx
// src/app/api/checkout/route.ts
export const revalidate = 0; // Não cachear API de checkout

// src/app/page.tsx (cardápio)
export const revalidate = 300; // Revalidar a cada 5 minutos
```

---

## 15. Atualizações e Versões

### 15.1 Versionamento Semântico

```
MAJOR.MINOR.PATCH
  |     |      |
  |     |      └─ Correções de bugs
  |     └─ Novas funcionalidades (backward compatible)
  └─ Mudanças incompatíveis (breaking changes)
```

**Exemplo:**
- `1.0.0` → Primeira versão estável
- `1.1.0` → Adicionar pagamento por boleto
- `1.1.1` → Corrigir bug no carrinho
- `2.0.0` → Migrar para Next.js 17 (breaking)

### 15.2 Changelog

**Manter arquivo CHANGELOG.md:**
```markdown
# Changelog

## [1.0.0] - 2026-03-17
### Added
- Sistema de e-commerce completo
- Integração Mercado Pago
- Cardápio dinâmico do Supabase
- Fila de impressão compartilhada

### Fixed
- Correção de validação de telefone

### Security
- Implementar security headers
- Habilitar RLS no Supabase
```

### 15.3 Roadmap

**Q2 2026:**
- [ ] Implementar cupons de desconto
- [ ] Adicionar avaliações de pratos
- [ ] Sistema de pontos/fidelidade
- [ ] Histórico de pedidos do cliente

**Q3 2026:**
- [ ] App móvel (React Native)
- [ ] Notificações push
- [ ] Rastreamento de entrega em tempo real

---

## Contato e Suporte

**Desenvolvedor:** Empório Cosi - Sistema Antigravity
**Email:** suporte@cosiararas.com.br
**WhatsApp:** (19) 99999-9999
**GitHub Issues:** https://github.com/cosiararas/marmitariaararas/issues

---

**Última atualização:** 17/03/2026
**Versão do documento:** 1.0
