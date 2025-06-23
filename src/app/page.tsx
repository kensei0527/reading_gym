// src/app/page.tsx (アニメーション対応版)
'use client' // ★ ブラウザの機能を使うためクライアントコンポーネントに

import Link from 'next/link'
import Image from 'next/image' // ★ Imageコンポーネントをインポート
import { createClient } from '@/utils/supabase/client' // ★ クライアント用のSupabaseクライアントを使用
import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { motion, useScroll, useTransform } from 'framer-motion' // ★ Framer Motionから必要な機能をインポート

export default function LandingPage() {
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)
  
  // ★ スクロール位置を取得するためのフック
  const { scrollYProgress } = useScroll()
  // ★ スクロール位置(0%〜100%)を、回転角度(0度〜360度)に変換
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360])

  // ユーザー情報を取得するロジックはクライアントサイドで行う
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
    }
    getUser()
  }, [supabase])

  return (
    // ★ 複数の要素を配置するため、divで囲む
    <div className="relative">
      
      {/* ★ 背景に表示する回転アイコン */}
      <motion.div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 opacity-25"
        style={{ rotate }} // ★ スクロール量に応じてrotateスタイルを適用
      >
        <Image
          src="/logo.png" // public/logo.png を参照
          alt="Background Logo"
          width={400}
          height={400}
          priority
        />
      </motion.div>

      {/* メインコンテンツ (以前のコードとほぼ同じ) */}
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
          AIが、あなただけの英語教材を。
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl">
          Personalized Reading Gymへようこそ。あなたの学習目的、レベル、興味に合わせて、AIが無限にリーディング教材を生成。もう教材選びに迷う必要はありません。
        </p>
        
        <div className="flex gap-4">
          {/* ★ ログイン状態に関わらず、常にダッシュボードへリンクするボタンに変更 */}
          <Link href="/dashboard" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-lg">
            {user ? 'ダッシュボードへ' : '無料で教材生成を試す'}
          </Link>
        </div>
      </div>
      
      {/* 特徴紹介セクション (以前のコードとほぼ同じ) */}
      <div className="w-full max-w-4xl mx-auto py-20">
        <h2 className="text-3xl font-bold mb-8 border-b pb-4 text-center">機能紹介</h2>
        <div className="grid md:grid-cols-3 gap-8 text-left">
          <div className="bg-gray-50/50 backdrop-blur-sm p-6 rounded-lg border">
            <h3 className="text-xl font-semibold mb-2">完全パーソナライズ</h3>
            <p className="text-gray-600">TOEIC、IELTSなどの試験対策から、ビジネス、趣味の話題まで。あなたのプロフィールに合わせて、最適な英文と問題をAIが作成します。</p>
          </div>
          <div className="bg-gray-50/50 backdrop-blur-sm p-6 rounded-lg border">
            <h3 className="text-xl font-semibold mb-2">多様な問題形式</h3>
            <p className="text-gray-600">4択問題だけでなく、True/False/Not Given、空所補充など、あなたの学習目的に合わせた形式の問題で、実践的な読解力を養います。</p>
          </div>
          <div className="bg-gray-50/50 backdrop-blur-sm p-6 rounded-lg border">
            <h3 className="text-xl font-semibold mb-2">詳細なフィードバック</h3>
            <p className="text-gray-600">解答後すぐに、詳しい解説と重要単語リストで復習できます。タイマー機能を使えば、本番さながらの緊張感で学習可能です。</p>
          </div>
        </div>
      </div>
    </div>
  )
}