'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import type { Post } from '@/types/post'
import { BookViewer } from './book-viewer'

interface FeedContainerProps {
	posts: Post[]
}

export function FeedContainer({ posts }: FeedContainerProps) {
	const [currentIndex, setCurrentIndex] = useState(0)
	const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set())
	const [bookmarkedPosts, setBookmarkedPosts] = useState<Set<string>>(
		new Set()
	)
	const containerRef = useRef<HTMLDivElement>(null)
	const isScrolling = useRef(false)
	const touchStartY = useRef<number>(0)
	const touchEndY = useRef<number>(0)

	const handleLike = useCallback((postId: string) => {
		setLikedPosts((prev) => {
			const next = new Set(prev)
			if (next.has(postId)) {
				next.delete(postId)
			} else {
				next.add(postId)
			}
			return next
		})
	}, [])

	const handleBookmark = useCallback((postId: string) => {
		setBookmarkedPosts((prev) => {
			const next = new Set(prev)
			if (next.has(postId)) {
				next.delete(postId)
			} else {
				next.add(postId)
			}
			return next
		})
	}, [])

	const scrollToIndex = useCallback(
		(index: number) => {
			if (isScrolling.current || index < 0 || index >= posts.length) {
				return
			}

			isScrolling.current = true
			setCurrentIndex(index)

			const container = containerRef.current
			if (container) {
				const targetElement = container.children[index] as HTMLElement
				if (targetElement) {
					targetElement.scrollIntoView({
						behavior: 'smooth',
						block: 'start',
					})
				}
			}

			setTimeout(() => {
				isScrolling.current = false
			}, 500)
		},
		[posts.length]
	)

	const handleScroll = useCallback(() => {
		if (isScrolling.current) return

		const container = containerRef.current
		if (!container) return

		const scrollPosition = container.scrollTop
		const itemHeight = window.innerHeight
		const newIndex = Math.round(scrollPosition / itemHeight)

		if (newIndex !== currentIndex && newIndex >= 0 && newIndex < posts.length) {
			setCurrentIndex(newIndex)
		}
	}, [currentIndex, posts.length])

	const handleTouchStart = useCallback((e: React.TouchEvent) => {
		touchStartY.current = e.touches[0].clientY
	}, [])

	const handleTouchMove = useCallback((e: React.TouchEvent) => {
		touchEndY.current = e.touches[0].clientY
	}, [])

	const handleTouchEnd = useCallback(() => {
		const diff = touchStartY.current - touchEndY.current
		const minSwipeDistance = 100

		if (Math.abs(diff) > minSwipeDistance) {
			if (diff > 0 && currentIndex < posts.length - 1) {
				// Swipe up - next post
				scrollToIndex(currentIndex + 1)
			} else if (diff < 0 && currentIndex > 0) {
				// Swipe down - previous post
				scrollToIndex(currentIndex - 1)
			}
		}
	}, [currentIndex, posts.length, scrollToIndex])

	const handleKeyDown = useCallback(
		(e: KeyboardEvent) => {
			if (e.key === 'ArrowUp' && currentIndex > 0) {
				e.preventDefault()
				scrollToIndex(currentIndex - 1)
			} else if (e.key === 'ArrowDown' && currentIndex < posts.length - 1) {
				e.preventDefault()
				scrollToIndex(currentIndex + 1)
			}
		},
		[currentIndex, posts.length, scrollToIndex]
	)

	useEffect(() => {
		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [handleKeyDown])

	useEffect(() => {
		const container = containerRef.current
		if (container) {
			container.addEventListener('scroll', handleScroll, { passive: true })
			return () => container.removeEventListener('scroll', handleScroll)
		}
	}, [handleScroll])

	return (
		<div className="relative h-screen w-full overflow-hidden">
			{/* Scroll Container */}
			<div
				ref={containerRef}
				className="h-full w-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
				onTouchStart={handleTouchStart}
				onTouchMove={handleTouchMove}
				onTouchEnd={handleTouchEnd}
				style={{
					scrollBehavior: 'smooth',
					scrollSnapType: 'y mandatory',
				}}
			>
				{posts.map((post, index) => (
					<BookViewer
						key={post.id}
						postId={post.id}
						excerpt={post.excerpt}
						imageUrl={post.imageUrl}
						caption={post.caption}
						username={post.username}
						userAvatar={post.userAvatar}
						likes={post.likes}
						comments={post.comments}
						shares={post.shares}
						isLiked={likedPosts.has(post.id)}
						isBookmarked={bookmarkedPosts.has(post.id)}
						onLike={() => handleLike(post.id)}
						onBookmark={() => handleBookmark(post.id)}
						onComment={() => {
							// TODO: Implement comment modal
							console.log('Comment on', post.id)
						}}
						onShare={() => {
							// TODO: Implement share functionality
							console.log('Share', post.id)
						}}
					/>
				))}
			</div>

			{/* Desktop Arrow Navigation - Fixed position outside content area */}
			<div className="pointer-events-none fixed right-4 top-1/2 z-30 hidden -translate-y-1/2 md:flex">
				<div className="pointer-events-auto flex flex-col gap-4">
					<button
						onClick={() => scrollToIndex(currentIndex - 1)}
						disabled={currentIndex === 0}
						className="flex h-14 w-14 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm transition-all hover:bg-black/80 disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
						aria-label="Previous post"
					>
						<svg
							className="h-6 w-6 fill-none stroke-amber-400"
							viewBox="0 0 24 24"
							strokeWidth={2.5}
						>
							<polyline points="18 15 12 9 6 15" />
						</svg>
					</button>
					<button
						onClick={() => scrollToIndex(currentIndex + 1)}
						disabled={currentIndex === posts.length - 1}
						className="flex h-14 w-14 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm transition-all hover:bg-black/80 disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
						aria-label="Next post"
					>
						<svg
							className="h-6 w-6 fill-none stroke-amber-400"
							viewBox="0 0 24 24"
							strokeWidth={2.5}
						>
							<polyline points="6 9 12 15 18 9" />
						</svg>
					</button>
				</div>
			</div>
		</div>
	)
}

