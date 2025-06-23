// src/app/terms/page.tsx
export default function TermsPage() {
    return (
      <div className="max-w-4xl mx-auto py-12">
        <h1 className="text-3xl font-bold mb-6">利用規約</h1>
        <div className="space-y-4 text-gray-700">
          <p>この利用規約（以下、「本規約」といいます。）は、[あなたの名前またはサービス名]（以下、「当方」といいます。）がこのウェブサイト上で提供するサービス（以下、「本サービス」といいます。）の利用条件を定めるものです。ユーザーの皆様には、本規約に従って、本サービスをご利用いただきます。</p>
          <h2 className="text-xl font-semibold pt-4">第1条（適用）</h2>
          <p>本規約は、ユーザーと当方との間の本サービスの利用に関わる一切の関係に適用されるものとします。</p>
          <h2 className="text-xl font-semibold pt-4">第2条（禁止事項）</h2>
          <p>ユーザーは、本サービスの利用にあたり、以下の行為をしてはなりません。</p>
          <ul className="list-disc list-inside">
            <li>法令または公序良俗に違反する行為</li>
            <li>犯罪行為に関連する行為</li>
            {/* ... 他の項目を追加 ... */}
          </ul>
          <p className="pt-4">（2025年06月23日 制定）</p>
        </div>
      </div>
    )
  }