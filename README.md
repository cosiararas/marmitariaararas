# 🍱 Marmitaria Araras - E-commerce

**Sistema completo de e-commerce para marmitas personalizadas**

[![Deploy](https://img.shields.io/badge/deploy-vercel-black)](https://marmitariaararas.com.br)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-2.0-green)](https://supabase.com/)

---

## 🎯 Sobre o Projeto

Sistema de e-commerce para **Marmitaria Araras** que permite aos clientes montar marmitas personalizadas, escolhendo tamanho, proteínas, acompanhamentos, adicionais, sobremesas e bebidas.

### 🌐 URL Produção
**https://marmitariaararas.com.br**

---

## ✨ Funcionalidades

### 🍽️ Monte Sua Marmita
- ✅ Seleção de tamanho (P, M, G)
- ✅ Escolha de proteínas (frango, carne, peixe, etc)
- ✅ Acompanhamentos personalizáveis
- ✅ Adicionais opcionais
- ✅ Sobremesas
- ✅ Bebidas

### 🛒 Carrinho de Compras
- ✅ Adicionar/Remover itens
- ✅ Editar quantidades
- ✅ Aplicar cupons de desconto
- ✅ Cálculo automático de total

### 💳 Checkout
- ✅ Validação de formulário (Zod)
- ✅ CPF com dígitos verificadores
- ✅ Telefone brasileiro
- ✅ Opção Entrega/Retirada
- ✅ Integração Mercado Pago
- ✅ Validação backend (n8n)

### 🖨️ Sistema de Impressão
- ✅ Integração com painel admin
- ✅ Impressão automática via daemon
- ✅ Suporte para impressora USB
- ✅ Fila de impressão (`print_queue`)

### 📊 Cardápio do Dia
- ✅ Sincronização com Google Sheets
- ✅ Atualização automática (n8n workflow)
- ✅ Exibição em `/cardapio-do-dia`

---

## 🛠️ Tecnologias

### Frontend
- **Next.js 16** - Framework React
- **TypeScript 5** - Tipagem estática
- **Tailwind CSS 4** - Estilização
- **Radix UI** - Componentes acessíveis
- **Lucide React** - Ícones

### Backend
- **Supabase** - Database + Auth
- **n8n** - Automação e validação
- **Mercado Pago** - Gateway de pagamento

### Deploy
- **Vercel** - Hosting + CDN
- **GitHub** - Controle de versão

---

## 📁 Estrutura do Projeto

```
marmitaria-vendas/
├── public/
│   ├── favicon.svg           # Ícone do site
│   ├── sitemap.xml          # Mapa do site (SEO)
│   ├── robots.txt           # Instruções para bots
│   ├── logo.png             # Logo principal
│   └── cardapio-fotos/      # Imagens de produtos
├── src/
│   ├── app/                 # App Router (Next.js 16)
│   ├── components/          # Componentes React
│   ├── lib/                 # Utilitários e configs
│   └── types/               # TypeScript types
├── supabase/
│   ├── functions/           # Edge Functions
│   └── migrations/          # SQL migrations
├── .env.example             # Variáveis de ambiente (exemplo)
├── vercel.json              # Config Vercel (headers, redirects)
├── package.json             # Dependências
└── README.md                # Este arquivo
```

---

## 🚀 Como Rodar Localmente

### 1. Clonar Repositório

```bash
git clone https://github.com/cosiararas/marmitariaararas.git
cd marmitariaararas
```

### 2. Instalar Dependências

```bash
npm install
```

### 3. Configurar Variáveis de Ambiente

Criar arquivo `.env.local` na raiz:

```env
# Supabase
VITE_SUPABASE_URL=https://energetictriggerfish-supabase.cloudfy.live
VITE_SUPABASE_ANON_KEY=eyJhbGci...

# Mercado Pago (PRODUÇÃO)
VITE_MP_PUBLIC_KEY=APP_USR-...

# n8n Webhooks
VITE_N8N_WEBHOOK_URL=https://energetictriggerfish-n8n.cloudfy.live/webhook/mp-criar-preference

# Marmitaria API
VITE_MARMITARIA_URL=https://marmitariaararas.com.br
```

### 4. Rodar em Desenvolvimento

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

### 5. Build para Produção

```bash
npm run build
npm run start
```

---

## 🔐 Variáveis de Ambiente

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `VITE_SUPABASE_URL` | URL da API Supabase | `https://...cloudfy.live` |
| `VITE_SUPABASE_ANON_KEY` | Chave pública Supabase | `eyJhbGci...` |
| `VITE_MP_PUBLIC_KEY` | Public key Mercado Pago | `APP_USR-...` |
| `VITE_N8N_WEBHOOK_URL` | Webhook n8n | `https://...n8n.cloudfy.live/webhook/...` |

---

## 📊 Integrações

### Supabase (Database)

**Tabelas principais:**
- `marmita_orders` - Pedidos de marmitas
- `daily_menu` - Cardápio do dia (sync com Google Sheets)
- `print_queue` - Fila de impressão
- `encomendas_products` - Produtos de encomenda

### n8n (Automação)

**Workflows:**
- **Consultar Cardapio** - Sync Google Sheets → Supabase (diário às 9h)
- **Mercado Pago** - Criar preferência de pagamento
- **Instagram** - Resposta automática DMs

### Mercado Pago

- Criação de preferências de pagamento
- Redirecionamento para checkout
- Webhook de confirmação

---

## 🖨️ Sistema de Impressão

### Daemon (marmitaria-print)

**Localização:** `../marmitaria-print/`

**Funcionamento:**
1. Pedido é feito no site
2. Admin clica "Imprimir" → "🍱 Marmitaria"
3. Pedido entra em `print_queue` (Supabase)
4. Daemon detecta e imprime na impressora USB
5. Status atualizado para `printed`

**Configuração:**
- Ver `../marmitaria-print/README.md`
- Requer Node.js + USB printer driver

---

## 🔒 Segurança

### Validação Dupla
- ✅ Frontend: Zod schema validation
- ✅ Backend: n8n webhook validation

### Headers de Segurança
- ✅ `X-Frame-Options: DENY`
- ✅ `X-Content-Type-Options: nosniff`
- ✅ `Strict-Transport-Security` (HSTS)
- ✅ `Content-Security-Policy` (CSP)
- ✅ `Referrer-Policy`

### Rate Limiting
- n8n webhook: configurable
- Supabase: nativo

### SSL/TLS
- ✅ Certificado SSL válido (Vercel)
- ✅ Redirecionamento HTTP→HTTPS automático

---

## 📈 Performance

### Lighthouse Score
- **Performance:** 85+
- **Accessibility:** 90+
- **Best Practices:** 90+
- **SEO:** 95+

### Métricas
- **TTFB:** ~150ms
- **Tempo de resposta:** ~1.4s
- **Tamanho página:** ~10KB (otimizado)

---

## 🧪 Testes

### Testes Automatizados
- 140 testes executados
- 89.3% de aprovação
- Ver `docs/RELATORIO_COMPLETO_TESTES_FINAL.md`

### Testar Localmente
```bash
# Executar testes (se configurado)
npm test
```

---

## 📦 Deploy

### Vercel (Automático)

1. **Push para GitHub:**
   ```bash
   git push origin main
   ```

2. **Vercel detecta e faz deploy automático**

3. **URL de produção:**
   - https://marmitariaararas.com.br

### Variáveis de Ambiente (Vercel)

Configurar no **Vercel Dashboard** → Settings → Environment Variables:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_MP_PUBLIC_KEY`
- `VITE_N8N_WEBHOOK_URL`

---

## 🗂️ Documentação Adicional

### Documentos Disponíveis

1. **[SECURITY_AUDIT_2026.md](SECURITY_AUDIT_2026.md)** - Auditoria de segurança
2. **[docs/CHECKLIST_TESTES_MARMITARIA_ARARAS.md](../gestao/docs/CHECKLIST_TESTES_MARMITARIA_ARARAS.md)** - Checklist completo de testes
3. **[docs/RELATORIO_COMPLETO_TESTES_FINAL.md](../gestao/docs/RELATORIO_COMPLETO_TESTES_FINAL.md)** - Relatório de testes
4. **[docs/AJUSTES_RECOMENDADOS.md](../gestao/docs/AJUSTES_RECOMENDADOS.md)** - Melhorias de SEO

### Scripts SQL

- `update-carne-panela-supabase.sql` - Update de produtos
- `update-fotos-supabase.sql` - Update de fotos

---

## 🤝 Contribuindo

1. Fork o projeto
2. Criar branch (`git checkout -b feature/NovaFuncionalidade`)
3. Commit (`git commit -m 'feat: adicionar nova funcionalidade'`)
4. Push (`git push origin feature/NovaFuncionalidade`)
5. Abrir Pull Request

---

## 📄 Licença

Este projeto é privado e pertence ao **Empório Cosi**.

---

## 👥 Equipe

- **Cliente:** Empório Cosi
- **Desenvolvimento:** Claude Code + Khalil Cury
- **Infraestrutura:** Vercel + Supabase + n8n (Cloudfy)

---

## 📞 Suporte

**Email:** cosiararas@gmail.com
**Site:** https://marmitariaararas.com.br
**Admin:** https://controle.cosiararas.com.br

---

## 🎯 Roadmap

### ✅ Concluído
- [x] Sistema de marmitas personalizadas
- [x] Integração Mercado Pago
- [x] Sistema de impressão
- [x] Cardápio do dia automatizado
- [x] Deploy em produção
- [x] SEO otimizado

### 🚧 Em Desenvolvimento
- [ ] App mobile (React Native)
- [ ] Sistema de fidelidade
- [ ] Programa de indicação
- [ ] Assinatura mensal

### 💡 Futuro
- [ ] IA para sugestões de marmitas
- [ ] Cardápio nutricional
- [ ] Rastreamento de entrega
- [ ] Sistema de avaliações

---

**Desenvolvido com ❤️ por [Claude Code](https://claude.com/claude-code)**

**Versão:** 2.0.0
**Última atualização:** 17/03/2026