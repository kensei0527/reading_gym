// src/app/onboarding/page.tsx (修正後)
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import type { Tables } from '@/types/supabase'

const INTEREST_OPTIONS = ['Technology', 'Business', 'Science', 'Health', 'Sports', 'Entertainment']

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Tables<'profiles'> | null>(null) // ★ プロフィール情報を保持
  const [isLoading, setIsLoading] = useState(true); // ★ ローディング状態を追加

  // ★ フォームのstate定義。初期値は空やデフォルト値。
  const [learningGoal, setLearningGoal] = useState('')
  const [interests, setInterests] = useState<string[]>([])
  const [academicLevel, setAcademicLevel] = useState(3)

  // ★ ページ読み込み時にユーザーとプロフィール情報を取得
  useEffect(() => {
    const getData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        // ログインユーザーに紐づくプロフィールを取得
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single()
        
        if (profileData) {
          setProfile(profileData)
          // ★ 取得したプロフィール情報でフォームの初期値を設定
          setLearningGoal(profileData.learning_goal || '')
          setInterests(profileData.interests || [])
          setAcademicLevel(profileData.academic_level || 3)
        }
      } else {
        router.push('/login')
      }
      setIsLoading(false); // ★ ローディング完了
    }
    getData()
  }, [supabase, router])

  const handleInterestChange = (interest: string) => {
    setInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    )
  }

  const handleSubmit = async () => {
    if (!user) return

    const { error } = await supabase.from('profiles').upsert({
      user_id: user.id,
      learning_goal: learningGoal,
      interests: interests,
      academic_level: academicLevel,
    },
    {
      onConflict: 'user_id',
    }
  )

    if (error) {
      alert('エラーが発生しました: ' + error.message)
    } else {
      alert('プロフィールを保存しました！')
      router.push('/')
    }
  }

  // ★ ローディング中は専用の表示を出す
  if (isLoading) {
    return <div>Loading...</div>
  }
  
  return (
    <div className="container mx-auto max-w-2xl py-12">
      <h1 className="text-3xl font-bold mb-8">プロフィール設定</h1>
      <p className="mb-8 text-gray-600">
        {profile ? '設定を変更できます。' : '学習をパーソナライズするために、いくつか質問させてください。'}
      </p>
      
      <div className="space-y-8">
        {/* 学習目的のセレクトボックス */}
        <div>
          <label htmlFor="learningGoal" className="block text-lg font-medium mb-2">
            1. あなたの英語学習の主な目的は何ですか？
          </label>
          <select
            id="learningGoal"
            value={learningGoal}
            onChange={(e) => setLearningGoal(e.target.value)}
            className="w-full p-2 border rounded-md bg-white"
          >
            <option value="" disabled>選択してください</option>
            <option value="TOEIC">TOEIC対策</option>
            <option value="TOEFL">TOEFL対策</option>
            <option value="IELTS">IELTS対策</option>
            <option value="EIKEN">英検対策</option>
            <option value="Business">ビジネス英語</option>
            <option value="DailyConversation">日常英会話</option>
            <option value="General">一般的な読解力向上</option>
          </select>
        </div>
        {/* ... 興味分野とアカデミック度のフォーム部分は変更なし ... */}
        <div>
          <label className="block text-lg font-medium mb-2">
            2. どんな分野の話題に興味がありますか？ (複数選択可)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {INTEREST_OPTIONS.map((interest) => (
              <label key={interest} className="flex items-center space-x-2 p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={interests.includes(interest)}
                  onChange={() => handleInterestChange(interest)}
                  className="h-5 w-5 rounded"
                />
                <span>{interest}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <label htmlFor="academicLevel" className="block text-lg font-medium mb-2">
            3. 読みたい記事の雰囲気を教えてください (1: カジュアル 〜 5: アカデミック)
          </label>
          <div className="flex items-center justify-between">
            <span>カジュアル</span>
            <input
              type="range"
              id="academicLevel"
              min="1"
              max="5"
              value={academicLevel}
              onChange={(e) => setAcademicLevel(Number(e.target.value))}
              className="w-full mx-4"
            />
            <span>アカデミック</span>
          </div>
          <div className="text-center text-xl font-bold mt-2">{academicLevel}</div>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg text-lg"
        >
          プロフィールを保存する
        </button>
      </div>
    </div>
  )
}