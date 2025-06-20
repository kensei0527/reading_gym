// src/components/Generator.tsx (修正後)
'use client'

import { useState, useEffect } from 'react'
import type { Tables } from '@/types/supabase'
import { 
  generateContentAction, 
  type GeneratedContent,
  type MultipleChoiceQuestion,
  type TrueFalseNotGivenQuestion,
  type FillInTheBlankQuestion
} from '@/actions/generateContent'
type Question = MultipleChoiceQuestion | TrueFalseNotGivenQuestion | FillInTheBlankQuestion;

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

  // ... (useEffect, formatTime などの関数は変更なし)

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
    // ★ 問題数に合わせて解答欄を初期化
    if(generatedContent && 'questions' in generatedContent) {
      setUserAnswers(Array(generatedContent.questions.length).fill(''))
    }
    setShowResults(false)
  }

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    if (showResults) return
    const newAnswers = [...userAnswers]
    newAnswers[questionIndex] = answer
    setUserAnswers(newAnswers)
  }

  const handleSubmitAnswers = () => {
    setIsTimerRunning(false)
    let correctCount = 0
    generatedContent && 'questions' in generatedContent && generatedContent.questions.forEach((q, index) => {
      // ★ 正誤判定を少し柔軟に（大文字小文字、前後の空白を無視）
      if (userAnswers[index] && q.answer.trim().toLowerCase() === userAnswers[index].trim().toLowerCase()) {
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
    setIsLearningMode(false) // ★
    setShowResults(false) // ★
    
    const content = await generateContentAction(profile, duration)
    setGeneratedContent(content)
    
    setIsLoading(false)
  }

  // ★ 問題タイプに応じてUIを出し分ける関数
  const renderQuestion = (q: Question, index: number) => {
    const isCorrect = showResults && userAnswers[index] && q.answer.trim().toLowerCase() === userAnswers[index].trim().toLowerCase();
    const isIncorrect = showResults && userAnswers[index] && q.answer.trim().toLowerCase() !== userAnswers[index].trim().toLowerCase();

    switch (q.type) {
      case 'multiple-choice':
        return (
          <div className="mt-2 space-y-2">
            {q.choices.map((choice: string) => (
              <label key={choice} className={`block p-2 rounded-md border-2 transition-colors ${showResults ? '' : 'cursor-pointer hover:bg-gray-100'} ${userAnswers[index] === choice ? 'bg-blue-100 border-blue-400' : 'bg-white'} ${showResults && (q.answer === choice ? '!bg-green-100 !border-green-500' : userAnswers[index] === choice ? '!bg-red-100 !border-red-500' : '')}`}>
                <input
                  type="radio"
                  name={`question-${index}`}
                  value={choice}
                  checked={userAnswers[index] === choice}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  className="sr-only"
                  disabled={showResults}
                />
                <span>{choice}</span>
              </label>
            ))}
          </div>
        );
      case 'true-false-not-given':
        return (
          <div className="mt-2 space-y-2">
            {['True', 'False', 'Not Given'].map((choice) => (
              <label key={choice} className={`block p-2 rounded-md border-2 transition-colors ${showResults ? '' : 'cursor-pointer hover:bg-gray-100'} ${userAnswers[index] === choice ? 'bg-blue-100 border-blue-400' : 'bg-white'} ${showResults && (q.answer === choice ? '!bg-green-100 !border-green-500' : userAnswers[index] === choice ? '!bg-red-100 !border-red-500' : '')}`}>
                <input
                  type="radio"
                  name={`question-${index}`}
                  value={choice}
                  checked={userAnswers[index] === choice}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  className="sr-only"
                  disabled={showResults}
                />
                <span>{choice}</span>
              </label>
            ))}
          </div>
        );
      case 'fill-in-the-blank':
        return (
          <div className="mt-2">
            <input
              type="text"
              value={userAnswers[index] || ''}
              onChange={(e) => handleAnswerChange(index, e.target.value)}
              disabled={showResults}
              className={`p-1 border rounded-md w-32 text-center ${showResults && (isCorrect ? 'bg-green-100 border-green-500' : isIncorrect ? 'bg-red-100 border-red-500' : '')}`}
              placeholder="答えを入力"
            />
          </div>
        );
        default:
          // @ts-expect-error
          return <p>Unsupported question type: {q.type}</p>;
    }
  }

  return (
    <div>
      {/* フォーム部分は変更なし */}
      {!isLearningMode && (
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
          <button type="submit" disabled={isLoading} className="self-end bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg disabled:bg-gray-400">
            {isLoading ? '生成中...' : '教材を生成する'}
          </button>
        </form>
      )}

      {isLoading && <p>AIが教材を生成中です...</p>}

      {generatedContent && 'text' in generatedContent && !isLearningMode && !isLoading && (
        <div className="bg-white p-6 rounded-lg shadow-md animate-fade-in">
          <h3 className="text-2xl font-bold mb-4 border-b pb-2">教材の準備が完了しました</h3>
          <p className="text-gray-700 mb-6">学習を開始すると、本文と問題が表示されます。</p>
          <button onClick={handleStartLearning} className="mt-6 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg">
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
          <ul className="space-y-6">
            {generatedContent.questions.map((q, index) => (
              <li key={index} className="bg-gray-50 p-4 rounded-md">
                {/* ★ 問題文の表示もタイプによって変える */}
                <p className="font-semibold">{index + 1}. {
                  q.type === 'true-false-not-given' ? q.statement :
                  q.type === 'multiple-choice' ? q.question :
                  `${q.question_text_before_blank}_____${q.question_text_after_blank}`
                }</p>
                {/* ★ 問題形式に応じてUIをレンダリング */}
                {renderQuestion(q, index)}

                {showResults && (
                  <div className={`mt-4 p-3 rounded-md ${userAnswers[index] && q.answer.trim().toLowerCase() === userAnswers[index].trim().toLowerCase() ? 'bg-green-50' : 'bg-red-50'}`}>
                    <p className="font-bold text-sm">{userAnswers[index] && q.answer.trim().toLowerCase() === userAnswers[index].trim().toLowerCase() ? '正解！' : '不正解'}</p>
                    {q.type === 'fill-in-the-blank' && userAnswers[index] && q.answer.trim().toLowerCase() !== userAnswers[index].trim().toLowerCase() && <p className="text-sm">正解は: <strong>{q.answer}</strong></p>}
                    <p className="text-sm text-gray-800 mt-1">{q.explanation}</p>
                  </div>
                )}
              </li>
            ))}
          </ul>
          
          {/* ... ここから下の結果表示部分は変更なし ... */}
          {!showResults && (
            <button onClick={handleSubmitAnswers} className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg">
              答え合わせをする
            </button>
          )}
          {showResults && (
            <div className="mt-8">
              <div className="p-4 bg-gray-100 rounded-lg">
                <h4 className="text-xl font-bold mb-2">結果</h4>
                <p className="text-lg">正解数: {score} / {generatedContent.questions.length}</p>
                <p className="text-lg">所要時間: {formatTime(timer)}</p>
              </div>
              {generatedContent.vocabulary && (
                <div className="mt-8">
                  <h3 className="text-2xl font-bold mb-4 border-b pb-2">Key Vocabulary</h3>
                  <dl className="space-y-4">
                    {generatedContent.vocabulary.map((vocab, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-md">
                        <dt className="font-bold text-lg text-gray-800">{vocab.word}</dt>
                        <dd className="text-gray-600 mt-1">{vocab.definition}</dd>
                        <dd className="text-gray-500 italic mt-2">"{vocab.example}"</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
              <button onClick={() => setIsLearningMode(false)} className="mt-8 w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg">
                別の教材を生成する
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