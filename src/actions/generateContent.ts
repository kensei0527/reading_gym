'use server'

import type { Tables } from '@/types/supabase'

// この型定義は、AIからの応答の形を定義します
export type GeneratedContent = {
  text: string;
  questions: {
    question: string;
    choices: string[];
    answer: string;
  }[];
} | { error: string };

// サーバーアクション関数
export async function generateContentAction(profile: Tables<'profiles'>, duration: number): Promise<GeneratedContent> {
  // ライブラリをインポート
  const { GoogleGenerativeAI } = await import('@google/generative-ai')

  try {
    // APIキーを使ってGeminiクライアントを初期化
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash', // 高速・低コストなモデルを使用
      generationConfig: { responseMimeType: 'application/json' }, // 応答をJSON形式に指定
    })

    // ★ ここがアプリの知能の核心！AIへの指示（プロンプト）
    const prompt = `
      あなたは優秀な英語教材作成のエキスパートです。
      以下のプロフィールを持つ学習者のために、指定された学習時間で終えられる量の、自然な多読用の英語教材を生成してください。

      # 学習者のプロフィール
      - 学習目的: ${profile.learning_goal || '一般的な英語学習'}
      - 興味のある分野: ${(profile.interests || []).join(', ') || '一般的なトピック'}
      - 好みのスタイル (1: カジュアル 〜 5: アカデミック): ${profile.academic_level || 3}

      # 指示
      - 上記のプロフィールを考慮したトピックと文体で、${duration}分の学習時間に適した長さの英文を作成してください。
      - 生成した英文の内容に関する、質の高い4択の読解問題を3つ作成してください。
      - 以下のJSON形式のスキーマに厳密に従って、応答を生成してください。

      {
        "text": "生成された英文（ここに英文が入る）",
        "questions": [
          { "question": "問題1の内容", "choices": ["選択肢A", "選択肢B", "選択肢C", "選択肢D"], "answer": "正解の選択肢" },
          { "question": "問題2の内容", "choices": ["選択肢A", "選択肢B", "選択肢C", "選択肢D"], "answer": "正解の選択肢" },
          { "question": "問題3の内容", "choices": ["選択肢A", "選択肢B", "選択肢C", "選択肢D"], "answer": "正解の選択肢" }
        ]
      }
    `
    // APIを呼び出し
    const result = await model.generateContent(prompt)
    const response = result.response
    const jsonText = response.text()

    // テキストをJSONとしてパースして返す
    return JSON.parse(jsonText)

  } catch (error) {
    console.error('AIの教材生成中にエラーが発生しました:', error)
    return { error: '教材の生成に失敗しました。時間をおいて再試行してください。' }
  }
}