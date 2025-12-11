'use client'

import { useState } from "react";
import { Character } from "@/data/stories";
import { cn } from "@/utils/utils";
import { Mic, MicOff, X, Loader2 } from "lucide-react";

interface VoiceWidgetProps {
  character: Character;
  onClose: () => void;
}

type ConversationState = "idle" | "connecting" | "listening" | "speaking";

const VoiceWidget = ({ character, onClose }: VoiceWidgetProps) => {
  const [state, setState] = useState<ConversationState>("idle");
  const [showIntro, setShowIntro] = useState(true);
  
  const handleStartConversation = async () => {
    setState("connecting");
    
    // Simulate connection delay - replace with actual ElevenLabs integration
    setTimeout(() => {
      setState("listening");
      setShowIntro(false);
    }, 1500);
  };
  
  const handleStopConversation = () => {
    setState("idle");
    setShowIntro(true);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Intro bubble */}
      {showIntro && state === "idle" && (
        <div className="max-w-[280px] bg-card/95 backdrop-blur-md rounded-2xl rounded-br-sm p-4 shadow-xl border border-border animate-in slide-in-from-bottom-2 fade-in duration-300">
          <p className="text-sm text-foreground leading-relaxed">
            "{character.introAudio}"
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            — {character.name}
          </p>
        </div>
      )}
      
      {/* Status indicator */}
      {state !== "idle" && (
        <div className="bg-card/90 backdrop-blur-md rounded-full px-4 py-2 shadow-lg border border-border animate-in fade-in duration-200">
          <p className="text-sm text-foreground flex items-center gap-2">
            {state === "connecting" && (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                Connecting...
              </>
            )}
            {state === "listening" && (
              <>
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Listening...
              </>
            )}
            {state === "speaking" && (
              <>
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                {character.name} is speaking...
              </>
            )}
          </p>
        </div>
      )}
      
      {/* Main floating widget */}
      <div className="relative">
        {/* Pulse rings when active */}
        {(state === "listening" || state === "speaking") && (
          <>
            <div className="absolute inset-0 rounded-full bg-primary/30 animate-pulse-ring" />
            <div 
              className="absolute inset-0 rounded-full bg-primary/20 animate-pulse-ring" 
              style={{ animationDelay: "0.5s" }}
            />
          </>
        )}
        
        {/* Widget button */}
        <button
          onClick={state === "idle" ? handleStartConversation : handleStopConversation}
          className={cn(
            "relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden",
            "shadow-2xl transition-all duration-300",
            "ring-2 ring-offset-2 ring-offset-background",
            state === "idle" 
              ? "ring-primary hover:scale-110" 
              : "ring-primary animate-glow"
          )}
        >
          <img
            src={character.avatar}
            alt={character.name}
            className="w-full h-full object-cover bg-secondary"
          />
          
          {/* Overlay icon */}
          <div 
            className={cn(
              "absolute inset-0 flex items-center justify-center transition-opacity duration-200",
              "bg-background/60 backdrop-blur-sm",
              state === "idle" ? "opacity-0 hover:opacity-100" : "opacity-100"
            )}
          >
            {state === "idle" && <Mic className="w-6 h-6 text-primary" />}
            {state === "connecting" && <Loader2 className="w-6 h-6 text-primary animate-spin" />}
            {state === "listening" && <Mic className="w-6 h-6 text-green-400" />}
            {state === "speaking" && <MicOff className="w-6 h-6 text-primary" />}
          </div>
        </button>
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 w-6 h-6 bg-secondary rounded-full flex items-center justify-center shadow-lg hover:bg-muted transition-colors"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
};

export default VoiceWidget;
