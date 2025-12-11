import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import './globals.css'

const playfairDisplay = Playfair_Display({
	variable: '--font-display',
	subsets: ['latin'],
	weight: ['400', '500', '600', '700'],
	display: 'swap',
})

const inter = Inter({
	variable: '--font-body',
	subsets: ['latin'],
	weight: ['300', '400', '500', '600', '700'],
	display: 'swap',
})

export const metadata: Metadata = {
	title: 'Bookly — Stories That Come Alive',
	description: 'Experience books in a new way with immersive reading',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en" className="dark">
			<body
				className={`${playfairDisplay.variable} ${inter.variable} antialiased`}
			>
				{children}
			</body>
		</html>
	)
}
