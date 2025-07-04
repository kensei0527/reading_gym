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

// ★ 見本表示用のコンポーネントを新しく定義
const GeneratorPlaceholder = () => {
  return (
    <div className="mt-8 p-6 bg-slate-50 border-2 border-dashed rounded-lg animate-fade-in">
      <h2 className="text-xl font-bold text-center text-gray-500 mb-6">ここに、あなただけの教材が生成されます</h2>
      
      <div className="space-y-6 opacity-60">
        {/* --- ダミーの英文 --- */}
        <div>
          <h3 className="text-lg font-semibold mb-2 text-gray-700">【例】生成される英文</h3>
          <p className="text-gray-600 p-4 bg-white rounded-md shadow-sm">
            Recent advancements in generative AI have significantly impacted various industries. For instance, in the creative sector, artists and writers are now using AI tools to brainstorm ideas and even co-create content. This synergy between human creativity and artificial intelligence is paving the way for unprecedented forms of expression.
          </p>
        </div>

        {/* --- ダミーの問題と解説 --- */}
        <div>
          <h3 className="text-lg font-semibold mb-2 text-gray-700">【例】生成される問題</h3>
          <div className="bg-white p-4 rounded-md shadow-sm">
            <p className="font-semibold">1. What is a major impact of generative AI mentioned in the text?</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-600">
              <li>It has decreased the need for human creativity.</li>
              <li>It is creating new ways of expression through human-AI synergy.</li>
              <li>It is primarily used in the technology sector.</li>
              <li>It has had no significant impact on industries.</li>
            </ul>
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="font-bold text-sm">解説</p>
              <p className="text-sm text-gray-700 mt-1">本文には 「synergy between human creativity and artificial intelligence is paving the way for unprecedented forms of expression.」（人間の創造性とAIの相乗効果が、前例のない表現形式への道を開いている）とあり、2番目の選択肢が正解です。</p>
            </div>
          </div>
        </div>
        
        {/* --- ダミーの単語リスト --- */}
        <div>
          <h3 className="text-lg font-semibold mb-2 text-gray-700">【例】重要単語リスト</h3>
          <div className="bg-white p-4 rounded-md shadow-sm">
            <dl>
              <dt className="font-bold text-gray-800">advancements</dt>
              <dd className="text-gray-600 mt-1">progress or development in a particular field.</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}

// Generatorコンポーネントの定義
export default function Generator({ profile }: { profile: Tables<'profiles'> | null }) {
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
    // 修正方法2: if文を使用（推奨）
    if (generatedContent && 'questions' in generatedContent) {
      generatedContent.questions.forEach((q, index) => {
        if (userAnswers[index] && q.answer.trim().toLowerCase() === userAnswers[index].trim().toLowerCase()) {
          correctCount++
        }
      })
    }
    setScore(correctCount)
    setShowResults(true)
  }

  // ★ ゲスト（未ログイン）ユーザー用のデフォルトプロフィールを定義
  const guestProfile: Tables<'profiles'> = {
    user_id: 'guest',
    learning_goal: 'General',
    interests: ['Technology', 'Science'],
    academic_level: 3,
    // 以下はDBのスキーマに合わせる
    id: 0, 
    created_at: new Date().toISOString(),
    generation_count: 0,
    last_generation_date: null,
  };

  // ★ ログインしていればユーザーのプロフィールを、していなければゲスト用プロフィールを使用
  const effectiveProfile = profile || guestProfile;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setGeneratedContent(null)
    setIsLearningMode(false) // ★
    setShowResults(false) // ★
    
    const content = await generateContentAction(effectiveProfile, duration)
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
          // @ts-expect-error Exhaustive switch case handling
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

      {/* ローディング中の表示 */}
      {isLoading && <div className="text-center p-8">AIが教材を生成中です...</div>}

      {/* ★ まだ何も生成されておらず、ローディング中でもない場合にプレースホルダーを表示 */}
      {!isLoading && !generatedContent && <GeneratorPlaceholder />}

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
                        <dd className="text-gray-500 italic mt-2">&quot;{vocab.example}&quot;</dd>
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