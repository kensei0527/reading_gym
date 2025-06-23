// src/app/contact/page.tsx
export default function ContactPage() {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center">
        <h1 className="text-3xl font-bold mb-6">お問い合わせ</h1>
        <div className="space-y-4 text-gray-700">
          <p>サービスに関するご質問、フィードバック、不具合のご報告などは、以下の連絡先までお願いいたします。</p>
          <p className="font-semibold pt-4">連絡先:</p>
          <a href="mailto:[smash268kensei@gmail.com]" className="text-blue-500 hover:underline">
            [smash268kensei@gmail.com]
          </a>
          <p className="text-sm mt-2">https://x.com/Aharaya_dev</p>
        </div>
      </div>
    )
  }