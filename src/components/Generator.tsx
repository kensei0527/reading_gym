// src/components/Generator.tsx (修正版)

'use client'

import { useState } from 'react'
import type { Tables } from '@/types/supabase'
import { generateContentAction, type GeneratedContent } from '@/actions/generateContent'

// Generatorコンポーネントの定義
export default function Generator({ profile }: { profile: Tables<'profiles'> }) {
  const [duration, setDuration] = useState(15)
  const [isLoading, setIsLoading] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setGeneratedContent(null)
    
    const content = await generateContentAction(profile, duration)
    setGeneratedContent(content)
    
    setIsLoading(false)
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex items-center gap-4 mb-6">
        <div>
          <label htmlFor="duration" className="block font-medium">学習時間 (分)</label>
          <select 
            id="duration"
            value={duration} 
            onChange={(e) => setDuration(Number(e.target.value))}
            className="p-2 border rounded-md"
          >
            <option value={15}>15</option>
            <option value={30}>30</option>
            <option value={60}>60</option>
          </select>
        </div>
        <button 
          type="submit" 
          disabled={isLoading}
          className="self-end bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg disabled:bg-gray-400"
        >
          {isLoading ? '生成中...' : '教材を生成する'}
        </button>
      </form>
      
      {/* 結果の表示部分 */}
      {generatedContent && 'text' in generatedContent && (
        <div className="bg-white p-6 rounded-lg shadow-md animate-fade-in">
          <h3 className="text-2xl font-bold mb-4 border-b pb-2">Generated Text</h3>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{generatedContent.text}</p>
          
          <h3 className="text-2xl font-bold mt-8 mb-4 border-b pb-2">Questions</h3>
          <ul className="space-y-4">
            {generatedContent.questions.map((q, index) => (
              <li key={index} className="bg-gray-50 p-4 rounded-md">
                <p className="font-semibold">{index + 1}. {q.question}</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  {q.choices.map(choice => <li key={choice}>{choice}</li>)}
                </ul>
                <p className="mt-2 text-sm font-bold text-green-600">Answer: {q.answer}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {generatedContent && 'error' in generatedContent && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
          <p className="font-bold">エラー</p>
          <p>{generatedContent.error}</p>
        </div>
      )}
    </div>
  )
}