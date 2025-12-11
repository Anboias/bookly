import { FeedContainer } from '@/components/feed-container'
import { rawPosts } from '@/data/mock-posts'
import StoryFeed from '@/(story-feed)/story-feed'

export default function Home() {
	return (
		<main className="h-screen w-full overflow-hidden bg-black">
			<div className="mx-auto h-full w-full max-w-md md:max-w-lg">
				{/* <FeedContainer posts={rawPosts} /> */}
				<StoryFeed />
			</div>
		</main>
	)
}
