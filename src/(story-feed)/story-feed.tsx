'use client'

import { useState, useRef, useEffect } from "react";
import { stories, Character, Story } from "@/data/stories";
import StoryCard from "./story-card";
import VoiceWidget from "./voice-widget";

const StoryFeed = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Select the first character by default on component mount
  useEffect(() => {
    if (stories.length > 0) {
      timeoutRef.current = setTimeout(() => {
        setSelectedCharacter(stories[currentIndex].characters[0]);
      }, 1500);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentIndex]);
  
  // Track current story based on scroll position
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const height = container.clientHeight;
      const newIndex = Math.round(scrollTop / height);
      
      if (newIndex !== currentIndex) {
        setCurrentIndex(newIndex);
        setSelectedCharacter(null); // Clear selection when changing stories
      }
    };
    
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [currentIndex]);
  
  const handleCharacterSelect = (character: Character) => {
    setSelectedCharacter(character);
  };
  
  const handleCloseWidget = () => {
    setSelectedCharacter(null);
  };

  return (
    <div 
      ref={containerRef}
      className="snap-container hide-scrollbar"
    >
      {stories.map((story, index) => (
        <StoryCard
          key={story.id}
          story={story}
          selectedCharacter={currentIndex === index ? selectedCharacter : null}
          onCharacterSelect={handleCharacterSelect}
        />
      ))}
      
      {/* Floating Voice Widget */}
      {selectedCharacter && (
        <VoiceWidget 
          character={selectedCharacter} 
          onClose={handleCloseWidget}
        />
      )}
    </div>
  );
};

export default StoryFeed;
