// src/actions/generateContent.ts (修正後)
'use server'

import type { Tables } from '@/types/supabase'
import { createClient } from '@/utils/supabase/server' // ★ Supabaseクライアントをインポート

// ★ AIからの応答の型定義を、多様な問題形式に対応できるように拡張
export type MultipleChoiceQuestion = {
  type: 'multiple-choice';
  question: string;
  choices: string[];
  answer: string;
  explanation: string;
}

export type TrueFalseNotGivenQuestion = {
  type: 'true-false-not-given';
  statement: string; // T/F/NGを判断すべき記述
  answer: 'True' | 'False' | 'Not Given';
  explanation: string;
}

export type FillInTheBlankQuestion = {
  type: 'fill-in-the-blank';
  question_text_before_blank: string; // 空欄の前の文章
  question_text_after_blank: string;  // 空欄の後の文章
  answer: string; // 空欄に当てはまる単語
  explanation: string;
}

export type GeneratedContent = {
  text: string;
  // ★ questionsの型を、複数の問題形式のユニオン型（組み合わせ）にする
  questions: (MultipleChoiceQuestion | TrueFalseNotGivenQuestion | FillInTheBlankQuestion)[];
  vocabulary: {
    word: string;
    definition: string;
    example: string;
  }[];
} | { error: string };

// サーバーアクション関数
export async function generateContentAction(profile: Tables<'profiles'>, duration: number): Promise<GeneratedContent> {
  const { GoogleGenerativeAI } = await import('@google/generative-ai')
  const supabase = await createClient(); // ★ async/await に合わせて修正

  // 1. 回数制限のチェック
  const DAILY_LIMIT = 3; // 1日の上限回数
  const today = new Date().toISOString().split('T')[0]; // 今日の日付 (YYYY-MM-DD)

  let currentCount = profile.generation_count || 0;
  const lastDate = profile.last_generation_date;

  // 最後に生成した日付が今日でない場合、カウンターをリセット
  if (lastDate !== today) {
    currentCount = 0;
  }

  // 上限に達しているかチェック
  if (currentCount >= DAILY_LIMIT) {
    return { error: `本日の生成回数の上限（${DAILY_LIMIT}回）に達しました。また明日お試しください。` };
  }

  // ★★★ ここまでが回数制限チェック ★★★

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: { responseMimeType: 'application/json' },
    })
    
    const questionCount = Math.max(3, Math.floor(duration / 5));

    // ★★★ ここからが今回のメインの変更点 ★★★
    // 学習目的に応じて、AIへの問題形式の指示を動的に変更する
    let questionTypeInstruction = `以下の問題形式をバランス良く混ぜて、合計で${questionCount}個の問題を作成してください。\n- "multiple-choice"\n- "true-false-not-given"\n- "fill-in-the-blank"`;

    switch (profile.learning_goal) {
      case 'IELTS':
        questionTypeInstruction = `IELTSリーディングセクションを想定し、"true-false-not-given"形式の問題を半数、残りを"multiple-choice"形式と"fill-in-the-blank"形式として、合計で${questionCount}個の問題を作成してください。`;
        break;
      case 'TOEIC':
        questionTypeInstruction = `TOEICのPart 7（読解問題）とPart 5/6（短文・長文穴埋め）を想定し、"multiple-choice"形式と"fill-in-the-blank"形式の問題を半々で、合計で${questionCount}個の問題を作成してください。`;
        break;
      case 'TOEFL':
        questionTypeInstruction = `TOEFL iBTのリーディングセクションを想定し、"multiple-choice"形式の問題を${questionCount}個作成してください。問題には、主題、詳細、推論、語彙など、多様な問いを含めてください。`;
        break;
      case 'EIKEN':
        questionTypeInstruction = `英検を想定し、"multiple-choice"形式の問題と、語彙力を問う"fill-in-the-blank"形式の問題をバランス良く混ぜて、合計で${questionCount}個の問題を作成してください。`;
        break;
      // "Business" や "DailyConversation", "General" はデフォルトのままでOK
    }
    // ★★★ ここまでがメインの変更点 ★★★

    const prompt = `
      あなたは優秀な英語教材作成のエキスパートです。
      以下のプロフィールを持つ学習者のために、質の高い多読用の英語教材を生成してください。

      # 学習者のプロフィール
      - 学習目的: ${profile.learning_goal || '一般的な英語力向上'}
      - 興味のある分野: ${(profile.interests || []).join(', ') || '一般的なトピック'}
      - 好みのスタイル (1: カジュアル 〜 5: アカデミック): ${profile.academic_level || 3}

      # 指示
      1. 上記のプロフィールを考慮し、${duration}分の学習時間に適した長さの英文を作成してください。
      2. 生成した英文の内容に基づき、以下の指示に従って問題を作成してください。
         ${questionTypeInstruction} // ★ ここで動的な指示を挿入
      3. 全ての問題に、詳しい「explanation」（解説）を付けてください。
      4. 英文全体から、重要単語やイディオムを5つ選び、「vocabulary」リストを作成してください。
      5. 以下のJSON形式のスキーマに厳密に従って、応答を生成してください。特に "type" フィールドを各問題に正しく含めてください。

      {
        "text": "...",
        "questions": [
          { 
            "type": "multiple-choice",
            "question": "...", 
            "choices": ["...", "...", "...", "..."], 
            "answer": "...",
            "explanation": "..."
          },
          { 
            "type": "true-false-not-given",
            "statement": "...",
            "answer": "True", 
            "explanation": "..."
          },
          {
            "type": "fill-in-the-blank",
            "question_text_before_blank": "...",
            "question_text_after_blank": "...",
            "answer": "...",
            "explanation": "..."
          }
        ],
        "vocabulary": [ ... ]
      }
    `
    const result = await model.generateContent(prompt)
    const response = result.response

    // ★★★ AIからの応答が成功した後に、カウンターを更新 ★★★
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        generation_count: currentCount + 1,
        last_generation_date: today,
      })
      .eq('user_id', profile.user_id);

    if (updateError) {
      // カウントアップに失敗しても教材は返す。ただしエラーは記録。
      console.error('Failed to update generation count:', updateError);
    }
    // ★★★ カウンター更新ここまで ★★★

    const jsonText = response.text()
    
    return JSON.parse(jsonText)

  } catch (error) {
    console.error('AIの教材生成中にエラーが発生しました:', error)
    return { error: '教材の生成に失敗しました。時間をおいて再試行してください。' }
  }
}