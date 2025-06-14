// src/components/Generator.tsx (修正版)

'use client'

import { useState, useEffect } from 'react'
import type { Tables } from '@/types/supabase'
import { generateContentAction, type GeneratedContent } from '@/actions/generateContent'

// Generatorコンポーネントの定義
export default function Generator({ profile }: { profile: Tables<'profiles'> }) {
  const [duration, setDuration] = useState(15)
  const [isLoading, setIsLoading] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null)
  const [isLearningMode, setIsLearningMode] = useState(false)
  const [timer, setTimer] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [userAnswers, setUserAnswers] = useState<string[]>([])
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isTimerRunning])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleStartLearning = () => {
    setIsLearningMode(true)
    setIsTimerRunning(true)
    setTimer(0)
    setUserAnswers([])
    setShowResults(false)
  }

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    const newAnswers = [...userAnswers]
    newAnswers[questionIndex] = answer
    setUserAnswers(newAnswers)
  }

  const handleSubmitAnswers = () => {
    setIsTimerRunning(false)
    let correctCount = 0
    generatedContent && 'questions' in generatedContent && generatedContent.questions.forEach((q, index) => {
      if (userAnswers[index] === q.answer) {
        correctCount++
      }
    })
    setScore(correctCount)
    setShowResults(true)
  }

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
      
      {generatedContent && 'text' in generatedContent && !isLearningMode && (
        <div className="bg-white p-6 rounded-lg shadow-md animate-fade-in">
          <h3 className="text-2xl font-bold mb-4 border-b pb-2">教材の準備が完了しました</h3>
          <p className="text-gray-700 mb-6">学習を開始すると、本文と問題が表示されます。</p>
          
          <button
            onClick={handleStartLearning}
            className="mt-6 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg"
          >
            学習を開始する
          </button>
        </div>
      )}

      {isLearningMode && generatedContent && 'text' in generatedContent && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold">学習モード</h3>
            <div className="text-xl font-mono">{formatTime(timer)}</div>
          </div>

          <div className="mb-8">
            <h4 className="text-xl font-bold mb-4 border-b pb-2">本文</h4>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{generatedContent.text}</p>
          </div>
          
          <h3 className="text-2xl font-bold mb-4 border-b pb-2">問題</h3>
          <ul className="space-y-4">
            {generatedContent.questions.map((q, index) => (
              <li key={index} className="bg-gray-50 p-4 rounded-md">
                <p className="font-semibold">{index + 1}. {q.question}</p>
                <ul className="mt-2 space-y-2">
                  {q.choices.map(choice => (
                    <li key={choice}>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name={`question-${index}`}
                          value={choice}
                          checked={userAnswers[index] === choice}
                          onChange={(e) => handleAnswerChange(index, e.target.value)}
                          className="form-radio"
                          disabled={showResults}
                        />
                        <span>{choice}</span>
                      </label>
                    </li>
                  ))}
                </ul>
                {showResults && (
                  <div className={`mt-2 text-sm font-bold ${userAnswers[index] === q.answer ? 'text-green-600' : 'text-red-600'}`}>
                    {userAnswers[index] === q.answer ? '正解' : `不正解 (正解: ${q.answer})`}
                  </div>
                )}
              </li>
            ))}
          </ul>

          {!showResults && (
            <button
              onClick={handleSubmitAnswers}
              className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
            >
              回答を提出する
            </button>
          )}

          {showResults && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-xl font-bold mb-2">結果</h4>
              <p className="text-lg">
                正解数: {score} / {generatedContent.questions.length}
              </p>
              <p className="text-lg">
                所要時間: {formatTime(timer)}
              </p>
              <button
                onClick={() => setIsLearningMode(false)}
                className="mt-4 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg"
              >
                学習を終了する
              </button>
            </div>
          )}
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