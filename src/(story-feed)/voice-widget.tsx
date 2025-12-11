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
	const [state, setState] = useState<ConversationState>('connecting')
	const [errorMessage, setErrorMessage] = useState<string>('')
	
	const conversationRef = useRef<any>(null)
	const isStartingRef = useRef(false)
	
	// Get the voice ID for this character
	const voiceId = getVoiceId(character.age, character.gender)
	
	// Auto-start conversation when character changes
	useEffect(() => {
		console.log('🔄 Character changed to:', character.name)
		
		// First, cleanup any existing conversation immediately
		if (conversationRef.current) {
			console.log('🛑 Ending previous conversation before starting new one')
			try {
				conversationRef.current.endSession()
			} catch (error) {
				console.error('Error ending previous session:', error)
			}
			conversationRef.current = null
		}
		
		// Reset the starting flag
		isStartingRef.current = false
		
		// Start conversation automatically with a small delay
		const timer = setTimeout(() => {
			handleStartConversation()
		}, 300)
		
		// Cleanup: stop conversation when component unmounts or character changes
		return () => {
			console.log('🧹 Cleanup triggered for:', character.name)
			clearTimeout(timer)
			if (conversationRef.current) {
				try {
					conversationRef.current.endSession()
				} catch (error) {
					console.error('Error ending session on cleanup:', error)
				}
				conversationRef.current = null
			}
			isStartingRef.current = false
		}
	}, [character.id])
	
	const handleStartConversation = async () => {
		// Prevent multiple simultaneous starts
		if (isStartingRef.current || conversationRef.current) {
			console.log('⏭️ Conversation already starting or active')
			return
		}
		
		isStartingRef.current = true
		setState('connecting')
		setErrorMessage('')
		
		console.log('🎤 Starting conversation with', character.name)
		
		try {
			// Check if character has an agent ID configured
			if (!character.agentId) {
				const errorMsg = `${character.name} needs agent setup. See AGENT_SETUP_GUIDE.md`
				console.error('❌', errorMsg)
				throw new Error(errorMsg)
			}
			
			// Get a signed URL from our backend API
			// This keeps the API key secure on the server
			console.log('🔑 Requesting token for agent:', character.agentId)
			const tokenResponse = await fetch('/api/conversation/token', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					agentId: character.agentId // Use the actual ElevenLabs agent ID
				})
			})

			if (!tokenResponse.ok) {
				const errorData = await tokenResponse.json().catch(() => ({}))
				console.error('❌ Token failed:', errorData)
				throw new Error(errorData.error || 'Failed to get token')
			}

			const { signedUrl } = await tokenResponse.json()
			console.log('✅ Got signed URL')

			// Dynamically import ElevenLabs to avoid SSR issues
			console.log('📦 Loading ElevenLabs SDK...')
			const { Conversation } = await import('@elevenlabs/client')
			
			console.log('🔌 Initializing conversation session...')
			// Initialize ElevenLabs Conversation using the signed URL
			// This way the client never sees the API key
			const conversation = await Conversation.startSession({
				signedUrl: signedUrl,
				// Configure for faster, more natural conversation
				config: {
					// Faster turn detection - agent responds quicker after you stop speaking
					turnDetection: {
						type: 'server_vad', // Use server-side voice activity detection
						threshold: 0.5, // Lower = more sensitive (detects silence faster)
						prefix_padding_ms: 300, // How much audio before speech to include
						silence_duration_ms: 700 // How long to wait after speech stops (lower = faster response)
					}
				},
				onConnect: () => {
					console.log('✅ Connected - Character will now speak introduction')
					setState('speaking') // Start with speaking state
				},
				onDisconnect: () => {
					console.log('🔌 Disconnected from conversation')
					setState('connecting')
					isStartingRef.current = false
				},
				onError: (message: string) => {
					console.error('❌ Conversation error:', message)
					setErrorMessage(`Connection error: ${message}`)
					setState('error')
					isStartingRef.current = false
				},
				onModeChange: ({ mode }: { mode: string }) => {
					console.log('🔄 Mode changed to:', mode)
					// Mode can be 'speaking' or 'listening'
					setState(mode === 'speaking' ? 'speaking' : 'listening')
				},
				onMessage: (message: any) => {
					console.log('💬 Message:', message)
				},
				// Additional callbacks for better state tracking
				onUserTranscript: (transcript: any) => {
					console.log('🎤 You said:', transcript)
				},
				onAgentResponse: (response: any) => {
					console.log('🤖 Agent responding:', response)
					setState('speaking')
				},
				onStatusChange: (status: any) => {
					console.log('📊 Status changed:', status)
				}
			} as any) // Type assertion for now until package is installed
			
			conversationRef.current = conversation
			
		} catch (error) {
			console.error('❌ Error starting conversation:', error)
			setErrorMessage(`Failed to start: ${error instanceof Error ? error.message : 'Unknown error'}`)
			setState('error')
			isStartingRef.current = false
		}
	}
	
	const handleStopConversation = useCallback(async () => {
		console.log('🛑 Stopping conversation...')
		
		// End conversation session
		if (conversationRef.current) {
			try {
				await conversationRef.current.endSession()
				console.log('✅ Conversation ended')
			} catch (error) {
				console.error('❌ Error ending conversation:', error)
			}
			conversationRef.current = null
		}
		
		setState('connecting')
		isStartingRef.current = false
		
		// Restart the conversation after a brief pause
		setTimeout(() => {
			handleStartConversation()
		}, 500)
	}, [])
	
	// Cleanup on unmount - stop all conversations
	useEffect(() => {
		return () => {
			console.log('🧹 Cleaning up conversation on unmount')
			// Stop any ongoing conversation
			if (conversationRef.current) {
				try {
					conversationRef.current.endSession()
				} catch (error) {
					console.error('Error during unmount cleanup:', error)
				}
				conversationRef.current = null
			}
			isStartingRef.current = false
		}
	}, [])

	return (
		<div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
			{/* Error message */}
			{state === 'error' && errorMessage && (
				<div className="max-w-[320px] bg-destructive/10 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-destructive/50 animate-in slide-in-from-bottom-2 fade-in duration-300">
					<p className="text-sm text-destructive leading-relaxed">
						{errorMessage}
					</p>
					<button
						onClick={handleStartConversation}
						className="mt-2 text-xs text-primary hover:text-primary/80"
					>
						Try again
					</button>
				</div>
			)}
			
			{/* Status indicator */}
			{state !== 'error' && (
				<div className="bg-card/90 backdrop-blur-md rounded-full px-4 py-2 shadow-lg border border-border animate-in fade-in duration-200">
					<p className="text-sm text-foreground flex items-center gap-2">
						{state === 'connecting' && (
							<>
								<Loader2 className="w-4 h-4 animate-spin text-primary" />
								Connecting to {character.name}...
							</>
						)}
						{state === 'listening' && (
							<>
								<Mic className="w-4 h-4 text-green-500 animate-pulse" />
								{character.name} is listening...
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
				
				{/* Widget button - restarts conversation when clicked */}
				<button
					onClick={handleStopConversation}
					disabled={state === 'connecting'}
					title={state === 'connecting' ? 'Connecting...' : 'Restart conversation'}
					className={cn(
						'relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden',
						'shadow-2xl transition-all duration-300',
						'ring-2 ring-offset-2 ring-offset-background',
						'disabled:opacity-50 disabled:cursor-not-allowed',
						state === 'error'
							? 'ring-destructive hover:scale-110' 
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
							state === 'connecting' ? 'opacity-100' : 'opacity-0 hover:opacity-100'
						)}
					>
						{state === 'connecting' && <Loader2 className="w-6 h-6 text-primary animate-spin" />}
						{state === 'listening' && <Mic className="w-6 h-6 text-green-400" />}
						{state === 'speaking' && <Volume2 className="w-6 h-6 text-primary" />}
						{state === 'error' && <X className="w-6 h-6 text-destructive" />}
					</div>
				</button>
				
				{/* Close button */}
				<button
					onClick={onClose}
					title="Close and stop conversation"
					className="absolute -top-2 -right-2 w-6 h-6 bg-secondary rounded-full flex items-center justify-center shadow-lg hover:bg-muted transition-colors"
				>
					<X className="w-4 h-4 text-muted-foreground" />
				</button>
			</div>
		</div>
	)
}

export default VoiceWidget
