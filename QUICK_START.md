# Quick Start Guide

Get Bookly up and running in 5 minutes!

## 1. Install Dependencies

```bash
npm install
npm install @elevenlabs/client
```

## 2. Set Up Environment

Create `.env.local` in the project root:

```env
ELEVENLABS_API_KEY=your_api_key_here
```

Get your API key from: https://elevenlabs.io/app/settings/api-keys

## 3. Create Your First Agent (Required!)

**Important**: You need at least ONE agent to test conversations.

### Quick Test Agent Setup:

1. Go to: https://elevenlabs.io/app/conversational-ai
2. Click "Create Agent"
3. Configure:
   - **Name**: "Harry Potter"
   - **Voice**: Choose any male voice (e.g., "Antoni")
   - **System Prompt**: 
     ```
     You are Harry Potter, a brave young wizard from Hogwarts. 
     Be friendly and talk about magic and adventures.
     ```
   - **First Message**: 
     ```
     Hello! I'm Harry Potter. Ready to chat about magic?
     ```
4. Click "Create" and copy the **Agent ID**
5. Add to `/src/data/stories.ts`:

```typescript
{
  id: 'harry',
  name: 'Harry Potter',
  // ... other fields ...
  agentId: 'YOUR_AGENT_ID_HERE' // ✅ Paste your agent ID here
}
```

## 4. Run the App

```bash
npm run dev
```

Open http://localhost:3000

## 5. Test It!

1. The app should load with story cards
2. First character (Harry Potter) should appear
3. Conversation should start automatically
4. Check browser console for connection logs:
   - 🎤 Starting conversation
   - 🔑 Requesting token
   - ✅ Connected
   - 🔄 Mode changes

## Troubleshooting

### "No agent ID configured"
→ You need to add `agentId` to the character in `stories.ts`

### "Agent not found" or 404 error  
→ Verify the agent ID is correct in ElevenLabs dashboard

### "Server configuration error"
→ Check `.env.local` has `ELEVENLABS_API_KEY` set

### No audio/conversation
→ Check browser console for errors
→ Make sure microphone permissions are enabled

## Next Steps

Once your first agent works:

1. **Add more agents** - See [AGENT_SETUP_GUIDE.md](./AGENT_SETUP_GUIDE.md)
2. **Customize characters** - Edit prompts in `stories.ts`
3. **Adjust voices** - Change voice mappings in `voice-mapping.ts`
4. **Style the app** - Customize UI in component files

## Common Questions

**Q: Do I need agents for ALL characters?**  
A: Yes, each character needs their own agent to have conversations.

**Q: Can I use the same agent for multiple characters?**  
A: Technically yes, but it's better to create separate agents for better personality distinction.

**Q: How much does this cost?**  
A: Check ElevenLabs pricing. Each conversation uses API credits based on character count.

**Q: Can users interrupt the character?**  
A: Yes! Just start speaking while the character is talking.

## Test Page

Visit http://localhost:3000/test-audio to test the TTS system without agents.

## Resources

- [Full Agent Setup Guide](./AGENT_SETUP_GUIDE.md)
- [API Architecture](./API_ARCHITECTURE.md)
- [ElevenLabs Documentation](https://elevenlabs.io/docs/conversational-ai)
- [Implementation Notes](./IMPLEMENTATION_NOTES.md)
