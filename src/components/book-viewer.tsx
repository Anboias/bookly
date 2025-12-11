'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import type { BookPage } from '@/types/post'
import { createBookPages } from '@/utils/text-utils'

interface BookViewerProps {
	postId: string
	excerpt: string
	imageUrl: string
	caption: string
	username: string
	userAvatar: string
	likes: number
	comments: number
	shares: number
	isLiked: boolean
	isBookmarked: boolean
	onLike: () => void
	onBookmark: () => void
	onComment: () => void
	onShare: () => void
}

export function BookViewer({
	postId,
	excerpt,
	imageUrl,
	caption,
	username,
	userAvatar,
	likes,
	comments,
	shares,
	isLiked,
	isBookmarked,
	onLike,
	onBookmark,
	onComment,
	onShare,
}: BookViewerProps) {
	const [pages] = useState<BookPage[]>(() =>
		createBookPages(postId, excerpt)
	)
	const [currentPageIndex, setCurrentPageIndex] = useState(0)
	const [currentWordIndex, setCurrentWordIndex] = useState(0)
	const [isPlaying, setIsPlaying] = useState(false)
	const containerRef = useRef<HTMLDivElement>(null)
	const touchStartX = useRef<number>(0)
	const touchEndX = useRef<number>(0)

	const currentPage = pages[currentPageIndex]
	const words = currentPage?.text.split(/\s+/) || []

	// Simulate audio playback with word highlighting
	useEffect(() => {
		if (!isPlaying || words.length === 0) return

		const interval = setInterval(() => {
			setCurrentWordIndex((prev) => {
				if (prev >= words.length - 1) {
					setIsPlaying(false)
					return prev
				}
				return prev + 1
			})
		}, 200) // Adjust speed as needed

		return () => clearInterval(interval)
	}, [isPlaying, words.length])

	// Auto-play when page changes
	useEffect(() => {
		setCurrentWordIndex(0)
		setIsPlaying(true)
	}, [currentPageIndex])

	const handleTouchStart = useCallback((e: React.TouchEvent) => {
		touchStartX.current = e.touches[0].clientX
	}, [])

	const handleTouchMove = useCallback((e: React.TouchEvent) => {
		touchEndX.current = e.touches[0].clientX
	}, [])

	const handleTouchEnd = useCallback(() => {
		const diff = touchStartX.current - touchEndX.current
		const minSwipeDistance = 50

		if (Math.abs(diff) > minSwipeDistance) {
			if (diff > 0 && currentPageIndex < pages.length - 1) {
				// Swipe left - next page
				setCurrentPageIndex((prev) => prev + 1)
			} else if (diff < 0 && currentPageIndex > 0) {
				// Swipe right - previous page
				setCurrentPageIndex((prev) => prev - 1)
			}
		}
	}, [currentPageIndex, pages.length])

	const handleKeyDown = useCallback(
		(e: KeyboardEvent) => {
			if (e.key === 'ArrowLeft' && currentPageIndex > 0) {
				setCurrentPageIndex((prev) => prev - 1)
			} else if (
				e.key === 'ArrowRight' &&
				currentPageIndex < pages.length - 1
			) {
				setCurrentPageIndex((prev) => prev + 1)
			}
		},
		[currentPageIndex, pages.length]
	)

	useEffect(() => {
		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [handleKeyDown])

	const renderWord = (word: string, index: number) => {
		if (index < currentWordIndex) {
			// Previous words - visible
			return (
				<span key={index} className="text-amber-50/90">
					{word}{' '}
				</span>
			)
		} else if (index === currentWordIndex) {
			// Current word - highlighted
			return (
				<span
					key={index}
					className="bg-amber-400/30 text-amber-50 px-1 rounded underline decoration-amber-400/50"
				>
					{word}{' '}
				</span>
			)
		} else {
			// Upcoming words - transparent
			return (
				<span key={index} className="text-amber-50/20">
					{word}{' '}
				</span>
			)
		}
	}

	return (
		<div
			ref={containerRef}
			className="relative h-screen w-full overflow-hidden"
			style={{ scrollSnapAlign: 'start', scrollSnapStop: 'always' }}
			onTouchStart={handleTouchStart}
			onTouchMove={handleTouchMove}
			onTouchEnd={handleTouchEnd}
		>
			{/* Background Image */}
			<div
				className="absolute inset-0 bg-cover bg-center bg-no-repeat"
				style={{
					backgroundImage: `url(${currentPage.backgroundImage})`,
				}}
			>
				<div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
			</div>

			{/* Content */}
			<div className="relative z-10 flex h-full flex-col p-6 md:p-8">
				{/* Header */}
				<div className="mb-4 flex items-center gap-3">
					<img
						src={userAvatar}
						alt={username}
						className="h-10 w-10 rounded-full border-2 border-amber-400/30"
					/>
					<div>
						<p className="font-semibold text-amber-50">{username}</p>
						<p className="text-sm text-amber-50/70">{caption}</p>
					</div>
				</div>

				{/* Book Text */}
				<div className="flex-1 flex items-center justify-center">
					<div className="max-w-2xl px-6 py-8">
						<p
							className="text-2xl md:text-3xl leading-relaxed text-amber-50"
							style={{ fontFamily: 'var(--font-display)' }}
						>
							{words.map((word, index) => renderWord(word, index))}
						</p>
					</div>
				</div>

				{/* Page Indicator */}
				<div className="mt-4 flex justify-center gap-2">
					{pages.map((_, index) => (
						<button
							key={index}
							onClick={() => setCurrentPageIndex(index)}
							className={`h-1.5 rounded-full transition-all ${
								index === currentPageIndex
									? 'w-8 bg-amber-400'
									: 'w-1.5 bg-amber-400/30'
							}`}
							aria-label={`Go to page ${index + 1}`}
						/>
					))}
				</div>
			</div>

			{/* Action Buttons - Mobile */}
			<div className="absolute bottom-6 right-6 z-20 flex flex-col gap-3 md:hidden">
				<button
					onClick={onLike}
					className="flex h-12 w-12 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm transition-all hover:bg-black/60 active:scale-95"
					aria-label={isLiked ? 'Unlike' : 'Like'}
				>
					<svg
						className={`h-6 w-6 ${
							isLiked ? 'fill-red-500' : 'fill-none'
						} stroke-amber-50`}
						viewBox="0 0 24 24"
						strokeWidth={2}
					>
						<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
					</svg>
				</button>
				<button
					onClick={onComment}
					className="flex h-12 w-12 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm transition-all hover:bg-black/60 active:scale-95"
					aria-label="Comment"
				>
					<svg
						className="h-6 w-6 fill-none stroke-amber-50"
						viewBox="0 0 24 24"
						strokeWidth={2}
					>
						<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
					</svg>
				</button>
				<button
					onClick={onBookmark}
					className="flex h-12 w-12 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm transition-all hover:bg-black/60 active:scale-95"
					aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark'}
				>
					<svg
						className={`h-6 w-6 ${
							isBookmarked ? 'fill-amber-400' : 'fill-none'
						} stroke-amber-50`}
						viewBox="0 0 24 24"
						strokeWidth={2}
					>
						<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
					</svg>
				</button>
				<button
					onClick={onShare}
					className="flex h-12 w-12 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm transition-all hover:bg-black/60 active:scale-95"
					aria-label="Share"
				>
					<svg
						className="h-6 w-6 fill-none stroke-amber-50"
						viewBox="0 0 24 24"
						strokeWidth={2}
					>
						<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
						<polyline points="16 6 12 2 8 6" />
						<line x1="12" y1="2" x2="12" y2="15" />
					</svg>
				</button>
			</div>

			{/* Action Buttons - Desktop */}
			<div className="absolute bottom-8 right-8 z-20 hidden flex-col gap-4 md:flex">
				<button
					onClick={onLike}
					className="group flex items-center gap-3 rounded-full bg-black/40 px-4 py-3 backdrop-blur-sm transition-all hover:bg-black/60"
					aria-label={isLiked ? 'Unlike' : 'Like'}
				>
					<svg
						className={`h-5 w-5 ${
							isLiked ? 'fill-red-500' : 'fill-none'
						} stroke-amber-50`}
						viewBox="0 0 24 24"
						strokeWidth={2}
					>
						<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
					</svg>
					<span className="text-amber-50 font-medium">{likes}</span>
				</button>
				<button
					onClick={onComment}
					className="group flex items-center gap-3 rounded-full bg-black/40 px-4 py-3 backdrop-blur-sm transition-all hover:bg-black/60"
					aria-label="Comment"
				>
					<svg
						className="h-5 w-5 fill-none stroke-amber-50"
						viewBox="0 0 24 24"
						strokeWidth={2}
					>
						<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
					</svg>
					<span className="text-amber-50 font-medium">{comments}</span>
				</button>
				<button
					onClick={onBookmark}
					className="group flex items-center gap-3 rounded-full bg-black/40 px-4 py-3 backdrop-blur-sm transition-all hover:bg-black/60"
					aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark'}
				>
					<svg
						className={`h-5 w-5 ${
							isBookmarked ? 'fill-amber-400' : 'fill-none'
						} stroke-amber-50`}
						viewBox="0 0 24 24"
						strokeWidth={2}
					>
						<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
					</svg>
					<span className="text-amber-50 font-medium">Save</span>
				</button>
				<button
					onClick={onShare}
					className="group flex items-center gap-3 rounded-full bg-black/40 px-4 py-3 backdrop-blur-sm transition-all hover:bg-black/60"
					aria-label="Share"
				>
					<svg
						className="h-5 w-5 fill-none stroke-amber-50"
						viewBox="0 0 24 24"
						strokeWidth={2}
					>
						<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
						<polyline points="16 6 12 2 8 6" />
						<line x1="12" y1="2" x2="12" y2="15" />
					</svg>
					<span className="text-amber-50 font-medium">{shares}</span>
				</button>
			</div>
		</div>
	)
}

