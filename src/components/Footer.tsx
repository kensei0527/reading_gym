// src/components/Footer.tsx

import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-100 dark:bg-gray-800 mt-auto">
      <div className="container mx-auto px-4 py-6 text-center text-gray-600 dark:text-gray-400 text-sm">
        <nav className="flex justify-center gap-4 mb-4">
          <Link href="/terms" className="hover:underline">利用規約</Link>
          <Link href="/privacy" className="hover:underline">プライバシーポリシー</Link>
          <Link href="/contact" className="hover:underline">お問い合わせ</Link>
        </nav>
        <p>&copy; {currentYear} My Reading Gym. All Rights Reserved.</p>
      </div>
    </footer>
  )
}