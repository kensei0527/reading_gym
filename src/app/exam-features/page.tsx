// src/app/exam-features/page.tsx
import Link from 'next/link';

export default function ExamFeaturesPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Personalized Reading Gymが対応する英語試験の特徴と対策
      </h1>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
          TOEIC L&R (Test of English for International Communication Listening & Reading)
        </h2>
        <div className="space-y-4 text-gray-700">
          <p>
            TOEIC L&Rテストは、ビジネスシーンにおける英語でのコミュニケーション能力を測る試験です。リーディングセクションはPart 5からPart 7で構成され、文法・語彙、長文読解、複数文書読解が問われます。
          </p>
          <h3 className="text-xl font-medium mb-2">特徴的な問題形式と対策</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>
              <strong>Part 5: 短文穴埋め問題</strong> - 文法知識と語彙力が問われます。Personalized Reading Gymの「空所補充 (fill-in-the-blank)」問題は、このパートの対策に役立ちます。AIが文脈に合った適切な単語を生成することで、実用的な語彙力を養えます。
            </li>
            <li>
              <strong>Part 6: 長文穴埋め問題</strong> - 文脈理解と適切な語句・文の選択が必要です。本アプリの「空所補充」や「4択問題 (multiple-choice)」を通じて、長文読解の中での文脈判断力を高めることができます。
            </li>
            <li>
              <strong>Part 7: 読解問題</strong> - シングルパッセージ、ダブルパッセージ、トリプルパッセージがあります。情報の特定、推論、著者の意図など、総合的な読解力が問われます。本アプリの「4択問題」や「True/False/Not Given」問題は、多角的な視点から英文を理解する練習に最適です。特に、生成される英文は時事的な要素を含んでいるため、実際のビジネス文書やニュース記事を読む力を養うのに役立ちます。
            </li>
          </ul>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
          IELTS (International English Language Testing System)
        </h2>
        <div className="space-y-4 text-gray-700">
          <p>
            IELTSは、アカデミックな環境や海外移住に必要な英語力を測る国際的な試験です。リーディングセクションは、アカデミック・モジュールとジェネラル・トレーニング・モジュールで内容が異なりますが、基本的な問題形式は共通しています。
          </p>
          <h3 className="text-xl font-medium mb-2">特徴的な問題形式と対策</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>
              <strong>True/False/Not Given (T/F/NG)</strong> - 英文の内容と与えられた記述が「合致する」「合致しない」「本文中に記載がない」を判断します。Personalized Reading Gymの「True/False/Not Given」問題は、IELTS対策に特化した訓練を提供し、正確な情報特定能力を鍛えます。
            </li>
            <li>
              <strong>Multiple Choice (多肢選択)</strong> - 文の要点理解や詳細情報の把握が求められます。本アプリの「4択問題」は、本文の内容を正確に理解し、最も適切な選択肢を選ぶ力を養うのに役立ちます。
            </li>
            <li>
              <strong>Gap Fill (空所補充)</strong> - 要約文や図表の空欄を埋めます。キーワードの特定と文脈理解が重要です。AIが生成する「空所補充」問題は、IELTSのこの形式に対応しており、効率的な情報抽出の練習ができます。
            </li>
          </ul>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
          TOEFL iBT (Test Of English as a Foreign Language Internet-Based Test)
        </h2>
        <div className="space-y-4 text-gray-700">
          <p>
            TOEFL iBTは、主に大学でのアカデミックな英語運用能力を測る試験です。リーディングセクションは、大学の講義や教科書から抜粋されたような長文を読み解き、幅広い形式の問題に答えます。
          </p>
          <h3 className="text-xl font-medium mb-2">特徴的な問題形式と対策</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>
              TOEFLのリーディング問題は、ほとんどが<strong>多肢選択 (Multiple Choice)</strong> 形式です。AIが生成する教材では、特に主題、詳細、推論、語彙、否定的事実情報、目的、修辞的意図、カテゴリー分類、要約、表完成など、多岐にわたる問いを含む4択問題を作成するよう設計されています。
            </li>
            <li>
              本アプリは、<strong>「アカデミック」な難易度設定</strong>により、TOEFLの学術的な文章に慣れるための最適な教材を提供します。
            </li>
            <li>
              要約問題やカテゴリー分類問題のような高度な理解を問う問題も、基本的な読解力と推論力を養う本アプリの教材で基礎を固めることができます。
            </li>
          </ul>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
          英検 (実用英語技能検定)
        </h2>
        <div className="space-y-4 text-gray-700">
          <p>
            英検は、日本国内で広く認知されている英語能力測定試験です。級によってレベルが大きく異なり、各級で求められる語彙力や読解力が段階的に上がっていきます。リーディングセクションでは、短文の語句空所補充、長文の語句空所補充、長文の内容一致問題などが出題されます。
          </p>
          <h3 className="text-xl font-medium mb-2">特徴的な問題形式と対策</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>
              <strong>短文の語句空所補充:</strong> 文脈に合う適切な単語や熟語を選ぶ問題です。Personalized Reading Gymの「空所補充 (fill-in-the-blank)」問題は、この形式の対策に直結します。
            </li>
            <li>
              <strong>長文の語句空所補充:</strong> 長文を読みながら、文脈に合った適切な語句を選択します。本アプリの「空所補充」問題は、長文読解力を養いながら、文脈に応じた語彙力を鍛えるのに有効です。
            </li>
            <li>
              <strong>長文の内容一致問題:</strong> 本文の内容と一致する選択肢を選ぶ問題です。本アプリの「4択問題 (multiple-choice)」は、長文から必要な情報を正確に読み取る訓練になります。
            </li>
            <li>
              AIが生成する教材は、幅広いトピックと難易度（アカデミック度）を調整できるため、英検の各級の学習レベルに合わせて利用できます。
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