# 📚 Bookly - Interactive Story Characters

A Next.js application that brings book characters to life through AI-powered voice conversations using ElevenLabs Conversational AI.

## ✨ Features

- **Story Feed**: Vertical scrolling feed of classic literature stories
- **Character Selection**: Choose from iconic characters across multiple books
- **Live Voice Conversations**: Have real-time voice conversations with characters
- **Smart Voice Matching**: Automatically selects appropriate voices based on character age and gender
- **Character Personalities**: Each character has unique personality traits and speaking styles
- **Beautiful UI**: Cinematic design with film grain effects and smooth animations

## 📖 Available Stories & Characters

### Harry Potter by J.K. Rowling
- Harry Potter (teenager, male)
- Hermione Granger (teenager, female)
- Albus Dumbledore (old, male)

### Pride & Prejudice by Jane Austen
- Elizabeth Bennet (young adult, female)
- Mr. Darcy (adult, male)

### The Great Gatsby by F. Scott Fitzgerald
- Jay Gatsby (adult, male)
- Nick Carraway (young adult, male)
- Daisy Buchanan (young adult, female)

### Lord of the Rings by J.R.R. Tolkien
- Frodo Baggins (young adult, male)
- Gandalf the Grey (old, male)
- Aragorn (middle-aged, male)

### Alice in Wonderland by Lewis Carroll
- Alice (child, female)
- Mad Hatter (adult, male)
- Cheshire Cat (adult, neutral)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- ElevenLabs API account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd bookly
```

2. Install dependencies:
```bash
npm install
```

3. Install ElevenLabs SDK:
```bash
npm install @elevenlabs/client
```

4. Set up environment variables:

Create a `.env.local` file in the root directory:

```env
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
```

Get your API key from [ElevenLabs Settings](https://elevenlabs.io/app/settings/api-keys)

**Important:** Use `ELEVENLABS_API_KEY` (server-side only, no `NEXT_PUBLIC_` prefix) to keep your API key secure.

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🎙️ How Voice Conversations Work

### Voice Mapping

Characters are assigned voices based on their age and gender:

- **Age categories**: child, teenager, young-adult, adult, middle-aged, old
- **Gender categories**: male, female, neutral

The system automatically combines these to create a voice key (e.g., `teenager-male`, `old-female`) and maps it to an ElevenLabs voice ID.

### Character Configuration

Each character has:

1. **Age & Gender**: Determines which voice to use
2. **Prompt**: Defines the character's personality, background, and speaking style
3. **Introduction**: The first message the character speaks when selected

Example:
```typescript
{
  name: 'Harry Potter',
  age: 'teenager',
  gender: 'male',
  prompt: 'You are Harry Potter, the famous wizard...',
  introduction: 'Hello there! I\'m Harry Potter...'
}
```

### Conversation Flow

1. **Character Selection**: User scrolls through stories and taps a character
2. **Introduction**: Character's introduction plays automatically
3. **Start Conversation**: User clicks the character avatar to begin
4. **Live Chat**: Real-time voice conversation using ElevenLabs AI
5. **End Session**: Click avatar again or close button to end

## 🎨 Customization

### Adding New Characters

Edit `/src/data/stories.ts`:

```typescript
{
  id: 'your-character',
  name: 'Character Name',
  avatar: 'avatar-url',
  age: 'adult',
  gender: 'female',
  prompt: 'Character personality and background...',
  introduction: 'First message the character will say...'
}
```

### Customizing Voices

Edit `/src/config/voice-mapping.ts` to use your own ElevenLabs voices:

```typescript
'adult-female': {
  voiceId: 'your-custom-voice-id',
  name: 'Custom Voice Name',
  description: 'Voice description'
}
```

Find voices in the [ElevenLabs Voice Library](https://elevenlabs.io/app/voice-library)

## 🏗️ Project Structure

```
bookly/
├── src/
│   ├── (story-feed)/
│   │   ├── story-feed.tsx        # Main feed component
│   │   ├── story-card.tsx        # Individual story card
│   │   ├── characters-carousel.tsx # Character selection
│   │   ├── voice-widget.tsx      # Voice conversation UI
│   │   └── nav-link.tsx          # Navigation component
│   ├── app/
│   │   ├── api/
│   │   │   ├── conversation/
│   │   │   │   ├── token/route.ts   # Get signed URL
│   │   │   │   └── start/route.ts   # Start session
│   │   │   └── tts/route.ts         # Text-to-speech
│   │   ├── page.tsx              # Home page
│   │   ├── layout.tsx            # Root layout
│   │   └── globals.css           # Global styles
│   ├── config/
│   │   └── voice-mapping.ts      # Voice ID mappings
│   ├── data/
│   │   └── stories.ts            # Story and character data
│   ├── hooks/
│   │   └── use-mobile.ts         # Mobile detection hook
│   └── utils/
│       └── utils.ts              # Utility functions
├── API_ARCHITECTURE.md           # Backend API documentation
├── ELEVENLABS_SETUP.md           # Detailed ElevenLabs setup guide
└── README.md                     # This file
```

## 🛠️ Technologies

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Voice AI**: ElevenLabs Conversational AI
- **Icons**: Lucide React
- **State Management**: React Hooks

## 🤖 Setting Up Characters

**Important**: Each character needs an ElevenLabs agent configured before conversations will work.

See **[AGENT_SETUP_GUIDE.md](./AGENT_SETUP_GUIDE.md)** for detailed instructions on:
- Creating agents in ElevenLabs dashboard
- Configuring voice, personality, and introduction
- Adding agent IDs to your characters

Without agent IDs, you'll see: _"No agent ID configured for [Character]"_

## 📝 Development

### Running Tests
```bash
npm run ts  # Type check
npm run lint  # Lint code
```

### Building for Production
```bash
npm run build
npm start
```

## 🔧 Troubleshooting

See [ELEVENLABS_SETUP.md](./ELEVENLABS_SETUP.md) for detailed troubleshooting steps.

Common issues:

- **No audio**: Check microphone permissions in browser
- **API errors**: Verify API key in `.env.local`
- **Connection fails**: Check internet connection and API credits

## 📄 License

This project is for educational purposes.

## 🙏 Credits

- Stories and characters are from classic literature
- Voice technology powered by [ElevenLabs](https://elevenlabs.io)
- Avatar images from [DiceBear](https://dicebear.com)
- Background images from [Unsplash](https://unsplash.com)
