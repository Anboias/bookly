# API Architecture - Backend Integration

The ElevenLabs integration now uses a secure backend architecture where all API calls go through Next.js API routes. This keeps your API key secure and provides better control over the conversation flow.

## API Routes

### 1. `/api/conversation/token` - Get Conversation Token
**Purpose:** Generate a signed URL for ElevenLabs conversation  
**Method:** POST  
**Security:** API key stays on server, client receives temporary signed URL

**Request:**
```typescript
{
  agentId: string // ElevenLabs agent ID
}
```

**Response:**
```typescript
{
  success: true,
  signedUrl: string,  // Temporary signed URL for WebSocket connection
  agentId: string
}
```

**Usage:**
The client calls this endpoint first to get a signed URL, then uses that URL to establish the WebSocket connection for the live conversation. This way, the API key never touches the client.

---

### 2. `/api/tts` - Text-to-Speech
**Purpose:** Generate audio for character introductions  
**Method:** POST  
**Security:** API key protected on server

**Request:**
```typescript
{
  text: string,      // Text to convert to speech
  voiceId: string    // ElevenLabs voice ID
}
```

**Response:**
```
Content-Type: audio/mpeg
Binary audio data
```

**Usage:**
When a character is selected, the widget calls this endpoint to generate and play the character's introduction audio.

---

### 3. `/api/conversation/start` - Start Conversation (Optional)
**Purpose:** Alternative method to initialize conversation session  
**Method:** POST  
**Status:** Implemented but not currently used in favor of the token method

**Request:**
```typescript
{
  voiceId: string,
  characterPrompt: string,
  characterIntroduction: string
}
```

---

## Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        User Flow                             │
└─────────────────────────────────────────────────────────────┘

1. User selects character
   ↓
2. Widget calls /api/tts
   - Sends: { text: intro, voiceId }
   - Backend calls ElevenLabs TTS API
   - Returns: audio/mpeg
   - Frontend plays introduction
   ↓
3. User clicks to start conversation
   ↓
4. Widget calls /api/conversation/token
   - Sends: { agentId }
   - Backend calls ElevenLabs to get signed URL
   - Returns: { signedUrl }
   ↓
5. Widget uses signed URL with ElevenLabs SDK
   - Establishes WebSocket connection
   - Begins live voice conversation
   ↓
6. Real-time conversation
   - User speaks → ElevenLabs processes → Character responds
   - All audio handled client-side via WebSocket
```

## Security Benefits

### Before (Client-side)
❌ API key exposed in client code  
❌ `NEXT_PUBLIC_ELEVENLABS_API_KEY` visible in browser  
❌ Anyone can extract and abuse the key  
❌ No rate limiting control  

### After (Backend API Routes)
✅ API key stays on server  
✅ `ELEVENLABS_API_KEY` (no NEXT_PUBLIC_)  
✅ Client never sees the actual key  
✅ Can add rate limiting, usage tracking  
✅ Can add authentication/authorization  
✅ Can monitor and log all requests  

## Code Structure

```
src/
├── app/
│   ├── api/
│   │   ├── conversation/
│   │   │   ├── token/
│   │   │   │   └── route.ts      # Generate signed URL
│   │   │   └── start/
│   │   │       └── route.ts      # Alternative session start
│   │   └── tts/
│   │       └── route.ts          # Text-to-speech endpoint
│   └── ...
└── (story-feed)/
    └── voice-widget.tsx           # Client component (calls API routes)
```

## Environment Variables

### `.env.local`
```env
# Server-side only (never exposed to client)
ELEVENLABS_API_KEY=sk_your_key_here
```

The absence of `NEXT_PUBLIC_` prefix ensures Next.js only makes this available to server-side code (API routes, Server Components).

## Client Implementation

The `voice-widget.tsx` now follows this pattern:

```typescript
// 1. Get signed URL from backend
const tokenResponse = await fetch('/api/conversation/token', {
  method: 'POST',
  body: JSON.stringify({ agentId: voiceId })
})

const { signedUrl } = await tokenResponse.json()

// 2. Use signed URL with ElevenLabs SDK
const conversation = await Conversation.startSession({
  signedUrl: signedUrl,
  onConnect: () => { /* ... */ },
  onDisconnect: () => { /* ... */ },
  // ... other callbacks
})
```

## Future Enhancements

### Rate Limiting
Add rate limiting to prevent abuse:

```typescript
// In API route
import { rateLimit } from '@/utils/rate-limit'

export async function POST(request: NextRequest) {
  const userId = getUserId(request) // From auth
  
  if (!rateLimit.check(userId, 10, 60000)) { // 10 requests per minute
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429 }
    )
  }
  // ... rest of handler
}
```

### Authentication
Add user authentication:

```typescript
import { getSession } from '@/utils/auth'

export async function POST(request: NextRequest) {
  const session = await getSession(request)
  
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }
  // ... rest of handler
}
```

### Usage Tracking
Track API usage per user:

```typescript
import { logUsage } from '@/utils/analytics'

export async function POST(request: NextRequest) {
  const result = await generateAudio(...)
  
  await logUsage({
    userId: session.userId,
    action: 'tts',
    characterCount: text.length,
    timestamp: new Date()
  })
  
  return result
}
```

### Caching
Cache generated audio to reduce API calls:

```typescript
import { cache } from '@/utils/cache'

export async function POST(request: NextRequest) {
  const cacheKey = `tts:${voiceId}:${hash(text)}`
  
  // Check cache first
  const cached = await cache.get(cacheKey)
  if (cached) {
    return new NextResponse(cached, {
      headers: { 'Content-Type': 'audio/mpeg' }
    })
  }
  
  // Generate and cache
  const audio = await generateAudio(...)
  await cache.set(cacheKey, audio, 86400) // 24 hours
  
  return audio
}
```

## Testing the API

### Test TTS Endpoint
```bash
curl -X POST http://localhost:3000/api/tts \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello, I am testing the API",
    "voiceId": "21m00Tcm4TlvDq8ikWAM"
  }' \
  --output test-audio.mp3
```

### Test Token Endpoint
```bash
curl -X POST http://localhost:3000/api/conversation/token \
  -H "Content-Type: application/json" \
  -d '{
    "agentId": "your-agent-id"
  }'
```

## Troubleshooting

### "Server configuration error"
- Check that `ELEVENLABS_API_KEY` exists in `.env.local`
- Restart the dev server after adding env variables
- Make sure there's no typo in the variable name

### "Failed to generate conversation token"
- Verify your ElevenLabs API key is valid
- Check that the agent ID exists in your ElevenLabs account
- Look at server logs for more details

### CORS errors
- API routes are on the same domain, so CORS shouldn't be an issue
- If deploying to production, ensure proper CORS headers if using a CDN

### Audio not playing
- Check browser console for fetch errors
- Verify the API route is returning audio/mpeg
- Check that the audio blob is being created correctly
