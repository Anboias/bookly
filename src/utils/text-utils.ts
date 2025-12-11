import type { BookPage } from '@/types/post'

/**
 * Splits text into pages of approximately 50 words each
 */
export function splitTextIntoPages(
	text: string,
	wordsPerPage: number = 50
): string[] {
	const words = text.trim().split(/\s+/)
	const pages: string[] = []

	for (let i = 0; i < words.length; i += wordsPerPage) {
		const pageWords = words.slice(i, i + wordsPerPage)
		pages.push(pageWords.join(' '))
	}

	return pages
}

/**
 * Generates a unique background image URL for each page
 */
export function generatePageBackgroundImage(
	bookId: string,
	pageIndex: number
): string {
	// Using placeholder service with unique seeds
	const seed = `${bookId}-${pageIndex}`
	return `https://placehold.co/800x1200/1a1a1a/ffffff?text=Page+${pageIndex + 1}&font=playfair`
}

/**
 * Creates BookPage objects from text
 */
export function createBookPages(
	bookId: string,
	text: string
): BookPage[] {
	const pageTexts = splitTextIntoPages(text)
	return pageTexts.map((text, index) => ({
		id: `${bookId}-page-${index}`,
		text,
		backgroundImage: generatePageBackgroundImage(bookId, index),
	}))
}

