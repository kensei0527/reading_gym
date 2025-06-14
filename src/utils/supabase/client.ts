// src/utils/supabase/client.ts

import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // .env.localから環境変数を読み込んで、ブラウザ用のSupabaseクライアントを作成
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}