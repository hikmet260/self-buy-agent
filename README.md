# Buyer Agent - Autonomous Deal-to-Delivery

A production-ready, fully autonomous "Deal-to-Delivery" Buyer Agent web app built with Next.js 15, TypeScript, and shadcn/ui.

## Features

- **Three-Input Purchase Flow**: Product name, max price, shipping address + payment method
- **Parallel Multi-Source Search**: Searches Amazon, Walmart, Target, eBay simultaneously
- **Best Deal Selection**: Calculates landed cost (item + shipping + tax - discounts)
- **Quality Verification**: Checks review scores and return rates
- **Session Persistence**: Maintains login sessions across price checks
- **Real-Time Streaming**: Live progress updates via Server-Sent Events
- **Final-Mile Confirmation**: Human-in-the-loop gate before purchase
- **Encrypted Credentials**: AES-GCM encrypted login vault

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS + shadcn/ui
- Vercel AI SDK for streaming
- Supabase (PostgreSQL + Auth + RLS)
- Vercel Blob for screenshots

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env.local` and fill in values:

```bash
cp .env.example .env.local
```

Required variables:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key
- `AGENT_VAULT_ENCRYPTION_KEY` - 32-byte key (`openssl rand -base64 32`)

Optional:
- `STRIPE_SECRET_KEY` - For virtual cards
- `BROWSERBASE_API_KEY` - For browser automation

### 3. Set Up Database

Run the schema in Supabase SQL Editor:

```bash
cat scripts/schema.sql
```

Or use the Supabase CLI:
```bash
supabase db push
```

### 4. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000

## Architecture

### State Machine Flow

```
PENDING → SEARCHING → COMPARING → AWAITING_LOGIN → AWAITING_2FA → AWAITING_CONFIRMATION → PURCHASING → PURCHASED
         ↓
       FAILED
```

### API Routes

- `POST /api/orders/[id]/run` - Start agent execution
- `GET /api/orders/[id]/run` - Stream agent progress
- `POST /api/orders/[id]/confirm` - Confirm/cancel purchase

### Database Tables

- `orders` - Shopper orders with status tracking
- `candidates` - Found products with landed cost
- `agent_runs` - Browser automation sessions
- `agent_steps` - Streamed progress steps
- `site_credentials` - Encrypted login vault
- `shipping_addresses` - User addresses
- `payment_methods` - Payment methods
- `pending_2fa` - 2FA code polling

## Deployment

Deploy to Vercel:

```bash
vercel deploy
```

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── orders/[id]/
│   │   │   ├── run/        # Agent execution
│   │   │   └── confirm/    # Final confirmation
│   │   ├── credentials/    # Vault API
│   │   ├── addresses/    # Address CRUD
│   │   └── payments/    # Payment CRUD
│   ├── dashboard/
│   │   ├── orders/[id]/  # Order detail
│   │   └── settings/   # User settings
│   ├── login/          # Auth page
│   ├── layout.tsx
│   └── page.tsx
├── components/ui/       # shadcn components
├── lib/
│   ├── supabase.ts    # Client
│   ├── agent.ts      # Agent utilities
│   ├── encryption.ts # AES-GCM vault
│   ├── stripe.ts    # Virtual cards
│   └── types.ts    # Database types
└── middleware.ts      # Auth guard
```

## License

MIT