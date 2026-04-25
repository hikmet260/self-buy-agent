export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          email: string
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          created_at?: string | null
          updated_at?: string | null
        }
      }
      shipping_addresses: {
        Row: {
          id: string
          user_id: string
          name: string
          line1: string
          line2: string | null
          city: string
          region: string
          postal: string
          country: string
          phone: string | null
          is_default: boolean
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          line1: string
          line2?: string | null
          city: string
          region: string
          postal: string
          country?: string
          phone?: string | null
          is_default?: boolean
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          line1?: string
          line2?: string | null
          city?: string
          region?: string
          postal?: string
          country?: string
          phone?: string | null
          is_default?: boolean
          created_at?: string | null
        }
      }
      payment_methods: {
        Row: {
          id: string
          user_id: string
          label: string
          stripe_payment_method_id: string | null
          virtual_card_enabled: boolean
          card_brand: string | null
          last4: string | null
          is_default: boolean
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          label: string
          stripe_payment_method_id?: string | null
          virtual_card_enabled?: boolean
          card_brand?: string | null
          last4?: string | null
          is_default?: boolean
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          label?: string
          stripe_payment_method_id?: string | null
          virtual_card_enabled?: boolean
          card_brand?: string | null
          last4?: string | null
          is_default?: boolean
          created_at?: string | null
        }
      }
      site_credentials: {
        Row: {
          id: string
          user_id: string
          domain: string
          username: string
          encrypted_password: string
          passkey_supported: boolean
          browserbase_context_id: string | null
          last_used_at: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          domain: string
          username: string
          encrypted_password: string
          passkey_supported?: boolean
          browserbase_context_id?: string | null
          last_used_at?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          domain?: string
          username?: string
          encrypted_password?: string
          passkey_supported?: boolean
          browserbase_context_id?: string | null
          last_used_at?: string | null
          created_at?: string | null
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          product_name: string
          max_price: number
          currency: string
          shipping_address_id: string | null
          payment_method_id: string | null
          status: string
          agent_run_id: string | null
          final_price: number | null
          final_url: string | null
          receipt_blob_url: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          product_name: string
          max_price: number
          currency?: string
          shipping_address_id?: string | null
          payment_method_id?: string | null
          status?: string
          agent_run_id?: string | null
          final_price?: number | null
          final_url?: string | null
          receipt_blob_url?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          product_name?: string
          max_price?: number
          currency?: string
          shipping_address_id?: string | null
          payment_method_id?: string | null
          status?: string
          agent_run_id?: string | null
          final_price?: number | null
          final_url?: string | null
          receipt_blob_url?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      candidates: {
        Row: {
          id: string
          order_id: string
          source: string
          url: string
          title: string
          item_price: number
          shipping: number | null
          tax: number | null
          discount_code: string | null
          landed_cost: number
          in_stock: boolean
          eta: string | null
          review_score: number | null
          return_rate_flag: boolean
          price_history_json: Json | null
          screenshot_url: string | null
          rank: number | null
          created_at: string | null
        }
        Insert: {
          id?: string
          order_id: string
          source: string
          url: string
          title: string
          item_price: number
          shipping?: number | null
          tax?: number | null
          discount_code?: string | null
          landed_cost: number
          in_stock?: boolean
          eta?: string | null
          review_score?: number | null
          return_rate_flag?: boolean
          price_history_json?: Json | null
          screenshot_url?: string | null
          rank?: number | null
          created_at?: string | null
        }
        Update: {
          id?: string
          order_id?: string
          source?: string
          url?: string
          title?: string
          item_price?: number
          shipping?: number | null
          tax?: number | null
          discount_code?: string | null
          landed_cost?: number
          in_stock?: boolean
          eta?: string | null
          review_score?: number | null
          return_rate_flag?: boolean
          price_history_json?: Json | null
          screenshot_url?: string | null
          rank?: number | null
          created_at?: string | null
        }
      }
      agent_runs: {
        Row: {
          id: string
          order_id: string
          browserbase_session_ids: string[] | null
          replay_urls: string[] | null
          started_at: string | null
          ended_at: string | null
          status: string
          error: string | null
        }
        Insert: {
          id?: string
          order_id: string
          browserbase_session_ids?: string[] | null
          replay_urls?: string[] | null
          started_at?: string | null
          ended_at?: string | null
          status?: string
          error?: string | null
        }
        Update: {
          id?: string
          order_id?: string
          browserbase_session_ids?: string[] | null
          replay_urls?: string[] | null
          started_at?: string | null
          ended_at?: string | null
          status?: string
          error?: string | null
        }
      }
      agent_steps: {
        Row: {
          id: string
          run_id: string
          step_index: number
          phase: string
          tool_name: string | null
          tool_input_json: Json | null
          tool_output_json: Json | null
          screenshot_blob_url: string | null
          reasoning: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          run_id: string
          step_index: number
          phase: string
          tool_name?: string | null
          tool_input_json?: Json | null
          tool_output_json?: Json | null
          screenshot_blob_url?: string | null
          reasoning?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          run_id?: string
          step_index?: number
          phase?: string
          tool_name?: string | null
          tool_input_json?: Json | null
          tool_output_json?: Json | null
          screenshot_blob_url?: string | null
          reasoning?: string | null
          created_at?: string | null
        }
      }
      pending_2fa: {
        Row: {
          id: string
          run_id: string
          code: string
          received_at: string | null
        }
        Insert: {
          id?: string
          run_id: string
          code: string
          received_at?: string | null
        }
        Update: {
          id?: string
          run_id?: string
          code?: string
          received_at?: string | null
        }
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}

export type OrderStatus =
  | 'pending'
  | 'searching'
  | 'comparing'
  | 'awaiting_login'
  | 'awaiting_2fa'
  | 'awaiting_confirmation'
  | 'purchasing'
  | 'purchased'
  | 'failed'
  | 'cancelled'
  | 'killed'

export type RunStatus =
  | 'running'
  | 'completed'
  | 'failed'
  | 'cancelled'

export type Phase =
  | 'discovery'
  | 'access'
  | 'transaction'
  | 'confirmation'
  | 'cleanup'