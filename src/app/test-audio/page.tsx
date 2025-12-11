'use client'

import { useState } from 'react'
import { Volume2 } from 'lucide-react'

export default function TestAudioPage() {
	const [isPlaying, setIsPlaying] = useState(false)
	const [error, setError] = useState('')
	const [logs, setLogs] = useState<string[]>([])

	const addLog = (message: string) => {
		console.log(message)
		setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
	}

	const testAudio = async () => {
		setIsPlaying(true)
		setError('')
		setLogs([])
		addLog('Starting audio test...')

		try {
			addLog('Calling /api/tts endpoint...')
			const response = await fetch('/api/tts', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					text: 'Hello! This is a test of the text to speech system.',
					voiceId: '21m00Tcm4TlvDq8ikWAM' // Rachel voice
				})
			})

			addLog(`Response status: ${response.status}`)

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
				addLog(`Error from API: ${JSON.stringify(errorData)}`)
				setError(`API Error: ${errorData.error || 'Failed to generate audio'}`)
				setIsPlaying(false)
				return
			}

			addLog('Response OK, getting blob...')
			const audioBlob = await response.blob()
			addLog(`Blob size: ${audioBlob.size} bytes`)
			addLog(`Blob type: ${audioBlob.type}`)

			if (audioBlob.size === 0) {
				addLog('ERROR: Blob is empty!')
				setError('Empty audio blob received')
				setIsPlaying(false)
				return
			}

			addLog('Creating audio URL...')
			const audioUrl = URL.createObjectURL(audioBlob)
			addLog(`Audio URL: ${audioUrl}`)

			addLog('Creating Audio element...')
			const audio = new Audio(audioUrl)

			audio.onloadeddata = () => {
				addLog('Audio data loaded')
			}

			audio.oncanplay = () => {
				addLog('Audio can play')
			}

			audio.onplay = () => {
				addLog('Audio started playing')
			}

			audio.onended = () => {
				addLog('Audio playback ended')
				URL.revokeObjectURL(audioUrl)
				setIsPlaying(false)
			}

			audio.onerror = (e) => {
				addLog(`Audio error: ${JSON.stringify(e)}`)
				setError('Audio playback error')
				URL.revokeObjectURL(audioUrl)
				setIsPlaying(false)
			}

			addLog('Attempting to play audio...')
			await audio.play()
			addLog('Audio.play() succeeded!')

		} catch (error: any) {
			addLog(`Exception: ${error.message}`)
			setError(`Error: ${error.message}`)
			setIsPlaying(false)
		}
	}

	return (
		<div className="min-h-screen bg-background p-8">
			<div className="max-w-2xl mx-auto space-y-6">
				<h1 className="text-3xl font-bold">Audio Test Page</h1>
				
				<div className="space-y-4">
					<button
						onClick={testAudio}
						disabled={isPlaying}
						className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
					>
						<Volume2 className={isPlaying ? 'animate-pulse' : ''} />
						{isPlaying ? 'Playing...' : 'Test Audio'}
					</button>

					{error && (
						<div className="p-4 bg-destructive/10 border border-destructive rounded-lg">
							<p className="text-destructive font-semibold">Error:</p>
							<p className="text-destructive">{error}</p>
						</div>
					)}

					<div className="bg-card border rounded-lg p-4">
						<h2 className="font-semibold mb-2">Console Logs:</h2>
						<div className="space-y-1 max-h-96 overflow-y-auto">
							{logs.length === 0 ? (
								<p className="text-muted-foreground text-sm">No logs yet. Click the button to test.</p>
							) : (
								logs.map((log, i) => (
									<p key={i} className="text-xs font-mono">{log}</p>
								))
							)}
						</div>
					</div>
				</div>

				<div className="space-y-2 text-sm text-muted-foreground">
					<h2 className="font-semibold text-foreground">What this tests:</h2>
					<ul className="list-disc list-inside space-y-1">
						<li>Backend API endpoint (/api/tts)</li>
						<li>ElevenLabs API key configuration</li>
						<li>Audio blob generation</li>
						<li>Audio playback in browser</li>
					</ul>
				</div>

				<div className="space-y-2 text-sm">
					<h2 className="font-semibold">Troubleshooting:</h2>
					<ul className="list-disc list-inside space-y-1 text-muted-foreground">
						<li>If you see "Server configuration error" - add ELEVENLABS_API_KEY to .env.local</li>
						<li>If blob size is 0 - check your ElevenLabs API key</li>
						<li>If audio doesn't play - check browser console for errors</li>
						<li>Make sure you have audio enabled and volume up</li>
					</ul>
				</div>
			</div>
		</div>
	)
}
