// src/app/reading-benefits/page.tsx
import Link from 'next/link';

export default function ReadingBenefitsPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">
        多読が英語学習にもたらす驚くべき効果とは？
      </h1>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
          多読とは？
        </h2>
        <div className="space-y-4 text-gray-700">
          <p>
            多読とは、自分のレベルに合った英文を、辞書を引かずに、大量に読む学習方法です。一見すると地味で学習当たりの質が低い方法に思えるかもしれませんが、実は英語力全般を効率的に向上させるための非常に強力なアプローチとして知られています。
          </p>
          <p>
            「My Reading Gym」は、あなたの興味や学習目的に合わせてAIがパーソナライズされた多読用の英文教材を生成することで、この多読の概念を最大限に活かすことを目指しています。
          </p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
          多読の5つの主要なメリット
        </h2>
        <div className="space-y-4 text-gray-700">
          <h3 className="text-xl font-medium mb-2">1. 英語を英語で理解する力が向上する</h3>
          <p>
            多読では、わからない単語が出てきてもいちいち辞書を引かず、文脈から意味を推測する練習をします。これを繰り返すことで、自然と英語を日本語に変換せずに直接理解する「英語脳」が鍛えられ、リーディングスピードが飛躍的に向上します。
          </p>

          <h3 className="text-xl font-medium mb-2">2. 語彙力と文法知識が自然に身につく</h3>
          <p>
            大量の英文に触れることで、同じ単語や表現、文法構造に繰り返し出会います。意識的に暗記しなくても、何度も目にするうちに自然と語彙が増え、複雑な文法構造も感覚的に理解できるようになります。
          </p>

          <h3 className="text-xl font-medium mb-2">3. リーディングスピードが劇的に上がる</h3>
          <p>
            英文を読むことに慣れると、スラッシュリーディングや返り読みが減り、前からスムーズに読み進められるようになります。これにより、TOEICやIELTS、TOEFLといった時間制限のある試験でのスコアアップにも直結します。
          </p>

          <h3 className="text-xl font-medium mb-2">4. 英語学習のモチベーションが維持しやすい</h3>
          <p>
            自分の興味のある分野の文章を読んだり、物語を楽しんだりすることで、学習が苦痛ではなくなり、継続しやすくなります。Personalized Reading Gymは、あなたの「興味のある分野」に合わせて教材を生成するため、飽きずに多読を続けられます。
          </p>

          <h3 className="text-xl font-medium mb-2">5. 英語圏の文化や思考に触れられる</h3>
          <p>
            洋書や英語の記事を読むことで、英語圏の人々の考え方や文化に触れることができます。これは、単なる言語学習を超えて、異文化理解を深める上でも非常に有益です。
          </p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
          多読を始めるには？
        </h2>
        <div className="space-y-4 text-gray-700">
          <p>
            多読の鍵は、「辞書を引かない」「わからなくても飛ばして読む」「つまらなければ読むのをやめる」の3原則です。そして最も大切なのは、自分のレベルに合った、興味を持てる教材を選ぶこと。
          </p>
          <p>
            「Personalized Reading Gym」は、この「レベル」と「興味」の2つの要素をAIが自動で判断し、あなたに最適な教材を無限に生成します。もう教材探しに時間を費やす必要はありません。
          </p>
          <p>
            さあ、AIがあなたのために用意したパーソナルな教材で、今日から多読学習を始めてみませんか？
          </p>
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