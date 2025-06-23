// src/components/Header.tsx (修正後)

import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import Image from 'next/image'

export default async function Header() {
  // サーバーコンポーネントでSupabaseクライアントを作成
  const supabase = await createClient()

  // 現在のユーザー情報を取得
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // ログアウト処理を行うサーバーアクション
  const signOut = async () => {
    'use server' // サーバー側で実行される関数であることを示すおまじない

    const supabase = await createClient()
    await supabase.auth.signOut()
    return redirect('/login') // ログアウト後にログインページにリダイレクト
  }

  return (
    <header className="bg-gray-800 text-white shadow-md">
      <div className="container mx-auto p-4 flex justify-between items-center">
      <Link href="/" className="flex items-center gap-3">
        <Image
          src="/logo.png" // public/logo.png を参照
          alt="Personalized Reading Gym Logo"
          width={64}
          height={64}
          className="h-16 w-16" // サイズを指定
        />
        <span className="text-xl font-bold">
          Personalized Reading Gym
        </span>
      </Link>
        <nav className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm hidden sm:inline">{user.email}</span>
              <Link href="/onboarding" className="text-sm hover:underline">
                設定
              </Link>
              <form action={signOut}>
                <button className="bg-gray-600 hover:bg-gray-700 px-3 py-1 rounded text-sm">
                  Logout
                </button>
              </form>
            </>
          ) : (
            <Link href="/login" className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded">
              ログイン / 新規登録
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}