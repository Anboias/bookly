import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
	try {
		const { voiceId, characterPrompt, characterIntroduction } = await request.json()

		if (!voiceId || !characterPrompt || !characterIntroduction) {
			return NextResponse.json(
				{ error: 'Missing required parameters' },
				{ status: 400 }
			)
		}

		const apiKey = process.env.ELEVENLABS_API_KEY
		if (!apiKey) {
			console.error('ElevenLabs API key not configured')
			return NextResponse.json(
				{ error: 'Server configuration error' },
				{ status: 500 }
			)
		}

		// Import ElevenLabs SDK
		const { Conversation } = await import('@elevenlabs/client')

		// Create a session with ElevenLabs
		// Note: This creates a session but the actual WebSocket connection
		// needs to be handled on the client side for real-time audio
		const conversation = await Conversation.startSession({
			agentId: voiceId,
			apiKey: apiKey
		} as any)

		// Return session info to the client
		return NextResponse.json({
			success: true,
			sessionId: 'session-created',
			message: 'Conversation session initiated'
		})

	} catch (error) {
		console.error('Error starting conversation:', error)
		return NextResponse.json(
			{ error: 'Failed to start conversation' },
			{ status: 500 }
		)
	}
}
