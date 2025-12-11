# ElevenLabs Agent Setup Guide

This guide will walk you through creating agents in the ElevenLabs dashboard for each character.

## What is an Agent?

An ElevenLabs **Agent** is a conversational AI that combines:
- A specific voice
- A system prompt (personality/behavior)
- A first message (introduction)
- Conversation settings

Each character in your app needs its own agent.

## Prerequisites

1. ElevenLabs account with Conversational AI access
2. API key configured in `.env.local` as `ELEVENLABS_API_KEY`

## Step-by-Step Agent Creation

### 1. Access the ElevenLabs Dashboard

Go to: [https://elevenlabs.io/app/conversational-ai](https://elevenlabs.io/app/conversational-ai)

### 2. Create a New Agent

Click **"Create Agent"** or **"New Agent"**

### 3. Configure the Agent

For each character, you'll need to configure:

#### **Agent Name**
Use the character's full name (e.g., "Harry Potter", "Hermione Granger")

#### **Voice Selection**
Choose a voice that matches the character's age and gender:

| Character | Age Category | Gender | Suggested Voice |
|-----------|-------------|--------|-----------------|
| Harry Potter | teenager | male | Antoni or similar young male voice |
| Hermione Granger | teenager | female | Bella or similar young female voice |
| Dumbledore | old | male | Josh or similar elderly male voice |
| Elizabeth Bennet | young-adult | female | Elli or similar adult female voice |
| Mr. Darcy | adult | male | Brian or similar adult male voice |

See `/src/config/voice-mapping.ts` for the voice ID references.

#### **System Prompt**
Copy the character's `prompt` field from `/src/data/stories.ts`

Example for Harry Potter:
```
You are Harry Potter, the famous wizard known as "The Boy Who Lived." You are brave, loyal, and have a strong sense of justice. You survived Voldemort's killing curse as a baby and now attend Hogwarts School of Witchcraft and Wizardry. You're in Gryffindor house and are best friends with Ron Weasley and Hermione Granger. You often find yourself in dangerous situations but always try to do what's right. You have a lightning bolt scar on your forehead and wear round glasses. Speak in a friendly, courageous manner befitting a young wizard hero.
```

#### **First Message**
Copy the character's `introduction` field from `/src/data/stories.ts`

Example for Harry Potter:
```
Hello there! I'm Harry Potter, the boy who lived. It's brilliant to meet you! Would you like to chat about magic, Hogwarts, or perhaps some of my adventures? What brings you here today?
```

#### **Conversation Settings**
- **Temperature**: 0.7-0.8 (for natural conversation)
- **Max Response Length**: 150-200 tokens
- **Enable Interruptions**: ✅ Yes (allows user to interrupt)

### 4. Save and Get Agent ID

1. Click **"Save"** or **"Create Agent"**
2. The agent will be created and you'll see its **Agent ID**
3. Copy the Agent ID (looks like: `abc123def456...`)

### 5. Add Agent ID to Character Data

Open `/src/data/stories.ts` and add the `agentId` to your character:

```typescript
{
  id: 'harry',
  name: 'Harry Potter',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=harry&backgroundColor=b6e3f4',
  age: 'teenager',
  gender: 'male',
  prompt: '...',
  introduction: '...',
  agentId: 'YOUR_AGENT_ID_HERE' // ✅ Add this line
}
```

### 6. Test the Character

1. Restart your dev server: `npm run dev`
2. Navigate to the character
3. The conversation should start automatically
4. Check browser console for connection logs

## Agent Configuration Checklist

For each character, ensure:

- [ ] Agent created in ElevenLabs dashboard
- [ ] Voice selected (matching age/gender)
- [ ] System prompt configured (character personality)
- [ ] First message set (character introduction)
- [ ] Interruptions enabled
- [ ] Agent ID copied
- [ ] Agent ID added to character data in `stories.ts`
- [ ] Tested in the app

## Quick Reference: All Characters

### Harry Potter Series
1. **Harry Potter** - teenager, male, brave hero
2. **Hermione Granger** - teenager, female, intelligent witch
3. **Albus Dumbledore** - old, male, wise headmaster

### Pride & Prejudice
4. **Elizabeth Bennet** - young-adult, female, witty and independent
5. **Mr. Darcy** - adult, male, reserved gentleman

### The Great Gatsby
6. **Jay Gatsby** - adult, male, optimistic dreamer
7. **Nick Carraway** - young-adult, male, thoughtful narrator
8. **Daisy Buchanan** - young-adult, female, charming socialite

### Lord of the Rings
9. **Frodo Baggins** - young-adult, male, brave hobbit
10. **Gandalf the Grey** - old, male, wise wizard
11. **Aragorn** - middle-aged, male, noble ranger

### Alice in Wonderland
12. **Alice** - child, female, curious adventurer
13. **Mad Hatter** - adult, male, eccentric riddler
14. **Cheshire Cat** - adult, neutral, mysterious feline

## Troubleshooting

### "Agent not found" error
- **Cause**: Agent ID is incorrect or agent was deleted
- **Solution**: Verify the agent ID in ElevenLabs dashboard matches the one in `stories.ts`

### "No agent ID configured" error
- **Cause**: Character doesn't have an `agentId` field
- **Solution**: Add the `agentId` field to the character in `stories.ts`

### Conversation won't start
- **Cause**: API key not configured or invalid
- **Solution**: Check `.env.local` has `ELEVENLABS_API_KEY` set correctly

### Character speaks with wrong voice
- **Cause**: Wrong voice selected in agent configuration
- **Solution**: Edit the agent in ElevenLabs dashboard and change the voice

### Character has wrong personality
- **Cause**: System prompt not matching character's prompt field
- **Solution**: Copy the exact prompt from `stories.ts` to the agent's system prompt

## Cost Considerations

- Each conversation uses ElevenLabs API credits
- Monitor usage at: https://elevenlabs.io/app/usage
- Consider setting up usage alerts

## Best Practices

1. **Test each agent** individually before adding to production
2. **Use consistent naming** - agent name should match character name
3. **Keep prompts concise** but descriptive (200-300 words ideal)
4. **Test interruptions** - make sure users can interrupt smoothly
5. **Monitor quality** - adjust temperature if responses are too random/rigid

## Example: Creating Harry Potter Agent

```
1. Go to: https://elevenlabs.io/app/conversational-ai
2. Click "Create Agent"
3. Name: "Harry Potter"
4. Voice: Select "Antoni" or similar young male voice
5. System Prompt: [Copy from stories.ts]
6. First Message: "Hello there! I'm Harry Potter..."
7. Settings:
   - Temperature: 0.75
   - Max tokens: 150
   - Enable interruptions: Yes
8. Click "Create"
9. Copy Agent ID: "abc123..."
10. Add to stories.ts:
    agentId: 'abc123...'
11. Test!
```

## Resources

- [ElevenLabs Conversational AI Docs](https://elevenlabs.io/docs/conversational-ai)
- [Voice Library](https://elevenlabs.io/app/voice-library)
- [API Documentation](https://elevenlabs.io/docs/api-reference)
