import { NextRequest, NextResponse } from 'next/server'

/**
 * Generate a signed URL or token for ElevenLabs Conversational AI
 * This keeps the API key secure on the server side
 */
export async function POST(request: NextRequest) {
	try {
		const { agentId } = await request.json()

		if (!agentId) {
			return NextResponse.json(
				{ error: 'Agent ID is required' },
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

		// Call ElevenLabs API to get a signed URL or conversation token
		// This allows the client to connect without exposing the API key
		const response = await fetch(
			`https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${agentId}`,
			{
				method: 'GET',
				headers: {
					'xi-api-key': apiKey
				}
			}
		)

		if (!response.ok) {
			const errorText = await response.text()
			console.error('ElevenLabs API error:', errorText)
			return NextResponse.json(
				{ error: 'Failed to generate conversation token' },
				{ status: response.status }
			)
		}

		const data = await response.json()

		return NextResponse.json({
			success: true,
			signedUrl: data.signed_url,
			agentId: agentId
		})

	} catch (error) {
		console.error('Error generating conversation token:', error)
		return NextResponse.json(
			{ error: 'Failed to generate conversation token' },
			{ status: 500 }
		)
	}
}
