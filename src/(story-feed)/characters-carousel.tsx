'use client'

import { Character } from "@/data/stories";
import { cn } from "@/utils/utils";

interface CharacterCarouselProps {
  characters: Character[];
  selectedCharacter: Character | null;
  onSelect: (character: Character) => void;
}

const CharacterCarousel = ({ characters, selectedCharacter, onSelect }: CharacterCarouselProps) => {
  return (
    <div className="px-4">
      <p className="text-sm text-muted-foreground mb-3 px-2 font-medium tracking-wide uppercase">
        Talk to a character
      </p>
      <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
        {characters.map((character) => {
          const isSelected = selectedCharacter?.id === character.id;
          
          return (
            <button
              key={character.id}
              onClick={() => onSelect(character)}
              className="flex flex-col items-center gap-2 flex-shrink-0 group"
            >
              <div 
                className={cn(
                  "relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden transition-all duration-300",
                  "ring-2 ring-offset-2 ring-offset-background",
                  isSelected 
                    ? "ring-primary scale-110 animate-glow" 
                    : "ring-muted-foreground/30 group-hover:ring-primary/50 group-hover:scale-105"
                )}
              >
                <img
                  src={character.avatar}
                  alt={character.name}
                  className="w-full h-full object-cover bg-secondary"
                />
                
                {/* Selection glow */}
                {isSelected && (
                  <div className="absolute inset-0 bg-primary/20 animate-pulse" />
                )}
              </div>
              
              <span 
                className={cn(
                  "text-xs md:text-sm font-medium transition-colors duration-200",
                  isSelected ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                )}
              >
                {character.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CharacterCarousel;
