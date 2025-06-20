// src/utils/supabase/server.ts (修正後)

import { createServerClient } from '@supabase/ssr' // ★ CookieOptions を削除
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false
      },
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch (_error) {
            // Server Componentからのcookie設定エラーは無視
            // この処理はRoute HandlerやServer Actionで実行される場合に有効
          }
        },
      },
    }
  )
}