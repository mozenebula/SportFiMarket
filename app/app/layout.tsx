import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SportFi Market - 加密体育预测市场',
  description: '基于全同态加密技术的去中心化体育预测市场',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}

