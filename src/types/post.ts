export interface Post {
	id: string
	username: string
	userAvatar: string
	caption: string
	imageUrl: string
	excerpt: string
	likes: number
	comments: number
	shares: number
	isLiked: boolean
	isBookmarked: boolean
}

export interface BookPage {
	id: string
	text: string
	backgroundImage: string
	audioUrl?: string
}

