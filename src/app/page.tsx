// src/app/page.tsx (新しいランディングページ)

import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'

export default async function LandingPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] text-center">
      <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
        AIが、あなただけの英語教材を。
      </h1>
      <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl">
        Personalized Reading Gymへようこそ。あなたの学習目的、レベル、興味に合わせて、AIが無限にリーディング教材を生成。もう教材選びに迷う必要はありません。
      </p>
      
      <div className="flex gap-4">
        {user ? (
          <Link href="/dashboard" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-lg">
            ダッシュボードへ
          </Link>
        ) : (
          <Link href="/login" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-lg">
            無料で学習を始める
          </Link>
        )}
      </div>

      <div className="mt-20 w-full max-w-4xl">
        <h2 className="text-3xl font-bold mb-8 border-b pb-4">機能</h2>
        <div className="grid md:grid-cols-3 gap-8 text-left">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">パーソナライズ</h3>
            <p className="text-gray-600">TOEIC、IELTSなどの試験対策から、ビジネス、趣味の話題まで。あなたのプロフィールに合わせて、最適な英文と問題をAIが作成します。</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">多様な問題形式</h3>
            <p className="text-gray-600">4択問題だけでなく、True/False/Not Given、空所補充など、あなたの学習目的に合わせた形式の問題で、実践的な読解力を養います。</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">詳細なフィードバック</h3>
            <p className="text-gray-600">解答後すぐに、詳しい解説と重要単語リストで復習できます。タイマー機能を使えば、本番さながらの緊張感で学習可能です。</p>
          </div>
        </div>
      </div>
    </div>
  )
}