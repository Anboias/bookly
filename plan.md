# Bookly POC Implementation Plan

## Project Structure

```
bookly/
├── package.json ✅
├── next.config.ts ✅
├── postcss.config.mjs ✅
├── tsconfig.json ✅
├── .env.local (for ElevenLabs API key) ⏳
├── src/
│   ├── app/
│   │   ├── layout.tsx ✅
│   │   ├── page.tsx ✅ (main feed)
│   │   └── globals.css ✅
│   ├── components/
│   │   ├── feed-container.tsx ✅ (vertical scroll container)
│   │   ├── book-viewer.tsx ✅ (individual book/story page)
│   │   └── character-selector.tsx ⏳ (bottom carousel)
│   ├── data/
│   │   └── mock-posts.ts ✅ (mock book data)
│   ├── types/
│   │   └── post.ts ✅
│   ├── utils/
│   │   └── text-utils.ts ✅
│   └── lib/
│       └── elevenlabs.ts ⏳ (ElevenLabs client setup)
```

## Implementation Status

### ✅ Completed

1. **Next.js Project Setup**
   - ✅ Next.js 16 with App Router
   - ✅ TypeScript configuration
   - ✅ Tailwind CSS v4 setup
   - ✅ PostCSS configuration

2. **Core Components**
   - ✅ `FeedContainer` - Vertical scroll container with snap behavior
   - ✅ `BookViewer` - Individual book/story page with:
     - Full viewport height
     - Background images
     - Text highlighting with audio sync simulation
     - Horizontal page navigation (swipe left/right)
     - Action buttons (like, comment, bookmark, share)
   - ✅ Desktop arrow navigation (up/down)
   - ✅ Mobile touch gestures

3. **Data Structure**
   - ✅ Post/Book type definitions
   - ✅ Mock data with book excerpts
   - ✅ Text splitting into pages (50 words per page)

4. **Styling**
   - ✅ Tailwind CSS with custom fonts (Playfair Display, Inter)
   - ✅ Dark theme with amber accents
   - ✅ Scroll snap CSS
   - ✅ Custom scrollbar hiding
   - ✅ Smooth scroll behavior
   - ✅ Responsive design (mobile-first)

### ⏳ Remaining Implementation

1. **Character Data & Selector**
   - ⏳ Add characters array to Post/Book type:
     - `name`, `avatar` (square images), `introAudio`, `agentId`
   - ⏳ Create `CharacterSelector` component:
     - Horizontal scrollable container (`overflow-x-scroll`)
     - Fixed positioning at bottom (`fixed bottom-0`)
     - Circular avatars (`rounded-full`) with horizontal spacing
     - Click handler to trigger ElevenLabs conversation
     - Z-index to stay above story content

2. **ElevenLabs Integration**
   - ⏳ Install `@elevenlabs/react` package
   - ⏳ Setup ElevenLabs React SDK client (`lib/elevenlabs.ts`)
   - ⏳ Create conversation handler function
   - ⏳ Use `ConversationalAI` component from `@elevenlabs/react`
   - ⏳ Handle `agentId` from character data
   - ⏳ Modal/overlay for conversation UI

3. **Story Card Enhancements**
   - ⏳ Update `BookViewer` to display character carousel at bottom
   - ⏳ Bottom gradient overlay (from transparent to black)
   - ⏳ Title text positioned above character carousel
   - ⏳ Integrate character selection with conversation trigger

4. **Environment Setup**
   - ⏳ Create `.env.local` for ElevenLabs API key
   - ⏳ Create `.env.local.example` template

## Key Technical Details

### Character Carousel
- `flex` with `gap-4` for spacing
- `snap-x` for horizontal snap (optional)
- Z-index to stay above story content
- Click handler to trigger ElevenLabs conversation

### ElevenLabs Widget
- Use `ConversationalAI` component from `@elevenlabs/react`
- Trigger on character click
- Overlay modal or fullscreen mode
- Pass `agentId` from character data

### Gradient Overlay
```css
background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%);
```

## Files to Create/Update

### New Files Needed
- `src/components/character-selector.tsx` - Character carousel component
- `src/lib/elevenlabs.ts` - ElevenLabs utilities
- `.env.local.example` - Environment variables template

### Files to Update
- `src/types/post.ts` - Add characters array to Post interface
- `src/data/mock-posts.ts` - Add character data to mock posts
- `src/components/book-viewer.tsx` - Integrate CharacterSelector component
- `package.json` - Add `@elevenlabs/react` dependency

## Dependencies to Add

```json
{
  "@elevenlabs/react": "latest"
}
```

## Notes

- All images will use Unsplash URLs with specific dimensions
- Agent IDs will be placeholders until real ElevenLabs agents are created
- Mobile-first responsive design
- No database - all data hardcoded
- No authentication required
- Current implementation uses book excerpts; will extend to support character-based stories
