// src/app/page.tsx (修正後)

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Generator from '@/components/Generator'

export default async function HomePage() {
  const supabase = await createClient() // ★ awaitを追加

  // ログインしているユーザー情報を取得
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 未ログインならログインページにリダイレクト
  if (!user) {
    return redirect('/login')
  }

  // ユーザーのプロフィール情報を取得
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  // プロフィールがまだ作成されていなければ、オンボーディングページにリダイレクト
  if (!profile) {
    return redirect('/onboarding')
  }

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <h1 className="text-2xl font-bold mb-4">Wide Reading Gym</h1>
      <p className="mb-6">あなたの設定に基づいて、パーソナライズされた多読用の教材を生成します。あくまで多読用なのでとにかく量をこなして基礎的な読解力や速読力を身に付けたいという方向けです。</p>
      
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h2 className="font-bold">現在の設定</h2>
        <p>学習目的: {profile.learning_goal || '未設定'}</p>
        <p>興味分野: {profile.interests?.join(', ') || '未設定'}</p>
        <p>アカデミック度: {profile.academic_level || '未設定'}</p>
      </div>

      {/* 教材生成を行うクライアントコンポーネントを呼び出す */}
      <Generator profile={profile} />
    </div>
  )
}