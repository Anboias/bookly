/**
 * Voice ID mapping based on age and gender combinations
 * Maps to ElevenLabs voice IDs
 */

export type AgeCategory = 'child' | 'teenager' | 'young-adult' | 'adult' | 'middle-aged' | 'old'
export type Gender = 'male' | 'female' | 'neutral'

export interface VoiceMapping {
	voiceId: string
	name: string
	description: string
}

/**
 * ElevenLabs Voice ID Mapping
 * Format: `${age}-${gender}`
 * 
 * NOTE: Replace these with actual ElevenLabs voice IDs from your account
 * You can get voice IDs from: https://elevenlabs.io/app/voice-library
 */
export const VOICE_MAPPING: Record<string, VoiceMapping> = {
	// Children voices
	'child-male': {
		voiceId: 'pNInz6obpgDQGcFmaJgB', // Adam (ElevenLabs default)
		name: 'Child Male',
		description: 'Young boy voice'
	},
	'child-female': {
		voiceId: 'EXAVITQu4vr4xnSDxMaL', // Bella (ElevenLabs default)
		name: 'Child Female',
		description: 'Young girl voice'
	},
	
	// Teenager voices
	'teenager-male': {
		voiceId: 'ErXwobaYiN019PkySvjV', // Antoni (ElevenLabs default)
		name: 'Teenager Male',
		description: 'Teenage boy voice'
	},
	'teenager-female': {
		voiceId: 'EXAVITQu4vr4xnSDxMaL', // Bella
		name: 'Teenager Female',
		description: 'Teenage girl voice'
	},
	
	// Young adult voices
	'young-adult-male': {
		voiceId: 'VR6AewLTigWG4xSOukaG', // Arnold (ElevenLabs default)
		name: 'Young Adult Male',
		description: 'Young man voice'
	},
	'young-adult-female': {
		voiceId: 'MF3mGyEYCl7XYWbV9V6O', // Elli (ElevenLabs default)
		name: 'Young Adult Female',
		description: 'Young woman voice'
	},
	
	// Adult voices
	'adult-male': {
		voiceId: 'nPczCjzI2devNBz1zQrb', // Brian (ElevenLabs default)
		name: 'Adult Male',
		description: 'Adult man voice'
	},
	'adult-female': {
		voiceId: '21m00Tcm4TlvDq8ikWAM', // Rachel (ElevenLabs default)
		name: 'Adult Female',
		description: 'Adult woman voice'
	},
	
	// Middle-aged voices
	'middle-aged-male': {
		voiceId: 'yoZ06aMxZJJ28mfd3POQ', // Sam (ElevenLabs default)
		name: 'Middle-Aged Male',
		description: 'Middle-aged man voice'
	},
	'middle-aged-female': {
		voiceId: 'CwhRBWXzGAHq8TQ4Fs17', // Serena (ElevenLabs default)
		name: 'Middle-Aged Female',
		description: 'Middle-aged woman voice'
	},
	
	// Old voices
	'old-male': {
		voiceId: 'TxGEqnHWrfWFTfGW9XjX', // Josh (ElevenLabs default)
		name: 'Old Male',
		description: 'Elderly man voice'
	},
	'old-female': {
		voiceId: 'jsCqWAovK2LkecY7zXl4', // Freya (ElevenLabs default)
		name: 'Old Female',
		description: 'Elderly woman voice'
	}
}

/**
 * Get voice ID from age and gender
 */
export function getVoiceId(age: AgeCategory, gender: Gender): string {
	const key = `${age}-${gender}`
	const mapping = VOICE_MAPPING[key]
	
	if (!mapping) {
		console.warn(`No voice mapping found for ${key}, falling back to default`)
		return VOICE_MAPPING['adult-male'].voiceId
	}
	
	return mapping.voiceId
}
