# ElevenLabs Integration Setup

This guide will help you set up ElevenLabs Conversational AI for live character interactions.

## Prerequisites

1. **ElevenLabs Account**: Sign up at [elevenlabs.io](https://elevenlabs.io)
2. **API Key**: Get your API key from [ElevenLabs Settings](https://elevenlabs.io/app/settings/api-keys)

## Installation

Install the ElevenLabs SDK:

```bash
npm install @elevenlabs/client
```

## Environment Configuration

Create a `.env.local` file in the project root:

```env
ELEVENLABS_API_KEY=your_api_key_here
```

Replace `your_api_key_here` with your actual ElevenLabs API key.

⚠️ **Important**: 
- This is a **server-side only** variable (no `NEXT_PUBLIC_` prefix)
- Never commit your `.env.local` file to version control!
- The API key is only accessible from API routes, keeping it secure

## Voice Mapping

The application automatically maps character voices based on their age and gender:

- **Age categories**: child, teenager, young-adult, adult, middle-aged, old
- **Gender categories**: male, female, neutral

Voice IDs are configured in `/src/config/voice-mapping.ts`.

### Customizing Voices

To use custom voices from your ElevenLabs account:

1. Go to [ElevenLabs Voice Library](https://elevenlabs.io/app/voice-library)
2. Select or create voices you want to use
3. Copy the voice IDs
4. Update the `VOICE_MAPPING` object in `/src/config/voice-mapping.ts`

Example:
```typescript
'teenager-male': {
  voiceId: 'your-custom-voice-id',
  name: 'Custom Teen Male',
  description: 'Custom teenage boy voice'
}
```

## How It Works

1. **Character Selection**: When you select a character, they play their introduction audio
2. **Start Conversation**: Click the character avatar to start a live voice conversation
3. **Voice Matching**: The system automatically selects the appropriate voice based on character age/gender
4. **AI Personality**: Each character has a custom prompt defining their personality and speaking style
5. **Live Interaction**: Speak naturally - the character will respond in real-time

## Character Configuration

Each character in `/src/data/stories.ts` has these fields:

- `age`: Determines voice age (teenager, adult, old, etc.)
- `gender`: Determines voice gender (male, female, neutral)
- `prompt`: System prompt defining the character's personality
- `introduction`: First message the character says when selected

## Troubleshooting

### "API key not configured" error
- Make sure `.env.local` exists in project root
- Verify the variable name is exactly: `ELEVENLABS_API_KEY` (no NEXT_PUBLIC_ prefix)
- Restart the development server after adding environment variables
- Check server logs for API key errors

### "Connection error"
- Check your internet connection
- Verify your ElevenLabs API key is valid
- Check if you have sufficient API credits

### Voice doesn't match character
- Update the voice mapping in `/src/config/voice-mapping.ts`
- Make sure the age/gender combination exists in the mapping

### Audio not playing
- Check browser permissions for microphone access
- Ensure your device has a working microphone and speakers
- Try a different browser (Chrome/Edge recommended)

## API Usage & Costs

ElevenLabs charges based on characters generated. Monitor your usage at:
[ElevenLabs Usage Dashboard](https://elevenlabs.io/app/usage)

## Additional Resources

- [ElevenLabs Documentation](https://elevenlabs.io/docs)
- [ElevenLabs API Reference](https://elevenlabs.io/docs/api-reference)
- [Conversational AI Guide](https://elevenlabs.io/docs/conversational-ai)
