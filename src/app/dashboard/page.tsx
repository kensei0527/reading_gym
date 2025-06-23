// src/app/page.tsx (修正後)

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Generator from '@/components/Generator'
import type { Tables } from '@/types/supabase'

export default async function HomePage() {
  const supabase = await createClient() // ★ awaitを追加

   // ログインしているか試みる
   const {
        data: { user },
    } = await supabase.auth.getUser()

    let profile: Tables<'profiles'> | null = null
    if (user) {
        // ログインしている場合のみプロフィールを取得
        const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()
        profile = profileData

        // ★ プロフィールがまだ作成されていなければ、オンボーディングページにリダイレクト
        if (!profile) {
        return redirect('/onboarding')
        }
    }

  return (
    <>
      {/* ★ profileの存在をチェックして、ログインユーザーかゲストかで表示を切り替え */}
      {profile ? (
        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <h2 className="font-bold">現在の設定</h2>
          <p>学習目的: {profile.learning_goal || '未設定'}</p>
          <p>興味分野: {profile.interests?.join(', ') || '未設定'}</p>
          <p>アカデミック度: {profile.academic_level || '未設定'}</p>
        </div>
      ) : (
        <div className="bg-blue-50 p-4 rounded-lg mb-6 text-center">
          <p>現在ゲストとして利用しています。ログインすると設定を保存し、学習をパーソナライズできます。</p>
        </div>
      )}
      
      {/* ★ ジェネレーターには常に profile (ログイン時) または null (ゲスト時) を渡す */}
      <Generator profile={profile} />
    </>
  )
}