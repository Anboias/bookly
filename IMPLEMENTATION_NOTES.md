# Implementation Notes - ElevenLabs Integration

## Architecture

The implementation uses a secure backend architecture with Next.js API routes. All ElevenLabs API calls go through the backend, keeping the API key secure. See [API_ARCHITECTURE.md](./API_ARCHITECTURE.md) for detailed documentation.

## What Was Implemented

### 1. Voice Mapping System (`/src/config/voice-mapping.ts`)
- Created a comprehensive voice mapping table based on age-gender combinations
- Maps character attributes to ElevenLabs voice IDs
- Supports: child, teenager, young-adult, adult, middle-aged, old
- Genders: male, female, neutral
- Helper function `getVoiceId(age, gender)` for easy voice selection

### 2. Updated Character Data Model (`/src/data/stories.ts`)
- Extended Character interface with:
  - `age`: AgeCategory - determines voice age
  - `gender`: Gender - determines voice gender  
  - `prompt`: string - AI system prompt defining personality
  - `introduction`: string - first message character says
- Updated all 15 characters across 5 stories with detailed prompts and introductions

### 3. Backend API Routes (`/src/app/api/`)
- **`/api/tts`**: Text-to-speech endpoint for character introductions
- **`/api/conversation/token`**: Generate signed URL for secure conversations
- **`/api/conversation/start`**: Alternative session initialization method
- All routes keep API key secure on server-side
- Proper error handling and response formatting

### 4. Voice Widget Integration (`/src/(story-feed)/voice-widget.tsx`)
- Calls backend API routes instead of direct ElevenLabs integration
- Automatic voice selection based on character attributes
- Introduction audio playback via `/api/tts` endpoint
- Real-time conversation states: idle, connecting, listening, speaking, error
- Beautiful UI with pulse animations and status indicators
- Error handling with user-friendly messages
- Secure: API key never exposed to client

### 5. Character Details

**Harry Potter Series:**
- Harry Potter (teenager, male) - Brave hero with lightning scar
- Hermione Granger (teenager, female) - Brightest witch, loves knowledge
- Albus Dumbledore (old, male) - Wise headmaster, philosophical

**Pride & Prejudice:**
- Elizabeth Bennet (young-adult, female) - Witty, independent spirit
- Mr. Darcy (adult, male) - Reserved, principled gentleman

**The Great Gatsby:**
- Jay Gatsby (adult, male) - Charming, optimistic, "old sport"
- Nick Carraway (young-adult, male) - Thoughtful narrator
- Daisy Buchanan (young-adult, female) - Beautiful, voice full of money

**Lord of the Rings:**
- Frodo Baggins (young-adult, male) - Ring bearer, brave hobbit
- Gandalf the Grey (old, male) - Ancient wizard, mysterious
- Aragorn (middle-aged, male) - Heir of Isildur, ranger

**Alice in Wonderland:**
- Alice (child, female) - Curious girl in Wonderland
- Mad Hatter (adult, male) - Eccentric riddle-speaker
- Cheshire Cat (adult, neutral) - Philosophical grinning cat

## Setup Requirements

### 1. Install ElevenLabs SDK
```bash
npm install @elevenlabs/client
```

### 2. Create ElevenLabs Account & Get API Key
- Sign up at https://elevenlabs.io
- Go to Settings > API Keys
- Copy your API key

### 3. Set Environment Variable
Create `.env.local`:
```
ELEVENLABS_API_KEY=your_api_key_here
```

**Note:** This is a server-side only variable for security. The API key is never exposed to the client.

### 4. Configure Agents in ElevenLabs Dashboard

**Important:** The current implementation uses voice IDs directly, but ElevenLabs Conversational AI actually requires you to create "Agents" in their dashboard. Each agent is configured with:

- A specific voice
- A system prompt
- A first message
- Other conversation settings

You have two options:

#### Option A: Create Agents for Each Character (Recommended)
1. Go to ElevenLabs Dashboard > Conversational AI > Create Agent
2. For each character, create an agent with:
   - Name: Character name (e.g., "Harry Potter Agent")
   - Voice: Select appropriate voice from the mapping
   - System Prompt: Copy the character's `prompt` field
   - First Message: Copy the character's `introduction` field
3. Copy each agent's ID
4. Update the Character interface to include `agentId` field
5. Update each character with their agent ID

#### Option B: Dynamic Configuration (Advanced)
Modify the voice-widget to use the ElevenLabs API to create/configure agents programmatically. This requires:
- Using the ElevenLabs REST API
- Creating agents on-the-fly with character prompts
- Caching agent IDs

## Current Limitations & Next Steps

### Type Errors
The code currently has TypeScript errors because:
1. The `@elevenlabs/client` package isn't installed yet
2. Using `as any` type assertions as temporary workarounds
3. Will be resolved once package is installed

### Agent Configuration
The integration currently passes `voiceId` as `agentId`, which won't work in production. You need to:
1. Create agents in ElevenLabs dashboard
2. Add `agentId` field to Character interface
3. Update all character data with real agent IDs
4. Update voice-widget to use character.agentId instead of voiceId

### Introduction Audio
Currently using text-to-speech API for introductions. Could be optimized by:
- Pre-generating introduction audio files
- Storing them in public/audio folder
- Reducing API calls and latency

## Testing Checklist

Once setup is complete:

- [ ] Install @elevenlabs/client package
- [ ] Add API key to .env.local
- [ ] Create agents in ElevenLabs dashboard
- [ ] Update character data with agent IDs
- [ ] Test microphone permissions in browser
- [ ] Test introduction audio playback
- [ ] Test starting conversation
- [ ] Test voice conversation flow
- [ ] Test error handling (bad API key, no mic, etc.)
- [ ] Test on different browsers (Chrome, Firefox, Safari)
- [ ] Test on mobile devices

## Additional Improvements

### Voice Customization
- Allow users to select different voices for characters
- Add voice preview functionality
- Create custom voices for specific characters

### Conversation Features
- Add conversation history display
- Allow users to type messages as alternative to voice
- Add conversation transcripts
- Implement conversation memory across sessions

### Performance
- Pre-load audio contexts
- Implement audio caching
- Optimize introduction playback
- Add loading states and skeleton screens

### Analytics
- Track conversation duration
- Monitor API usage
- Track character popularity
- Collect user feedback

## Resources

- [ElevenLabs Docs](https://elevenlabs.io/docs)
- [Conversational AI Guide](https://elevenlabs.io/docs/conversational-ai)
- [Voice Library](https://elevenlabs.io/app/voice-library)
- [API Reference](https://elevenlabs.io/docs/api-reference)
