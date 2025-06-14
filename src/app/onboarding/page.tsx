// src/app/onboarding/page.tsx (デバッグ版)

'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'

const INTEREST_OPTIONS = ['Technology', 'Business', 'Science', 'Health', 'Sports', 'Entertainment']

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        // デバッグ用: ユーザーIDを確認
        console.log('Current user ID:', user.id)
      } else {
        router.push('/login')
      }
    }
    checkUser()
  }, [supabase, router])

  const [learningGoal, setLearningGoal] = useState('')
  const [interests, setInterests] = useState<string[]>([])
  const [academicLevel, setAcademicLevel] = useState(3)

  const handleInterestChange = (interest: string) => {
    setInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    )
  }

  const handleSubmit = async () => {
    if (!user) return

    // デバッグ用: 送信するデータを確認
    const profileData = {
      user_id: user.id,
      learning_goal: learningGoal,
      interests: interests,
      academic_level: academicLevel,
    }
    console.log('Submitting profile data:', profileData)

    const { data, error } = await supabase.from('profiles').upsert(profileData)

    if (error) {
      // より詳細なエラー情報を表示
      console.error('Supabase error:', error)
      alert(`エラーが発生しました: ${error.message}\nDetails: ${error.details || 'No additional details'}`)
    } else {
      console.log('Profile saved successfully:', data)
      alert('プロフィールを保存しました！')
      router.push('/')
    }
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto max-w-2xl py-12">
      <h1 className="text-3xl font-bold mb-8">ようこそ、{user.email} さん</h1>
      <p className="mb-8 text-gray-600">学習をパーソナライズするために、いくつか質問させてください。</p>
      
      {/* デバッグ情報表示 */}
      <div className="mb-4 p-4 bg-gray-100 rounded text-sm">
        <strong>Debug Info:</strong><br/>
        User ID: {user.id}<br/>
        Email: {user.email}
      </div>

      <div className="space-y-8">
        <div>
          <label htmlFor="learningGoal" className="block text-lg font-medium mb-2">
            1. あなたの英語学習の目的は何ですか？
          </label>
          <input
            type="text"
            id="learningGoal"
            value={learningGoal}
            onChange={(e) => setLearningGoal(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="例: TOEFLで100点取る、海外の技術ブログを読む"
          />
        </div>

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
          保存して始める
        </button>
      </div>
    </div>
  )
}