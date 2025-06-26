// src/app/generated-materials-details/page.tsx
import Link from 'next/link';

export default function GeneratedMaterialsDetailsPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">
        AIが生成するパーソナライズ教材：My Reading Gymの仕組み
      </h1>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
          なぜAIによる教材生成なのか？
        </h2>
        <div className="space-y-4 text-gray-700">
          <p>
            英語学習において、TOEIC、IELTS、TOEFLなど様々な試験にチャレンジする機会があると思いますが、各試験対策問題集は試験の問題形式に慣れる練習というものが多く、基礎の英語力を向上させる教材があまりない印象です。そこで各試験の対策問題集に挑戦する前にまずは基礎英語力を高めるために量をこなすステップを踏むことが必要だと感じています。
          </p>
          <p>
            My Reading Gymは、この課題を解決するために最先端のAI技術（GoogleのGemini API）を活用しています。AIがあなたの学習プロフィールに基づいて、パーソナライズされたリーディング教材と問題、そして詳細な解説をその場で生成します。この学習法で量をこなしていくことで基礎的なリーディングの力を向上させることができます。
          </p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
          パーソナライズの仕組み：あなたの学習プロフィールが鍵
        </h2>
        <div className="space-y-4 text-gray-700">
          <p>
            このアプリでは、初回利用時にいくつかの簡単な質問に答えていただきます。
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>
              <strong>学習目的:</strong> TOEIC、IELTS、TOEFL、英検といった試験対策から、ビジネス英語、日常会話、趣味の英語まで。
            </li>
            <li>
              <strong>アカデミックレベル:</strong> 初級、中級、上級など、現在の英語力。
            </li>
            <li>
              <strong>興味のある分野:</strong> 科学、歴史、テクノロジー、文化、スポーツなど、あなたが読みたいトピック。
            </li>
          </ul>
          <p>
            これらの情報が「学習プロフィール」となり、AIが教材を生成する際の判断基準となります。例えば、TOEIC対策を選べばビジネス関連の文章が、科学に興味があれば最新の科学ニュースに関する英文が生成される、といった具合です。
          </p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
          生成される教材の種類と特徴
        </h2>
        <div className="space-y-4 text-gray-700">
          <p>
            AIは、あなたのプロフィールに合わせて以下の要素を調整しながら、オリジナルのリーディング教材を生成します。
          </p>
          <h3 className="text-xl font-medium mb-2">1. リーディングパッセージ（英文）</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>
              <strong>トピック:</strong> あなたの興味分野に基づいた、読み応えのある英文。
            </li>
            <li>
              <strong>難易度:</strong> あなたのアカデミックレベルに合わせた語彙や文法構造。
            </li>
            <li>
              <strong>時事性:</strong> 最新のニュースや話題を取り入れた、鮮度の高い内容。
            </li>
          </ul>

          <h3 className="text-xl font-medium mb-2">2. 多様な問題形式</h3>
          <p>
            生成される問題は、単なる内容理解にとどまりません。
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>
              <strong>4択問題 (Multiple Choice):</strong> 内容理解、推論、語彙など、幅広い読解力を測ります。
            </li>
            <li>
              <strong>True/False/Not Given:</strong> 英文中の情報と記述の合致を正確に判断する力を養います。IELTS対策に特に有効です。
            </li>
            <li>
              <strong>空所補充 (Fill-in-the-Blank):</strong> 文脈に合った適切な単語やフレーズを選ぶことで、語彙力と文法力を強化します。TOEICや英検対策に役立ちます。
            </li>
          </ul>

          <h3 className="text-xl font-medium mb-2">3. 詳細なフィードバックと解説</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>
              <strong>問題解説:</strong> 各問題の正解・不正解だけでなく、なぜその選択肢が正解（または不正解）なのかを日本語で丁寧に解説します。
            </li>
            <li>
              <strong>重要単語リスト:</strong> 英文中に出てくる重要語彙を抽出し、日本語訳と合わせて提示します。
            </li>
            <li>
              <strong>タイマー機能:</strong> 時間を意識した学習で、本番の試験に備えることができます。
            </li>
          </ul>
        </div>
      </section>

      <div className="text-center mt-12">
        <Link href="/" className="text-blue-500 hover:underline text-lg">
          &larr; トップページに戻る
        </Link>
      </div>
    </div>
  );
}