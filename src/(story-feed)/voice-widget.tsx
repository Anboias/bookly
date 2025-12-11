'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Character } from '@/data/stories'
import { getVoiceId } from '@/config/voice-mapping'
import { cn } from '@/utils/utils'
import { Mic, MicOff, X, Loader2, Volume2 } from 'lucide-react'

interface VoiceWidgetProps {
	character: Character
	onClose: () => void
}

type ConversationState = 'idle' | 'connecting' | 'listening' | 'speaking' | 'error'

const VoiceWidget = ({ character, onClose }: VoiceWidgetProps) => {
	const [state, setState] = useState<ConversationState>('idle')
	const [showIntro, setShowIntro] = useState(true)
	const [errorMessage, setErrorMessage] = useState<string>('')
	const [isPlayingIntro, setIsPlayingIntro] = useState(false)
	
	const conversationRef = useRef<any>(null)
	const audioContextRef = useRef<AudioContext | null>(null)
	const audioRef = useRef<HTMLAudioElement | null>(null)
	
	// Get the voice ID for this character
	const voiceId = getVoiceId(character.age, character.gender)
	
	// Initialize audio context
	useEffect(() => {
		audioContextRef.current = new AudioContext()
		return () => {
			audioContextRef.current?.close()
		}
	}, [])
	
	// Auto-play introduction when character changes
	useEffect(() => {
		// Automatically play introduction
		const timer = setTimeout(() => {
			playIntroduction()
		}, 300) // Small delay to let component mount
		
		// Cleanup: stop any playing audio when component unmounts or character changes
		return () => {
			clearTimeout(timer)
			if (audioRef.current) {
				audioRef.current.pause()
				audioRef.current = null
			}
			setIsPlayingIntro(false)
		}
	}, [character.id])
	
	const playIntroduction = async () => {
		try {
			console.log('🎵 Starting playIntroduction for', character.name)
			setIsPlayingIntro(true)
			
			// Stop any currently playing audio
			if (audioRef.current) {
				audioRef.current.pause()
				audioRef.current.currentTime = 0
				audioRef.current = null
			}
			
			console.log('🎵 Fetching audio from /api/tts...')
			// Call our backend API to generate the introduction audio
			const response = await fetch('/api/tts', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					text: character.introduction,
					voiceId: voiceId
				})
			})
			
			console.log('🎵 Response status:', response.status)
			
			if (!response.ok) {
				const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
				console.error('❌ Failed to generate introduction audio:', response.status, errorData)
				setIsPlayingIntro(false)
				return
			}
			
			const audioBlob = await response.blob()
			console.log('🎵 Blob size:', audioBlob.size, 'bytes, type:', audioBlob.type)
			
			// Check if blob is valid
			if (audioBlob.size === 0) {
				console.error('❌ Received empty audio blob')
				setIsPlayingIntro(false)
				return
			}
			
			const audioUrl = URL.createObjectURL(audioBlob)
			console.log('🎵 Created audio URL:', audioUrl)
			const audio = new Audio(audioUrl)
			
			// Store reference to current audio
			audioRef.current = audio
			
			// Play with error handling
			console.log('🎵 Attempting to play audio...')
			try {
				await audio.play()
				console.log('✅ Audio playing successfully!')
			} catch (playError: any) {
				// If autoplay is blocked, that's OK - user can click the button
				if (playError.name === 'NotAllowedError') {
					console.log('ℹ️ Autoplay blocked by browser - user can click play button')
				} else {
					console.error('❌ Error playing audio:', playError)
				}
				URL.revokeObjectURL(audioUrl)
				audioRef.current = null
				setIsPlayingIntro(false)
				return
			}
			
			audio.onended = () => {
				console.log('🎵 Audio playback ended')
				URL.revokeObjectURL(audioUrl)
				audioRef.current = null
				setIsPlayingIntro(false)
			}
			
			// Also clean up on error
			audio.onerror = (e) => {
				console.error('❌ Audio element error:', e)
				URL.revokeObjectURL(audioUrl)
				audioRef.current = null
				setIsPlayingIntro(false)
			}
		} catch (error) {
			console.error('❌ Error playing introduction:', error)
			setIsPlayingIntro(false)
		}
	}
	
	const handlePlayIntroduction = () => {
		console.log('🎯 Play button clicked for', character.name)
		playIntroduction()
	}
	
	const handleStartConversation = async () => {
		setState('connecting')
		setShowIntro(false)
		setErrorMessage('')
		
		try {
			// Get a signed URL from our backend API
			// This keeps the API key secure on the server
			const tokenResponse = await fetch('/api/conversation/token', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					agentId: voiceId // This should be the actual agent ID from ElevenLabs dashboard
				})
			})

			if (!tokenResponse.ok) {
				throw new Error('Failed to get conversation token')
			}

			const { signedUrl } = await tokenResponse.json()

			// Dynamically import ElevenLabs to avoid SSR issues
			const { Conversation } = await import('@elevenlabs/client')
			
			// Initialize ElevenLabs Conversation using the signed URL
			// This way the client never sees the API key
			const conversation = await Conversation.startSession({
				signedUrl: signedUrl,
				onConnect: () => {
					console.log('Connected to ElevenLabs')
					setState('listening')
				},
				onDisconnect: () => {
					console.log('Disconnected from ElevenLabs')
					setState('idle')
				},
				onError: (message: string) => {
					console.error('Conversation error:', message)
					setErrorMessage('Connection error. Please try again.')
					setState('error')
				},
				onModeChange: ({ mode }: { mode: string }) => {
					// Mode can be 'speaking' or 'listening'
					setState(mode === 'speaking' ? 'speaking' : 'listening')
				}
			} as any) // Type assertion for now until package is installed
			
			conversationRef.current = conversation
			
		} catch (error) {
			console.error('Error starting conversation:', error)
			setErrorMessage('Failed to start conversation. Please try again.')
			setState('error')
		}
	}
	
	const handleStopConversation = useCallback(async () => {
		// Stop any playing introduction audio
		if (audioRef.current) {
			audioRef.current.pause()
			audioRef.current.currentTime = 0
			audioRef.current = null
		}
		
		// End conversation session
		if (conversationRef.current) {
			try {
				await conversationRef.current.endSession()
			} catch (error) {
				console.error('Error ending conversation:', error)
			}
			conversationRef.current = null
		}
		
		setState('idle')
		setShowIntro(true)
	}, [])
	
	// Cleanup on unmount - stop all audio and conversations
	useEffect(() => {
		return () => {
			// Stop any ongoing conversation
			if (conversationRef.current) {
				conversationRef.current.endSession()
				conversationRef.current = null
			}
			
			// Stop any playing introduction audio
			if (audioRef.current) {
				audioRef.current.pause()
				audioRef.current.currentTime = 0
				audioRef.current = null
			}
		}
	}, [])

	return (
		<div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
			{/* Intro bubble */}
			{showIntro && state === 'idle' && (
				<div className="max-w-[320px] bg-card/95 backdrop-blur-md rounded-2xl rounded-br-sm p-4 shadow-xl border border-border animate-in slide-in-from-bottom-2 fade-in duration-300">
					<p className="text-sm text-foreground leading-relaxed">
						"{character.introduction}"
					</p>
					<p className="text-xs text-muted-foreground mt-2 flex items-center justify-between">
						<span>— {character.name}</span>
						{!isPlayingIntro && (
							<button
								onClick={handlePlayIntroduction}
								className="ml-3 text-primary hover:text-primary/80 transition-colors"
								title="Play introduction"
							>
								<Volume2 className="w-4 h-4" />
							</button>
						)}
						{isPlayingIntro && (
							<span className="ml-3 flex items-center gap-1 text-primary">
								<Volume2 className="w-4 h-4 animate-pulse" />
								<span className="text-xs">Playing...</span>
							</span>
						)}
					</p>
				</div>
			)}
			
			{/* Error message */}
			{state === 'error' && errorMessage && (
				<div className="max-w-[320px] bg-destructive/10 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-destructive/50 animate-in slide-in-from-bottom-2 fade-in duration-300">
					<p className="text-sm text-destructive leading-relaxed">
						{errorMessage}
					</p>
				</div>
			)}
			
			{/* Status indicator */}
			{state !== 'idle' && state !== 'error' && (
				<div className="bg-card/90 backdrop-blur-md rounded-full px-4 py-2 shadow-lg border border-border animate-in fade-in duration-200">
					<p className="text-sm text-foreground flex items-center gap-2">
						{state === 'connecting' && (
							<>
								<Loader2 className="w-4 h-4 animate-spin text-primary" />
								Connecting...
							</>
						)}
						{state === 'listening' && (
							<>
								<span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
								Listening...
							</>
						)}
						{state === 'speaking' && (
							<>
								<Volume2 className="w-4 h-4 text-primary animate-pulse" />
								{character.name} is speaking...
							</>
						)}
					</p>
				</div>
			)}
			
			{/* Main floating widget */}
			<div className="relative">
				{/* Pulse rings when active */}
				{(state === 'listening' || state === 'speaking') && (
					<>
						<div className="absolute inset-0 rounded-full bg-primary/30 animate-pulse-ring" />
						<div 
							className="absolute inset-0 rounded-full bg-primary/20 animate-pulse-ring" 
							style={{ animationDelay: '0.5s' }}
						/>
					</>
				)}
				
				{/* Widget button */}
				<button
					onClick={state === 'idle' || state === 'error' ? handleStartConversation : handleStopConversation}
					disabled={state === 'connecting'}
					className={cn(
						'relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden',
						'shadow-2xl transition-all duration-300',
						'ring-2 ring-offset-2 ring-offset-background',
						'disabled:opacity-50 disabled:cursor-not-allowed',
						state === 'idle' || state === 'error'
							? 'ring-primary hover:scale-110' 
							: 'ring-primary animate-glow'
					)}
				>
					<img
						src={character.avatar}
						alt={character.name}
						className="w-full h-full object-cover bg-secondary"
					/>
					
					{/* Overlay icon */}
					<div 
						className={cn(
							'absolute inset-0 flex items-center justify-center transition-opacity duration-200',
							'bg-background/60 backdrop-blur-sm',
							state === 'idle' || state === 'error' ? 'opacity-0 hover:opacity-100' : 'opacity-100'
						)}
					>
						{(state === 'idle' || state === 'error') && <Mic className="w-6 h-6 text-primary" />}
						{state === 'connecting' && <Loader2 className="w-6 h-6 text-primary animate-spin" />}
						{state === 'listening' && <Mic className="w-6 h-6 text-green-400" />}
						{state === 'speaking' && <MicOff className="w-6 h-6 text-primary" />}
					</div>
				</button>
				
				{/* Close button */}
				<button
					onClick={onClose}
					className="absolute -top-2 -right-2 w-6 h-6 bg-secondary rounded-full flex items-center justify-center shadow-lg hover:bg-muted transition-colors"
				>
					<X className="w-4 h-4 text-muted-foreground" />
				</button>
			</div>
		</div>
	)
}

export default VoiceWidget
