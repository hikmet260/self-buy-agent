-- Database Schema for Buyer Agent

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (managed by Supabase Auth - no password field needed)
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS will be managed by Supabase Auth

-- Shipping addresses
CREATE TABLE public.shipping_addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  line1 TEXT NOT NULL,
  line2 TEXT,
  city TEXT NOT NULL,
  region TEXT NOT NULL,
  postal TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'US',
  phone TEXT,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment methods
CREATE TABLE public.payment_methods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  label TEXT NOT NULL,
  stripe_payment_method_id TEXT,
  virtual_card_enabled BOOLEAN DEFAULT false,
  card_brand TEXT,
  last4 TEXT,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Site credentials (encrypted vault)
CREATE TABLE public.site_credentials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  domain TEXT NOT NULL,
  username TEXT NOT NULL,
  encrypted_password TEXT NOT NULL,
  passkey_supported BOOLEAN DEFAULT false,
  browserbase_context_id TEXT,
  last_used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, domain)
);

-- Orders
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_name TEXT NOT NULL,
  max_price NUMERIC(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  shipping_address_id UUID REFERENCES public.shipping_addresses(id),
  payment_method_id UUID REFERENCES public.payment_methods(id),
  status TEXT DEFAULT 'pending',
  final_price NUMERIC(10,2),
  final_url TEXT,
  receipt_blob_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Candidates (products found)
CREATE TABLE public.candidates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  source TEXT NOT NULL,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  item_price NUMERIC(10,2) NOT NULL,
  shipping NUMERIC(10,2),
  tax NUMERIC(10,2),
  discount_code TEXT,
  landed_cost NUMERIC(10,2) NOT NULL,
  in_stock BOOLEAN DEFAULT true,
  eta TEXT,
  review_score NUMERIC(2,1),
  return_rate_flag BOOLEAN DEFAULT false,
  price_history_json JSONB,
  screenshot_url TEXT,
  rank INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Agent runs
CREATE TABLE public.agent_runs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  browserbase_session_ids TEXT[],
  replay_urls TEXT[],
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'running',
  error TEXT
);

-- Agent steps (for streaming/audit)
CREATE TABLE public.agent_steps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  run_id UUID REFERENCES public.agent_runs(id) ON DELETE CASCADE NOT NULL,
  step_index INTEGER NOT NULL,
  phase TEXT NOT NULL,
  tool_name TEXT,
  tool_input_json JSONB,
  tool_output_json JSONB,
  screenshot_blob_url TEXT,
  reasoning TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pending 2FA codes
CREATE TABLE public.pending_2fa (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  run_id UUID REFERENCES public.agent_runs(id) ON DELETE CASCADE NOT NULL,
  code TEXT NOT NULL,
  received_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.shipping_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pending_2fa ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own shipping addresses"
  ON public.shipping_addresses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own shipping addresses"
  ON public.shipping_addresses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own shipping addresses"
  ON public.shipping_addresses FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own shipping addresses"
  ON public.shipping_addresses FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own payment methods"
  ON public.payment_methods FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own payment methods"
  ON public.payment_methods FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own payment methods"
  ON public.payment_methods FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own payment methods"
  ON public.payment_methods FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own credentials"
  ON public.site_credentials FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own credentials"
  ON public.site_credentials FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own credentials"
  ON public.site_credentials FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own credentials"
  ON public.site_credentials FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own orders"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own orders"
  ON public.orders FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own orders"
  ON public.orders FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view candidates for their orders"
  ON public.candidates FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.orders WHERE orders.id = candidates.order_id AND orders.user_id = auth.uid()));

CREATE POLICY "Users can insert candidates for their orders"
  ON public.candidates FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.orders WHERE orders.id = candidates.order_id AND orders.user_id = auth.uid()));

CREATE POLICY "Users can view their own runs"
  ON public.agent_runs FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.orders WHERE orders.id = agent_runs.order_id AND orders.user_id = auth.uid()));

CREATE POLICY "Users can insert runs for their orders"
  ON public.agent_runs FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.orders WHERE orders.id = agent_runs.order_id AND orders.user_id = auth.uid()));

CREATE POLICY "Users can view steps for their runs"
  ON public.agent_steps FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.agent_runs WHERE agent_runs.id = agent_steps.run_id AND EXISTS (SELECT 1 FROM public.orders WHERE orders.id = agent_runs.order_id AND orders.user_id = auth.uid())));

CREATE POLICY "Users can insert steps for their runs"
  ON public.agent_steps FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.agent_runs WHERE agent_runs.id = agent_steps.run_id AND EXISTS (SELECT 1 FROM public.orders WHERE orders.id = agent_runs.order_id AND orders.user_id = auth.uid())));

CREATE POLICY "Users can view pending 2FA for their runs"
  ON public.pending_2fa FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.agent_runs WHERE agent_runs.id = pending_2fa.run_id AND EXISTS (SELECT 1 FROM public.orders WHERE orders.id = agent_runs.order_id AND orders.user_id = auth.uid())));

CREATE POLICY "Users can insert pending 2FA for their runs"
  ON public.pending_2fa FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.agent_runs WHERE agent_runs.id = pending_2fa.run_id AND EXISTS (SELECT 1 FROM public.orders WHERE orders.id = agent_runs.order_id AND orders.user_id = auth.uid())));

-- Create indexes
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_candidates_order_id ON public.candidates(order_id);
CREATE INDEX idx_candidates_landed_cost ON public.candidates(landed_cost);
CREATE INDEX idx_agent_runs_order_id ON public.agent_runs(order_id);
CREATE INDEX idx_agent_steps_run_id ON public.agent_steps(run_id);
CREATE INDEX idx_pending_2fa_run_id ON public.pending_2fa(run_id);