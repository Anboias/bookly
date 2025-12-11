'use client'

import { Story, Character } from "@/data/stories";
import CharacterCarousel from "./characters-carousel";

interface StoryCardProps {
  story: Story;
  selectedCharacter: Character | null;
  onCharacterSelect: (character: Character) => void;
}

const StoryCard = ({ story, selectedCharacter, onCharacterSelect }: StoryCardProps) => {
  return (
    <div className="snap-item relative h-screen w-full flex-shrink-0 overflow-hidden film-grain">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${story.coverImage})` }}
      >
        {/* Dark overlay for better text contrast */}
        <div className="absolute inset-0 bg-background/40" />
      </div>
      
      {/* Cinematic gradient overlay */}
      <div 
        className="absolute inset-0"
        style={{ background: 'var(--cinematic-gradient)' }}
      />
      
      {/* Content */}
      <div className="relative z-10 flex h-full flex-col justify-end pb-32">
        {/* Book Info */}
        <div className="px-6 mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2 drop-shadow-lg">
            {story.title}
          </h1>
          <p className="text-lg text-muted-foreground font-light tracking-wide">
            by {story.author}
          </p>
        </div>
        
        {/* Character Carousel */}
        <CharacterCarousel 
          characters={story.characters}
          selectedCharacter={selectedCharacter}
          onSelect={onCharacterSelect}
        />
      </div>
    </div>
  );
};

export default StoryCard;
