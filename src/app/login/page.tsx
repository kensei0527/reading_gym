// src/app/login/page.tsx

'use client' // このページがブラウザでインタラクティブに動くことを示すおまじない

import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClient } from '@/utils/supabase/client'
import { useEffect } from 'react'

export default function LoginPage() {
  const supabase = createClient()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        // ユーザーがログインしたら、ホームページにリダイレクト
        window.location.href = '/'
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase])


  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={['google', 'github']} // ソーシャルログインを使わない場合はこの行を削除
          redirectTo={`${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`}
        />
      </div>
    </div>
  )
}