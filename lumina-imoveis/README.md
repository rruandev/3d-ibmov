# LUMINA Imóveis — Plataforma Imobiliária Premium

Aplicação completa, pronta para produção, para uma imobiliária de alto padrão.
Visual premium, animações fluidas, experiência 3D e arquitetura escalável.

> **Funciona sem nenhuma configuração.** Sem variáveis de ambiente, a aplicação
> roda em **modo demonstração** com dados mock em memória — basta `npm install && npm run dev`.

---

## ✨ Destaques

- **Hero cinematográfico** com cidade 3D em Three.js, parallax pelo mouse, luzes dinâmicas e partículas.
- **Busca inteligente** com filtros por finalidade, cidade, tipo, preço, quartos, banheiros, vagas e área.
- **Cards premium** com tilt 3D, zoom de imagem e microinterações.
- **Experiência 3D** com casa procedural interativa (lazy loading + Suspense).
- **Tour virtual** (360°, vídeo e visita interativa).
- **Favoritos, comparação (até 4) e compartilhamento** com persistência local (Zustand).
- **Painel administrativo** completo: CRUD de imóveis e gestão de leads.
- **SEO completo**: metadata, Open Graph, sitemap dinâmico, robots e Schema.org (JSON-LD).
- **Clean Architecture**: domínio → repositórios → serviços → actions → UI.

---

## 🧱 Stack

| Camada        | Tecnologias |
|---------------|-------------|
| Framework     | Next.js 15 (App Router), React 19, TypeScript |
| Estilo        | TailwindCSS, design system próprio (estilo shadcn/UI) |
| Animação      | Framer Motion, GSAP + ScrollTrigger |
| 3D            | Three.js, React Three Fiber, Drei |
| Estado        | Zustand (persistido) |
| Formulários   | React Hook Form + Zod |
| Backend/Dados | Supabase (PostgreSQL) com fallback mock |
| Ícones        | Lucide |

---

## 🚀 Como rodar

```bash
npm install
npm run dev
# abra http://localhost:3000
```

Scripts disponíveis:

```bash
npm run dev        # desenvolvimento
npm run build      # build de produção
npm run start      # servir build
npm run lint       # eslint
npm run typecheck  # checagem de tipos
```

---

## 🗄️ Configurando o Supabase (opcional)

1. Crie um projeto em [supabase.com](https://supabase.com).
2. No **SQL Editor**, execute o conteúdo de [`supabase/schema.sql`](./supabase/schema.sql)
   (cria tabelas `properties`, `agents`, `leads`, enums, índices, RLS e seed).
3. Copie `.env.example` para `.env.local` e preencha:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key
NEXT_PUBLIC_SITE_URL=https://seudominio.com
```

Sem essas variáveis, a aplicação detecta automaticamente e usa os dados mock.

---

## 🏛️ Arquitetura

```
src/
├─ app/
│  ├─ (site)/                 # Site público (route group)
│  │  ├─ layout.tsx           # Navbar + Footer + CompareBar + ScrollProgress
│  │  ├─ page.tsx             # Home (Hero, Destaques, 3D, Tour, Sobre, Depoimentos, CTA, Contato)
│  │  ├─ imoveis/             # Listagem + filtros + detalhe [slug]
│  │  ├─ favoritos/           # Favoritos (Zustand)
│  │  └─ comparar/            # Comparação lado a lado
│  ├─ admin/                  # Painel administrativo (layout próprio)
│  │  ├─ page.tsx             # Dashboard
│  │  ├─ imoveis/             # Lista, novo, [id]/editar
│  │  └─ leads/               # Gestão de leads
│  ├─ actions/                # Server Actions (lead, property)
│  ├─ sitemap.ts / robots.ts  # SEO
│  └─ layout.tsx              # Root: fontes, metadata, JSON-LD
├─ components/
│  ├─ ui/                     # Primitivos (button, card, input, select…)
│  ├─ layout/                 # Navbar, Footer, Logo
│  ├─ sections/               # Seções da home
│  ├─ property/               # Card, galeria, favoritos, comparação, compartilhar
│  ├─ search/                 # Busca rápida + filtros + ordenação
│  ├─ three/                  # Cenas 3D (cidade, casa) com lazy load
│  ├─ forms/                  # Formulário de lead
│  ├─ admin/                  # Sidebar, tabelas, formulário de imóvel
│  ├─ seo/                    # JSON-LD (Organization, Property, Breadcrumb)
│  └─ shared/                 # Reveal, SectionHeading, Pagination, ScrollProgress
├─ repositories/              # Acesso a dados (Supabase OU mock)
├─ services/                  # Regras de negócio
├─ store/                     # Zustand (favoritos, comparação)
├─ hooks/                     # useCountUp, useMounted, useMediaQuery
├─ lib/                       # utils, constants, validations (Zod), supabase
├─ data/                      # Dados mock (properties, agents, testimonials)
└─ types/                     # Tipagens de domínio
```

**Fluxo de dados (Clean Architecture):**
`UI → Service → Repository → (Supabase | Mock)` — a UI nunca fala direto com a fonte de dados.

---

## 🎨 Design System

- **Cores:** Preto `#0A0A0A`, Branco `#FFFFFF`, Grafite `#1A1A1A`, Azul premium `#0F4C81`, Dourado `#D4AF37`.
- **Tipografia:** Inter (corpo) + Plus Jakarta Sans (display).
- **Recursos:** glassmorphism, soft shadows, gradientes dourados, scroll storytelling, microinterações.

Tokens em [`tailwind.config.ts`](./tailwind.config.ts) e [`src/app/globals.css`](./src/app/globals.css).

---

## ⚡ Performance

- Cenas 3D com **lazy loading + Suspense** e montagem só quando visíveis (IntersectionObserver).
- `AdaptiveDpr` / `AdaptiveEvents` para escalonar a qualidade conforme o dispositivo.
- Imagens otimizadas via `next/image` (AVIF/WebP) e `next/font` (sem CLS).
- Code splitting por rota; primitivos de UI próprios (sem peso de bibliotecas extras).

---

## 🛡️ Painel Admin

Acesse em `/admin`. No modo demonstração as alterações ficam em memória.

> **Produção:** proteja `/admin` com autenticação (Supabase Auth + middleware).
> As policies de RLS já restringem escrita a usuários autenticados; o backend usa a
> `service_role` key apenas em Server Actions.

---

## ☁️ Deploy na Vercel

1. Suba o repositório para o GitHub.
2. Importe na [Vercel](https://vercel.com/new).
3. Configure as variáveis de ambiente (se for usar Supabase).
4. Deploy — o `next build` já está validado.

---

© LUMINA Imóveis. Projeto desenvolvido com foco em conversão e excelência visual.
