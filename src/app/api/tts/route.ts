import { NextRequest, NextResponse } from 'next/server'

/**
 * Text-to-Speech API endpoint
 * Generates audio for character introductions
 */
export async function POST(request: NextRequest) {
	try {
		const { text, voiceId } = await request.json()

		if (!text || !voiceId) {
			return NextResponse.json(
				{ error: 'Text and voiceId are required' },
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

		// Call ElevenLabs text-to-speech API
		const response = await fetch(
			`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
			{
				method: 'POST',
				headers: {
					'Accept': 'audio/mpeg',
					'Content-Type': 'application/json',
					'xi-api-key': apiKey
				},
				body: JSON.stringify({
					text: text,
					model_id: 'eleven_monolingual_v1',
					voice_settings: {
						stability: 0.5,
						similarity_boost: 0.75
					}
				})
			}
		)

		if (!response.ok) {
			const errorText = await response.text()
			console.error('ElevenLabs TTS error:', errorText)
			return NextResponse.json(
				{ error: 'Failed to generate audio' },
				{ status: response.status }
			)
		}

		// Get the audio blob
		const audioBlob = await response.blob()
		
		// Return the audio data
		return new NextResponse(audioBlob, {
			headers: {
				'Content-Type': 'audio/mpeg',
				'Cache-Control': 'public, max-age=31536000, immutable'
			}
		})

	} catch (error) {
		console.error('Error generating audio:', error)
		return NextResponse.json(
			{ error: 'Failed to generate audio' },
			{ status: 500 }
		)
	}
}
